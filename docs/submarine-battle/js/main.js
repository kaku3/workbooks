// ============================================================
// main.js  ゲームコントローラー（メッセージルーティング）
// ============================================================
import { MSG, getMyId, getIsHost, setMessageHandler,
         broadcastState, sendPrivate, broadcastPublic,
         broadcastGameOver, sendToGuest, sendRematchRequest } from './peer.js';
import { createInitialState,
         sanitizeStateForPlayer } from './gameLogic.js';
import { handleCommand, forceConfirmAll,
         advanceToNextTurn, calcTimeCost } from './gameSequence.js';
import { COMMAND_TIME_LIMIT } from './constants.js';
import { initRenderer, renderState, startActionAnimation, clearActionAnimation } from './render.js';
import { initUI, updateUI, showPhase, showPhaseOverlay, showActionEvents, getSelectedOps,
         showGameOver, enableDraw, enableCommand, showTurnSummary, showCurrentAction } from './ui.js';
import { cancelBoardPick } from './modal.js';

let gameState = null;   // ホストのみ保持
let localView  = null;  // 各クライアントが受信したサニタイズ済み状態
let commandTimer = null;
let _lastPhase = null;  // フェーズ変化検出用
let _animStartTimeoutId = null;  // actionアニメ開始の1800ms遅延タイマー（キャンセル可能）
let _gameOverTimeoutId = null;    // 勝利画面表示タイマー（多重起動防止）

/* ============================================================
   ゲーム開始（ロビーから呼ばれる）
   ============================================================ */
export function initGameScreen(playerIds, playerNames) {
  document.getElementById('lobby-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  initRenderer(document.getElementById('board-canvas'));

  if (getIsHost()) {
    gameState = createInitialState(playerIds, playerNames);
    setMessageHandler(onHostMessage);
    syncStateToAll();
  }
  initUI({
    onConfirm: handleConfirmLocal,
    calcTimeCost,
    onRematch: handleRematchLocal,
  });
}

/* ============================================================
   ホスト側メッセージハンドラ
   ============================================================ */
function onHostMessage(msg) {
  const from = msg.from || getMyId();
  switch (msg.type) {
    case MSG.COMMAND_CONFIRM: {
      handleCommand(gameState, from, msg.cardUids, msg.targets);
      syncStateToAll();
      if (gameState.phase === 'action') {
        stopCommandTimer();
      }
      break;
    }
    case MSG.DISCARD_CHOICE: {
      const p = gameState.players[from];
      if (p && msg.cardUids) {
        msg.cardUids.forEach(uid => {
          const idx = p.hand.findIndex(c => c.uid === uid);
          if (idx >= 0) {
            const removed = p.hand.splice(idx, 1)[0];
            gameState.discards[removed.cat].push(removed);
          }
        });
      }
      syncStateToAll();
      break;
    }
    case MSG.STATE_UPDATE: {
      // ホスト自身のローカル受信
      if (msg._local) {
        localView = msg.state;
        onLocalStateUpdate(msg.event);
      }
      break;
    }
    case MSG.PRIVATE_EVENT: {
      if (msg._local) onPrivateEvent(msg);
      break;
    }
    case MSG.PUBLIC_EVENT: {
      if (msg._local) onPublicEvent(msg);
      break;
    }
    case MSG.GAME_OVER: {
      if (msg._local) showGameOverNow(msg.winnerId, localView);
      break;
    }
    case MSG.REMATCH_REQUEST: {
      if (gameState?.phase === 'ended') {
        restartGameFromCurrentPlayers();
      }
      break;
    }
  }
}

/* ============================================================
   ゲスト側メッセージハンドラ
   ============================================================ */
export function onGuestMessage(msg) {
  switch (msg.type) {
    case MSG.STATE_UPDATE:
      localView = msg.state;
      onLocalStateUpdate(msg.event);
      break;
    case MSG.PRIVATE_EVENT:
      onPrivateEvent(msg);
      break;
    case MSG.PUBLIC_EVENT:
      onPublicEvent(msg);
      break;
    case MSG.GAME_OVER:
      showGameOverNow(msg.winnerId, localView);
      break;
  }
}

/* ============================================================
   状態同期
   ============================================================ */
function syncStateToAll() {
  if (!getIsHost() || !gameState) return;
  broadcastState(gameState, sanitizeStateForPlayer);

  // コマンドフェーズ開始 → タイマー設定
  if (gameState.phase === 'command' && !commandTimer) {
    startCommandTimer();
  }
  // 勝者決定 (winner=null の引き分けも含む)
  if (gameState.phase === 'ended') {
    broadcastGameOver(gameState.winner);
  }
}

function startCommandTimer() {
  if (commandTimer) return;
  let remaining = COMMAND_TIME_LIMIT;
  commandTimer = setInterval(() => {
    remaining--;
    broadcastPublic({ timerTick: remaining });
    if (remaining <= 0) {
      clearInterval(commandTimer);
      commandTimer = 'expired'; // syncStateToAll がタイマーを再起動しないようガード
      // 時間切れ: 盤面ピック中のプロミスを先にキャンセルしてから selectedOps を取得
      cancelBoardPick();
      // ローカルプレイヤーがまだ確定していなければ、選択済みのコマンドをそのまま確定送信
      const myId = getMyId();
      if (gameState.players[myId] && !gameState.players[myId].commandConfirmed) {
        const { opIds, targets } = getSelectedOps();
        handleConfirmLocal(opIds, targets);
      }
      // ゲスト側は timerTick=0 を受けて確定メッセージを送信するが PeerJS 経由のため
      // ホストへの到着は非同期。600ms 猶予を設けて先着順に受け付け、
      // それでも未確定のプレイヤーは forceConfirmAll で強制確定する。
      setTimeout(() => {
        forceConfirmAll(gameState);
        commandTimer = null; // ガード解除（以後は syncStateToAll が通常通り動作）
        syncStateToAll();
      }, 600);
      // 次ターンへの遷移はアニメ完了コールバックで行う
    }
  }, 1000);
}

function stopCommandTimer() {
  if (commandTimer) { clearInterval(commandTimer); commandTimer = null; }
}

/* ============================================================
   ローカル状態更新ハンドラ（表示系）
   ============================================================ */
function onLocalStateUpdate(event) {
  if (!localView) return;
  // actionフェーズ中はアニメが座標を管理するため、冲頭の renderState はスキップ。
  // コマンドフェーズまたは終了時は通常渲染。
  if (localView.phase !== 'action') renderState(localView);
  updateUI(localView);

  const phase = localView.phase;
  showPhase(phase, localView.turn);

  const isNewPhase = (phase !== _lastPhase);
  if (isNewPhase) {
    if (phase === 'command') showPhaseOverlay('コマンド入力', '操作パネルからコマンドを選択して確定してください');
    else if (phase === 'action')  showPhaseOverlay('行動フェーズ', '作戦実行中…');
    _lastPhase = phase;
  }

  if (phase === 'command') {
    if (_animStartTimeoutId) { clearTimeout(_animStartTimeoutId); _animStartTimeoutId = null; }
    if (_gameOverTimeoutId) { clearTimeout(_gameOverTimeoutId); _gameOverTimeoutId = null; }
    clearActionAnimation();
    enableCommand(localView, isNewPhase);
  } else if (phase === 'action') {
    stopCommandTimer(); // タイムアウト経由でタイマーが再起動された場合も確実に停止
    showActionEvents(localView.actionEvents, localView);
    // isNewPhase のときのみアニメを開始（再送信等による多重起動を防ぐ）
    // フェーズオーバーレイ（1800ms）が消えてからアニメ開始
    if (isNewPhase) {
      const capturedView = localView;
      // オーバーレイ表示（1800ms）が消えてからアニメ開始するよう常に1800ms待つ。
      // (actionPhaseStartedAtを使った「経過時間差し引き」は、
      //   ネットワーク遅延が大きいとdelay=0になりオーバーレイ中に開始してしまうため廃止)
      const delay = 1800;
      _animStartTimeoutId = setTimeout(() => {
        _animStartTimeoutId = null;
        startActionAnimation(
          capturedView.actionEvents || [],
          capturedView,
          // onDone: ホストのみ次ターンへ遷移（winner 確定時は ended に遷移して broadcastGameOver）
          getIsHost() ? () => {
            advanceToNextTurn(gameState);
            syncStateToAll();
          } : null,
          (ev) => {
            showCurrentAction(ev, capturedView);
          }
        );
      }, delay);
    }
  } else if (phase === 'ended') {
    stopCommandTimer();
  }
}

function onPrivateEvent(msg) {
  // ソナー結果等の個人通知
  if (msg.drawnCard) {
    // ドローアニメーション等
  }
}

function onPublicEvent(msg) {
  if (msg.timerTick !== undefined) {
    const el = document.getElementById('timer-display');
    if (el) el.textContent = msg.timerTick;

    // ゲスト側: timerTick=0 受信時に入力済みコマンドを自動送信（ベストエフォート）
    // ホスト側は startCommandTimer 内で直接処理するためここでは不要
    if (!getIsHost() && msg.timerTick <= 0) {
      const myId = getMyId();
      if (localView?.phase === 'command' && localView?.players?.[myId] && !localView.players[myId].commandConfirmed) {
        cancelBoardPick();
        const { opIds, targets } = getSelectedOps();
        handleConfirmLocal(opIds, targets);
      }
    }
  }
}

/* ============================================================
   ローカル操作 → メッセージ送信
   ============================================================ */
function handleConfirmLocal(opIds, targets) {
  if (getIsHost()) {
    onHostMessage({ type: MSG.COMMAND_CONFIRM, from: getMyId(), cardUids: opIds, targets });
  } else {
    import('./peer.js').then(m => m.sendCommandConfirm(opIds, targets));
  }
}

function handleRematchLocal() {
  if (getIsHost()) {
    if (gameState?.phase === 'ended') {
      restartGameFromCurrentPlayers();
    }
    return;
  }
  sendRematchRequest();
}

function restartGameFromCurrentPlayers() {
  if (!gameState) return;
  const playerIds = [...gameState.playerOrder];
  const playerNames = playerIds.map(id => gameState.players[id]?.name || 'プレイヤー');
  gameState = createInitialState(playerIds, playerNames);
  _lastPhase = null;
  if (_animStartTimeoutId) { clearTimeout(_animStartTimeoutId); _animStartTimeoutId = null; }
  if (_gameOverTimeoutId) { clearTimeout(_gameOverTimeoutId); _gameOverTimeoutId = null; }
  commandTimer = null;
  syncStateToAll();
}

function showGameOverNow(winnerId, view) {
  if (_gameOverTimeoutId) {
    clearTimeout(_gameOverTimeoutId);
    _gameOverTimeoutId = null;
  }
  showGameOver(winnerId, view);
}

function scheduleGameOver(winnerId, view, delayMs) {
  if (_gameOverTimeoutId) clearTimeout(_gameOverTimeoutId);
  _gameOverTimeoutId = setTimeout(() => {
    _gameOverTimeoutId = null;
    showGameOver(winnerId, view);
  }, delayMs);
}

export function getLocalView() { return localView; }
