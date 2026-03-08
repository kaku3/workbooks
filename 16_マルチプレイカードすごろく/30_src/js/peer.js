// ============================================================
// peer.js  PeerJS を使ったP2P通信レイヤー
//
// 役割: ホスト(1名)がゲーム状態を持ち、他3名はゲストとして接続する。
//       全メッセージはホストを経由して全員に同期する。
// ============================================================

import { sanitizeStateForPlayer } from './gameLogic.js';

let peer = null;       // 自分のPeerオブジェクト
let myId = null;       // 自分のPeer ID（= ルームに参加するときに使うID）
let isHost = false;
let guestConns = {};   // ホスト用: { peerId: DataConnection }
let hostConn = null;   // ゲスト用: ホストへの DataConnection
let onMessageCallback = null; // ゲーム本体への通知

export const MSG = {
  // ゲスト→ホスト
  JOIN:            'join',           // ゲストが参加を申請
  PLAY_CARD:       'play_card',      // カードをプレイ
  RESOLVE_LOC:     'resolve_loc',    // ロケーション効果を解決
  DECLARE_ARREST:  'declare_arrest', // 確保宣言
  CHOOSE_CARD:     'choose_card',    // 闇市/タワーでカードを選択
  PASS_CHOICE:     'pass_choice',    // 横流し：渡すカードを選択

  // ホスト→全員
  STATE_UPDATE:    'state_update',   // ゲーム状態を全員へ配信
  PRIVATE_REVEAL:  'private_reveal', // 個人だけへの情報開示
  PUBLIC_REVEAL:   'public_reveal',  // 全員への公開
  GAME_OVER:       'game_over',      // ゲーム終了
  PLAYER_LIST:     'player_list',    // ロビー: 参加者一覧
  GAME_START:      'game_start',     // ゲーム開始通知

  // エラー
  ERROR:           'error',
};

// --------------- 初期化 ---------------
/**
 * PeerJSを初期化し、自分のPeer IDを取得する
 * @returns {Promise<string>} myPeerId
 */
export function initPeer() {
  return new Promise((resolve, reject) => {
    // オプションなし → PeerJS公式クラウドサーバー (0.peerjs.com) を使用
    peer = new Peer();
    peer.on('open', id => {
      myId = id;
      resolve(id);
    });
    peer.on('error', err => reject(err));
  });
}

export function getMyId() { return myId; }
export function getIsHost() { return isHost; }

// --------------- ホスト ---------------
/**
 * ホストとしてルームを作成し、接続を待ち受ける
 */
export function createRoom(onMessage) {
  isHost = true;
  onMessageCallback = onMessage;

  peer.on('connection', conn => {
    conn.on('open', () => {
      guestConns[conn.peer] = conn;
      console.log('ゲスト接続:', conn.peer);
    });
    conn.on('data', data => {
      // ゲストからのメッセージをゲーム本体へ
      onMessageCallback({ from: conn.peer, ...data });
    });
    conn.on('close', () => {
      delete guestConns[conn.peer];
    });
  });
}

/**
 * ホストから指定プレイヤーにメッセージ送信（自分含む全員の場合は broadcastState を使う）
 */
export function sendToGuest(peerId, msg) {
  const conn = guestConns[peerId];
  if (conn && conn.open) conn.send(msg);
}

/**
 * ゲーム状態を全員に配信（各プレイヤー視点でサニタイズする）
 * @param {object} state
 * @param {object} [events] - { all?: EventObj, [playerId]: EventObj }
 *   all: 全員に表示するイベント。プレイヤー個別エントリが優先される。
 */
export function broadcastState(state, events = {}) {
  const myEvent = events[myId] ?? events.all ?? null;
  // ホスト自身への通知
  const myView = sanitizeStateForPlayer(state, myId);
  onMessageCallback({ type: MSG.STATE_UPDATE, state: myView, event: myEvent, _local: true });

  // 各ゲストへ
  Object.keys(guestConns).forEach(pid => {
    const view = sanitizeStateForPlayer(state, pid);
    const ev   = events[pid] ?? events.all ?? null;
    sendToGuest(pid, { type: MSG.STATE_UPDATE, state: view, event: ev });
  });
}

/**
 * 特定プレイヤーだけへのプライベート通知
 */
export function sendPrivate(toId, payload) {
  if (toId === myId) {
    onMessageCallback({ type: MSG.PRIVATE_REVEAL, ...payload, _local: true });
  } else {
    sendToGuest(toId, { type: MSG.PRIVATE_REVEAL, ...payload });
  }
}

/**
 * 全員への公開通知
 */
export function broadcastPublic(payload) {
  const msg = { type: MSG.PUBLIC_REVEAL, ...payload };
  onMessageCallback({ ...msg, _local: true });
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
}

/**
 * ゲーム終了通知
 */
export function broadcastGameOver(winner) {
  const msg = { type: MSG.GAME_OVER, winner };
  onMessageCallback({ ...msg, _local: true });
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
}

/**
 * ゲスト一覧をロビーに通知
 */
export function broadcastPlayerList(players) {
  const msg = { type: MSG.PLAYER_LIST, players };
  onMessageCallback({ ...msg, _local: true });
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
}

/**
 * ゲーム開始を全員に通知
 * 注意: ゲストへの GAME_START は必ず STATE_UPDATE より先に届く必要があるため、
 *       WebRTC 送信（ゲスト宛）を先に行い、ローカル処理（ホスト）を後に実行する。
 */
export function broadcastGameStart(playerIds, playerNames = []) {
  const msg = { type: MSG.GAME_START, playerIds, playerNames };
  // 1) ゲストへ先に送信（WebRTC キューに積む）
  Object.keys(guestConns).forEach(pid => sendToGuest(pid, msg));
  // 2) ホスト自身はローカル処理（この中で broadcastState が呼ばれ STATE_UPDATE が送られる）
  onMessageCallback({ ...msg, _local: true });
}

export function getGuestIds() {
  return Object.keys(guestConns);
}

/**
 * メッセージハンドラを差し替える（ロビー→ゲーム画面切り替え時に使用）
 */
export function setMessageHandler(callback) {
  onMessageCallback = callback;
}

// --------------- ゲスト ---------------
/**
 * ゲストとしてホストに接続する
 * @param {string} hostId - ホストのPeer ID（URLパラメータなどで共有）
 * @param {Function} onMessage - メッセージ受信コールバック
 */
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

/**
 * ゲストからホストへメッセージ送信
 */
export function sendToHost(msg) {
  if (hostConn && hostConn.open) hostConn.send(msg);
}

// --------------- 共通アクション送信 ---------------
export function sendPlayCard(cardId, targetPlayerId = null, chosenCardId = null, targetLocation = null) {
  const msg = { type: MSG.PLAY_CARD, cardId, targetPlayerId, chosenCardId, targetLocation };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}

export function sendResolveLoc(locType, chosenCardId = null) {
  const msg = { type: MSG.RESOLVE_LOC, locType, chosenCardId };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}

export function sendDeclareArrest() {
  const msg = { type: MSG.DECLARE_ARREST };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}

export function sendPassChoice(cardId) {
  const msg = { type: MSG.PASS_CHOICE, cardId };
  if (isHost) onMessageCallback({ from: myId, ...msg });
  else sendToHost(msg);
}
