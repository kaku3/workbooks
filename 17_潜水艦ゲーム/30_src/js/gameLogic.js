// ============================================================
// gameLogic.js  v5.0 パネル操作制ゲームロジック
// ============================================================
import {
  GRID_SIZE, INITIAL_HP, BASE_TIME, WIN_KILLS,
  OPS, INITIAL_INVENTORY,
  DIR, DIR_DELTA, DIR_LIST, rotateDir,
  shuffle, SUPPLY_FIXED,
  getSafeZone, isInDanger,
} from './constants.js';

/* --- 初期配置候補 (外縁) --- */
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
  const players = {};
  playerIds.forEach((id, i) => {
    players[id] = makePlayer(id, playerNames[i], positions[i]);
  });
  const state = {
    turn: 1,
    phase: 'command',
    players,
    playerOrder: [...playerIds],
    supplyPoints: [...SUPPLY_FIXED],
    mines: [],
    decoys: [],
    turnLog: [],
    actionEvents: [],
    winner: null,
  };
  alivePlayers(state).forEach(id => {
    state.players[id].commandConfirmed = false;
    state.players[id].commandQueue = [];
  });
  return state;
}

function makePlayer(id, name, pos) {
  return {
    id, name,
    x: pos.x, y: pos.y, dir: pos.dir,
    hp: INITIAL_HP, maxHp: INITIAL_HP,
    time: BASE_TIME, maxTime: BASE_TIME,
    inventory: { ...INITIAL_INVENTORY },
    commandQueue: [],
    commandConfirmed: false,
    alive: true,
    kills: 0,
    respawning: false,
    buffs: defaultBuffs(),
    sonarResults: [],
    dogfightWith: null,
    forwardWarning: null,
  };
}

function defaultBuffs() {
  return { chaffActive: false, armorActive: false };
}

function getRandomRespawnPos(state) {
  const occupied = new Set(
    state.playerOrder.filter(id => state.players[id].alive)
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

/* ============================================================
   2. コマンドフェーズ
   ============================================================ */
export function calcTimeCost(opIds) {
  return opIds.reduce((sum, id) => sum + (OPS[id]?.cost ?? 0), 0);
}

export function handleCommand(state, playerId, opIds, targets) {
  const p = state.players[playerId];
  if (!p || !p.alive || state.phase !== 'command') return false;
  if (!opIds.every(id => !!OPS[id])) return false;
  const cost = calcTimeCost(opIds);
  if (cost > p.time) return false;
  const invUse = {};
  for (const id of opIds) {
    const op = OPS[id];
    if (op.invKey) invUse[op.invKey] = (invUse[op.invKey] || 0) + 1;
  }
  for (const [key, count] of Object.entries(invUse)) {
    if ((p.inventory[key] ?? 0) < count) return false;
  }
  p.commandQueue = opIds.map((op, i) => ({ op, target: targets[i] || {} }));
  p.commandConfirmed = true;
  if (allAliveDone(state, pl => pl.commandConfirmed)) resolveActions(state);
  return true;
}

export function forceConfirmAll(state) {
  if (state.phase !== 'command') return;
  alivePlayers(state).forEach(id => {
    const p = state.players[id];
    if (!p.commandConfirmed) { p.commandQueue = []; p.commandConfirmed = true; }
  });
  resolveActions(state);
}

/* ============================================================
   3. アクションフェーズ解決
   ============================================================ */
export function resolveActions(state) {
  state.phase = 'action';
  state.actionEvents = [];
  state.turnLog = [];
  const alive = alivePlayers(state);

  // 0) 防御バフ (chaff / armor) -- 在庫消費含む
  alive.forEach(id => {
    for (const { op } of state.players[id].commandQueue) {
      if (op === 'chaff') activateChaff(state, id);
      if (op === 'armor') activateArmor(state, id);
    }
  });

  // 1) 収縮ダメージ
  alive.forEach(id => {
    const p = state.players[id];
    if (isInDanger(p.x, p.y, state.turn)) applyDamage(state, id, 1, 'shrink', null);
  });

  // 2) 移動
  alive.forEach(id => {
    for (const cmd of state.players[id].commandQueue) {
      if (OPS[cmd.op]?.cat === 'move') resolveMove(state, id, cmd);
    }
  });

  // 3) 機雷チェック
  checkMines(state, alive);

  // 4) 補給
  resolveSupply(state, alive);

  // 5) ソナー
  alive.forEach(id => {
    for (const cmd of state.players[id].commandQueue) {
      if (cmd.op === 'sonar') resolveSonar(state, id, cmd);
    }
  });

  // 6) 武器
  alive.forEach(id => {
    for (const cmd of state.players[id].commandQueue) {
      if (OPS[cmd.op]?.cat === 'weapon') resolveWeapon(state, id, cmd);
    }
  });

  // 7) 設置 (在庫消費)
  alive.forEach(id => {
    for (const cmd of state.players[id].commandQueue) {
      if (cmd.op === 'decoy') resolveDecoy(state, id, cmd);
      if (cmd.op === 'mine')  resolveMine(state, id, cmd);
    }
  });

  // weapon/place 在庫消費 (chaff/armor は既に消費済み)
  alive.forEach(id => {
    const p = state.players[id];
    const invUse = {};
    for (const { op } of p.commandQueue) {
      const opDef = OPS[op];
      if (opDef?.invKey && op !== 'chaff' && op !== 'armor') {
        invUse[opDef.invKey] = (invUse[opDef.invKey] || 0) + 1;
      }
    }
    for (const [key, count] of Object.entries(invUse)) {
      p.inventory[key] = Math.max(0, (p.inventory[key] ?? 0) - count);
    }
  });

  // 8) ドッグファイト
  resolveDogfight(state, alive);

  // 9) 前方警戒
  resolveForwardWarning(state, alive);

  // 10) デコイ寿命
  state.decoys = state.decoys.filter(d => { d.turnsLeft--; return d.turnsLeft > 0; });

  // 11) 脱落チェック
  checkEliminations(state);
}

export function advanceToNextTurn(state) {
  if (state.winner || state.phase === 'ended') return;
  state.turn++;
  prepareNextTurn(state);
}

function prepareNextTurn(state) {
  state.playerOrder.forEach(id => {
    const p = state.players[id];
    if (p.respawning) {
      const pos = getRandomRespawnPos(state);
      p.x = pos.x; p.y = pos.y; p.dir = pos.dir;
      p.hp = INITIAL_HP;
      p.alive = true;
      p.respawning = false;
      p.inventory = { ...INITIAL_INVENTORY };
      p.buffs = defaultBuffs();
      pushEvent(state, { type: 'respawn', pid: id, x: pos.x, y: pos.y, public: true });
      state.turnLog.push(`${p.name} が外縁(${pos.x},${pos.y})に復活`);
    }
  });
  state.phase = 'command';
  alivePlayers(state).forEach(id => {
    const p = state.players[id];
    p.time = BASE_TIME;
    p.sonarResults = [];
    p.forwardWarning = null;
    p.commandQueue = [];
    p.commandConfirmed = false;
    p.dogfightWith = null;  // コマンドフェーズ開始時にリセット。移動後の行動フェーズで再判定する。
  });
}

/* ============================================================
   4. 操作リゾルバー
   ============================================================ */
function resolveMove(state, pid, cmd) {
  const p = state.players[pid];
  const fromX = p.x, fromY = p.y, fromDir = p.dir;
  switch (cmd.op) {
    case 'forward':
      p.x = clamp(p.x + DIR_DELTA[p.dir].dx, 0, GRID_SIZE - 1);
      p.y = clamp(p.y + DIR_DELTA[p.dir].dy, 0, GRID_SIZE - 1);
      break;
    case 'turn_left':  p.dir = rotateDir(p.dir, -1); break;
    case 'turn_right': p.dir = rotateDir(p.dir,  1); break;
    case 'strafe_l': {
      const d = DIR_DELTA[rotateDir(p.dir, -1)];
      p.x = clamp(p.x + d.dx, 0, GRID_SIZE - 1);
      p.y = clamp(p.y + d.dy, 0, GRID_SIZE - 1);
      break;
    }
    case 'strafe_r': {
      const d = DIR_DELTA[rotateDir(p.dir, 1)];
      p.x = clamp(p.x + d.dx, 0, GRID_SIZE - 1);
      p.y = clamp(p.y + d.dy, 0, GRID_SIZE - 1);
      break;
    }
  }
  pushEvent(state, { type: 'move', pid, op: cmd.op, fromX, fromY, fromDir, x: p.x, y: p.y, dir: p.dir, public: false, to: pid });
}

function resolveSonar(state, pid, cmd) {
  const p = state.players[pid];
  const cx = cmd.target?.x ?? p.x;
  const cy = cmd.target?.y ?? p.y;
  const r = 1;  // 直役3マス = Chebyshev距雦1
  const hits = [];
  findEnemiesInRadius(state, pid, cx, cy, r).forEach(ep => {
    const hasDecoy = state.decoys.some(d => d.ownerId === ep.id && d.x === ep.x && d.y === ep.y);
    if (!hasDecoy) {
      const hit = { x: ep.x, y: ep.y, playerId: ep.id };
      p.sonarResults.push(hit);
      hits.push(hit);
    }
  });
  pushEvent(state, { type: 'sonar', pid, op: 'sonar', cx, cy, r, hits, public: false, to: pid });
}

function resolveWeapon(state, pid, cmd) {
  const p = state.players[pid];
  switch (cmd.op) {
    case 'torpedo': {
      const { endX, endY } = fireTorpedoLine(state, pid, p.x, p.y, p.dir, GRID_SIZE, 2);
      pushEvent(state, { type: 'torpedo_fire', pid, op: 'torpedo', sx: p.x, sy: p.y, ex: endX, ey: endY, public: false, to: pid });
      pushEvent(state, { type: 'attack_leak', pid, op: 'torpedo', dir: p.dir, public: true, line: true });
      break;
    }
    case 'guided': {
      const tx = cmd.target?.x ?? p.x;
      const ty = cmd.target?.y ?? p.y;
      // 発射者向けプライベートイベント（アニメーション用）
      pushEvent(state, { type: 'guided_fire', pid, op: 'guided', sx: p.x, sy: p.y, tx, ty, public: false, to: pid });
      alivePlayers(state).forEach(eid => {
        if (eid === pid) return;
        const ep = state.players[eid];
        if (ep.x === tx && ep.y === ty) {
          if (ep.buffs.chaffActive) {
            ep.buffs.chaffActive = false;
            state.turnLog.push(`${ep.name} のチャフが追尾魚雷を無効化`);
            pushEvent(state, { type: 'chaff_block', pid: eid, public: false, to: eid });
          } else {
            applyDamage(state, eid, 1, 'guided', pid);
          }
        }
      });
      pushEvent(state, { type: 'attack_leak', pid, op: 'guided', public: true, cx: tx, cy: ty, r: 2 });
      break;
    }
    case 'shotgun': {
      const fwd = DIR_DELTA[p.dir];
      const lDir = rotateDir(p.dir, -1), rDir = rotateDir(p.dir, 1);
      const fan = [
        { x: clamp(p.x + fwd.dx, 0, GRID_SIZE - 1), y: clamp(p.y + fwd.dy, 0, GRID_SIZE - 1) },
        { x: clamp(p.x + DIR_DELTA[lDir].dx + fwd.dx, 0, GRID_SIZE - 1), y: clamp(p.y + DIR_DELTA[lDir].dy + fwd.dy, 0, GRID_SIZE - 1) },
        { x: clamp(p.x + DIR_DELTA[rDir].dx + fwd.dx, 0, GRID_SIZE - 1), y: clamp(p.y + DIR_DELTA[rDir].dy + fwd.dy, 0, GRID_SIZE - 1) },
      ];
      alivePlayers(state).forEach(eid => {
        if (eid === pid) return;
        const ep = state.players[eid];
        if (fan.some(f => f.x === ep.x && f.y === ep.y)) {
          if (ep.buffs.armorActive) {
            ep.buffs.armorActive = false;
            state.turnLog.push(`${ep.name} の装甲板が散弾を無効化`);
            pushEvent(state, { type: 'armor_block', pid: eid, public: false, to: eid });
          } else {
            applyDamage(state, eid, 1, 'shotgun', pid);
          }
        }
      });
      pushEvent(state, { type: 'attack_leak', pid, op: 'shotgun', dir: p.dir, public: true, fan: true });
      break;
    }
  }
}

function activateChaff(state, pid) {
  const p = state.players[pid];
  if ((p.inventory.chaff ?? 0) <= 0) return;
  p.inventory.chaff--;
  p.buffs.chaffActive = true;
  pushEvent(state, { type: 'buff', pid, op: 'chaff', public: false, to: pid });
  state.turnLog.push(`${p.name} がチャフを展開`);
}

function activateArmor(state, pid) {
  const p = state.players[pid];
  if ((p.inventory.armor ?? 0) <= 0) return;
  p.inventory.armor--;
  p.buffs.armorActive = true;
  pushEvent(state, { type: 'buff', pid, op: 'armor', public: false, to: pid });
  state.turnLog.push(`${p.name} が装甲板を展開`);
}

function resolveDecoy(state, pid, cmd) {
  const p = state.players[pid];
  const tx = cmd.target?.x ?? p.x;
  const ty = cmd.target?.y ?? p.y;
  state.decoys.push({ x: tx, y: ty, ownerId: pid, turnsLeft: 2 });
  pushEvent(state, { type: 'decoy', pid, x: tx, y: ty, public: false, to: pid });
  state.turnLog.push(`${p.name} がデコイを設置 (${tx},${ty})`);
}

function resolveMine(state, pid, cmd) {
  const p = state.players[pid];
  const tx = cmd.target?.x ?? p.x;
  const ty = cmd.target?.y ?? p.y;
  state.mines.push({ x: tx, y: ty, ownerId: pid });
  pushEvent(state, { type: 'mine_place', pid, x: tx, y: ty, public: false, to: pid });
  state.turnLog.push(`${p.name} が機雷を設置 (${tx},${ty})`);}

function fireTorpedoLine(state, pid, sx, sy, dir, range, damage) {
  const dl = DIR_DELTA[dir];
  let cx = sx, cy = sy, endX = sx, endY = sy;
  for (let i = 0; i < range; i++) {
    cx += dl.dx; cy += dl.dy;
    if (cx < 0 || cx >= GRID_SIZE || cy < 0 || cy >= GRID_SIZE) break;
    endX = cx; endY = cy;
    const hit = alivePlayers(state).find(eid => eid !== pid && state.players[eid].x === cx && state.players[eid].y === cy);
    if (hit) { applyDamage(state, hit, damage, 'torpedo', pid); break; }
  }
  return { endX, endY };
}

function resolveSupply(state, alive) {
  alive.forEach(pid => {
    const p = state.players[pid];
    for (const sp of state.supplyPoints) {
      if (p.x === sp.x && p.y === sp.y) {
        if (sp.type === 'ammo') {
          p.inventory = { ...INITIAL_INVENTORY };
          state.turnLog.push(`${p.name} が弾薬を全回復`);
        } else if (sp.type === 'repair') {
          p.hp = Math.min(p.hp + 1, p.maxHp);
          state.turnLog.push(`${p.name} がHP回復 (${p.hp}/${p.maxHp})`);
        }
        pushEvent(state, { type: 'supply', pid, supplyType: sp.type, public: false, to: pid });
      }
    }
  });
}

function checkMines(state, alive) {
  alive.forEach(pid => {
    const p = state.players[pid];
    state.mines = state.mines.filter(m => {
      if (m.x === p.x && m.y === p.y && m.ownerId !== pid) {
        applyDamage(state, pid, 1, 'mine', m.ownerId);
        pushEvent(state, { type: 'explosion', x: m.x, y: m.y, public: true });
        return false;
      }
      return true;
    });
  });
}

function resolveDogfight(state, alive) {
  alive.forEach(pid => {
    const p = state.players[pid];
    if (p.dogfightWith) {
      const other = state.players[p.dogfightWith];
      if (!other || !other.alive || chebyshev(p.x, p.y, other.x, other.y) > 4) {
        if (other) other.dogfightWith = null;
        p.dogfightWith = null;
        pushEvent(state, { type: 'dogfight_end', pid, public: false, to: pid });
      }
    }
  });
  if (state.turn <= 1) return;
  for (let i = 0; i < alive.length; i++) {
    for (let j = i + 1; j < alive.length; j++) {
      const a = state.players[alive[i]], b = state.players[alive[j]];
      if (a.dogfightWith || b.dogfightWith) continue;
      if (chebyshev(a.x, a.y, b.x, b.y) <= 3) {
        a.dogfightWith = alive[j];
        b.dogfightWith = alive[i];
        pushEvent(state, { type: 'dogfight_start', pids: [alive[i], alive[j]], public: false, to: alive[i] });
        pushEvent(state, { type: 'dogfight_start', pids: [alive[i], alive[j]], public: false, to: alive[j] });
      }
    }
  }
}

function resolveForwardWarning(state, alive) {
  alive.forEach(pid => {
    const p = state.players[pid];
    p.forwardWarning = null;
    const dl = DIR_DELTA[p.dir];
    for (let step = 1; step <= 3; step++) {
      const fx = p.x + dl.dx * step, fy = p.y + dl.dy * step;
      if (fx < 0 || fx >= GRID_SIZE || fy < 0 || fy >= GRID_SIZE) continue;
      if (alive.some(eid => eid !== pid && state.players[eid].x === fx && state.players[eid].y === fy)) {
        if (step === 1) p.forwardWarning = 'critical';
        else if (step === 2) p.forwardWarning = p.forwardWarning || 'near';
        else p.forwardWarning = p.forwardWarning || 'far';
      }
    }
  });
}

function checkEliminations(state) {
  state.playerOrder.forEach(id => {
    const p = state.players[id];
    if (p.alive && p.hp <= 0) {
      p.alive = false;
      p.respawning = true;
      if (p.dogfightWith) {
        const partner = state.players[p.dogfightWith];
        if (partner) partner.dogfightWith = null;
      }
      p.dogfightWith = null;
      pushEvent(state, { type: 'eliminated', pid: id, respawning: true, public: true });
    }
  });
  if (state.winner) state.phase = 'ended';
}

/* ============================================================
   5. 状態サニタイズ（霧戦争）
   ============================================================ */
export function sanitizeStateForPlayer(state, playerId) {
  const me = state.players[playerId];
  const safeZone = getSafeZone(state.turn);
  const players = {};
  state.playerOrder.forEach(id => {
    if (id === playerId) {
      players[id] = { ...state.players[id], inventory: { ...state.players[id].inventory } };
    } else {
      const o = state.players[id];
      const revealed = {
        id: o.id, name: o.name, alive: o.alive,
        kills: o.kills, respawning: o.respawning,
        dogfightWith: o.dogfightWith,
        commandConfirmed: o.commandConfirmed,
        hp: o.hp,
        x: undefined, y: undefined, dir: undefined,
      };
      if (me && me.dogfightWith === id && o.alive) {
        revealed.x = o.x; revealed.y = o.y; revealed.dir = o.dir;
      }
      if (!o.alive) revealed.hp = 0;
      players[id] = revealed;
    }
  });
  return {
    turn: state.turn, phase: state.phase, myId: playerId,
    players, playerOrder: state.playerOrder,
    supplyPoints: state.supplyPoints, safeZone,
    winner: state.winner, turnLog: state.turnLog,
    actionEvents: state.actionEvents.filter(e =>
      e.public || e.to === playerId || (Array.isArray(e.pids) && e.pids.includes(playerId))
    ),
    myMines: state.mines.filter(m => m.ownerId === playerId),
    myDecoys: state.decoys.filter(d => d.ownerId === playerId),
  };
}

/* ============================================================
   6. ユーティリティ
   ============================================================ */
function alivePlayers(state) {
  return state.playerOrder.filter(id => state.players[id].alive);
}
function allAliveDone(state, pred) {
  return state.playerOrder.every(id => !state.players[id].alive || pred(state.players[id]));
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function chebyshev(x1, y1, x2, y2) { return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)); }
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
  p.hp -= amount;
  pushEvent(state, { type: 'damage', pid, dmg: amount, source, attackerId, hp: p.hp, public: source !== 'mine' });
  state.turnLog.push(`${p.name} が ${source} で ${amount} ダメージ (HP:${p.hp})`);
  if (p.hp <= 0 && attackerId && state.players[attackerId]) {
    state.players[attackerId].kills++;
    state.turnLog.push(`${state.players[attackerId].name} がキル (計${state.players[attackerId].kills}キル)`);
    if (state.players[attackerId].kills >= WIN_KILLS) state.winner = attackerId;
  }
}
