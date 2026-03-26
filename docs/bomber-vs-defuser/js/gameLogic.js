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
  // プレイ順をランダムに決定
  const order = shuffle([...Array(playerIds.length).keys()]);
  playerIds   = order.map(i => playerIds[i]);
  playerNames = order.map(i => playerNames[i] ?? '');

  const n = playerIds.length;
  if (n < 3 || n > 6) throw new Error('3〜6人必要です');

  // 人数に応じた役職配布
  // 3人: 爆弾魔1/解除班2  4人: 爆弾魔2/解除班2  5人: 爆弾魔2/解除班3  6人: 爆弾魔2/解除班4
  const bomberCount = n === 3 ? 1 : 2;
  const defuserCount = n - bomberCount;
  const roles = shuffle([
    ...Array(bomberCount).fill(ROLES.BOMBER),
    ...Array(defuserCount).fill(ROLES.DEFUSER),
  ]);

  // 移動山・アクション山を別々に作成
  const moveDeck   = shuffle(CARD_DEFINITIONS.filter(c => c.type === CARD_TYPES.MOVE).map(c => ({ ...c })));
  const actionDeck = shuffle(CARD_DEFINITIONS.filter(c => c.type === CARD_TYPES.ACTION).map(c => ({ ...c })));
  const itemPile = shuffle(ITEM_DEFINITIONS.map(c => ({ ...c })));

  // 各プレイヤーに移動3枚＋アクション2枚を配る（二山ドロー初期配布）
  const hands = {};
  playerIds.forEach(id => { hands[id] = []; });
  for (let i = 0; i < 3; i++) {
    playerIds.forEach(id => { if (moveDeck.length   > 0) hands[id].push(moveDeck.pop());   });
  }
  for (let i = 0; i < 2; i++) {
    playerIds.forEach(id => { if (actionDeck.length > 0) hands[id].push(actionDeck.pop()); });
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
    moveDeck,            // 移動カード山
    actionDeck,          // アクションカード山
    itemPile,            // アイテムパイル（爆弾パーツ・解除キット・ダミー）
    discard: [],         // 捨て札（移動・アクション共通）
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
/**
 * @param {GameState} state
 * @param {'move'|'action'} deckType - どちらの山から引くか
 */
function drawFromDeck(state, deckType = 'move') {
  const deckKey    = deckType === 'action' ? 'actionDeck' : 'moveDeck';
  const targetType = deckType === 'action' ? CARD_TYPES.ACTION : CARD_TYPES.MOVE;
  if (state[deckKey].length === 0) {
    // 捨て札から同種カードを取り出してシャッフルし補充
    const refill = state.discard.filter(c => c.type === targetType);
    state.discard = state.discard.filter(c => c.type !== targetType);
    state[deckKey] = shuffle(refill);
    if (state[deckKey].length > 0)
      addLog(state, `${deckType === 'action' ? 'アクション' : '移動'}山が尽きました。捨て札をシャッフルして再利用します。`);
  }
  return state[deckKey].length > 0 ? state[deckKey].pop() : null;
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
/**
 * @param {GameState} state
 * @param {'move'|'action'} deckType - 引く山を選択（二山ドロー）
 */
export function doDrawPhase(state, deckType = 'move') {
  const player = getCurrentPlayer(state);
  const card = drawFromDeck(state, deckType);
  if (card) {
    player.hand.push(card);
    addLog(state, `${pName(state, player.id)} が${deckType === 'action' ? 'アクション' : '移動'}山から1枚引きました`);
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
 * @param {string|null} gloveCardId    - 手袋カードID（コンボ時）
 */
export function playCard(state, cardId, targetPlayerId = null, chosenCardId = null, targetLocation = null, gloveCardId = null) {
  const player = getCurrentPlayer(state);
  const cardIdx = player.hand.findIndex(c => c.id === cardId);
  if (cardIdx === -1) return { state, error: 'カードが手札にありません' };

  const card = player.hand.splice(cardIdx, 1)[0];

  if (card.type === CARD_TYPES.MOVE) {
    // 移動処理
    const newPos = (player.position + card.value) % TOTAL_LOCATIONS;
    player.position = newPos;
    discardCard(state, card);
    addLog(state, `${pName(state, player.id)} が ${card.value} 進んで「${LOCATIONS[newPos]?.name ?? `マス${newPos}`}」へ移動`);
    state.phase = 'location';
    const locType = LOCATIONS[newPos]?.type;
    const pendingData = { locationIndex: newPos };
    if (locType === 'tower') {
      pendingData.deck = [
        ...state.moveDeck.slice(0, 5),
        ...state.actionDeck.slice(0, 5),
      ].map(c => ({ ...c }));
    }
    if (locType === 'factory')   pendingData.itemPile = shuffle([...state.itemPile]).slice(0, 5).map(c => ({ ...c }));
    if (locType === 'black_mkt') pendingData.discard  = shuffle([...state.discard]).slice(0, 6).map(c => ({ ...c }));
    if (locType === 'alley')     pendingData.discard  = shuffle([...state.discard]).slice(0, 3).map(c => ({ ...c }));
    state.pendingAction = pendingData;
  } else if (card.type === CARD_TYPES.ACTION) {
    // 手袋カードは単体プレイ不可
    if (card.action === 'glove') {
      player.hand.push(card);
      return { state, error: '手袋は単体でプレイできません（強奪・ポイ捨て・煙幕と同時使用してください）' };
    }

    // 手袋コンボ処理
    let boosted = false;
    if (gloveCardId && ['steal', 'dump', 'smoke'].includes(card.action)) {
      const gloveIdx = player.hand.findIndex(c => c.id === gloveCardId);
      if (gloveIdx !== -1 && player.hand[gloveIdx].action === 'glove') {
        const gloveCard = player.hand.splice(gloveIdx, 1)[0];
        discardCard(state, gloveCard);
        boosted = true;
        addLog(state, `${pName(state, player.id)} が手袋を併用！`);
      }
    }

    discardCard(state, card);
    const actionResult = resolveAction(state, player, card, targetPlayerId, chosenCardId, targetLocation, boosted);
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
function resolveAction(state, player, card, targetId, chosenCardId, targetLocation, boosted = false) {
  switch (card.action) {
    case 'trade':   return actionTrade(state, player, targetId, chosenCardId);
    case 'steal':   return actionSteal(state, player, targetId, chosenCardId, boosted);
    case 'pass':    return actionPass(state);
    case 'dump':    return actionDump(state, player, targetId, boosted);
    case 'peek':    return actionPeek(state, player, targetId);
    case 'expose':  return actionExpose(state, player, targetId);
    case 'whisper': return actionWhisper(state, player, targetId);
    case 'skip':    return actionSkip(state, targetId);
    case 'block':   return actionBlock(state, targetLocation);
    case 'detect':  return actionDetect(state, player, targetId);
    case 'dash':    return actionDash(state, player);
    case 'smoke':   return actionSmoke(state, player, targetId, boosted);
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

function actionSteal(state, player, targetId, myCardId, boosted = false) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const count = boosted ? Math.min(2, target.hand.length) : 1;
  const stolen = [];
  for (let i = 0; i < count; i++) {
    if (target.hand.length === 0) break;
    const idx = randomInt(target.hand.length);
    const card = target.hand.splice(idx, 1)[0];
    player.hand.push(card);
    stolen.push(card);
  }
  const suffix = boosted ? '（手袋+2枚）' : '';
  addLog(state, `【強奪】${pName(state, player.id)} が ${pName(state, targetId)} のポケットからカードを引っこ抜いた${suffix}`);
  if (stolen.length === 1) {
    return { gainCard: { to: player.id, card: stolen[0] }, lostCard: { to: targetId, card: stolen[0] }, boosted };
  }
  return {
    gainCards: stolen.map(c => ({ to: player.id, card: c })),
    lostCards: stolen.map(c => ({ to: targetId, card: c })),
    boosted,
  };
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

    // 次インデックスへ渡す
    const n = state.players.length;
    state.players.forEach((p, i) => {
      const card = passedCards[p.id];
      if (card) state.players[(i + 1) % n].hand.push(card);
    });

    addLog(state, '【横流し】各自のカードが次のプレイヤーへと渡った');
    checkWinCondition(state);
    if (!state.winner) nextTurn(state);
    return { state, done: true };
  }

  return { state };
}

function actionDump(state, player, targetId, boosted = false) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const count = boosted ? Math.min(2, target.hand.length) : 1;
  const dumped = [];
  for (let i = 0; i < count; i++) {
    if (target.hand.length === 0) break;
    const idx = randomInt(target.hand.length);
    const card = target.hand.splice(idx, 1)[0];
    discardCard(state, card);
    dumped.push(card);
  }
  const suffix = boosted ? `（手袋+${dumped.length}枚）` : '';
  addLog(state, `【廃棄】${pName(state, player.id)} が ${pName(state, targetId)} の手札を容赦なく捨て札にした${suffix}`);
  if (dumped.length === 1) {
    return { lostCard: { to: target.id, card: dumped[0] }, boosted };
  }
  return { lostCards: dumped.map(c => ({ to: target.id, card: c })), boosted };
}

// --- 情報収集 ---
function actionPeek(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const idx = randomInt(target.hand.length);
  const peeked = target.hand[idx];
  addLog(state, `【尋問】${pName(state, player.id)} がそっと ${pName(state, targetId)} に近づき、手札を1枚のぞき見した`);
  return { privateReveal: { to: player.id, card: peeked, revealTitle: `${pName(state, targetId)} の手札` } };
}

function actionExpose(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const idx = randomInt(target.hand.length);
  const exposed = target.hand[idx];
  addLog(state, `【公開捕査】${pName(state, player.id)} が ${pName(state, targetId)} の手札を全員の前に晁した → ${exposed.label}`);
  return { publicReveal: { card: exposed, owner: targetId } };
}

function actionWhisper(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) return {};
  const theirCard = target.hand[randomInt(target.hand.length)];
  const reveals = [
    { to: player.id, card: theirCard, revealTitle: `${pName(state, targetId)} の手札` },
  ];
  if (player.hand.length > 0) {
    const myCard = player.hand[randomInt(player.hand.length)];
    reveals.push({ to: targetId, card: myCard, revealTitle: `${pName(state, player.id)} の手札` });
  }
  addLog(state, `【密談】${pName(state, player.id)} と ${pName(state, targetId)} が路地裏で手札を見せ合った`);
  return { privateReveal: reveals };
}

// --- 妨害 ---
function actionSkip(state, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target) return {};
  target.skipped = true;
  addLog(state, `【足止め】${pName(state, targetId)} は次のターンを棒に振った`);
  return {};
}

function actionBlock(state, locationIndex) {
  if (locationIndex == null) return {};
  state.blockedLocation = locationIndex;
  // 全員が1回ずつターンを終えるまで（プレイヤー数分）通行止め
  state.blockedUntilTurn = state.turnCount + state.players.length;
  const locName = LOCATIONS[locationIndex]?.name ?? `マス${locationIndex}`;
  addLog(state, `【封鎖】「${locName}」が封鎖された——全員が1巡するまで通れない`);
  return {};
}

// --- 探知機 ---
function actionDetect(state, player, targetId) {
  const target = getPlayerById(state, targetId);
  if (!target) return {};

  // 精度式: パーツ枚数 ÷ (3 + キット枚数 + ダミー枚数×2)
  const partsInPile   = state.itemPile.filter(c => c.subtype === ITEM_SUBTYPES.BOMB_PART).length;
  const kitsInPile    = state.itemPile.filter(c => c.subtype === ITEM_SUBTYPES.DEFUSE_KIT).length;
  const dummiesInPile = state.itemPile.filter(c => c.subtype === ITEM_SUBTYPES.DUMMY).length;
  const denominator   = 3 + kitsInPile + dummiesInPile * 2;
  const accuracy      = Math.min(partsInPile / denominator, 1);

  // accuracy の確率で正解のヒント、それ以外は逆のヒントを返す
  const isCorrect = Math.random() < accuracy;
  const hintRole  = isCorrect ? target.role : (target.role === ROLES.BOMBER ? ROLES.DEFUSER : ROLES.BOMBER);
  const roleLabel = hintRole === ROLES.BOMBER ? '爆弾魔' : '解除班';
  const pct       = Math.round(accuracy * 100);

  addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} を探知機でスキャン（精度 ${pct}%）`);
  return { privateReveal: { to: player.id, role: hintRole, roleLabel, accuracy: pct, targetName: pName(state, targetId) } };
}

// --- ダッシュ ---
function actionDash(state, player) {
  const moveCards = player.hand.filter(c => c.type === CARD_TYPES.MOVE);
  if (moveCards.length === 0) {
    addLog(state, `${pName(state, player.id)} がダッシュを使ったが、移動カードがなかった（効果なし）`);
    return {};
  }
  return { needsInput: 'dash_select_move', pendingAction: { action: 'dash' } };
}

/**
 * ダッシュカード選択を解決する
 * @param {GameState} state
 * @param {string} playerId - 選択したプレイヤーID
 * @param {string} moveCardId - 選択した移動カードID
 */
export function resolveDashChoice(state, playerId, moveCardId) {
  if (!state.pendingAction || state.pendingAction.action !== 'dash')
    return { error: 'ダッシュ待機中ではありません' };

  const player = getPlayerById(state, playerId);
  if (!player) return { error: 'プレイヤーが見つかりません' };

  const cardIdx = player.hand.findIndex(c => c.id === moveCardId);
  if (cardIdx === -1) return { error: '選択された移動カードが手札にありません' };

  const moveCard = player.hand[cardIdx];
  if (moveCard.type !== CARD_TYPES.MOVE) return { error: '移動カードを選んでください' };

  // 移動カードを手札から取り除いて捨て札へ（元の数字のまま）
  player.hand.splice(cardIdx, 1);
  discardCard(state, moveCard);

  // 移動量+2で移動
  const distance = moveCard.value + 2;
  const newPos = (player.position + distance) % TOTAL_LOCATIONS;
  player.position = newPos;
  const locName = LOCATIONS[newPos]?.name ?? `マス${newPos}`;
  addLog(state, `${pName(state, player.id)} がダッシュ！${moveCard.value}+2=${distance}マス移動して「${locName}」へ`);

  // ロケーション効果フェーズへ
  state.phase = 'location';
  const locType = LOCATIONS[newPos]?.type;
  const pendingData = { locationIndex: newPos };
  if (locType === 'tower') {
    pendingData.deck = [
      ...state.moveDeck.slice(0, 5),
      ...state.actionDeck.slice(0, 5),
    ].map(c => ({ ...c }));
  }
  if (locType === 'factory')   pendingData.itemPile = shuffle([...state.itemPile]).slice(0, 5).map(c => ({ ...c }));
  if (locType === 'black_mkt') pendingData.discard  = shuffle([...state.discard]).slice(0, 6).map(c => ({ ...c }));
  if (locType === 'alley')     pendingData.discard  = shuffle([...state.discard]).slice(0, 3).map(c => ({ ...c }));
  state.pendingAction = pendingData;

  checkWinCondition(state);
  return { state };
}

// --- 煙幕 ---
function actionSmoke(state, player, targetId, boosted = false) {
  const target = getPlayerById(state, targetId);
  if (!target) return {};

  const moveCards = target.hand.filter(c => c.type === CARD_TYPES.MOVE);
  if (moveCards.length === 0) {
    addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} に煙幕を使ったが、移動カードがなかった`);
    return {};
  }

  const count = boosted ? Math.min(2, moveCards.length) : 1;
  const destroyed = [];
  for (let i = 0; i < count; i++) {
    const remaining = target.hand.filter(c => c.type === CARD_TYPES.MOVE);
    if (remaining.length === 0) break;
    const chosen = remaining[randomInt(remaining.length)];
    const idx = target.hand.findIndex(c => c.id === chosen.id);
    if (idx !== -1) {
      target.hand.splice(idx, 1);
      discardCard(state, chosen);
      destroyed.push(chosen);
    }
  }
  if (destroyed.length === 0) return {};
  const labels = destroyed.map(c => `「${c.label}」`).join('・');
  const suffix = boosted ? '（手袋）' : '';
  addLog(state, `${pName(state, player.id)} が ${pName(state, targetId)} に煙幕${suffix}！${labels}を破棄`);
  if (destroyed.length === 1) {
    return { lostCard: { to: target.id, card: destroyed[0] }, boosted };
  }
  return { lostCards: destroyed.map(c => ({ to: target.id, card: c })), boosted };
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
    addLog(state, `「${LOCATIONS[locIdx]?.name ?? `マス${locIdx}`}」は通行止め中のため効果なし`);
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
    addLog(state, `「${LOCATIONS[player.position]?.name ?? `マス${player.position}`}」は通行止め中のため効果なし`);
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
  return { state, gainCards: [{ to: attacker.id, card: theirCard }, { to: target.id, card: myCard }] };
}

/**
 * スタート地点効果 Step1: 手札2枚を捨て、対象を指定 → ランダム4枚プレビュー
 */
export function resolveStartStep(state, playerId, discardIds, targetId) {
  const player = getPlayerById(state, playerId);
  if (!player) return { error: 'プレイヤーが見つかりません' };
  if (state.phase !== 'location') return { error: 'ロケーション効果フェーズではありません' };

  // 手札から2枚捨てる
  if (!Array.isArray(discardIds) || discardIds.length !== 2)
    return { error: '捨てるカードを2枚選んでください' };

  const discarded = [];
  for (const did of discardIds) {
    const idx = player.hand.findIndex(c => c.id === did);
    if (idx === -1) return { error: '選択されたカードが手札にありません' };
    discarded.push(player.hand.splice(idx, 1)[0]);
  }
  discarded.forEach(c => discardCard(state, c));

  const target = getPlayerById(state, targetId);
  if (!target || target.hand.length === 0) {
    addLog(state, `${pName(state, player.id)}：スタート地点（対象の手札なし）`);
    state.pendingAction = null;
    checkWinCondition(state);
    if (!state.winner) nextTurn(state);
    return { state };
  }

  // ランダム4枚をプレビュー（4枚未満なら全表示）
  const preview = shuffle([...target.hand]).slice(0, 4).map(c => ({ ...c }));
  addLog(state, `${pName(state, player.id)}：スタート地点で ${pName(state, targetId)} の手札を捜索中…`);

  state.pendingAction = { locationIndex: 0, locEffect: 'start_pick', previewCards: preview, startTargetId: targetId };
  // phase は 'location' のまま → クライアントが pick UI を表示
  return { state, startPreview: { to: player.id, cards: preview, targetId } };
}

function processLocationByType(state, player, locIdx, chosenCardId, locType) {
  switch (locType) {
    case 'start': {
      // スタート地点：手札2枚捨て→相手指定→ランダム4枚から1枚奪取
      if (chosenCardId) {
        // Step 2: 4枚のプレビューから1枚選んで奪取
        const targetId = state.pendingAction?.startTargetId;
        const target = getPlayerById(state, targetId);
        if (target) {
          const idx = target.hand.findIndex(c => c.id === chosenCardId);
          if (idx !== -1) {
            const stolen = target.hand.splice(idx, 1)[0];
            player.hand.push(stolen);
            addLog(state, `${pName(state, player.id)}：スタート地点で ${pName(state, targetId)} から「${stolen.label}」を奪取`);
            return { gainCard: { to: player.id, card: stolen }, lostCard: { to: targetId, card: stolen } };
          }
        }
        addLog(state, `${pName(state, player.id)}：スタート地点（奪取失敗）`);
      }
      // Step 0: 効果なし（スキップ or 手札不足）
      break;
    }
    case 'junk': {
      // アイテムパイルからランダムに1枚取得
      if (state.itemPile.length > 0) {
        const idx = randomInt(state.itemPile.length);
        const c = state.itemPile.splice(idx, 1)[0];
        player.hand.push(c);
        addLog(state, `${pName(state, player.id)}：ジャンク屋でアイテム入手: ${c.label}`);
        return { privateReveal: { to: player.id, card: c } };
      } else {
        addLog(state, `${pName(state, player.id)}：ジャンク屋（アイテム置き場が空）→効果なし`);
      }
      break;
    }
    case 'pub': {
      // ランダムな相手と手札1枚交換
      const others = state.players.filter(p => p.id !== player.id && p.hand.length > 0);
      if (others.length > 0 && player.hand.length > 0) {
        const target = others[randomInt(others.length)];
        const myIdx    = randomInt(player.hand.length);
        const theirIdx = randomInt(target.hand.length);
        const myCard    = player.hand.splice(myIdx, 1)[0];
        const theirCard = target.hand.splice(theirIdx, 1)[0];
        player.hand.push(theirCard);
        target.hand.push(myCard);
        addLog(state, `${pName(state, player.id)}：酒場で ${pName(state, target.id)} と手札1枚交換（ランダム）`);
        return {
          gainCards: [{ to: player.id, card: theirCard }, { to: target.id, card: myCard }],
          lostCards: [{ to: player.id, card: myCard },    { to: target.id, card: theirCard }],
        };
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
          addLog(state, `${pName(state, player.id)}：パーツ工場でアイテムを入手した`);
          return { gainCard: { to: player.id, card: c } };
        }
      } else if (state.itemPile.length > 0) {
        addLog(state, `${pName(state, player.id)}：パーツ工場に到達（アイテム置き場から1枚選んでください）`);
        state.pendingAction = { locEffect: 'factory_search', itemPile: state.itemPile.map(c => ({ ...c })) };
      } else {
        addLog(state, `${pName(state, player.id)}：パーツ工場（アイテム置き場が空）→効果なし`);
      }
      break;
    }
    case 'casino': {
      const DICE_EMOJI = ['⚀','⚁','⚂','⚃','⚄','⚅'];
      const roll = randomInt(6) + 1;
      const diceEmoji = DICE_EMOJI[roll - 1];
      if (roll % 2 === 0) {
        const c1 = drawFromDeck(state); if (c1) player.hand.push(c1);
        const c2 = drawFromDeck(state); if (c2) player.hand.push(c2);
        addLog(state, `${pName(state, player.id)}：カジノ ${diceEmoji}（偶数）→2枚ドロー！`);
        const gained = [c1, c2].filter(Boolean);
        if (gained.length > 0) return { gainCards: gained.map(c => ({ to: player.id, card: c })) };
      } else {
        if (player.hand.length > 0) {
          const lost = player.hand.splice(randomInt(player.hand.length), 1)[0];
          discardCard(state, lost);
          addLog(state, `${pName(state, player.id)}：カジノ ${diceEmoji}（奇数）→1枚没収`);
          return { lostCard: { to: player.id, card: lost } };
        } else {
          addLog(state, `${pName(state, player.id)}：カジノ ${diceEmoji}（奇数）→没収するカードなし`);
        }
      }
      break;
    }
    case 'tower': {
      // 山札をUIで見て1枚選ぶ → pendingAction でUI側に委ねる
      // ホストが chosenCardId を受け取ったら実際にドロー
      if (chosenCardId) {
        let found = null;
        const mIdx = state.moveDeck.findIndex(c => c.id === chosenCardId);
        if (mIdx !== -1) {
          found = state.moveDeck.splice(mIdx, 1)[0];
        } else {
          const aIdx = state.actionDeck.findIndex(c => c.id === chosenCardId);
          if (aIdx !== -1) found = state.actionDeck.splice(aIdx, 1)[0];
        }
        if (found) {
          player.hand.push(found);
          addLog(state, `${pName(state, player.id)}：タワーでカードをサーチして入手`);
          return { gainCard: { to: player.id, card: found } };
        }
      } else {
        addLog(state, `${pName(state, player.id)}：タワー（山札が空）→ 効果なし`);
      }
      break;
    }
    case 'crossing': {
      // 全員が手札を1枚ずつ次インデックスに
      const pLen = state.players.length;
      const given = state.players.map(p => {
        if (p.hand.length === 0) return null;
        return p.hand.splice(randomInt(p.hand.length), 1)[0];
      });
      given.forEach((card, i) => {
        if (card) state.players[(i + 1) % pLen].hand.push(card);
      });
      addLog(state, 'スクランブル交差点：全員の手札が1枚ずつ次プレイヤーに回った');
      const gainCards = given.map((c, i) => c ? { to: state.players[(i + 1) % pLen].id, card: c } : null).filter(Boolean);
      const lostCards = given.map((c, i) => c ? { to: state.players[i].id,              card: c } : null).filter(Boolean);
      if (gainCards.length > 0) return { gainCards, lostCards };
      break;
    }
    case 'police_box': {
      if (chosenCardId) {  // chosenCardId = 対象プレイヤーID
        const target = getPlayerById(state, chosenCardId);
        if (target?.hand.length > 0) {
          const lost = target.hand.splice(randomInt(target.hand.length), 1)[0];
          discardCard(state, lost);
          addLog(state, `${pName(state, player.id)}：交番で ${pName(state, chosenCardId)} の手札を1枚没収: ${lost.label}`);
          return { lostCard: { to: chosenCardId, card: lost } };
        }
      } else {
        addLog(state, `${pName(state, player.id)}：交番（対象なし）`);
      }
      break;
    }
    case 'black_mkt': {
      // 捨て札から6枚ランダムに絞り、1枚選ぶ → UI側に委ねる
      if (chosenCardId) {
        const idx = state.discard.findIndex(c => c.id === chosenCardId);
        if (idx !== -1) {
          const c = state.discard.splice(idx, 1)[0];
          player.hand.push(c);
          addLog(state, `${pName(state, player.id)}：闇市でカードを入手した`);
          return { gainCard: { to: player.id, card: c } };
        }
      } else {
        addLog(state, `${pName(state, player.id)}：闇市に到達（捨て札からカードを1枚選んでください）`);
        state.pendingAction = { locEffect: 'black_mkt', discard: shuffle([...state.discard]).slice(0, 6) };
      }
      break;
    }
    case 'alley': {
      // 捨て札から3枚ランダムに絞り、1枚選ぶ → UI側に委ねる
      if (chosenCardId) {
        const idx = state.discard.findIndex(c => c.id === chosenCardId);
        if (idx !== -1) {
          const c = state.discard.splice(idx, 1)[0];
          player.hand.push(c);
          addLog(state, `${pName(state, player.id)}：裏路地でカードを入手した`);
          return { gainCard: { to: player.id, card: c } };
        }
      } else {
        addLog(state, `${pName(state, player.id)}：裏路地に到達（捨て札からカードを1枚選んでください）`);
        state.pendingAction = { locEffect: 'alley', discard: shuffle([...state.discard]).slice(0, 3) };
      }
      break;
    }
    case 'broadcast': {
      if (player.hand.length > 0) {
        const exposed = player.hand[randomInt(player.hand.length)];
        addLog(state, `${pName(state, player.id)}：放送局で ${exposed.label} を全員に公開 → 1枚ドロー`);
        const drawn = drawFromDeck(state); if (drawn) player.hand.push(drawn);
        return { publicReveal: { card: exposed, owner: player.id }, gainCard: drawn ? { to: player.id, card: drawn } : null };
      }
      break;
    }
    case 'construct': {
      player.skipped = true;
      addLog(state, `${pName(state, player.id)}：工事現場で1回休み`);
      break;
    }
    case 'salvage': {
      if (state.itemPile.length > 0) {
        const c = state.itemPile.splice(randomInt(state.itemPile.length), 1)[0];
        player.hand.push(c);
        addLog(state, `${pName(state, player.id)}：廃材置き場でアイテムを1枚入手した`);
        return { privateReveal: { to: player.id, card: c, revealTitle: '廃材置き場で入手' } };
      } else {
        addLog(state, `${pName(state, player.id)}：廃材置き場（アイテムパイル枯渇）→効果なし`);
      }
      break;
    }
    case 'hospital': {
      state.discard.push(...player.hand);
      player.hand = [];
      const drawnH = [];
      for (let i = 0; i < 3; i++) { const c = drawFromDeck(state, 'move');   if (c) { player.hand.push(c); drawnH.push(c); } }
      for (let i = 0; i < 2; i++) { const c = drawFromDeck(state, 'action'); if (c) { player.hand.push(c); drawnH.push(c); } }
      addLog(state, `${pName(state, player.id)}：病院で手札リセット → 移動3枚＋アクション2枚引き直し`);
      if (drawnH.length > 0) return { gainCards: drawnH.map(c => ({ to: player.id, card: c })) };
      break;
    }
    case 'warehouse': {
      const c = drawFromDeck(state, 'move');
      if (c) {
        player.hand.push(c);
        addLog(state, `${pName(state, player.id)}：倉庫から1枚ドロー`);
        return { privateReveal: { to: player.id, card: c, revealTitle: '倉庫でドロー' } };
      }
      break;
    }
    case 'police_hq': {
      if (chosenCardId) {  // chosenCardId = 対象プレイヤーID
        const target = getPlayerById(state, chosenCardId);
        if (target) {
          // 弱体化: 陣営カード(パーツ/キット) > ダミー のときのみ特定成功
          const factionCount = target.hand.filter(
            c => c.subtype === ITEM_SUBTYPES.BOMB_PART || c.subtype === ITEM_SUBTYPES.DEFUSE_KIT
          ).length;
          const dummyCount = target.hand.filter(
            c => c.subtype === ITEM_SUBTYPES.DUMMY
          ).length;

          if (factionCount > dummyCount) {
            const roleLabel = target.role === ROLES.BOMBER ? '爆弾魔' : '解除班';
            addLog(state, `${pName(state, player.id)}：警察本部で ${pName(state, chosenCardId)} の陣営を特定！`);
            return { privateReveal: { to: player.id, role: target.role, roleLabel } };
          } else {
            addLog(state, `${pName(state, player.id)}：警察本部で ${pName(state, chosenCardId)} を捜査したが…捜査失敗`);
            return { privateReveal: { to: player.id, investigationFailed: true, targetName: pName(state, chosenCardId) } };
          }
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

  // 解除キット X/Y/Z が全種類揃っているか（3種類以上）
  const kitFamilies = declarer.hand.map(c => c.family).filter(Boolean);
  const kitCount = ['kit_x', 'kit_y', 'kit_z'].filter(f => kitFamilies.includes(f)).length;
  if (kitCount < 3) return { state, error: `解除キット X・Y・Z がすべて必要です（現在 ${kitCount} 種）` };

  // 自分と同じマスに爆弾魔がいるか
  const bombersHere = state.players.filter(
    p => p.role === ROLES.BOMBER && p.position === declarer.position
  );
  if (bombersHere.length === 0) return { state, error: '同じマスに爆弾魔がいません' };

  state.winner = 'defuser';
  addLog(state, `【確保】${pName(state, declarerId)} が爆弾魔をその場で取り押さえた！解除班の勝利！`);
  state.phase = 'end';
  return { state };
}

// --------------- 勝利判定 ---------------
function checkWinCondition(state) {
  // 爆弾魔の勝利: タワー(id=6)で爆弾パーツA/B/Cを全種類持っている
  for (const p of state.players) {
    if (p.role !== ROLES.BOMBER) continue;
    if (p.position !== 6) continue; // タワーのマスインデックス
    const families = p.hand.map(c => c.family).filter(Boolean);
    const hasAll = ['bomb_a', 'bomb_b', 'bomb_c'].every(f => families.includes(f));
    if (hasAll) {
      state.winner = 'bomber';
      addLog(state, `【爆発】${pName(state, p.id)} がタワーを爆破した！闇夜に辟音が響き渡る——爆弾魔チームの勝利！`);
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
  // スタート地点プレビュー: 手番プレイヤー以外にはカードを隠す
  if (sanitized.pendingAction?.locEffect === 'start_pick') {
    const currentId = sanitized.players[sanitized.currentTurnIndex]?.id;
    if (viewerId !== currentId) {
      delete sanitized.pendingAction.previewCards;
    }
  }
  sanitized.moveDeck   = sanitized.moveDeck.map(()   => ({ hidden: true }));
  sanitized.actionDeck = sanitized.actionDeck.map(() => ({ hidden: true }));
  sanitized.itemPile   = sanitized.itemPile.map(()   => ({ hidden: true }));
  return sanitized;
}
