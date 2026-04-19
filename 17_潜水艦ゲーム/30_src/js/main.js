// ============================================================
// main.js  ゲームコントローラー（メッセージルーティング）
// ============================================================
import { MSG, getMyId, getIsHost, setMessageHandler,
         broadcastState, sendPrivate, broadcastPublic,
         broadcastGameOver, sendToGuest } from './peer.js';
import { createInitialState, handleCommand,
         forceConfirmAll, advanceToNextTurn,
         sanitizeStateForPlayer, calcTimeCost } from './gameLogic.js';
import { COMMAND_TIME_LIMIT } from './constants.js';
import { initRenderer, renderState, startActionAnimation, clearActionAnimation } from './render.js';
import { initUI, updateUI, showPhase, showPhaseOverlay, showActionEvents, getSelectedOps,
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
    onConfirm: handleConfirmLocal,
    calcTimeCost,
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
      // 時間切れ: ローカルプレイヤーがまだ確定していなければ、入力中のコマンドをそのまま確定送信
      const myId = getMyId();
      if (gameState.players[myId] && !gameState.players[myId].commandConfirmed) {
        const { opIds, targets } = getSelectedOps();
        handleConfirmLocal(opIds, targets);
      }
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
    if (phase === 'command') showPhaseOverlay('コマンド入力', '操作パネルからコマンドを選択して確定してください');
    else if (phase === 'action')  showPhaseOverlay('行動フェーズ', '作戦実行中…');
    _lastPhase = phase;
  }

  if (phase === 'command') {
    if (_animStartTimeoutId) { clearTimeout(_animStartTimeoutId); _animStartTimeoutId = null; }
    clearActionAnimation();
    enableCommand(localView, isNewPhase);
  } else if (phase === 'action') {
    showActionEvents(localView.actionEvents, localView);
    // isNewPhase のときのみアニメを開始（再送信等による多重起動を防ぐ）
    // フェーズオーバーレイ（1800ms）が消えてからアニメ開始
    if (isNewPhase) {
      const capturedView = localView;
      // actionPhaseStartedAt を使ってネットワーク遅延分だけ待機時間を短縮し同期を記る
      const elapsed = capturedView.actionPhaseStartedAt ? Date.now() - capturedView.actionPhaseStartedAt : 0;
      const delay = Math.max(0, 1800 - elapsed);
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

export function getLocalView() { return localView; }
