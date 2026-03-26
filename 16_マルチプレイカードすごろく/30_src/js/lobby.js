// ============================================================
// lobby.js  ロビー画面のUI処理
// ============================================================

import { initPeer, getMyId, createRoom, joinRoom, broadcastPlayerList, broadcastGameStart, sendToHost, MSG, getGuestIds, setMessageHandler } from './peer.js';
import { initGameScreen } from './main.js';

const MAX_PLAYERS_MIN = 3;
const MAX_PLAYERS_MAX = 6;
let maxPlayers = 4; // ラジオボタンで変更される
let players = []; // { id, name }
let gameState = null;

const elStatus    = document.getElementById('status');
const elStatusRoom = document.getElementById('status-room');
const elMyId      = document.getElementById('my-id');
const elRoomInput = document.getElementById('room-id-input');
const elPlayerList = document.getElementById('player-list');
const elCreateBtn  = document.getElementById('btn-create');
const elJoinBtn    = document.getElementById('btn-join');
const elStartBtn   = document.getElementById('btn-start');
const elNameInput  = document.getElementById('player-name');
const elCopyBtn    = document.getElementById('btn-copy');

// ルームID入力に応じてボタンの有効/無効を切り替え
elJoinBtn.disabled = true;
elRoomInput.addEventListener('input', () => {
  const hasId = elRoomInput.value.trim().length > 0;
  elCreateBtn.disabled = hasId;
  elJoinBtn.disabled   = !hasId;
});

function setStatus(msg) {
  elStatus.textContent = msg;
}

function renderPlayerList(list) {
  const panel = document.getElementById('panel-players');
  if (panel) panel.style.display = 'block';
  elPlayerList.innerHTML = '';
  list.forEach((p, i) => {
    const li = document.createElement('li');
    const hostBadge = i === 0
      ? ' <span class="material-symbols-rounded" style="font-size:1rem;vertical-align:middle;color:#f5c842">star_rate</span><span style="font-size:0.75rem;color:#f5c842;font-weight:700">ホスト</span>'
      : '';
    li.innerHTML = `${i + 1}. ${p.name || p.id}${hostBadge}`;
    elPlayerList.appendChild(li);
  });
  if (elStartBtn) {
    elStartBtn.disabled = list.length < maxPlayers;
    elStartBtn.textContent = list.length < maxPlayers
      ? `ゲーム開始（${list.length}/${maxPlayers}人）`
      : 'ゲーム開始！';
  }
}

// ホスト側: メッセージ受信
function onHostMessage(msg) {
  if (msg.type === MSG.JOIN) {
    // 名前未入力のゲストは参加順で自動採番（ホストが1なので 2,3,4）
    const name = msg.name || `プレイヤー${players.length + 1}`;
    if (!players.find(p => p.id === msg.from)) {
      players.push({ id: msg.from, name });
      broadcastPlayerList(players);
    }
    return;
  }
  if (msg.type === MSG.PLAYER_LIST && msg._local) {
    renderPlayerList(msg.players);
    return;
  }
  if (msg.type === MSG.GAME_START && msg._local) {
    startGame(msg.playerIds, msg.playerNames, msg.maxPlayers ?? maxPlayers);
  }
}

// ゲスト側: メッセージ受信
function onGuestMessage(msg) {
  if (msg.type === MSG.PLAYER_LIST) {
    // 自分のエントリを探して名前入力欄を更新（未入力の場合は自動採番名を反映）
    const myIdVal = getMyId();
    const ownPlayer = msg.players.find(p => p.id === myIdVal);
    if (ownPlayer) {
      elNameInput.value = ownPlayer.name;
      elNameInput.disabled = true;
    }
    renderPlayerList(msg.players);
    return;
  }
  if (msg.type === MSG.GAME_START) {
    startGame(msg.playerIds, msg.playerNames, msg.maxPlayers ?? 4);
  }
  if (msg.type === MSG.ERROR) {
    setStatus('エラー: ' + msg.message);
  }
}

function resetLobby() {
  players = [];
  elNameInput.disabled = false;
  elNameInput.value    = '';
  elRoomInput.value    = '';
  // URL から ?room= を除去
  history.replaceState(null, '', window.location.pathname);
  document.getElementById('panel-create').style.display  = 'block';
  document.getElementById('panel-join').style.display    = 'block';
  const panelPlayers = document.getElementById('panel-players');
  if (panelPlayers) panelPlayers.style.display = 'none';
  elPlayerList.innerHTML = '';
  if (elStatusRoom) elStatusRoom.style.display = 'none';
  elMyId.textContent = '—';
  elCreateBtn.disabled = false;
  elJoinBtn.disabled   = true;
  if (elStartBtn) elStartBtn.style.display = 'none';
  setStatus('ルームを作成するか、ホストのルームIDを入力して参加してください');
  elStatus.style.display = 'block';
}

function returnToLobbyKeepRoom() {
  const myIdVal   = getMyId();
  const isHostVal = players[0]?.id === myIdVal;

  // メッセージハンドラをロビー用に戻す
  setMessageHandler(isHostVal ? onHostMessage : onGuestMessage);

  // UIをロビースタイルに戻す（接続・プレイヤーリストはそのまま）
  document.getElementById('panel-create').style.display = 'none';
  document.getElementById('panel-join').style.display   = 'none';
  if (elStatusRoom) elStatusRoom.style.display = 'block';
  elStatus.style.display = 'none';

  // プレイヤーリストを再描画
  renderPlayerList(players);

  if (isHostVal) {
    // ホストのみスタートボタンを再表示し、全員にプレイヤーリストを再配信
    if (elStartBtn) elStartBtn.style.display = 'block';
    broadcastPlayerList(players);
  }
}

function startGame(playerIds, playerNames, maxP = 4) {
  const myIdVal   = getMyId();
  const isHostVal = playerIds[0] === myIdVal;

  document.getElementById('lobby-screen').style.display = 'none';
  document.getElementById('game-screen').style.display  = 'flex';

  initGameScreen(playerIds, playerNames, myIdVal, isHostVal, returnToLobbyKeepRoom, maxP);
}

// -------- ボタンイベント --------
elCreateBtn.addEventListener('click', async () => {
  const name = elNameInput.value.trim() || 'プレイヤー1';
  elNameInput.value = name; // 未入力の場合はデフォルト名を表示
  elNameInput.disabled = true;
  document.getElementById('panel-create').style.display = 'none';
  document.getElementById('panel-join').style.display   = 'none';
  setStatus('接続中...');
  try {
    const id = await initPeer();
    elMyId.textContent = id;
    // URL に ?room=<id> を付与して共有しやすくする
    const roomUrl = new URL(window.location.href);
    roomUrl.searchParams.set('room', id);
    history.replaceState(null, '', roomUrl.toString());
    if (elStatusRoom) elStatusRoom.style.display = 'block';
    players = [{ id, name }];
    createRoom(onHostMessage);
    renderPlayerList(players);
    // ホストにのみ開始ボタンを表示
    if (elStartBtn) elStartBtn.style.display = 'block';
    elStatus.style.display = 'none';
  } catch (e) {
    setStatus('接続エラー: ' + e.message);
  }
});

elJoinBtn.addEventListener('click', async () => {
  const hostId = elRoomInput.value.trim();
  const name  = elNameInput.value.trim(); // 空のままホストに渡し、ホスト側で採番
  if (!hostId) { setStatus('ルームIDを入力してください'); return; }
  // disabled は PLAYER_LIST 受信後に行う（自動採番名を反映するため）
  document.getElementById('panel-create').style.display = 'none';
  document.getElementById('panel-join').style.display   = 'none';
  setStatus('接続中...');
  try {
    await initPeer();
    joinRoom(hostId, name, onGuestMessage);
    setStatus('ルームに参加しました。ホストがゲームを開始するまでお待ちください。');
  } catch (e) {
    setStatus('接続エラー: ' + e.message);
  }
});

if (elCopyBtn) {
  elCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(elMyId.textContent);
    elCopyBtn.textContent = 'コピーしました！';
    setTimeout(() => { elCopyBtn.textContent = 'IDコピー'; }, 2000);
  });
}

const elCopyUrlBtn = document.getElementById('btn-copy-url');
if (elCopyUrlBtn) {
  elCopyUrlBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    elCopyUrlBtn.textContent = 'コピーしました！';
    setTimeout(() => { elCopyUrlBtn.textContent = '🔗 URLコピー'; }, 2000);
  });
}

// ページ読み込み時: ?room=<id> があれば入力欄に自動セット（編集不可に）
(function applyRoomFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get('room');
  const elResetBtn = document.getElementById('btn-reset-room');
  if (roomParam) {
    elRoomInput.value    = roomParam;
    elRoomInput.disabled = true;          // 編集不可
    if (elResetBtn) elResetBtn.style.display = '';
    elRoomInput.dispatchEvent(new Event('input'));
    // ルーム作成パネルを非表示
    document.getElementById('panel-create').style.display = 'none';

    if (elResetBtn) {
      elResetBtn.addEventListener('click', () => {
        // ?room を削除して全部リセット
        history.replaceState(null, '', window.location.pathname);
        elRoomInput.value    = '';
        elRoomInput.disabled = false;
        elResetBtn.style.display = 'none';
        // ルーム作成パネルを再表示
        document.getElementById('panel-create').style.display = 'block';
        document.getElementById('panel-join').style.display   = 'block';
        elCreateBtn.disabled = false;
        elJoinBtn.disabled   = true;
        elRoomInput.dispatchEvent(new Event('input'));
      }, { once: true });
    }
  }
})();

if (elStartBtn) {
  elStartBtn.addEventListener('click', () => {
    if (players.length < maxPlayers) return;
    const ids   = players.map(p => p.id);
    const names = players.map(p => p.name);
    broadcastGameStart(ids, names, maxPlayers);
  });
}

// 人数ラジオボタンの変更を監視（ホスト側のみ有効）
document.querySelectorAll('input[name="player-count"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    maxPlayers = parseInt(e.target.value, 10);
    renderPlayerList(players);
  });
});
