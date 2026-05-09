// ============================================================
// lobby.js  ロビー画面管理
// ============================================================
import { MSG, initPeer, getMyId, getIsHost,
         createRoom, joinRoom, broadcastPlayerList,
         broadcastGameStart, setMessageHandler } from './peer.js';
import { initGameScreen, onGuestMessage } from './main.js';

let players = [];   // [{id, name}]
let maxPlayers = 6;

const $ = s => document.querySelector(s);

export function initLobby() {
  // ── パララックス ──
  _initParallax();

  const elCreate      = $('#create-room-btn');
  const elJoin        = $('#join-room-btn');
  const elStart       = $('#start-game-btn');
  const elRoomId      = $('#room-id-input');
  const elName        = $('#player-name');
  const elStatus      = $('#lobby-status');
  const elPlayers     = $('#lobby-players');
  const elRoomUrl     = $('#room-url');
  const elActions     = $('#lobby-actions');
  const elRoomField   = $('#room-id-field');
  const elMaxField    = $('#max-players-field');

  // ── 初期UI設定 ──
  function resetLobbyUI() {
    if (elCreate)    elCreate.classList.remove('hidden');
    if (elJoin)      elJoin.classList.remove('hidden');
    if (elRoomField) elRoomField.classList.remove('hidden');
    if (elMaxField)  elMaxField.classList.remove('hidden');
    if (elStart)     elStart.classList.add('hidden');
    if (elRoomUrl)   elRoomUrl.innerHTML = '';
    if (elStatus)    elStatus.textContent = '';
    if (elPlayers)   elPlayers.innerHTML = '';
    if (elName)      elName.disabled = false;
    if (elRoomId)    elRoomId.disabled = false;
  }

  // URL パラメータ
  const params = new URLSearchParams(location.search);
  const roomParam = params.get('room');
  if (roomParam && elRoomId) {
    elRoomId.value = roomParam;
    // ?room 付き = ゲストとして参加意図 → 作成ボタン非表示
    if (elCreate) elCreate.classList.add('hidden');
    if (elMaxField) elMaxField.classList.add('hidden');
  }

  // ルームIDをクリアしたら初期UIに戻す
  elRoomId?.addEventListener('input', () => {
    if (!elRoomId.value.trim()) resetLobbyUI();
  });

  // 人数選択
  document.querySelectorAll('input[name="max-players"]').forEach(r => {
    r.addEventListener('change', () => { maxPlayers = parseInt(r.value) || 6; });
  });

  // ────── ルーム作成 ──────
  elCreate?.addEventListener('click', async () => {
    const rawName = elName?.value?.trim();
    const name = rawName || 'プレイヤー1';
    if (!rawName && elName) elName.value = 'プレイヤー1';
    elCreate.disabled = true;
    elJoin.disabled = true;
    try {
      const id = await initPeer();
      createRoom(onHostLobbyMessage);
      players = [{ id, name }];
      renderPlayers(elPlayers);
      elStatus.textContent = `ルーム作成完了`;
      if (elName) elName.disabled = true;

      // ルーム作成後: 入力系を非表示
      if (elCreate)    elCreate.classList.add('hidden');
      if (elJoin)      elJoin.classList.add('hidden');
      if (elRoomField) elRoomField.classList.add('hidden');
      if (elMaxField)  elMaxField.classList.add('hidden');

      // 参加用 URL + キャンセルボタン
      const url = `${location.origin}${location.pathname}?room=${id}`;
      elRoomUrl.innerHTML = `
        <div class="room-url-row">
          <span class="room-id-display">Room: <code>${id}</code></span>
          <button class="btn btn-sm" onclick="navigator.clipboard.writeText('${url}')">URLコピー</button>
          <button class="btn btn-sm" id="cancel-room-btn">キャンセル</button>
        </div>
      `;
      $('#cancel-room-btn')?.addEventListener('click', () => {
        location.href = location.pathname; // クエリなしでリロード → 初期UI
      });

      elStart.classList.remove('hidden');
      elStart.disabled = players.length < 2;
    } catch (e) {
      elStatus.textContent = 'ルーム作成失敗: ' + e.message;
      elCreate.disabled = false;
      elJoin.disabled = false;
    }
  });

  // ────── ルーム参加 ──────
  elJoin?.addEventListener('click', async () => {
    const hostId = elRoomId?.value?.trim();
    const rawName = elName?.value?.trim();
    // デフォルト名はここでは空文字にしておき、ホスト側で参加順に割り当てる
    const name = rawName || '';
    if (!rawName && elName) elName.value = '';
    if (!hostId) { elStatus.textContent = 'ルームIDを入力してください'; return; }
    elCreate.disabled = true;
    elJoin.disabled = true;
    if (elRoomId) elRoomId.disabled = true;
    if (elName) elName.disabled = true;
    elStatus.textContent = '接続中…';
    try {
      await initPeer();
      joinRoom(hostId, name, onGuestLobbyMessage);
    } catch (e) {
      elStatus.textContent = '接続失敗: ' + e.message;
      elCreate.disabled = false;
      elJoin.disabled = false;
      if (elRoomId) elRoomId.disabled = false;
      if (elName) elName.disabled = false;
    }
  });

  // ────── ゲーム開始 ──────
  elStart?.addEventListener('click', () => {
    if (players.length < 2) { elStatus.textContent = '2人以上必要です'; return; }
    const playerIds = players.map(p => p.id);
    const playerNames = players.map(p => p.name);
    broadcastGameStart(playerIds, playerNames, maxPlayers);
  });
}

/* ─── ホスト：ロビーメッセージ ─── */
function onHostLobbyMessage(msg) {
  switch (msg.type) {
    case MSG.JOIN: {
      if (players.length >= maxPlayers) return;
      // 名前が未入力または空の場合、参加順（ホスト=1、次の人=2…）でデフォルト名を割り当てる
      const newIdx = players.length + 1;
      let candidate = msg.name?.trim() || `プレイヤー${newIdx}`;
      // 重複チェック（同じ名前がすでにいれば -1 を付ける）
      if (players.some(p => p.name === candidate)) candidate = `${candidate}-1`;
      players.push({ id: msg.from, name: candidate });
      // 表示名をゲスト側の入力欄に反映させるため実名を返信先に含める
      renderPlayers($('#lobby-players'));
      broadcastPlayerList(players);
      const startBtn = $('#start-game-btn');
      if (startBtn) startBtn.disabled = players.length < 2;
      break;
    }
    case MSG.PLAYER_LIST:
      if (msg._local) {
        players = msg.players;
        renderPlayers($('#lobby-players'));
      }
      break;
    case MSG.GAME_START: {
      startGame(msg.playerIds, msg.playerNames);
      break;
    }
  }
}

/* ─── ゲスト：ロビーメッセージ ─── */
function onGuestLobbyMessage(msg) {
  switch (msg.type) {
    case MSG.PLAYER_LIST:
      players = msg.players;
      renderPlayers($('#lobby-players'));
      $('#lobby-status').textContent = `ルームに参加中 (${players.length}人)`;
      break;
    case MSG.GAME_START:
      setMessageHandler(onGuestMessage);
      startGame(msg.playerIds, msg.playerNames);
      break;
  }
}

/* ─── 共通 ─── */
function renderPlayers(el) {
  if (!el) return;
  el.innerHTML = players.map((p, i) => {
    const isMe = p.id === getMyId();
    return `<div class="lobby-player${isMe ? ' is-me' : ''}">
      <span class="lobby-player-icon">${i === 0 ? '👑' : '🚢'}</span>
      <span>${p.name}${isMe ? ' (あなた)' : ''}</span>
    </div>`;
  }).join('');
}

function startGame(playerIds, playerNames) {
  // パララックスを停止してゲーム画面へ
  _stopParallax();
  initGameScreen(playerIds, playerNames);
}

/* ─── パララックス ─── */
let _parallaxRaf = null;

function _initParallax() {
  const screen = document.getElementById('lobby-screen');
  const far  = document.querySelector('.lp-layer-far');
  const mid  = document.querySelector('.lp-layer-mid');
  const near = document.querySelector('.lp-layer-near');
  if (!screen || !far || !mid || !near) return;

  // マウス視差
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 〜 +1
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // スクロール視差
  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      _applyParallax(screen, far, mid, near, mx, my);
    });
  }
  screen.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true }); // body スクロール対応

  // マウス視差は rAF ループで滑らかに追従
  let curMx = 0, curMy = 0;
  function loop() {
    curMx += (mx - curMx) * 0.06;
    curMy += (my - curMy) * 0.06;
    _applyParallax(screen, far, mid, near, curMx, curMy);
    _parallaxRaf = requestAnimationFrame(loop);
  }
  _parallaxRaf = requestAnimationFrame(loop);
}

function _applyParallax(screen, far, mid, near, mx, my) {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  // 各レイヤーをスクロール量 × 視差係数 + マウス視差 でずらす
  far.style.transform  = `translate(${mx * 10 - scrollY * 0.08}px, ${my * 10  + scrollY * 0.08}px)`;
  mid.style.transform  = `translate(${mx * 22 - scrollY * 0.18}px, ${my * 22  + scrollY * 0.18}px)`;
  near.style.transform = `translate(${mx * 40 - scrollY * 0.30}px, ${my * 40  + scrollY * 0.30}px)`;
}

function _stopParallax() {
  if (_parallaxRaf) { cancelAnimationFrame(_parallaxRaf); _parallaxRaf = null; }
  // パララックスdivを非表示
  const el = document.getElementById('lobby-parallax');
  if (el) el.style.display = 'none';
}
