// ============================================================
// main.js  ゲーム画面エントリポイント（状態管理ロジック呼び出し）
// ============================================================

import {
  getMyId, setMessageHandler,
  broadcastState, broadcastPublic, broadcastGameOver, sendPrivate,
  sendPlayCard, sendDeclareArrest, sendPassChoice, sendTradeTargetChoice, sendDashChoice,
  MSG
} from './peer.js';

import {
  createInitialState,
  doDrawPhase, playCard, resolveLocationSync, declareArrest,
  getCurrentPlayer, resolvePassChoice, resolveTradeChoice, resolveDashChoice,
} from './gameLogic.js';

import { CARD_TYPES, LOCATIONS } from './constants.js';

import { renderGame, getDisplayHand } from './render.js';

import {
  showTargetSelector, showLocationPrompt,
  showPrivateReveal, showPublicReveal,
  showEffectOverlay,
  showGameOver, showToast, showError,
  showPassCardSelector, showTradeTargetSelector, showDashCardSelector,
} from './modal.js';

// ============================================================
// 状態
// ============================================================
let myId      = null;
let isHost    = false;
let gameState = null; // ホストのみフル状態を保持
let localState = null; // 自分視点のサニタイズ済み状態（全員）
let nameMap   = {}; // { peerId: display名前 }

// ============================================================
// 初期化（lobby.js から呼び出される）
// ============================================================
export function initGameScreen(playerIds, playerNames, currentMyId, isHostParam, onReturnToLobby, maxPlayers = 4) {
  myId   = currentMyId;
  isHost = isHostParam;

  // 名前マップを構築
  nameMap = {};
  playerIds.forEach((id, i) => { nameMap[id] = playerNames?.[i] || id.slice(0, 8); });

  // ゲームメッセージハンドラを切り替え
  setMessageHandler(onMessage);

  // ボタンのイベントを登録（重複登録されないよう AbortController で管理）
  const arrestBtn    = document.getElementById('btn-arrest');
  const rulesBtn     = document.getElementById('btn-rules');
  const rulesClose   = document.getElementById('rules-close-btn');
  const backLobbyBtn = document.getElementById('btn-back-lobby');

  function onArrest()     { sendDeclareArrest(); }
  function onRulesOpen()  { document.getElementById('rules-overlay').style.display = 'flex'; }
  function onRulesClose() { document.getElementById('rules-overlay').style.display = 'none'; }
  function onBackLobby()  {
    // イベント解除
    arrestBtn?.removeEventListener('click', onArrest);
    rulesBtn?.removeEventListener('click', onRulesOpen);
    rulesClose?.removeEventListener('click', onRulesClose);
    backLobbyBtn?.removeEventListener('click', onBackLobby);
    // 画面切り替え
    document.getElementById('gameover-overlay').style.display = 'none';
    document.getElementById('game-screen').style.display      = 'none';
    document.getElementById('lobby-screen').style.display     = 'flex';
    // 接続は維持してロビーをリセット
    onReturnToLobby?.();
  }

  arrestBtn?.addEventListener('click', onArrest);
  rulesBtn?.addEventListener('click', onRulesOpen);
  rulesClose?.addEventListener('click', onRulesClose);
  backLobbyBtn?.addEventListener('click', onBackLobby);

  if (isHost) {
    gameState = createInitialState(playerIds, playerIds.map(id => nameMap[id]));
    broadcastState(gameState);
  }
}

// ============================================================
// メッセージ受信
// ============================================================
function onMessage(msg) {
  switch (msg.type) {
    case MSG.STATE_UPDATE:
      localState = msg.state;
      if (msg.event) showEffectOverlay(msg.event);
      renderGame(msg.state, myId, nameMap, onCardClick, onLocationPrompt, () => sendPlayCard(null));
      if (isHost) gameState = msg.state._full ?? gameState; // ホストはフル状態を維持
      // ダッシュ移動カード選択モーダル
      if (msg.state.phase === 'action_targeting' && msg.state.pendingAction?.action === 'dash') {
        const isMyTurn  = msg.state.players[msg.state.currentTurnIndex]?.id === myId;
        const modalOpen = document.getElementById('modal-overlay')?.style.display === 'flex';
        if (isMyTurn && !modalOpen) {
          showDashCardSelector(msg.state, myId, (cardId) => {
            sendDashChoice(cardId);
          }, getDisplayHand);
        }
      }
      // 横流し選択モーダル（未提出かつモーダル未表示の場合のみ）
      if (msg.state.phase === 'action_targeting' && msg.state.pendingAction?.action === 'pass') {
        const alreadySubmitted = msg.state.pendingAction.submitted?.includes(myId);
        const modalOpen = document.getElementById('modal-overlay')?.style.display === 'flex';
        if (!alreadySubmitted && !modalOpen) {
          showPassCardSelector(msg.state, myId, nameMap, (cardId) => {
            sendPassChoice(cardId);
          }, getDisplayHand);
        }
      }
      // 取引相手選択モーダル
      if (msg.state.phase === 'action_targeting' && msg.state.pendingAction?.action === 'trade' &&
          msg.state.pendingAction?.waitingFor === myId) {
        const modalOpen = document.getElementById('modal-overlay')?.style.display === 'flex';
        if (!modalOpen) {
          showTradeTargetSelector(msg.state, myId, (cardId) => {
            sendTradeTargetChoice(cardId);
          }, getDisplayHand);
        }
      }
      break;

    case MSG.PASS_CHOICE:
      if (isHost) handlePassChoice(msg.from, msg.cardId);
      break;

    case MSG.TRADE_TARGET_CHOICE:
      if (isHost) handleTradeTargetChoice(msg.from, msg.cardId);
      break;

    case MSG.DASH_CHOICE:
      if (isHost) handleDashChoice(msg.from, msg.cardId);
      break;

    case MSG.PLAY_CARD:
      if (isHost) handlePlayCard(msg.from, msg.cardId, msg.targetPlayerId, msg.chosenCardId, msg.targetLocation);
      break;

    case MSG.RESOLVE_LOC:
      if (isHost) handleResolveLoc(msg.from, msg.locType, msg.chosenCardId);
      break;

    case MSG.DECLARE_ARREST:
      if (isHost) handleDeclareArrest(msg.from);
      break;

    case MSG.PRIVATE_REVEAL:
      showPrivateReveal(msg);
      break;

    case MSG.PUBLIC_REVEAL:
      showPublicReveal(msg);
      break;

    case MSG.GAME_OVER:
      showGameOver(msg.winner, msg.players ?? [], nameMap);
      break;

    case MSG.ERROR:
      showError(msg.message);
      break;
  }
}

// ============================================================
// ホスト側: ゲームロジック呼び出し
// ============================================================
function handlePlayCard(fromId, cardId, targetPlayerId, chosenCardId, targetLocation) {
  const current = getCurrentPlayer(gameState);
  if (current.id !== fromId) return;

  if (gameState.phase === 'draw') {
    const drawResult = doDrawPhase(gameState);
    gameState = drawResult.state;
    const events = {};
    if (drawResult.drawnCard) {
      const c = drawResult.drawnCard;
      const icon = c.type === CARD_TYPES.ITEM ? '🎁'
                 : c.type === CARD_TYPES.MOVE  ? '🏃'
                 : '⚡';
      events[fromId] = {
        icon,
        title: 'カードをドロー！',
        body:  `「${c.label}」\n${c.desc}`,
      };
    }
    broadcastState(gameState, events);
    return;
  }

  if (!cardId) return;

  // カード情報をプレイ前に取得
  const card = current.hand.find(c => c.id === cardId);

  const result = playCard(gameState, cardId, targetPlayerId, chosenCardId, targetLocation);
  if (result.error) { sendErrorToPlayer(fromId, result.error); return; }

  gameState = result.state;

  let events = {};
  if (card?.type === CARD_TYPES.MOVE) {
    // 移動カード: ロケーション効果は handleResolveLoc 中で表示
    // ここでは移動通知のみ
    const newPos = current.position; // playCard が更新済み
    const loc    = LOCATIONS[gameState.players.find(p=>p.id===fromId)?.position];
    events.all = {
      icon:  loc?.emoji ?? '🚶',
      title: `${n(fromId)} が移動！`,
      body:  `${card.label} マス進んで「${loc?.name}」へ`,
    };
  } else if (card?.type === CARD_TYPES.ACTION) {
    events = buildActionEvents(fromId, card, targetPlayerId, targetLocation, result);
  }

  if (result.publicReveal) broadcastPublic({ ...result.publicReveal, ownerName: n(result.publicReveal.owner) });
  broadcastState(gameState, events);
  if (result.privateReveal) {
    const revs = Array.isArray(result.privateReveal) ? result.privateReveal : [result.privateReveal];
    revs.forEach(r => sendPrivate(r.to, r));
  }
  if (gameState.winner) broadcastWin();
}

// 名前山を返すヘルパー
function n(id) { return nameMap[id] ?? id?.slice(0, 6) ?? '?'; }

// アクションカードのイベントオブジェクトを構築
function buildActionEvents(fromId, card, targetId, targetLocation, result) {
  const events = {};
  const from = n(fromId);
  const targ = targetId ? n(targetId) : null;
  const rev  = result?.privateReveal;
  const pub  = result?.publicReveal;

  switch (card?.action) {
    case 'trade':
      events.all = { icon: '🤝', title: '取引！', body: `${from} が ${targ} と手札を１枚交換した` };
      break;
    case 'steal':
      events.all = { icon: '💸', title: '強奪！', body: `${from} が ${targ} の手札を１枚奪った` };
      break;
    case 'pass':
      events.all = { icon: '🔀', title: '横流し！', body: '全員がカードを選んでいます…' };
      break;
    case 'dump':
      events.all = { icon: '🗑️', title: 'ポイ捨て！', body: `${from} が ${targ} の手札を１枚捨てさせた` };
      break;
    case 'peek':
      events.all = { icon: '🔍', title: '尋問', body: `${from} が ${targ} の手札を１枚こっそり確認した` };
      break;
    case 'scan':
      events.all = { icon: '📡', title: 'スキャン', body: `${from} が ${targ} をスキャンした` };
      if (rev && !Array.isArray(rev)) {
        events[rev.to] = { icon: '📡', title: 'スキャン結果（本人のみ）', body: `${targ} の危険度：「${rev.hintLabel}」` };
      }
      break;
    case 'expose':
      events.all = { icon: '📢', title: '公開捜査！', body: `${from} が ${targ} の「${pub?.card?.label ?? '?'}」を全員に公開させた` };
      break;
    case 'whisper':
      events.all = { icon: '🤫', title: '密談', body: `${from} と ${targ} が手札を１枚見せ合った` };
      break;
    case 'skip':
      events.all = { icon: '⏭️', title: '足止め！', body: `${targ} は次のターンをスキップされた` };
      break;
    case 'block': {
      const locName = LOCATIONS[targetLocation]?.name ?? `マス${targetLocation}`;
      events.all = { icon: '🚧', title: '通行止め！', body: `${from} が「${locName}」を次のターンまで通行止めにした` };
      break;
    }
    case 'detect':
      events.all = { icon: '📡', title: '探知機！', body: `${from} が ${targ} をスキャンした（結果は本人のみ）` };
      break;
    case 'dash':
      events.all = { icon: '💨', title: 'ダッシュ！', body: `${from} が移動カードを選んでいます…` };
      break;
    case 'smoke':
      events.all = { icon: '🌫️', title: '煙幕！', body: `${from} が ${targ} の移動カード1枚を破棄した` };
      break;
    default: break;
  }
  return events;
}

function handleResolveLoc(fromId, locType, chosenCardId) {
  const current = getCurrentPlayer(gameState);
  if (current.id !== fromId) return;

  const loc = LOCATIONS[current.position];
  const result = resolveLocationSync(gameState, locType, chosenCardId);
  gameState = result.state;

  if (!result.wasBlocked) {
    if (result.privateReveal) {
      const revs = Array.isArray(result.privateReveal) ? result.privateReveal : [result.privateReveal];
      revs.forEach(r => sendPrivate(r.to, r));
    }
    if (result.publicReveal) broadcastPublic({ ...result.publicReveal, ownerName: n(result.publicReveal.owner) });
  }

  // 通行止め中の場合はイベントを表示しない
  const events = result.wasBlocked ? {} : buildLocationEvents(fromId, loc, locType, chosenCardId, result);

  broadcastState(gameState, events);
  if (gameState.winner) broadcastWin();
}

// ロケーション効果のイベントオブジェクトを構築
function buildLocationEvents(fromId, loc, locType, chosenCardId, result) {
  const events = {};
  const from = n(fromId);
  const targ = chosenCardId ? n(chosenCardId) : null; // detective/police_box/police_hq の対象
  const rev  = result?.privateReveal;
  const pub  = result?.publicReveal;

  switch (locType) {
    case 'start':
      break; // 効果なし
    case 'junk':
      events.all = { icon: loc.emoji, title: 'ジャンク屋', body: `${from} が山札から１枚ドローした` };
      if (rev && !Array.isArray(rev)) {
        events[rev.to] = { icon: loc.emoji, title: 'ジャンク屋でドロー（本人のみ）', body: `引いたカード：\n「${rev.card?.label}」\n${rev.card?.desc ?? ''}` };
      }
      break;
    case 'pub':
      events.all = { icon: loc.emoji, title: '酒場', body: `${from} が強制的に誰かと手札１枚交換した（泥酔）` };
      break;
    case 'detective':
      // ログは全員 → オーバーレイは本人のみ（investigator）
      events[fromId] = { icon: loc.emoji, title: '探偵事務所', body: `${targ ?? '?'} の手札をこっそり調査した` };
      if (rev && !Array.isArray(rev)) {
        events[rev.to] = { icon: loc.emoji, title: '探偵の調査結果（本人のみ）', body: `${targ ?? '?'} の手札に\n「${rev.card?.label}」\n${rev.card?.desc}` };
      }
      break;
    case 'factory':
      events.all = { icon: loc.emoji, title: 'パーツ工場', body: `${from} がアイテムカードを入手した` };
      break;
    case 'casino': {
      const lastMsg = gameState.log[gameState.log.length - 1]?.message ?? '';
      events.all = { icon: loc.emoji, title: 'カジノ', body: lastMsg };
      break;
    }
    case 'tower':
      events.all = { icon: loc.emoji, title: 'タワー', body: `${from} が山札からカードをサーチして入手した` };
      break;
    case 'crossing':
      events.all = { icon: loc.emoji, title: 'スクランブル交差点', body: '全員の手札が1枚ずつ次のプレイヤーに回った！' };
      break;
    case 'police_box':
      events.all = { icon: loc.emoji, title: '交番', body: `${from} が ${targ ?? '?'} の手札を１枚没収した` };
      break;
    case 'black_mkt':
      events.all = { icon: loc.emoji, title: '闇市', body: `${from} が捨て札からカードを入手した` };
      break;
    case 'broadcast':
      events.all = { icon: loc.emoji, title: '放送局！', body: `${from} の手札が全員に公開された！ → １枚ドロー` };
      break;
    case 'construct':
      events.all = { icon: loc.emoji, title: '工事現場', body: `${from} は工事現場で１回休みになった` };
      break;
    case 'salvage':
      events.all = { icon: loc.emoji, title: '廃材置き場', body: `${from} が廃材からアイテムを入手した` };
      if (rev && !Array.isArray(rev)) {
        events[fromId] = { icon: loc.emoji, title: '廃材置き場で入手（本人のみ）', body: `「${rev.card?.label}」\n${rev.card?.desc ?? ''}` };
      }
      break;
    case 'hospital':
      events.all = { icon: loc.emoji, title: '病院', body: `${from} の手札がリセットされた → ５枚引き直し` };
      break;
    case 'warehouse':
      events.all = { icon: loc.emoji, title: '倉庫', body: `${from} が倉庫から１枚ドローした` };
      if (rev && !Array.isArray(rev)) {
        events[fromId] = { icon: loc.emoji, title: '倉庫でドロー（本人のみ）', body: `「${rev.card?.label}」\n${rev.card?.desc ?? ''}` };
      }
      break;
    case 'police_hq':
      // ログは全員 → オーバーレイは本人のみ
      events[fromId] = { icon: loc.emoji, title: '警察本部', body: `${targ ?? '?'} の陣営を調査した` };
      if (rev && !Array.isArray(rev)) {
        events[rev.to] = { icon: loc.emoji, title: '捜査結果（本人のみ）', body: `${targ ?? '?'} は「${rev.roleLabel}」だ！` };
      }
      break;
    default: break;
  }
  return events;
}

function handleDeclareArrest(fromId) {
  const result = declareArrest(gameState, fromId);
  if (result.error) { sendErrorToPlayer(fromId, result.error); return; }
  gameState = result.state;
  broadcastState(gameState);
  broadcastWin();
}

function handleTradeTargetChoice(fromId, cardId) {
  const attackerName = n(getCurrentPlayer(gameState)?.id);
  const targetName   = n(fromId);
  const result = resolveTradeChoice(gameState, fromId, cardId);
  if (result.error) { sendErrorToPlayer(fromId, result.error); return; }
  gameState = result.state;
  const events = { all: { icon: '🤝', title: '取引完了！', body: `${attackerName} と ${targetName} が手札を1枚交換した` } };
  broadcastState(gameState, events);
  if (gameState.winner) broadcastWin();
}

function handlePassChoice(fromId, cardId) {
  const result = resolvePassChoice(gameState, fromId, cardId);
  if (result.error) { sendErrorToPlayer(fromId, result.error); return; }
  gameState = result.state;
  const events = result.done
    ? { all: { icon: '🔀', title: '横流し完了！', body: '各自が選んだカードが次のプレイヤーに渡った' } }
    : {};
  broadcastState(gameState, events);
  if (gameState.winner) broadcastWin();
}

function handleDashChoice(fromId, cardId) {
  const current = getCurrentPlayer(gameState);
  if (current.id !== fromId) return;
  const result = resolveDashChoice(gameState, fromId, cardId);
  if (result.error) { sendErrorToPlayer(fromId, result.error); return; }
  gameState = result.state;
  const player = gameState.players.find(p => p.id === fromId);
  const loc = LOCATIONS[player?.position];
  const events = { all: { icon: '💨', title: 'ダッシュ！', body: `${n(fromId)} が猛ダッシュで「${loc?.name ?? '?'}」へ移動！` } };
  broadcastState(gameState, events);
  if (gameState.winner) broadcastWin();
}

// ゲーム終了通知（役職情報を含む）
function broadcastWin() {
  broadcastGameOver(gameState.winner, gameState.players.map(p => ({ id: p.id, role: p.role, name: p.name })));
}

function sendErrorToPlayer(toId, message) {
  if (toId === myId) showError(message);
  else sendPrivate(toId, { type: MSG.ERROR, message });
}

// ============================================================
// カードクリック処理（手番プレイヤーのみ）
// ============================================================
function onCardClick(card) {
  if (!localState) return;

  // フェーズチェック: 'main' 以外はカードをプレイできない
  const phase = localState.phase;
  if (phase === 'draw') {
    showToast('まず「カードを引く」ボタンを押してください');
    return;
  }
  if (phase === 'location') {
    showToast('ロケーション効果を先に解決してください');
    return;
  }
  if (phase === 'action_targeting') {
    showToast('前のアクションを先に解決してください');
    return;
  }
  if (phase !== 'main') return;

  // 自分のターン確認
  if (getCurrentPlayer(localState)?.id !== myId) return;

  if (card.type === CARD_TYPES.MOVE) {
    sendPlayCard(card.id);
  } else if (card.type === CARD_TYPES.ACTION) {
    const needsTarget = ['trade','steal','dump','peek','scan','expose','whisper','skip','block','detect','smoke'].includes(card.action);
    if (needsTarget) {
      showTargetSelector(card, localState, myId, nameMap, getDisplayHand);
    } else {
      // ダッシュはまずプレイしてに待機状態へ移行（モーダルは STATE_UPDATE 受信後に自動表示）
      sendPlayCard(card.id);
    }
  }
}

// ============================================================
// ロケーション効果コールバック（render.js から呼ばれる）
// ============================================================
function onLocationPrompt(loc, state) {
  showLocationPrompt(loc, state, myId, nameMap);
}
