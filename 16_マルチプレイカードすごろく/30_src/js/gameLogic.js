// ============================================================
// gameLogic.js  ゲームの状態管理・ルール処理
// ホストのブラウザでゲーム状態を管理し、全員に同期する
// ============================================================

import {
  ROLES, CARD_TYPES, ITEM_SUBTYPES,
  CARD_DEFINITIONS, ITEM_DEFINITIONS, BOMB_PART_IDS, DEFUSE_KIT_IDS, TOTAL_LOCATIONS, LOCATIONS
} from './constants.js';

// --------------- ユーティリティ ---------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

// --------------- 初期化 ---------------
/**
 * ゲーム状態オブジェクトを生成する
 * @param {string[]} playerIds - プレイヤーIDの配列（順番 = 座席順）
 * @returns {GameState}
 */
export function createInitialState(playerIds, playerNames = []) {
  if (playerIds.length !== 4) throw new Error('4人必要です');

  // 役割をシャッフルして配布 (爆弾魔×2, 解除班×2)
  const roles = shuffle([ROLES.BOMBER, ROLES.BOMBER, ROLES.DEFUSER, ROLES.DEFUSER]);

  // 通常デッキ（移動＋アクション）とアイテムパイルを別々に作成
  const deck = shuffle(CARD_DEFINITIONS.map(c => ({ ...c })));
  const itemPile = shuffle(ITEM_DEFINITIONS.map(c => ({ ...c })));

  // 各プレイヤーに5枚配る（通常デッキのみ。アイテムは初期手から除外）
  const hands = {};
  playerIds.forEach(id => { hands[id] = []; });
  const initialHandSize = 5;
  for (let i = 0; i < initialHandSize; i++) {
    playerIds.forEach(id => {
      if (deck.length > 0) hands[id].push(deck.pop());
    });
  }

  const players = playerIds.map((id, idx) => ({
    id,
    name: playerNames[idx] || id.slice(0, 8),
    role: roles[idx],
    position: 0,         // マイン盤上の位置
    skipped: false,      // 足止め状態
    hand: hands[id],
  }));

  return {
    players,             // プレイヤー配列
    deck,                // 山札（移動＋アクションのみ）
    itemPile,            // アイテムパイル（爆弾パーツ・解除キット・ダミー）
    discard: [],         // 捨て札
    blockedLocation: null, // 通行止め中のロケーション
    blockedUntilTurn: -1,
    currentTurnIndex: 0, // 現在の手番プレイヤーindex
    turnCount: 0,
    phase: 'draw',       // 'draw' | 'main' | 'location' | 'action_targeting' | 'end'
    pendingAction: null, // 処理中のアクション情報
    log: [],             // イベントログ
    winner: null,        // null | 'bomber' | 'defuser'
  };
}

// --------------- 山札管理 ---------------
function drawFromDeck(state) {
  if (state.deck.length === 0) {
    // 捨て札をシャッフルして山札に
    state.deck = shuffle(state.discard);
    state.discard = [];
    addLog(state, '山札が尽きました。捨て札をシャッフルして再利用します。');
  }
  return state.deck.length > 0 ? state.deck.pop() : null;
}

function discardCard(state, card) {
  if (card) state.discard.push(card);
}

// --------------- ログ ---------------
function addLog(state, message) {
  state.log.push({ turn: state.turnCount, message });
  if (state.log.length > 100) state.log.shift();
}

// プレイヤーIDからゲームログ用の表示名を返すヘルパー
function pName(state, id) {
  return state.players.find(p => p.id === id)?.name ?? id?.slice(0, 6) ?? '?';
}

// --------------- プレイヤー取得 ---------------
export function getCurrentPlayer(state) {
  return state.players[state.currentTurnIndex];
}

function getPlayerById(state, id) {
  return state.players.find(p => p.id === id);
}

function getPlayerIndex(state, id) {
  return state.players.findIndex(p => p.id === id);
}

// --------------- 手番管理 ---------------
function nextTurn(state) {
  let next = (state.currentTurnIndex + 1) % state.players.length;
  // 足止め中ならスキップ
  if (state.players[next].skipped) {
    addLog(state, `${pName(state, state.players[next].id)} は足止め中のためスキップされました`);
    state.players[next].skipped = false;
    next = (next + 1) % state.players.length;
  }
  state.currentTurnIndex = next;
  state.turnCount++;
  state.phase = 'draw';
  state.pendingAction = null; // 前ターンの保留アクションをクリア

  // 通行止め解除チェック
  if (state.blockedLocation !== null && state.turnCount >= state.blockedUntilTurn) {
    state.blockedLocation = null;
  }
}

// --------------- ドローフェーズ ---------------
export function doDrawPhase(state) {
  const player = getCurrentPlayer(state);
  const card = drawFromDeck(state);
  if (card) {
    player.hand.push(card);
    addLog(state, `${pName(state, player.id)} がカードを1枚引きました`);
  }
  state.phase = 'main';
  return { state, drawnCard: card };
}

// --------------- メインフェーズ: カードをプレイ ---------------
/**
 * 手番プレイヤーが手札からカードをプレイする
 * @param {GameState} state
 * @param {string} cardId - プレイするカードのID
 * @param {string|null} targetPlayerId - アクション対象プレイヤーID（必要な場合）
 * @param {string|null} chosenCardId   - 交換等で選ぶカードのID（必要な場合）
 * @param {number|null} targetLocation - 通行止め等のロケーションindex
 */
export function playCard(state, cardId, targetPlayerId = null, chosenCardId = null, targetLocation = null) {
  const player = getCurrentPlayer(state);
  const cardIdx = player.hand.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return { state, error: 'カードが手札にありません' };

  const card = player.hand.splice(cardIdx, 1)[0];

  if (card.type === CARD_TYPES.MOVE) {
    // 移動処理
    const newPos = (player.position + card.value) % TOTAL_LOCATIONS;
    player.position = newPos;
    discardCard(state, card);
    addLog(state, `${pName(state, player.id)} が ${card.value} 進んでマス ${newPos} へ移動`);
    state.phase = 'location';
    const locType = LOCATIONS[newPos]?.type;
    const pendingData = { locationIndex: newPos };
    if (locType === 'tower')     pendingData.deck     = state.deck.map(c => ({ ...c }));
    if (locType === 'factory')   pendingData.itemPile = state.itemPile.map(c => ({ ...c }));
    if (locType === 'black_mkt') pendingData.discard  = state.discard.map(c => ({ ...c }));
    state.pendingAction = pendingData;
  } else if (card.type === CARD_TYPES.ACTION) {
    discardCard(state, card);
    const actionResult = resolveAction(state, player, card, targetPlayerId, chosenCardId, targetLocation);
    if (actionResult.needsInput) {
      // クライアントへ追加入力を要求
      state.pendingAction = actionResult.pendingAction;
      state.phase = 'action_targeting';
      return { state, needsInput: actionResult.needsInput };
    }
    state.phase = 'main'; // アクション後は同ターンにもう一度フェーズを確認（→nextTurn へ）
    checkWinCondition(state);
    if (!state.winner) nextTurn(state);
    // privateReveal / publicReveal を呼び出し元に返す
    return { state, ...actionResult };
  } else if (card.type === CARD_TYPES.ITEM) {
    // アイテムは自分の手札に戻す（出せない: アイテムは手に持つだけ）
    player.hand.push(card);
    return { state, error: 'アイテムカードは直接プレイできません（手に持ち続けてください）' };
  }

  checkWinCondition(state);
  return { state };
}

// --------------- アクション解決 ---------------
function resolveAction(state, player, card, targetId, chosenCardId, targetLocation) {
  switch (card.action) {
    case 'trade':   return actionTrade(state, player, targetId, chosenCardId);
    case 'steal':   return actionSteal(state, player, targetId, chosenCardId);
    case 'pass':    return actionPass(state);
    case 'dump':    return actionDump(state, player, targetId);
    case 'peek':    return actionPeek(state, player, targetId);
    case 'scan':    return actionScan(state, player, targetId);
    case 'expose':  return actionExpose(state, player, targetId);
    case 'whisper': return actionWhisper(state, player, targetId);
    case 'skip':    return actionSkip(state, targetId);
    case 'block':   return actionBlock(state, targetLocation);
    default:        return {};
  }
}

// --- 手札操作 ---
function actionTrade(state, player, targetId, myCardId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const myIdx = player.hand.findIndex(c => c.id === myCardId);
  if (myIdx === -1) return { needsInput: 'choose_my_card_for_trade', pendingAction: { action: 'trade', with: targetId } };
  // 自分のカードを他確定 → 相手のカード選択待ち
  return {
    needsInput: 'wait_trade_target',
    pendingAction: { action: 'trade', with: targetId, myCard: myCardId, waitingFor: targetId }
  };
}

function actionSteal(state, player, targetId, myCardId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const myIdx = player.hand.findIndex(c => c.id === myCardId);
  if (myIdx === -1) return { needsInput: 'choose_my_card_for_steal', pendingAction: { action: 'steal', with: targetId } };
  const myCard = player.hand.splice(myIdx, 1)[0];
  const theirIdx = randomInt(target.hand.length);
  const theirCard = target.hand.splice(theirIdx, 1)[0];
  player.hand.push(theirCard);
  target.hand.push(myCard);
  addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} から強奪（ランダム）`);
  return {};
}

function actionPass(state) {
  // 各プレイヤーが渡すカードを選ぶ → 全員の選択が揃ったら実行
  const submitted = [];

  // 手札がないプレイヤーは自動的に送信済みとする
  state.players.forEach(p => {
    if (p.hand.length === 0) submitted.push(p.id);
  });

  // 全員が手札なしの場合は即時終了
  const playersWithCards = state.players.filter(p => p.hand.length > 0);
  if (playersWithCards.length === 0) {
    addLog(state, '横流し：全員の手札がないため効果なし');
    return {};
  }

  state.pendingAction = { action: 'pass', choices: {}, submitted };
  return { needsInput: 'pass_select', pendingAction: state.pendingAction };
}

/**
 * 横流しカード選択を解決する（各プレイヤーから呼ばれる）
 * @param {GameState} state
 * @param {string} playerId - 選択したプレイヤーID
 * @param {string} cardId   - 選択したカードID
 */
export function resolvePassChoice(state, playerId, cardId) {
  if (!state.pendingAction || state.pendingAction.action !== 'pass')
    return { error: '横流し待機中ではありません' };

  // 既に提出済みなら無視
  if (state.pendingAction.submitted.includes(playerId))
    return { state };

  const player = state.players.find(p => p.id === playerId);
  if (!player) return { error: 'プレイヤーが見つかりません' };

  const cardIdx = player.hand.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return { error: 'そのカードはありません' };

  state.pendingAction.choices[playerId] = cardId;
  state.pendingAction.submitted.push(playerId);

  // 全員の選択が揃ったか確認
  const playersWithCards = state.players.filter(p => p.hand.length > 0);
  const allChosen = playersWithCards.every(p => state.pendingAction.submitted.includes(p.id));

  if (allChosen) {
    const choices = state.pendingAction.choices;
    state.pendingAction = null;

    // 各プレイヤーの選択カードを手札から取り出す
    const passedCards = {};
    state.players.forEach(p => {
      const cid = choices[p.id];
      if (!cid) return;
      const idx = p.hand.findIndex(c => c.id === cid);
      if (idx !== -1) passedCards[p.id] = p.hand.splice(idx, 1)[0];
    });

    // 左隣（次インデックス）へ渡す
    const n = state.players.length;
    state.players.forEach((p, i) => {
      const card = passedCards[p.id];
      if (card) state.players[(i + 1) % n].hand.push(card);
    });

    addLog(state, '横流し：各自が選んだカードが左隣に渡った');
    checkWinCondition(state);
    if (!state.winner) nextTurn(state);
    return { state, done: true };
  }

  return { state };
}

function actionDump(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const idx = randomInt(target.hand.length);
  const dumped = target.hand.splice(idx, 1)[0];
  discardCard(state, dumped);
  addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} の手札を1枚ポイ捨て`);
  return {};
}

// --- 情報収集 ---
function actionPeek(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const idx = randomInt(target.hand.length);
  const peeked = target.hand[idx];
  addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} の手札を1枚のぞき見（本人のみ通知）`);
  // peekedカード情報はクライアント側でプレイヤー本人のみ受け取る
  return { privateReveal: { to: player.id, card: peeked } };
}

function actionScan(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target) return {};
  const isBomber = target.role === ROLES.BOMBER;
  const roll = Math.random();
  let hint, hintLabel;
  if (isBomber) {
    if (roll < 0.70)      { hint = 'suspicious_high'; hintLabel = '怪しい（★★★）'; }
    else if (roll < 0.90) { hint = 'suspicious_mid';  hintLabel = 'やや怪しい（★★）'; }
    else                  { hint = 'clean';            hintLabel = '問題なし（★）'; }
  } else {
    if (roll < 0.70)      { hint = 'clean';            hintLabel = '問題なし（★）'; }
    else if (roll < 0.90) { hint = 'suspicious_mid';  hintLabel = 'やや怪しい（★★）'; }
    else                  { hint = 'suspicious_high'; hintLabel = '怪しい（★★★）'; }
  }
  addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} をスキャン（本人のみ通知）`);
  return { privateReveal: { to: player.id, hint, hintLabel } };
}

function actionExpose(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const idx = randomInt(target.hand.length);
  const exposed = target.hand[idx];
  addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} の手札1枚を全員に公開: ${exposed.label}`);
  return { publicReveal: { card: exposed, owner: targetId } };
}

function actionWhisper(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const myIdx   = randomInt(player.hand.length);
  const theirIdx = randomInt(target.hand.length);
  const myCard    = player.hand[myIdx];
  const theirCard = target.hand[theirIdx];
  addLog(state, `${pName(state, player.id)} と ${pName(state, targetId)} が密談（互いに1枚見せ合い）`);
  return {
    privateReveal: [
      { to: player.id, card: theirCard },
      { to: targetId,  card: myCard },
    ],
  };
}

// --- 妨害 ---
function actionSkip(state, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target) return {};
  target.skipped = true;
  addLog(state, `${pName(state, targetId)} が足止めされた（次のターンスキップ）`);
  return {};
}

function actionBlock(state, locationIndex) {
  if (locationIndex == null) return {};
  state.blockedLocation = locationIndex;
  // 全員が1回ずつターンを終えるまで（プレイヤー数分）通行止め
  state.blockedUntilTurn = state.turnCount + state.players.length;
  const locName = LOCATIONS[locationIndex]?.name ?? `マス${locationIndex}`;
  addLog(state, `「${locName}」が通行止めになった（全員が1巡するまで）`);
  return {};
}

// --------------- ロケーション効果 ---------------
/**
 * 移動後のロケーション効果を処理する
 * @param {GameState} state
 * @param {string|null} chosenCardId - 闇市などでプレイヤーが選んだカードID
 */
export function resolveLocation(state, chosenCardId = null) {
  const player = getCurrentPlayer(state);
  const locIdx = player.position;

  // 通行止め中チェック
  if (state.blockedLocation === locIdx) {
    addLog(state, `マス ${locIdx} は通行止め中のため効果なし`);
    state.phase = 'main';
    checkWinCondition(state);
    if (!state.winner) nextTurn(state);
    return { state };
  }

  processLocationByType(state, player, locIdx, chosenCardId);
  state.pendingAction = null;

  checkWinCondition(state);
  if (!state.winner) nextTurn(state);
  return { state };
}

/** resolveLocation の実体（同期版）*/
export function resolveLocationSync(state, locType, chosenCardId = null) {
  const player = getCurrentPlayer(state);

  // 通行止め中チェック
  if (state.blockedLocation === player.position) {
    addLog(state, `マス ${player.position} は通行止め中のため効果なし`);
    state.pendingAction = null;
    checkWinCondition(state);
    if (!state.winner) nextTurn(state);
    return { state, wasBlocked: true };
  }

  const sideEffect = processLocationByType(state, player, player.position, chosenCardId, locType) || {};
  state.pendingAction = null;
  checkWinCondition(state);
  if (!state.winner) nextTurn(state);
  return { state, ...sideEffect };
}

/**
 * 取引の相手カード選択を解決する
 */
export function resolveTradeChoice(state, fromPlayerId, cardId) {
  if (!state.pendingAction || state.pendingAction.action !== 'trade')
    return { error: '取引待機中ではありません' };
  if (state.pendingAction.waitingFor !== fromPlayerId)
    return { error: '取引の対象プレイヤーではありません' };

  const attacker = getCurrentPlayer(state);
  const target   = getPlayerById(state, fromPlayerId);
  if (!attacker || !target) return { error: 'プレイヤーが見つかりません' };

  const myCardId = state.pendingAction.myCard;
  const myIdx    = attacker.hand.findIndex(c => c.id === myCardId);
  if (myIdx === -1) {
    // アタッカーのカードが消えた場合はキャンセル
    state.pendingAction = null;
    if (!state.winner) nextTurn(state);
    return { state };
  }
  const theirIdx = target.hand.findIndex(c => c.id === cardId);
  if (theirIdx === -1) return { error: '選択されたカードが手札にありません' };

  const myCard    = attacker.hand.splice(myIdx, 1)[0];
  const theirCard = target.hand.splice(theirIdx, 1)[0];
  attacker.hand.push(theirCard);
  target.hand.push(myCard);
  addLog(state, `${pName(state, attacker.id)} と ${pName(state, fromPlayerId)} が手札を1枚交換`);
  state.pendingAction = null;
  checkWinCondition(state);
  if (!state.winner) nextTurn(state);
  return { state };
}

function processLocationByType(state, player, locIdx, chosenCardId, locType) {
  switch (locType) {
    case 'junk': {
      // アイテムパイルからランダムに1枚取得
      if (state.itemPile.length > 0) {
        const idx = randomInt(state.itemPile.length);
        const c = state.itemPile.splice(idx, 1)[0];
        player.hand.push(c);
        addLog(state, `${pName(state, player.id)}：ジャンク屋でアイテム入手: ${c.label}`);
        return { privateReveal: { to: player.id, card: c } };
      } else {
        addLog(state, `${pName(state, player.id)}：ジャンク屋（アイテムパイル枕渇）→効枚なし`);
      }
      break;
    }
    case 'pub': {
      // ランダムな相手と手札1枚交換
      const others = state.players.filter(p => p.id !== player.id && p.hand.length > 0);
      if (others.length > 0 && player.hand.length > 0) {
        const target = others[randomInt(others.length)];
        const myIdx = randomInt(player.hand.length);
        const theirIdx = randomInt(target.hand.length);
        const tmp = player.hand.splice(myIdx, 1)[0];
        player.hand.push(target.hand.splice(theirIdx, 1)[0]);
        target.hand.push(tmp);
        addLog(state, `${pName(state, player.id)}：酒場で ${pName(state, target.id)} と手札1枚交換（ランダム）`);
      }
      break;
    }
    case 'detective': {
      if (chosenCardId) {  // chosenCardId = 対象プレイヤーID
        const target = getPlayerById(state, chosenCardId);
        if (target?.hand.length > 0) {
          const peeked = target.hand[randomInt(target.hand.length)];
          addLog(state, `${pName(state, player.id)}：探偵事務所で ${pName(state, chosenCardId)} の手札をこっそり調査`);
          return { privateReveal: { to: player.id, card: peeked } };
        }
      }
      addLog(state, `${pName(state, player.id)}：探偵事務所（対象なし）`);
      break;
    }
    case 'factory': {
      // アイテムパイルを全て見て1枚選ぶ（サーチ）
      if (chosenCardId) {
        const idx = state.itemPile.findIndex(c => c.id === chosenCardId);
        if (idx !== -1) {
          const c = state.itemPile.splice(idx, 1)[0];
          player.hand.push(c);
          addLog(state, `${pName(state, player.id)}：パーツ工場でアイテムをサーチ入手: ${c.label}`);
        }
      } else if (state.itemPile.length > 0) {
        addLog(state, `${pName(state, player.id)}：パーツ工場に到達（アイテムパイルから1枚選んでください）`);
        state.pendingAction = { locEffect: 'factory_search', itemPile: state.itemPile.map(c => ({ ...c })) };
      } else {
        addLog(state, `${pName(state, player.id)}：パーツ工場（アイテムパイル枕渇）→効枚なし`);
      }
      break;
    }
    case 'casino': {
      const roll = randomInt(6) + 1;
      if (roll % 2 === 0) {
        const c1 = drawFromDeck(state); if (c1) player.hand.push(c1);
        const c2 = drawFromDeck(state); if (c2) player.hand.push(c2);
        addLog(state, `${pName(state, player.id)}：カジノ ダイス${roll}（偶数）→2枚ドロー！`);
      } else {
        if (player.hand.length > 0) {
          const lost = player.hand.splice(randomInt(player.hand.length), 1)[0];
          discardCard(state, lost);
          addLog(state, `${pName(state, player.id)}：カジノ ダイス${roll}（奇数）→1枚没収`);
        }
      }
      break;
    }
    case 'tower': {
      // 山札をUIで見て1枚選ぶ → pendingAction でUI側に委ねる
      // ホストが chosenCardId を受け取ったら実際にドロー
      if (chosenCardId) {
        const idx = state.deck.findIndex(c => c.id === chosenCardId);
        if (idx !== -1) {
          const c = state.deck.splice(idx, 1)[0];
          player.hand.push(c);
          addLog(state, `${pName(state, player.id)}：タワーでカードをサーチして入手`);
        }
      } else {
        addLog(state, `${pName(state, player.id)}：タワーに到達（山札からカードを1枚選んでください）`);
        state.pendingAction = { locEffect: 'tower', deck: [...state.deck] };
      }
      break;
    }
    case 'crossing': {
      // 全員が手札を1枚ずつ左隣に
      const given = state.players.map(p => {
        if (p.hand.length === 0) return null;
        return p.hand.splice(randomInt(p.hand.length), 1)[0];
      });
      given.forEach((card, i) => {
        if (card) state.players[(i + 1) % state.players.length].hand.push(card);
      });
      addLog(state, 'スクランブル交差点：全員の手札が1枚ずつ左隣に回った');
      break;
    }
    case 'police_box': {
      if (chosenCardId) {  // chosenCardId = 対象プレイヤーID
        const target = getPlayerById(state, chosenCardId);
        if (target?.hand.length > 0) {
          const lost = target.hand.splice(randomInt(target.hand.length), 1)[0];
          discardCard(state, lost);
          addLog(state, `${pName(state, player.id)}：交番で ${pName(state, chosenCardId)} の手札を1枚没収: ${lost.label}`);
        }
      } else {
        addLog(state, `${pName(state, player.id)}：交番（対象なし）`);
      }
      break;
    }
    case 'black_mkt': {
      // 捨て札から1枚選ぶ → UI側に委ねる
      if (chosenCardId) {
        const idx = state.discard.findIndex(c => c.id === chosenCardId);
        if (idx !== -1) {
          const c = state.discard.splice(idx, 1)[0];
          player.hand.push(c);
          addLog(state, `${pName(state, player.id)}：闇市で捨て札から入手: ${c.label}`);
        }
      } else {
        addLog(state, `${pName(state, player.id)}：闇市に到達（捨て札からカードを1枚選んでください）`);
        state.pendingAction = { locEffect: 'black_mkt', discard: [...state.discard] };
      }
      break;
    }
    case 'broadcast': {
      if (player.hand.length > 0) {
        const exposed = player.hand[randomInt(player.hand.length)];
        addLog(state, `${pName(state, player.id)}：放送局で ${exposed.label} を全員に公開 → 1枚ドロー`);
        const c = drawFromDeck(state); if (c) player.hand.push(c);
        return { publicReveal: { card: exposed, owner: player.id } };
      }
      break;
    }
    case 'construct': {
      player.skipped = true;
      addLog(state, `${pName(state, player.id)}：工事現場で1回休み`);
      break;
    }
    case 'hospital': {
      const count = player.hand.length || 5;
      state.discard.push(...player.hand);
      player.hand = [];
      for (let i = 0; i < 5; i++) {
        const c = drawFromDeck(state); if (c) player.hand.push(c);
      }
      addLog(state, `${pName(state, player.id)}：病院で手札リセット → 5枚引き直し`);
      break;
    }
    case 'police_hq': {
      if (chosenCardId) {  // chosenCardId = 対象プレイヤーID
        const target = getPlayerById(state, chosenCardId);
        if (target) {
          const roleLabel = target.role === ROLES.BOMBER ? '爆弾魔' : '解除班';
          addLog(state, `${pName(state, player.id)}：警察本部で ${pName(state, chosenCardId)} の陣営を調査`);
          return { privateReveal: { to: player.id, role: target.role, roleLabel } };
        }
      }
      addLog(state, `${pName(state, player.id)}：警察本部（対象なし）`);
      break;
    }
    default:
      break;
  }
  return {};
}

// --------------- 確保（解除）宣言 ---------------
/**
 * 解除班プレイヤーが確保宣言を行う
 */
export function declareArrest(state, declarerId) {
  const declarer = getPlayerById(state, declarerId);
  if (!declarer || declarer.role !== ROLES.DEFUSER) return { state, error: '解除班のみ宣言できます' };

  // 解除キットが3種以上揃っているか（4種中3種以上）
  const kitIds = declarer.hand.map(c => c.id);
  const kitCount = DEFUSE_KIT_IDS.filter(id => kitIds.includes(id)).length;
  if (kitCount < 3) return { state, error: `解除キットが3種以上必要です（現在 ${kitCount} 種）` };

  // 自分と同じマスに爆弾魔がいるか
  const bombersHere = state.players.filter(
    p => p.role === ROLES.BOMBER && p.position === declarer.position
  );
  if (bombersHere.length === 0) return { state, error: '同じマスに爆弾魔がいません' };

  state.winner = 'defuser';
  addLog(state, `${pName(state, declarerId)} が爆弾魔を確保！解除班の勝利！`);
  state.phase = 'end';
  return { state };
}

// --------------- 勝利判定 ---------------
function checkWinCondition(state) {
  // 爆弾魔の勝利: タワー(id=6)で爆弾パーツを全て持っている
  for (const p of state.players) {
    if (p.role !== ROLES.BOMBER) continue;
    if (p.position !== 6) continue; // タワーのマスインデックス
    const cardIds = p.hand.map(c => c.id);
    const hasAll = BOMB_PART_IDS.every(id => cardIds.includes(id));
    if (hasAll) {
      state.winner = 'bomber';
      addLog(state, `${pName(state, p.id)} がタワーで爆発！爆弾魔チームの勝利！`);
      state.phase = 'end';
      return;
    }
  }
}

// --------------- 公開用のサニタイズ（他人の手札は伏せる） ---------------
/**
 * 特定プレイヤー視点でゲーム状態を整形する
 * 他のプレイヤーの手札は枚数のみ見せ、カード情報は非公開
 */
export function sanitizeStateForPlayer(state, viewerId) {
  const sanitized = JSON.parse(JSON.stringify(state));
  sanitized.players = sanitized.players.map(p => {
    if (p.id === viewerId) return p; // 自分の手札はそのまま
    return {
      ...p,
      role: undefined,     // 役職は非公開
      hand: p.hand.map(() => ({ hidden: true })), // 手札の内容は伏せる
    };
  });
  // 横流し選択中: 実際のカードIDは隠蔽し、提出済みリストのみ公開
  if (sanitized.pendingAction?.choices) {
    delete sanitized.pendingAction.choices;
  }
  sanitized.deck = sanitized.deck.map(() => ({ hidden: true }));
  sanitized.itemPile = sanitized.itemPile.map(() => ({ hidden: true }));
  return sanitized;
}
