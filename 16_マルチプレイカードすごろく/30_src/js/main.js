// ============================================================
// main.js  ゲーム画面エントリポイント（状態管理ロジック呼び出し）
// ============================================================

import {
  getMyId, setMessageHandler,
  broadcastState, broadcastPublic, broadcastGameOver, sendPrivate,
  sendPlayCard, sendDeclareArrest, sendPassChoice,
  MSG
} from './peer.js';

import {
  createInitialState,
  doDrawPhase, playCard, resolveLocationSync, declareArrest,
  getCurrentPlayer, resolvePassChoice,
} from './gameLogic.js';

import { CARD_TYPES, LOCATIONS } from './constants.js';

import { renderGame } from './render.js';

import {
  showTargetSelector, showLocationPrompt,
  showPrivateReveal, showPublicReveal,
  showEffectOverlay,
  showGameOver, showToast, showError,
  showPassCardSelector,
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
export function initGameScreen(playerIds, playerNames, currentMyId, isHostParam) {
  myId   = currentMyId;
  isHost = isHostParam;

  // 名前マップを構築
  nameMap = {};
  playerIds.forEach((id, i) => { nameMap[id] = playerNames?.[i] || id.slice(0, 8); });

  // ゲームメッセージハンドラを切り替え
  setMessageHandler(onMessage);

  // ボタンのイベントを登録（この時点でDOMは確実に存在する）
  document.getElementById('btn-arrest')?.addEventListener('click', () => {
    sendDeclareArrest();
  });

  document.getElementById('btn-rules')?.addEventListener('click', () => {
    document.getElementById('rules-overlay').style.display = 'flex';
  });
  document.getElementById('rules-close-btn')?.addEventListener('click', () => {
    document.getElementById('rules-overlay').style.display = 'none';
  });

  document.getElementById('btn-back-lobby')?.addEventListener('click', () => {
    document.getElementById('gameover-overlay').style.display = 'none';
    document.getElementById('game-screen').style.display      = 'none';
    document.getElementById('lobby-screen').style.display     = 'flex';
  });

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
      // 横流し選択モーダル（未提出かつモーダル未表示の場合のみ）
      if (msg.state.phase === 'action_targeting' && msg.state.pendingAction?.action === 'pass') {
        const alreadySubmitted = msg.state.pendingAction.submitted?.includes(myId);
        const modalOpen = document.getElementById('modal-overlay')?.style.display === 'flex';
        if (!alreadySubmitted && !modalOpen) {
          showPassCardSelector(msg.state, myId, nameMap, (cardId) => {
            sendPassChoice(cardId);
          });
        }
      }
      break;

    case MSG.PASS_CHOICE:
      if (isHost) handlePassChoice(msg.from, msg.cardId);
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
      showGameOver(msg.winner);
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

  if (result.privateReveal) {
    const revs = Array.isArray(result.privateReveal) ? result.privateReveal : [result.privateReveal];
    revs.forEach(r => sendPrivate(r.to, r));
  }
  if (result.publicReveal) broadcastPublic(result.publicReveal);

  broadcastState(gameState, events);
  if (gameState.winner) broadcastGameOver(gameState.winner);
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
      events.all = { icon: '💸', title: '強奪！', body: `${from} が ${targ} の手札を１枚奔った` };
      break;
    case 'pass':
      events.all = { icon: '🔀', title: '横流し！', body: '全員がカードを選んでいます…' };
      break;
    case 'dump':
      events.all = { icon: '🗑️', title: 'ポイ捨て！', body: `${from} が ${targ} の手札を１枚捨てさせた` };
      break;
    case 'peek':
      events.all = { icon: '🔍', title: '尋問', body: `${from} が ${targ} の手札を１枚こっそり確認した` };
      if (rev && !Array.isArray(rev)) {
        events[rev.to] = { icon: '🔍', title: `尋問の結果（本人のみ）`, body: `${targ} の手札に\n「${rev.card?.label}」\n${rev.card?.desc}` };
      }
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
      if (Array.isArray(rev)) {
        rev.forEach(r => {
          const other = r.to === fromId ? targ : from;
          events[r.to] = { icon: '🤫', title: '密談の結果（本人のみ）', body: `${other} の手札に\n「${r.card?.label}」\n${r.card?.desc}` };
        });
      }
      break;
    case 'skip':
      events.all = { icon: '⏭️', title: '足止め！', body: `${targ} は次のターンをスキップされた` };
      break;
    case 'block': {
      const locName = LOCATIONS[targetLocation]?.name ?? `マス${targetLocation}`;
      events.all = { icon: '🚧', title: '通行止め！', body: `${from} が「${locName}」を次のターンまで通行止めにした` };
      break;
    }
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

  if (result.privateReveal) {
    const revs = Array.isArray(result.privateReveal) ? result.privateReveal : [result.privateReveal];
    revs.forEach(r => sendPrivate(r.to, r));
  }
  if (result.publicReveal) broadcastPublic(result.publicReveal);

  // ロケーション効果オーバーレイイベントを構築
  const events = buildLocationEvents(fromId, loc, locType, chosenCardId, result);

  broadcastState(gameState, events);
  if (gameState.winner) broadcastGameOver(gameState.winner);
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
      events.all = { icon: loc.emoji, title: 'スクランブル交差点', body: '全員の手札が１枚ずつ左隣に回った！' };
      break;
    case 'police_box':
      events.all = { icon: loc.emoji, title: '交番', body: `${from} が ${targ ?? '?'} の手札を１枚没収した` };
      break;
    case 'black_mkt':
      events.all = { icon: loc.emoji, title: '闇市', body: `${from} が捧て札からカードを入手した` };
      break;
    case 'broadcast':
      events.all = { icon: loc.emoji, title: '放送局！', body: `${from} の手札が全員に公開された！ → １枚ドロー` };
      break;
    case 'construct':
      events.all = { icon: loc.emoji, title: '工事現場', body: `${from} は工事現場で１回休みになった` };
      break;
    case 'hospital':
      events.all = { icon: loc.emoji, title: '病院', body: `${from} の手札がリセットされた → ５枚引き直し` };
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
  broadcastGameOver(gameState.winner);
}

function handlePassChoice(fromId, cardId) {
  const result = resolvePassChoice(gameState, fromId, cardId);
  if (result.error) { sendErrorToPlayer(fromId, result.error); return; }
  gameState = result.state;
  const events = result.done
    ? { all: { icon: '🔀', title: '横流し完了！', body: '各自が選んだカードが左隣に渡った' } }
    : {};
  broadcastState(gameState, events);
  if (gameState.winner) broadcastGameOver(gameState.winner);
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
  if (localState.phase === 'draw') {
    showToast('まず「カードを引く」ボタンを押してください');
    return;
  }

  if (card.type === CARD_TYPES.MOVE) {
    sendPlayCard(card.id);
  } else if (card.type === CARD_TYPES.ACTION) {
    const needsTarget = ['trade','steal','dump','peek','scan','expose','whisper','skip','block'].includes(card.action);
    if (needsTarget) {
      showTargetSelector(card, localState, myId, nameMap);
    } else {
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
