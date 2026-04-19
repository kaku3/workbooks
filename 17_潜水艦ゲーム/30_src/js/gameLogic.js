// ============================================================
// gameLogic.js  ゲーム状態管理・アクション解決
// ============================================================
import {
  GRID_SIZE, MAX_HAND, INITIAL_HP, BASE_FUEL,
  DRAWS_PER_TURN, RESPAWN_DRAWS, WIN_KILLS, CAT,
  DIR, DIR_DELTA, DIR_LIST, rotateDir,
  buildDeck, shuffle,
  SUPPLY_FIXED, SUPPLY_TYPES,
  getSafeZone, isInDanger,
  VIRTUAL_CARD_MAP,
} from './constants.js';

/* ─── 初期配置候補 (外縁) ─── */
const START_POS = [
  { x: 0, y: 4, dir: 'E' }, { x: 9, y: 5, dir: 'W' },
  { x: 4, y: 0, dir: 'S' }, { x: 5, y: 9, dir: 'N' },
  { x: 0, y: 0, dir: 'S' }, { x: 9, y: 9, dir: 'N' },
];

/* ============================================================
   1. 状態生成
   ============================================================ */
export function createInitialState(playerIds, playerNames) {
  const positions = shuffle([...START_POS]).slice(0, playerIds.length);

  const decks = {
    move: buildDeck(CAT.MOVE),
    recon: buildDeck(CAT.RECON),
    attack: buildDeck(CAT.ATTACK),
    special: buildDeck(CAT.SPECIAL),
  };
  const discards = { move: [], recon: [], attack: [], special: [] };

  const players = {};
  playerIds.forEach((id, i) => {
    const pos = positions[i];
    // 初期手札 5 枚 (移動2 索敵1 攻撃1 特殊1)
    const hand = [];
    const counts = { move: 2, recon: 1, attack: 1, special: 1 };
    for (const [cat, n] of Object.entries(counts)) {
      for (let j = 0; j < n; j++) {
        const c = popDeck(decks, discards, cat);
        if (c) hand.push(c);
      }
    }
    players[id] = makePlayer(id, playerNames[i], pos, hand);
  });

  // 補給ポイント（固定3 + ランダム1）
  const randType = SUPPLY_TYPES[Math.floor(Math.random() * SUPPLY_TYPES.length)];
  const supplyPoints = [...SUPPLY_FIXED, { x: 7, y: 6, type: randType }];

  const state = {
    turn: 1, phase: 'draw',
    players, playerOrder: [...playerIds],
    decks, discards,
    supplyPoints,
    mines: [],           // {x,y,ownerId}
    trackingBuoys: [],   // {x,y,ownerId,turnsLeft}
    turnLog: [],
    actionEvents: [],    // アニメ用イベントキュー
    winner: null,
  };
  // ドローフェーズ初期化: drawsLeft を DRAWS_PER_TURN(2) にセット
  startDrawPhase(state);
  return state;
}

function makePlayer(id, name, pos, hand) {
  return {
    id, name,
    x: pos.x, y: pos.y, dir: pos.dir,
    hp: INITIAL_HP, maxHp: INITIAL_HP,
    fuel: BASE_FUEL, maxFuel: BASE_FUEL, bonusFuel: 0,
    hand,
    commandQueue: [],      // [{card, target}]
    commandConfirmed: false,
    drawsLeft: 0,
    alive: true,
    kills: 0,
    respawning: false,
    buffs: defaultBuffs(),
    sonarResults: [],      // 今ターンの索敵結果 [{x,y,playerId}]
    dogfightWith: null,
    forwardWarning: null,  // null | 'far' | 'near' | 'critical'
  };
}

function defaultBuffs() {
  return {
    overchargeNext: false, torpedoLock: false,
    enhancedSonar: false, armor: false,
    barragePrep: false, chaffTurns: 0,
    smokescreen: false, highOutput: false,
  };
}

/* ─── 復活位置生成 ─── */
function getRandomRespawnPos(state) {
  const occupied = new Set(
    state.playerOrder
      .filter(id => state.players[id].alive)
      .map(id => `${state.players[id].x},${state.players[id].y}`)
  );
  const edge = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    edge.push({ x, y: 0, dir: 'S' });
    edge.push({ x, y: GRID_SIZE - 1, dir: 'N' });
  }
  for (let y = 1; y < GRID_SIZE - 1; y++) {
    edge.push({ x: 0, y, dir: 'E' });
    edge.push({ x: GRID_SIZE - 1, y, dir: 'W' });
  }
  const available = edge.filter(p => !occupied.has(`${p.x},${p.y}`));
  const pool = available.length > 0 ? available : edge;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ─── デッキ操作 ─── */
function popDeck(decks, discards, cat) {
  if (decks[cat].length === 0) {
    if (discards[cat].length === 0) return null;
    decks[cat] = shuffle(discards[cat]);
    discards[cat] = [];
  }
  return decks[cat].pop();
}

/* ============================================================
   2. ドローフェーズ
   ============================================================ */
export function startDrawPhase(state) {
  state.phase = 'draw';
  alivePlayers(state).forEach(id => {
    const p = state.players[id];
    p.drawsLeft = (p.hand.length >= MAX_HAND) ? 0 : DRAWS_PER_TURN;
    p.sonarResults = [];
    p.forwardWarning = null;
    p.commandQueue = [];
    p.commandConfirmed = false;
  });
}

export function handleDraw(state, playerId, deckType) {
  const p = state.players[playerId];
  if (!p || !p.alive || p.drawsLeft <= 0 || state.phase !== 'draw') return null;
  if (p.hand.length >= MAX_HAND) {
    p.drawsLeft = 0;
    // 手札上限で全員完了チェック → コマンドフェーズへ
    if (allAliveDone(state, pl => pl.drawsLeft <= 0)) {
      state.phase = 'command';
      alivePlayers(state).forEach(id => {
        state.players[id].commandConfirmed = false;
        state.players[id].commandQueue = [];
      });
    }
    return null;
  }

  const card = popDeck(state.decks, state.discards, deckType);
  if (!card) return null;
  p.hand.push(card);
  p.drawsLeft--;

  // 全員完了 → コマンドフェーズ
  if (allAliveDone(state, pl => pl.drawsLeft <= 0)) {
    state.phase = 'command';
    alivePlayers(state).forEach(id => {
      state.players[id].commandConfirmed = false;
      state.players[id].commandQueue = [];
    });
  }
  return card;
}

/* ============================================================
   3. コマンドフェーズ
   ============================================================ */

/** 燃料コスト計算 (バフ・ドッグファイト込み) */
export function calcFuelCost(cards, isDogfight) {
  let total = 0, bpActive = false;
  for (const c of cards) {
    if (!c) continue;
    // 仮想カード：バフ影響なし・ドッグファイト追加コストなし
    if (c.virtual) { total += (c.fuel ?? 1); continue; }
    let cost = c.fuel;
    if (bpActive && c.cat === CAT.ATTACK) { cost = Math.max(0, cost - 2); bpActive = false; }
    if (c.id === 'barrage_prep') bpActive = true;
    if (isDogfight && c.cat === CAT.MOVE && c.id !== 'escape') cost += 1;
    total += cost;
  }
  return total;
}

export function handleCommand(state, playerId, cardUids, targets) {
  const p = state.players[playerId];
  if (!p || !p.alive || state.phase !== 'command') return false;

  // 仮想カード（手札不要）または手札からカードを解決
  const cards = cardUids.map(uid => VIRTUAL_CARD_MAP[uid] || p.hand.find(c => c.uid === uid));
  if (cards.some(c => !c)) return false; // 不明なカードUID

  // 仮想カード以外は手札に存在することを確認
  const allHandCardsPresent = cardUids
    .filter(uid => !VIRTUAL_CARD_MAP[uid])
    .every(uid => p.hand.some(c => c.uid === uid));
  if (!allHandCardsPresent) return false;

  const cost = calcFuelCost(cards, !!p.dogfightWith);
  if (cost > p.fuel) return false;

  p.commandQueue = cards.map((card, i) => ({ card, target: targets[i] || {} }));
  p.commandConfirmed = true;

  if (allAliveDone(state, pl => pl.commandConfirmed)) {
    resolveActions(state);
  }
  return true;
}

/** タイムアウト時に全員強制確定 */
export function forceConfirmAll(state) {
  if (state.phase !== 'command') return;  // コマンドフェーズ以外で発火された場合は何もしない
  alivePlayers(state).forEach(id => {
    const p = state.players[id];
    if (!p.commandConfirmed) {
      p.commandQueue = [];
      p.commandConfirmed = true;
    }
  });
  resolveActions(state);
}

/* ============================================================
   4. アクションフェーズ解決
   ============================================================ */
export function resolveActions(state) {
  state.phase = 'action';
  state.actionEvents = [];
  state.turnLog = [];

  const alive = alivePlayers(state);

  // コマンドカードをカテゴリ分類
  const cmds = {};
  alive.forEach(id => {
    cmds[id] = { move: [], recon: [], attack: [], special: [] };
    for (const cmd of state.players[id].commandQueue) {
      cmds[id][cmd.card.cat].push(cmd);
    }
  });

  // 0) バフ・デバフ先行適用
  alive.forEach(id => cmds[id].special.forEach(cmd => {
    if (cmd.card.subtype === 'buff' || cmd.card.subtype === 'debuff') resolveBuff(state, id, cmd);
  }));

  // 1) 収縮ダメージ
  alive.forEach(id => {
    const p = state.players[id];
    if (isInDanger(p.x, p.y, state.turn)) {
      applyDamage(state, id, 1, 'shrink');
    }
  });

  // 2) 移動（high_output 先行スキャン: 対象プレイヤーの全移動ら21倍）
  alive.forEach(id => {
    const p = state.players[id];
    if (cmds[id].move.some(cmd => cmd.card.id === 'high_output')) p.buffs.highOutput = true;
  });
  alive.forEach(id => cmds[id].move.forEach(cmd => resolveMove(state, id, cmd)));
  alive.forEach(id => { state.players[id].buffs.highOutput = false; });
  checkMines(state, alive);

  // 3) 補給
  resolveSupply(state, alive);

  // 4) 索敵
  alive.forEach(id => cmds[id].recon.forEach(cmd => resolveRecon(state, id, cmd)));
  resolveBuoyScans(state, alive);

  // 5) 攻撃
  alive.forEach(id => cmds[id].attack.forEach(cmd => resolveAttack(state, id, cmd)));

  // 6) 特殊 (バフ以外)
  alive.forEach(id => cmds[id].special.forEach(cmd => {
    if (cmd.card.subtype !== 'buff' && cmd.card.subtype !== 'debuff') resolveSpecial(state, id, cmd);
  }));

  // 使用カードを手札→捨て札（仮想カードはスキップ）
  alive.forEach(id => {
    const p = state.players[id];
    const used = new Set(
      p.commandQueue
        .map(c => c.card.uid)
        .filter(uid => !VIRTUAL_CARD_MAP[uid])
    );
    const removed = p.hand.filter(c => used.has(c.uid));
    p.hand = p.hand.filter(c => !used.has(c.uid));
    removed.forEach(c => state.discards[c.cat].push(c));
  });

  // 7) ドッグファイト判定
  resolveDogfight(state, alive);

  // 8) 前方警戒
  resolveForwardWarning(state, alive);

  // 9) ブイ寿命 / チャフ減少
  state.trackingBuoys = state.trackingBuoys.filter(b => { b.turnsLeft--; return b.turnsLeft > 0; });
  alive.forEach(id => {
    const p = state.players[id];
    if (p.buffs.chaffTurns > 0) p.buffs.chaffTurns--;
    p.buffs.smokescreen = false;
  });

  // 10) 脱落チェック
  checkEliminations(state);

  // ※ phase='action' のまま止める。次ターンへの遷移は main.js が行う
}

/** アクション表示後に呼ぶ: 次ターンへ遷移 */
export function advanceToNextTurn(state) {
  if (state.winner || state.phase === 'ended') return;
  state.turn++;
  prepareNextTurn(state);
}

function prepareNextTurn(state) {
  state.phase = 'draw';

  // 復活処理: 前ターンで撃沈されたプレイヤーをランダム外縁マスに配置
  const respawnedIds = new Set();
  state.playerOrder.forEach(id => {
    const p = state.players[id];
    if (p.respawning) {
      const pos = getRandomRespawnPos(state);
      p.x = pos.x; p.y = pos.y; p.dir = pos.dir;
      p.hp = INITIAL_HP;
      p.alive = true;
      p.respawning = false;
      p.hand = [];  // 手札リセット（復活ターンにドロー+1で補填）
      respawnedIds.add(id);
      pushEvent(state, { type: 'respawn', pid: id, x: pos.x, y: pos.y, public: true });
      state.turnLog.push(`${p.name} が外縁(${pos.x},${pos.y})に復活`);
    }
  });

  alivePlayers(state).forEach(id => {
    const p = state.players[id];
    if (p.buffs.overchargeNext) {
      p.fuel = BASE_FUEL + 4;
      p.buffs.overchargeNext = false;
    } else {
      p.fuel = BASE_FUEL + p.bonusFuel;
    }
    p.bonusFuel = 0;
    // 復活ターンは通常より1枚多くドローできる
    const draws = respawnedIds.has(id) ? RESPAWN_DRAWS : DRAWS_PER_TURN;
    p.drawsLeft = (p.hand.length >= MAX_HAND) ? 0 : draws;
    p.sonarResults = [];
    p.forwardWarning = null;
    p.commandQueue = [];
    p.commandConfirmed = false;
    // 1回限りバフリセット
    p.buffs.torpedoLock = false;
    p.buffs.enhancedSonar = false;
    p.buffs.barragePrep = false;
  });
  // 全員ドロー不要なら即コマンドフェーズへ
  if (allAliveDone(state, pl => pl.drawsLeft <= 0)) {
    state.phase = 'command';
    alivePlayers(state).forEach(id => {
      state.players[id].commandConfirmed = false;
      state.players[id].commandQueue = [];
    });
  }
}

/* ============================================================
   5. カード効果リゾルバー
   ============================================================ */

/* ─── 移動 ─── */
function resolveMove(state, pid, cmd) {
  const p = state.players[pid];
  const t = cmd.target;
  const fromX = p.x, fromY = p.y, fromDir = p.dir;
  switch (cmd.card.id) {
    case 'forward':          moveForward(p, 1); break;
    case 'free_forward':     moveForward(p, 1); break;
    case 'turbo_move':       moveForward(p, 3); break;
    case 'turn':
      p.dir = t.turnDir === 'L' ? rotateDir(p.dir, -1) : rotateDir(p.dir, 1);
      break;
    case 'free_turn_left':   p.dir = rotateDir(p.dir, -1); break;
    case 'free_turn_right':  p.dir = rotateDir(p.dir,  1); break;
    case 'cruise': {
      const d = t.dir || p.dir;
      const delta = DIR_DELTA[d];
      const steps = p.buffs.highOutput ? 2 : 1;
      for (let i = 0; i < steps; i++) {
        p.x = clamp(p.x + delta.dx, 0, GRID_SIZE - 1);
        p.y = clamp(p.y + delta.dy, 0, GRID_SIZE - 1);
      }
      break;
    }
    case 'strafe_left': {
      moveInDir(p, rotateDir(p.dir, -1), 1);
      break;
    }
    case 'strafe_right': {
      moveInDir(p, rotateDir(p.dir,  1), 1);
      break;
    }
    case 'rush':             moveForward(p, 3); break;
    case 'reverse':
      p.dir = rotateDir(p.dir, 2);
      moveForward(p, 2);
      break;
    case 'escape': {
      const d2 = t.dir || p.dir;
      const dl = DIR_DELTA[d2];
      for (let i = 0; i < 4; i++) {
        p.x = clamp(p.x + dl.dx, 0, GRID_SIZE - 1);
        p.y = clamp(p.y + dl.dy, 0, GRID_SIZE - 1);
      }
      break;
    }
    case 'high_output':
      // pre-processed via pre-scan; emit buff event and skip move event
      pushEvent(state, { type: 'buff', pid, card: 'high_output', public: false, to: pid });
      return;
    default: break;
  }
  pushEvent(state, { type: 'move', pid, card: cmd.card.id, fromX, fromY, fromDir, x: p.x, y: p.y, dir: p.dir, public: false, to: pid });
}

function moveForward(p, steps) {
  const actualSteps = p.buffs.highOutput ? steps * 2 : steps;
  const d = DIR_DELTA[p.dir];
  for (let i = 0; i < actualSteps; i++) {
    p.x = clamp(p.x + d.dx, 0, GRID_SIZE - 1);
    p.y = clamp(p.y + d.dy, 0, GRID_SIZE - 1);
  }
}

function moveInDir(p, dir, steps) {
  const actualSteps = p.buffs.highOutput ? steps * 2 : steps;
  const d = DIR_DELTA[dir];
  for (let i = 0; i < actualSteps; i++) {
    p.x = clamp(p.x + d.dx, 0, GRID_SIZE - 1);
    p.y = clamp(p.y + d.dy, 0, GRID_SIZE - 1);
  }
}

/* ─── 索敵 ─── */
function resolveRecon(state, pid, cmd) {
  const p = state.players[pid];
  const t = cmd.target;
  const rangeBonus = p.buffs.enhancedSonar ? 2 : 0;

  switch (cmd.card.id) {
    case 'passive_sonar': {
      const r = 3 + rangeBonus;
      findEnemiesInRadius(state, pid, p.x, p.y, r).forEach(e => {
        p.sonarResults.push({ x: e.x, y: e.y, playerId: e.id });
      });
      if (rangeBonus) p.buffs.enhancedSonar = false;
      pushEvent(state, { type: 'sonar', pid, card: 'passive_sonar', cx: p.x, cy: p.y, r, public: false, to: pid });
      break;
    }
    case 'active_sonar': {
      const r = 5 + rangeBonus;
      findEnemiesInRadius(state, pid, p.x, p.y, r).forEach(e => {
        if (!state.players[e.id].buffs.smokescreen) {
          p.sonarResults.push({ x: e.x, y: e.y, playerId: e.id });
        }
      });
      if (rangeBonus) p.buffs.enhancedSonar = false;
      // 副作用: 自艦エリアが漏れる
      pushEvent(state, { type: 'sonar', pid, card: 'active_sonar', cx: p.x, cy: p.y, r, public: true, areaLeak: { cx: p.x, cy: p.y, r: 3 } });
      break;
    }
    case 'hydrophone': {
      // { row, col } (旧モーダル) または { x, y } (盤面クリック) を両方サポート
      const row = 'row' in t ? t.row : t.y;  // 横スキャン: y 座標
      const col = 'col' in t ? t.col : t.x;  // 縦スキャン: x 座標
      alivePlayers(state).forEach(eid => {
        if (eid === pid) return;
        const ep = state.players[eid];
        if ((row != null && ep.y === row) || (col != null && ep.x === col)) {
          p.sonarResults.push({ x: ep.x, y: ep.y, playerId: eid, approximate: true });
        }
      });
      pushEvent(state, { type: 'sonar', pid, card: 'hydrophone', public: false, to: pid });
      break;
    }
    case 'recon_torpedo': {
      const d = t.dir || p.dir;
      const dl = DIR_DELTA[d];
      let cx = p.x, cy = p.y;
      for (let i = 0; i < GRID_SIZE; i++) {
        cx += dl.dx; cy += dl.dy;
        if (cx < 0 || cx >= GRID_SIZE || cy < 0 || cy >= GRID_SIZE) break;
        const hit = alivePlayers(state).find(eid => {
          if (eid === pid) return false;
          const ep = state.players[eid];
          return ep.x === cx && ep.y === cy && !ep.buffs.smokescreen;
        });
        if (hit) {
          const ep = state.players[hit];
          p.sonarResults.push({ x: ep.x, y: ep.y, playerId: hit });
          break;
        }
      }
      // 副作用: 射出音
      pushEvent(state, { type: 'sound_leak', pid, card: 'recon_torpedo', dir: d, public: true, line: true });
      break;
    }
    case 'tracking_buoy': {
      const bx = t.x ?? p.x, by = t.y ?? p.y;
      state.trackingBuoys.push({ x: bx, y: by, ownerId: pid, turnsLeft: 3 });
      pushEvent(state, { type: 'buoy_place', pid, x: bx, y: by, public: true });
      break;
    }
    case 'decoy_signal': {
      const fx = t.fakeX ?? Math.floor(Math.random() * GRID_SIZE);
      const fy = t.fakeY ?? Math.floor(Math.random() * GRID_SIZE);
      // 全員に偽情報
      alivePlayers(state).forEach(eid => {
        if (eid === pid) return;
        state.players[eid].sonarResults.push({ x: fx, y: fy, playerId: pid, fake: true });
      });
      pushEvent(state, { type: 'decoy', pid, fx, fy, public: false });
      break;
    }
  }
}

/* ─── 攻撃 ─── */
function resolveAttack(state, pid, cmd) {
  const p = state.players[pid];
  const t = cmd.target;

  switch (cmd.card.id) {
    case 'torpedo': {
      const range = (cmd.card.range || 6) + (p.buffs.torpedoLock ? 3 : 0);
      if (p.buffs.torpedoLock) p.buffs.torpedoLock = false;
      const d = p.dir;  // 常に正面方向のみ
      const { endX, endY } = fireTorpedoLine(state, pid, p.x, p.y, d, range, 2);  // 2ダメージ
      // 発射者のみに軌跡アニメイベント
      pushEvent(state, { type: 'torpedo_fire', pid, card: 'torpedo', sx: p.x, sy: p.y, ex: endX, ey: endY, public: false, to: pid });
      // 副作用: 発射ライン漏れ
      pushEvent(state, { type: 'attack_leak', pid, card: 'torpedo', dir: d, public: true, line: true });
      break;
    }
    case 'harpoon': {
      const HARPOON_RANGE = (cmd.card.range || 3) + (p.buffs.torpedoLock ? 3 : 0);
      if (p.buffs.torpedoLock) p.buffs.torpedoLock = false;
      const leftDir  = rotateDir(p.dir, -1);
      const rightDir = rotateDir(p.dir, 1);
      const tx = t.x ?? (p.x + DIR_DELTA[leftDir].dx);  // fallback: 左
      const ty = t.y ?? (p.y + DIR_DELTA[leftDir].dy);
      const ddx = tx - p.x, ddy = ty - p.y;
      let fireDir, fireRange;
      if (Math.abs(ddx) >= Math.abs(ddy)) {
        fireDir   = ddx >= 0 ? 'E' : 'W';
        fireRange = Math.min(HARPOON_RANGE, Math.abs(ddx));
      } else {
        fireDir   = ddy >= 0 ? 'S' : 'N';
        fireRange = Math.min(HARPOON_RANGE, Math.abs(ddy));
      }
      // 左右(横)方向のみ許可
      if ((fireDir !== leftDir && fireDir !== rightDir) || fireRange <= 0) break;
      const { endX: hEx, endY: hEy } = fireTorpedoLine(state, pid, p.x, p.y, fireDir, fireRange, 1);
      pushEvent(state, { type: 'torpedo_fire', pid, card: 'harpoon', sx: p.x, sy: p.y, ex: hEx, ey: hEy, public: false, to: pid });
      pushEvent(state, { type: 'attack_leak', pid, card: 'harpoon', dir: fireDir, public: true, line: true });
      break;
    }
    case 'guided_torpedo': {
      const range = 3 + (p.buffs.torpedoLock ? 3 : 0);
      if (p.buffs.torpedoLock) p.buffs.torpedoLock = false;
      // 直進 + 最大 2 回転換
      const path = t.guidedPath || [{ dir: t.dir || p.dir, steps: range }];
      fireGuidedTorpedo(state, pid, p.x, p.y, path);
      pushEvent(state, { type: 'attack_leak', pid, card: 'guided_torpedo', public: true, areaLeak: { cx: p.x, cy: p.y, r: 3 } });
      break;
    }
    case 'depth_charge': {
      const cx = t.x ?? p.x, cy = t.y ?? p.y;
      const r = cmd.card.radius || 2;
      // 爆発圆を先にアニメキューに登録し、その後にダメージを行刀
      pushEvent(state, { type: 'attack_leak', pid, card: 'depth_charge', cx, cy, r, public: true });
      alivePlayers(state).forEach(eid => {
        if (eid === pid) return;
        const ep = state.players[eid];
        if (chebyshev(cx, cy, ep.x, ep.y) <= r) {
          applyDamage(state, eid, 1, 'depth_charge', pid);
        }
      });
      break;
    }
    case 'mine': {
      const mx = t.x ?? p.x, my = t.y ?? p.y;
      state.mines.push({ x: mx, y: my, ownerId: pid });
      pushEvent(state, { type: 'mine_place', pid, x: mx, y: my, public: false, to: pid });
      break;
    }
    case 'barrage': {
      const range = (cmd.card.range || 6) + (p.buffs.torpedoLock ? 3 : 0);
      if (p.buffs.torpedoLock) p.buffs.torpedoLock = false;
      // 前方左右 45° の2方向
      const dIdx = DIR_LIST.indexOf(p.dir);
      const leftDir = DIR_LIST[(dIdx + 3) % 4]; // -1
      const rightDir = DIR_LIST[(dIdx + 1) % 4];
      fireTorpedoLine(state, pid, p.x, p.y, p.dir, range);
      fireTorpedoDiag(state, pid, p.x, p.y, p.dir, leftDir, range);
      fireTorpedoDiag(state, pid, p.x, p.y, p.dir, rightDir, range);
      pushEvent(state, { type: 'attack_leak', pid, card: 'barrage', dir: p.dir, public: true, line: true });
      break;
    }
  }
}

function fireTorpedoLine(state, pid, sx, sy, dir, range, damage = 1) {
  const dl = DIR_DELTA[dir];
  let cx = sx, cy = sy, lastX = sx, lastY = sy;
  for (let i = 0; i < range; i++) {
    const nx = cx + dl.dx, ny = cy + dl.dy;
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
    lastX = nx; lastY = ny;
    cx = nx; cy = ny;
    const hit = findEnemyAt(state, pid, cx, cy);
    if (hit) {
      // ドッグファイト距離チェック: 距離2未満は当たらない
      if (chebyshev(sx, sy, cx, cy) >= 2) {
        applyDamage(state, hit, damage, 'torpedo', pid);
        pushEvent(state, { type: 'explosion', x: cx, y: cy, public: true });
      }
      break; // 貫通しない
    }
  }
  return { endX: lastX, endY: lastY };
}

function fireTorpedoDiag(state, pid, sx, sy, mainDir, sideDir, range) {
  const md = DIR_DELTA[mainDir], sd = DIR_DELTA[sideDir];
  let cx = sx, cy = sy;
  for (let i = 0; i < range; i++) {
    // 斜め移動 (1:1)
    cx += md.dx + sd.dx;
    cy += md.dy + sd.dy;
    cx = clamp(cx, 0, GRID_SIZE - 1);
    cy = clamp(cy, 0, GRID_SIZE - 1);
    const hit = findEnemyAt(state, pid, cx, cy);
    if (hit && chebyshev(sx, sy, cx, cy) >= 2) {
      applyDamage(state, hit, 1, 'barrage', pid);
      pushEvent(state, { type: 'explosion', x: cx, y: cy, public: true });
      break;
    }
  }
}

function fireGuidedTorpedo(state, pid, sx, sy, path) {
  let cx = sx, cy = sy;
  for (const seg of path) {
    const dl = DIR_DELTA[seg.dir];
    const steps = seg.steps || 3;
    for (let i = 0; i < steps; i++) {
      cx += dl.dx; cy += dl.dy;
      if (cx < 0 || cx >= GRID_SIZE || cy < 0 || cy >= GRID_SIZE) return;
      const hit = findEnemyAt(state, pid, cx, cy);
      if (hit) {
        // チャフチェック: 誘導無効 → 直進のみなのでここで命中
        if (chebyshev(sx, sy, cx, cy) >= 2) {
          applyDamage(state, hit, 1, 'guided_torpedo', pid);
          pushEvent(state, { type: 'explosion', x: cx, y: cy, public: true });
        }
        return;
      }
    }
  }
}

/* ─── 特殊 / バフ / デバフ ─── */
function resolveBuff(state, pid, cmd) {
  const p = state.players[pid];
  switch (cmd.card.id) {
    case 'overcharge':     p.buffs.overchargeNext = true; break;
    case 'torpedo_lock':   p.buffs.torpedoLock = true; break;
    case 'enhanced_sonar': p.buffs.enhancedSonar = true; break;
    case 'armor':          p.buffs.armor = true; break;
    case 'barrage_prep':   p.buffs.barragePrep = true; break;
    case 'chaff':          p.buffs.chaffTurns = 2; break;
    case 'smokescreen':    p.buffs.smokescreen = true; break;
  }
  pushEvent(state, { type: 'buff', pid, card: cmd.card.id, public: false, to: pid });
}

function resolveSpecial(state, pid, cmd) {
  const p = state.players[pid];
  switch (cmd.card.id) {
    case 'repair':
      p.hp = Math.min(p.hp + 1, p.maxHp);
      pushEvent(state, { type: 'repair', pid, hp: p.hp, public: false, to: pid });
      break;
    case 'resupply': {
      // 手札1枚捨て → 2枚引く
      const discUid = cmd.target.discardUid;
      const idx = p.hand.findIndex(c => c.uid === discUid);
      if (idx >= 0) {
        const removed = p.hand.splice(idx, 1)[0];
        state.discards[removed.cat].push(removed);
      }
      const d1 = cmd.target.drawDeck1 || CAT.MOVE;
      const d2 = cmd.target.drawDeck2 || CAT.ATTACK;
      const c1 = popDeck(state.decks, state.discards, d1);
      const c2 = popDeck(state.decks, state.discards, d2);
      if (c1) p.hand.push(c1);
      if (c2) p.hand.push(c2);
      pushEvent(state, { type: 'resupply', pid, public: false, to: pid });
      break;
    }
    case 'emp': {
      // 半径3マス内の索敵を次ターン無効化 (簡易実装: 今ターンの索敵結果を除去)
      const r = 3;
      alivePlayers(state).forEach(eid => {
        if (eid === pid) return;
        const ep = state.players[eid];
        if (chebyshev(p.x, p.y, ep.x, ep.y) <= r) {
          ep.sonarResults = [];
        }
      });
      pushEvent(state, { type: 'emp', pid, cx: p.x, cy: p.y, r, public: true });
      break;
    }
    case 'hijack': {
      // 相手1名のソナー結果を盗む (ランダム選択)
      const targets = alivePlayers(state).filter(id => id !== pid && state.players[id].sonarResults.length > 0);
      if (targets.length > 0) {
        const tid = targets[Math.floor(Math.random() * targets.length)];
        p.sonarResults.push(...state.players[tid].sonarResults);
      }
      pushEvent(state, { type: 'hijack', pid, public: false, to: pid });
      break;
    }
  }
}

/* ─── 補給 ─── */
function resolveSupply(state, alive) {
  alive.forEach(pid => {
    const p = state.players[pid];
    for (const sp of state.supplyPoints) {
      if (p.x === sp.x && p.y === sp.y) {
        switch (sp.type) {
          case 'fuel':   p.bonusFuel = Math.min(p.bonusFuel + 5, 5); break;
          case 'repair': p.hp = Math.min(p.hp + 2, p.maxHp); break;
          case 'armory': {
            for (let i = 0; i < 3; i++) {
              const cats = [CAT.MOVE, CAT.RECON, CAT.ATTACK, CAT.SPECIAL];
              const c = popDeck(state.decks, state.discards, cats[i % 4]);
              if (c && p.hand.length < MAX_HAND) p.hand.push(c);
            }
            break;
          }
        }
        pushEvent(state, { type: 'supply', pid, supplyType: sp.type, public: false, to: pid });
      }
    }
  });
}

/* ─── 機雷 ─── */
function checkMines(state, alive) {
  alive.forEach(pid => {
    const p = state.players[pid];
    state.mines = state.mines.filter(m => {
      if (m.x === p.x && m.y === p.y && m.ownerId !== pid) {
        applyDamage(state, pid, 1, 'mine', m.ownerId);
        pushEvent(state, { type: 'explosion', x: m.x, y: m.y, public: true });
        return false; // 機雷除去
      }
      return true;
    });
  });
}

/* ─── 追跡ブイ ─── */
function resolveBuoyScans(state, alive) {
  for (const b of state.trackingBuoys) {
    const owner = state.players[b.ownerId];
    if (!owner || !owner.alive) continue;
    alive.forEach(eid => {
      if (eid === b.ownerId) return;
      const ep = state.players[eid];
      if (chebyshev(b.x, b.y, ep.x, ep.y) <= 2 && !ep.buffs.smokescreen) {
        owner.sonarResults.push({ x: ep.x, y: ep.y, playerId: eid });
      }
    });
  }
}

/* ─── ドッグファイト ─── */
function resolveDogfight(state, alive) {
  // 既存ドッグファイトの終了判定
  alive.forEach(pid => {
    const p = state.players[pid];
    if (p.dogfightWith) {
      const other = state.players[p.dogfightWith];
      if (!other || !other.alive || chebyshev(p.x, p.y, other.x, other.y) >= 5) {
        if (other) other.dogfightWith = null;
        p.dogfightWith = null;
        pushEvent(state, { type: 'dogfight_end', pid, public: false, to: pid });
      }
    }
  });

  // 新規ドッグファイト判定 (チェビシェフ距離 ≤ 1)
  for (let i = 0; i < alive.length; i++) {
    for (let j = i + 1; j < alive.length; j++) {
      const a = state.players[alive[i]], b = state.players[alive[j]];
      if (a.dogfightWith || b.dogfightWith) continue;
      if (chebyshev(a.x, a.y, b.x, b.y) <= 1) {
        a.dogfightWith = alive[j];
        b.dogfightWith = alive[i];
        pushEvent(state, { type: 'dogfight_start', pids: [alive[i], alive[j]], public: false, to: alive[i] });
        pushEvent(state, { type: 'dogfight_start', pids: [alive[i], alive[j]], public: false, to: alive[j] });
      }
    }
  }
}

/* ─── 前方警戒 ─── */
function resolveForwardWarning(state, alive) {
  alive.forEach(pid => {
    const p = state.players[pid];
    p.forwardWarning = null;
    const dl = DIR_DELTA[p.dir];
    for (let step = 1; step <= 3; step++) {
      const fx = p.x + dl.dx * step, fy = p.y + dl.dy * step;
      if (fx < 0 || fx >= GRID_SIZE || fy < 0 || fy >= GRID_SIZE) continue;
      const found = alive.some(eid => {
        if (eid === pid) return false;
        const ep = state.players[eid];
        return ep.x === fx && ep.y === fy;
      });
      if (found) {
        if (step === 1) p.forwardWarning = 'critical';
        else if (step === 2) p.forwardWarning = p.forwardWarning || 'near';
        else p.forwardWarning = p.forwardWarning || 'far';
      }
    }
  });
}

/* ─── 脱落・勝利 ─── */
function checkEliminations(state) {
  state.playerOrder.forEach(id => {
    const p = state.players[id];
    if (p.alive && p.hp <= 0) {
      p.alive = false;
      p.respawning = true;  // 次ターン開始時に復活
      // 相手側のドッグファイト参照もクリア
      if (p.dogfightWith) {
        const partner = state.players[p.dogfightWith];
        if (partner) partner.dogfightWith = null;
      }
      p.dogfightWith = null;
      pushEvent(state, { type: 'eliminated', pid: id, respawning: true, public: true });
    }
  });
  // 勝者確定済みの場合のみ終了（キル数で決まる）
  if (state.winner) {
    state.phase = 'ended';
  }
}

/* ============================================================
   6. 状態サニタイズ（霧戦争）
   ============================================================ */
export function sanitizeStateForPlayer(state, playerId) {
  const me = state.players[playerId];
  const safeZone = getSafeZone(state.turn);

  const players = {};
  state.playerOrder.forEach(id => {
    if (id === playerId) {
      // 自分: 全情報
      players[id] = { ...state.players[id], hand: [...state.players[id].hand] };
    } else {
      const o = state.players[id];
      const revealed = {
        id: o.id, name: o.name, alive: o.alive,
        kills: o.kills,
        respawning: o.respawning,
        dogfightWith: o.dogfightWith,
        commandConfirmed: o.commandConfirmed,
        drawsLeft: o.drawsLeft,
        hp: o.hp,
        x: undefined, y: undefined, dir: undefined,
      };
      // ドッグファイト中 → 座標公開
      if (me && me.dogfightWith === id && o.alive) {
        revealed.x = o.x; revealed.y = o.y; revealed.dir = o.dir;
      }
      // 脱落者の HP 公開
      if (!o.alive) revealed.hp = 0;
      players[id] = revealed;
    }
  });

  return {
    turn: state.turn, phase: state.phase,
    myId: playerId,
    players,
    playerOrder: state.playerOrder,
    supplyPoints: state.supplyPoints,
    safeZone,
    winner: state.winner,
    deckCounts: {
      move: state.decks.move.length , recon: state.decks.recon.length,
      attack: state.decks.attack.length, special: state.decks.special.length,
    },
    turnLog: state.turnLog,
    actionEvents: state.actionEvents.filter(e =>
      e.public || e.to === playerId || (Array.isArray(e.pids) && e.pids.includes(playerId))
    ),
    myMines: state.mines.filter(m => m.ownerId === playerId),
    myBuoys: state.trackingBuoys.filter(b => b.ownerId === playerId),
  };
}

/* ============================================================
   7. ユーティリティ
   ============================================================ */
function alivePlayers(state) {
  return state.playerOrder.filter(id => state.players[id].alive);
}
function allAliveDone(state, pred) {
  return state.playerOrder.every(id => !state.players[id].alive || pred(state.players[id]));
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function chebyshev(x1, y1, x2, y2) { return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)); }
function findEnemyAt(state, pid, x, y) {
  return alivePlayers(state).find(eid => eid !== pid && state.players[eid].x === x && state.players[eid].y === y) || null;
}
function findEnemiesInRadius(state, pid, cx, cy, r) {
  return alivePlayers(state)
    .filter(eid => eid !== pid)
    .map(eid => state.players[eid])
    .filter(ep => chebyshev(cx, cy, ep.x, ep.y) <= r);
}
function pushEvent(state, ev) { state.actionEvents.push(ev); }
function applyDamage(state, pid, amount, source, attackerId) {
  const p = state.players[pid];
  if (!p.alive) return;
  let dmg = amount;
  if (p.buffs.armor && dmg > 0) { dmg = Math.max(0, dmg - 1); p.buffs.armor = false; }
  p.hp -= dmg;
  pushEvent(state, { type: 'damage', pid, dmg, source, attackerId, hp: p.hp, public: source !== 'mine' });
  state.turnLog.push(`${p.name} が ${source} で ${dmg} ダメージ (HP:${p.hp})`);
  // キル判定: HP0以下かつ攻撃者が存在する場合
  if (p.hp <= 0 && attackerId && state.players[attackerId]) {
    state.players[attackerId].kills++;
    state.turnLog.push(`${state.players[attackerId].name} がキル (計${state.players[attackerId].kills}キル)`);
    if (state.players[attackerId].kills >= WIN_KILLS) {
      state.winner = attackerId;
    }
  }
}
