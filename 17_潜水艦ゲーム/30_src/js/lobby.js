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
  const elCreate  = $('#create-room-btn');
  const elJoin    = $('#join-room-btn');
  const elStart   = $('#start-game-btn');
  const elRoomId  = $('#room-id-input');
  const elName    = $('#player-name');
  const elStatus  = $('#lobby-status');
  const elPlayers = $('#lobby-players');
  const elRoomUrl = $('#room-url');

  // URL パラメータ
  const params = new URLSearchParams(location.search);
  if (params.get('room') && elRoomId) elRoomId.value = params.get('room');

  // 人数選択
  document.querySelectorAll('input[name="max-players"]').forEach(r => {
    r.addEventListener('change', () => { maxPlayers = parseInt(r.value) || 6; });
  });

  // ────── ルーム作成 ──────
  elCreate?.addEventListener('click', async () => {
    const name = elName?.value?.trim() || 'プレイヤー1';
    elCreate.disabled = true;
    elJoin.disabled = true;
    try {
      const id = await initPeer();
      createRoom(onHostLobbyMessage);
      players = [{ id, name }];
      renderPlayers(elPlayers);
      elStatus.textContent = `ルーム作成完了`;

      // 参加用 URL
      const url = `${location.origin}${location.pathname}?room=${id}`;
      elRoomUrl.innerHTML = `
        <span class="room-id-display">Room: <code>${id}</code></span>
        <button class="btn btn-sm" onclick="navigator.clipboard.writeText('${url}')">URL コピー</button>
      `;
      elStart.classList.remove('hidden');
      elStart.disabled = players.length < 3;
    } catch (e) {
      elStatus.textContent = 'ルーム作成失敗: ' + e.message;
      elCreate.disabled = false;
      elJoin.disabled = false;
    }
  });

  // ────── ルーム参加 ──────
  elJoin?.addEventListener('click', async () => {
    const hostId = elRoomId?.value?.trim();
    const name = elName?.value?.trim() || '';
    if (!hostId) { elStatus.textContent = 'ルームIDを入力してください'; return; }
    elCreate.disabled = true;
    elJoin.disabled = true;
    elStatus.textContent = '接続中…';
    try {
      await initPeer();
      joinRoom(hostId, name, onGuestLobbyMessage);
    } catch (e) {
      elStatus.textContent = '接続失敗: ' + e.message;
      elCreate.disabled = false;
      elJoin.disabled = false;
    }
  });

  // ────── ゲーム開始 ──────
  elStart?.addEventListener('click', () => {
    if (players.length < 3) { elStatus.textContent = '3人以上必要です'; return; }
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
      players.push({ id: msg.from, name: msg.name || `プレイヤー${players.length + 1}` });
      renderPlayers($('#lobby-players'));
      broadcastPlayerList(players);
      const startBtn = $('#start-game-btn');
      if (startBtn) startBtn.disabled = players.length < 3;
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
  initGameScreen(playerIds, playerNames);
}
