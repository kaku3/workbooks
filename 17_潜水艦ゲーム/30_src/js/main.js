// ============================================================
// main.js  ゲームコントローラー（メッセージルーティング）
// ============================================================
import { MSG, getMyId, getIsHost, setMessageHandler,
         broadcastState, sendPrivate, broadcastPublic,
         broadcastGameOver, sendToGuest } from './peer.js';
import { createInitialState, handleDraw, handleCommand,
         forceConfirmAll, advanceToNextTurn,
         sanitizeStateForPlayer, calcFuelCost } from './gameLogic.js';
import { COMMAND_TIME_LIMIT } from './constants.js';
import { initRenderer, renderState, startActionAnimation, clearActionAnimation } from './render.js';
import { initUI, updateUI, showPhase, showPhaseOverlay, showActionEvents,
         showGameOver, enableDraw, enableCommand, showTurnSummary, showCurrentAction } from './ui.js';

let gameState = null;   // ホストのみ保持
let localView  = null;  // 各クライアントが受信したサニタイズ済み状態
let commandTimer = null;
let _lastPhase = null;  // フェーズ変化検出用
let _animStartTimeoutId = null;  // actionアニメ開始の1800ms遅延タイマー（キャンセル可能）

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
    onDraw: handleDrawLocal,
    onConfirm: handleConfirmLocal,
    calcFuelCost,
  });
}

/* ============================================================
   ホスト側メッセージハンドラ
   ============================================================ */
function onHostMessage(msg) {
  const from = msg.from || getMyId();
  switch (msg.type) {
    case MSG.DRAW_CHOICE: {
      const card = handleDraw(gameState, from, msg.deckType);
      if (card) {
        // そのプレイヤーに引いたカードを通知
        sendPrivate(from, { drawnCard: card });
      }
      syncStateToAll();
      break;
    }
    case MSG.COMMAND_CONFIRM: {
      handleCommand(gameState, from, msg.cardUids, msg.targets);
      syncStateToAll();
      // アクションフェーズになったらタイマーを停止
      // 次ターンへの遷移はアニメ完了コールバック (advanceAfterAnimation) で行う
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
      if (msg._local) showGameOver(msg.winnerId, localView);
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
      showGameOver(msg.winnerId, localView);
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
      commandTimer = null;
      forceConfirmAll(gameState);
      syncStateToAll();
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
  renderState(localView);
  updateUI(localView);

  const phase = localView.phase;
  showPhase(phase, localView.turn);

  const isNewPhase = (phase !== _lastPhase);
  if (isNewPhase) {
    if (phase === 'draw')    showPhaseOverlay('戦術フェーズ', 'カードを２枚補充し戦術を決める');
    else if (phase === 'command') showPhaseOverlay('戦術フェーズ', 'コマンドを選択して確定してください');
    else if (phase === 'action')  showPhaseOverlay('行動フェーズ', '戦術に沿った行動をとる');
    _lastPhase = phase;
  }

  if (phase === 'draw') {
    if (_animStartTimeoutId) { clearTimeout(_animStartTimeoutId); _animStartTimeoutId = null; }
    clearActionAnimation();   // アクションアニメが残っていた場合即座にクリア
    stopCommandTimer();
    enableDraw(localView);
  } else if (phase === 'command') {
    if (_animStartTimeoutId) { clearTimeout(_animStartTimeoutId); _animStartTimeoutId = null; }
    clearActionAnimation();
    enableCommand(localView, isNewPhase);  // isNewPhase=false の場合は選択状態を保持
  } else if (phase === 'action') {
    showActionEvents(localView.actionEvents, localView);
    // isNewPhase のときのみアニメを開始（再送信等による多重起動を防ぐ）
    // フェーズオーバーレイ（1800ms）が消えてからアニメ開始
    if (isNewPhase) {
      const capturedView = localView;
      _animStartTimeoutId = setTimeout(() => {
        _animStartTimeoutId = null;
        startActionAnimation(
          capturedView.actionEvents || [],
          capturedView,
          // onDone: ホストのみ次ターンへ遷移
          getIsHost() ? () => {
            advanceToNextTurn(gameState);
            syncStateToAll();
          } : null,
          (ev) => showCurrentAction(ev, capturedView)
        );
      }, 1800);
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
  }
}

/* ============================================================
   ローカル操作 → メッセージ送信
   ============================================================ */
function handleDrawLocal(deckType) {
  if (getIsHost()) {
    onHostMessage({ type: MSG.DRAW_CHOICE, from: getMyId(), deckType });
  } else {
    import('./peer.js').then(m => m.sendDrawChoice(deckType));
  }
}

function handleConfirmLocal(cardUids, targets) {
  if (getIsHost()) {
    onHostMessage({ type: MSG.COMMAND_CONFIRM, from: getMyId(), cardUids, targets });
  } else {
    import('./peer.js').then(m => m.sendCommandConfirm(cardUids, targets));
  }
}

export function getLocalView() { return localView; }
