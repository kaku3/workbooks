// ============================================================
// peer.js  PeerJS P2P通信レイヤー（潜水艦ゲーム版）
//
// 役割: ホスト(1名)がゲーム状態を持ち、他はゲストとして接続。
//       全メッセージはホストを経由して全員に同期する。
// ============================================================

let peer = null;
let myId = null;
let isHost = false;
let guestConns = {};
let hostConn = null;
let onMessageCallback = null;

export const MSG = {
  // ロビー
  JOIN:           'join',
  PLAYER_LIST:    'player_list',
  GAME_START:     'game_start',
  // ゲーム（ゲスト→ホスト）
  DRAW_CHOICE:    'draw_choice',      // 山札選択
  COMMAND_CONFIRM:'command_confirm',   // コマンド確定
  DISCARD_CHOICE: 'discard_choice',    // 手札上限超過時の捨て札
  CARD_TARGET:    'card_target',       // カードの追加入力（方向、座標等）
  // ゲーム（ホスト→全員/個人）
  STATE_UPDATE:   'state_update',
  PRIVATE_EVENT:  'private_event',     // ソナー結果等（個人宛）
  PUBLIC_EVENT:   'public_event',      // 音漏れ等（全員）
  GAME_OVER:      'game_over',
  ERROR:          'error',
};

// --------------- 初期化 ---------------
export function initPeer() {
  return new Promise((resolve, reject) => {
    peer = new Peer();
    peer.on('open', id => { myId = id; resolve(id); });
    peer.on('error', err => reject(err));
  });
}

export function getMyId() { return myId; }
export function getIsHost() { return isHost; }

// --------------- ホスト ---------------
export function createRoom(onMessage) {
  isHost = true;
  onMessageCallback = onMessage;
  peer.on('connection', conn => {
    conn.on('open', () => {
      guestConns[conn.peer] = conn;
      console.log('ゲスト接続:', conn.peer);
    });
    conn.on('data', data => {
      onMessageCallback({ from: conn.peer, ...data });
    });
    conn.on('close', () => { delete guestConns[conn.peer]; });
  });
}

export function sendToGuest(peerId, msg) {
  const conn = guestConns[peerId];
  if (conn && conn.open) conn.send(msg);
}

/**
 * ゲーム状態を全員に配信（各プレイヤー視点でサニタイズ）
 */
export function broadcastState(state, sanitizeFn, events = {}) {
  // ホスト自身
  const myView = sanitizeFn(state, myId);
  const myEvent = events[myId] ?? events.all ?? null;
  onMessageCallback({ type: MSG.STATE_UPDATE, state: myView, event: myEvent, _local: true });
  // 各ゲスト
  Object.keys(guestConns).forEach(pid => {
    const view = sanitizeFn(state, pid);
    const ev = events[pid] ?? events.all ?? null;
    sendToGuest(pid, { type: MSG.STATE_UPDATE, state: view, event: ev });
  });
}

export function sendPrivate(toId, payload) {
  const msg = { type: MSG.PRIVATE_EVENT, ...payload };
  if (toId === myId) {
    onMessageCallback({ ...msg, _local: true });
  } else {
    sendToGuest(toId, msg);
  }
}

export function broadcastPublic(payload) {
  const msg = { type: MSG.PUBLIC_EVENT, ...payload };
  onMessageCallback({ ...msg, _local: true });
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
}

export function broadcastGameOver(winnerId, players = []) {
  const msg = { type: MSG.GAME_OVER, winnerId, players };
  onMessageCallback({ ...msg, _local: true });
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
}

export function broadcastPlayerList(players) {
  const msg = { type: MSG.PLAYER_LIST, players };
  onMessageCallback({ ...msg, _local: true });
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
}

export function broadcastGameStart(playerIds, playerNames, maxPlayers) {
  const msg = { type: MSG.GAME_START, playerIds, playerNames, maxPlayers };
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
  onMessageCallback({ ...msg, _local: true });
}

export function getGuestIds() { return Object.keys(guestConns); }

export function setMessageHandler(callback) { onMessageCallback = callback; }

export function destroyPeer() {
  Object.values(guestConns).forEach(c => { try { c.close(); } catch(_){} });
  guestConns = {};
  if (hostConn) { try { hostConn.close(); } catch(_){} hostConn = null; }
  if (peer) { try { peer.destroy(); } catch(_){} peer = null; }
  myId = null; isHost = false; onMessageCallback = null;
}

// --------------- ゲスト ---------------
export function joinRoom(hostId, name, onMessage) {
  isHost = false;
  onMessageCallback = onMessage;
  hostConn = peer.connect(hostId, { reliable: true });
  hostConn.on('open', () => {
    console.log('ホストに接続:', hostId);
    sendToHost({ type: MSG.JOIN, from: myId, name });
  });
  hostConn.on('data', data => {
    onMessageCallback({ ...data, _local: false });
  });
  hostConn.on('error', err => console.error('接続エラー:', err));
}

export function sendToHost(msg) {
  if (hostConn && hostConn.open) hostConn.send(msg);
}

// --------------- 共通アクション送信 ---------------
export function sendDrawChoice(deckType) {
  const msg = { type: MSG.DRAW_CHOICE, deckType };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}

export function sendCommandConfirm(cardUids, targets) {
  const msg = { type: MSG.COMMAND_CONFIRM, cardUids, targets };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}

export function sendCardTarget(cardUid, target) {
  const msg = { type: MSG.CARD_TARGET, cardUid, target };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}

export function sendDiscardChoice(cardUids) {
  const msg = { type: MSG.DISCARD_CHOICE, cardUids };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}
