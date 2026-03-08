// ============================================================
// lobby.js  ロビー画面のUI処理
// ============================================================

import { initPeer, getMyId, createRoom, joinRoom, broadcastPlayerList, broadcastGameStart, sendToHost, MSG, getGuestIds } from './peer.js';
import { initGameScreen } from './main.js';

const MAX_PLAYERS = 4;
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
    li.textContent = `${i + 1}. ${p.name || p.id} ${i === 0 ? '👑ホスト' : ''}`;
    elPlayerList.appendChild(li);
  });
  if (elStartBtn) {
    elStartBtn.disabled = list.length < MAX_PLAYERS;
    elStartBtn.textContent = list.length < MAX_PLAYERS
      ? `ゲーム開始（${list.length}/${MAX_PLAYERS}人）`
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
    startGame(msg.playerIds, msg.playerNames);
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
    startGame(msg.playerIds, msg.playerNames);
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

function startGame(playerIds, playerNames) {
  const myIdVal   = getMyId();
  const isHostVal = playerIds[0] === myIdVal;

  document.getElementById('lobby-screen').style.display = 'none';
  document.getElementById('game-screen').style.display  = 'flex';

  initGameScreen(playerIds, playerNames, myIdVal, isHostVal, resetLobby);
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
    setTimeout(() => { elCopyBtn.textContent = 'コピー'; }, 2000);
  });
}

if (elStartBtn) {
  elStartBtn.addEventListener('click', () => {
    if (players.length < MAX_PLAYERS) return;
    const ids   = players.map(p => p.id);
    const names = players.map(p => p.name);
    broadcastGameStart(ids, names);
  });
}
