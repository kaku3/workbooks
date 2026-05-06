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
  return { chaffActive: false };
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
   2. コマンドフェーズ―このファイルは状態初期化とアクション解決のみ。
   handleCommand / forceConfirmAll / advanceToNextTurn は
   gameSequence.js が担当する。
   ============================================================ */
/* ============================================================
   3. アクションフェーズ解決
   ─────────────────────────────────────────────────────
   タイムライン方式:
     各プレイヤーのコマンドに「累積コスト = 完了時刻 t」を付けて
     1本のリストに並べ、t 昇順で実行する。
     同一 t のコマンドは「同時に完了した」扱いでまとめて実行し、
     ティック境界（t が変わる瞬間）で機雷・ドッグファイト突入を判定。
     これにより「前進→ソナー」は前進後にソナーが動き、
     「前進の結果ドッグファイト範囲に入った」も正しく検出できる。
   ============================================================ */
export function resolveActions(state) {
  state.phase = 'action';
  state.actionPhaseStartedAt = Date.now();
  state.actionEvents = [];
  state.turnLog = [];
  const alive = alivePlayers(state);

  // 1) チャフ（コマンドを先読みして即時展開）
  alive.forEach(id => {
    for (const { op } of state.players[id].commandQueue) {
      if (op === 'chaff') activateChaff(state, id);
    }
  });

  // 2) タイムライン構築（累積コスト = 完了時刻）
  const timeline = [];
  for (const pid of alive) {
    let t = 0;
    for (const cmd of state.players[pid].commandQueue) {
      t += OPS[cmd.op]?.cost ?? 1;
      timeline.push({ t, pid, cmd });
    }
  }
  // t 昇順 → 同 t はプレイヤー順（決定論的）
  timeline.sort((a, b) =>
    a.t - b.t || state.playerOrder.indexOf(a.pid) - state.playerOrder.indexOf(b.pid)
  );

  // 3) タイムライン実行
  //    ティックが変わるたびに飛翔体前進 → 機雷トリガーとドッグファイト突入を判定する
  const projectiles = [];
  let projSeq = 0;
  let prevT = -1;
  for (const { t, pid, cmd } of timeline) {
    // ─ ティック境界: 飛翔体を1ステップ前進させてから衝突判定 ─
    if (t !== prevT && prevT >= 0) {
      _advanceProjectiles(state, projectiles);
      _tickEnterCheck(state);
    }
    prevT = t;

    if (!state.players[pid].alive) continue;
    const cat = OPS[cmd.op]?.cat;
    if      (cat === 'move')     resolveMove(state, pid, cmd);
    else if (cmd.op === 'sonar') resolveSonar(state, pid, cmd);
    else if (cat === 'weapon')   _spawnProjectile(state, pid, cmd, projectiles, projSeq++);
    else if (cmd.op === 'mine')  resolveMine(state, pid, cmd);
  }
  // 最終ティック後: 残存飛翔体を射程が尽きるまで前進させる
  for (let extra = 0; extra < GRID_SIZE && projectiles.length > 0; extra++) {
    _advanceProjectiles(state, projectiles);
  }
  _tickEnterCheck(state);

  // 4) 補給（全行動完了後）
  resolveSupply(state, alivePlayers(state));

  // 5) 在庫消費（chaff は activateChaff 内で消費済み）
  alive.forEach(id => {
    const p = state.players[id];
    const invUse = {};
    for (const { op } of p.commandQueue) {
      const opDef = OPS[op];
      if (opDef?.invKey && op !== 'chaff') {
        invUse[opDef.invKey] = (invUse[opDef.invKey] || 0) + 1;
      }
    }
    for (const [key, count] of Object.entries(invUse)) {
      p.inventory[key] = Math.max(0, (p.inventory[key] ?? 0) - count);
    }
  });

  // 6) 前方警戒
  resolveForwardWarning(state, alivePlayers(state));

  // 8) 脱落チェック
  checkEliminations(state);
}

/**
 * ティック境界での衝突・ドッグファイト判定
 * 順序: ドッグファイト離脱 → 突入 → 機雷トリガー
 * 「離脱した直後に別ペアに突入」を同一ティック内で正しく処理するため
 * 離脱を先に行う。
 */
function _tickEnterCheck(state) {
  const alive = alivePlayers(state);

  // 1) ドッグファイト離脱（先に判定）
  const exited = new Set();
  alive.forEach(pid => {
    const p = state.players[pid];
    if (!p.dogfightWith || exited.has(pid)) return;
    const other = state.players[p.dogfightWith];
    if (!other || !other.alive || chebyshev(p.x, p.y, other.x, other.y) > 4) {
      exited.add(pid);
      exited.add(p.dogfightWith);
      const partnerId = p.dogfightWith;
      if (other) other.dogfightWith = null;
      p.dogfightWith = null;
      pushEvent(state, { type: 'dogfight_end', pid,            public: false, to: pid });
      pushEvent(state, { type: 'dogfight_end', pid: partnerId, public: false, to: partnerId });
    }
  });

  // 2) ドッグファイト突入（離脱後に判定 / ターン1はスキップ）
  if (state.turn > 1) {
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        const a = state.players[alive[i]], b = state.players[alive[j]];
        if (a.dogfightWith === alive[j]) continue; // 既に同士ならスキップ
        if (a.dogfightWith || b.dogfightWith) continue; // 他と交戦中ならスキップ
        if (chebyshev(a.x, a.y, b.x, b.y) <= 3) {
          a.dogfightWith = alive[j];
          b.dogfightWith = alive[i];
          pushEvent(state, { type: 'dogfight_start', pids: [alive[i], alive[j]], public: false, to: alive[i] });
          pushEvent(state, { type: 'dogfight_start', pids: [alive[i], alive[j]], public: false, to: alive[j] });
        }
      }
    }
  }

  // 3) 機雷トリガー
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
  // public: true → 全端末で全プレイヤーのアニメーションを再生するために必要
  pushEvent(state, { type: 'move', pid, op: cmd.op, fromX, fromY, fromDir, x: p.x, y: p.y, dir: p.dir, public: true });
}

function resolveSonar(state, pid, cmd) {
  const p = state.players[pid];
  const cx = cmd.target?.x ?? p.x;
  const cy = cmd.target?.y ?? p.y;
  const r = 1;  // Chebyshev1（前ステップで移動より先に解決するため1で十分）
  const hits = [];
  findEnemiesInRadius(state, pid, cx, cy, r).forEach(ep => {
    const hit = { x: ep.x, y: ep.y, playerId: ep.id, expiresAfterTurn: state.turn + 1 };
    p.sonarResults.push(hit);
    hits.push(hit);
    // 検知された側に警告イベントを通知
    pushEvent(state, { type: 'sonar_detected', pid: ep.id, detectedBy: pid, public: false, to: ep.id });
  });
  pushEvent(state, { type: 'sonar', pid, op: 'sonar', cx, cy, r, hits, public: false, to: pid });
}

/* ── 飛翔体スポーン・管理 ─────────────────────────────────── */
const TORPEDO_RANGE = 8;
const GUIDED_RANGE  = 12;
/** 追尾魚雷の角度修正間隔（ティック数）― 導いほど追尾強度が強まる */
const GUIDED_REROUTE_INTERVAL = 4;
/** 追尾魚雷が追尾を終了する移動歩数（これを超えたら結果が変わらない） */
const GUIDED_TRACK_STEPS = 6;

/**
 * 武器コマンドを飛翔体として登録する。
 * 実際のダメージは _advanceProjectiles() 内のヒット判定で発生する。
 */
function _spawnProjectile(state, pid, cmd, projectiles, seq) {
  const p = state.players[pid];
  const projId = `pj${seq}`;
  if (cmd.op === 'torpedo') {
    const tx = cmd.target?.x != null ? Math.round(Number(cmd.target.x)) : null;
    const ty = cmd.target?.y != null ? Math.round(Number(cmd.target.y)) : null;
    if (tx == null || ty == null) return;
    const td = DIR_DELTA[p.dir];
    const tFwd   = (tx - p.x) * td.dx + (ty - p.y) * td.dy;
    const tCross = Math.abs((tx - p.x) * td.dy - (ty - p.y) * td.dx);
    if (tFwd <= 0 || tCross > tFwd) return;
    const path = _computeProjPath(p.x, p.y, tx, ty, TORPEDO_RANGE);
    projectiles.push({ id: projId, type: 'torpedo', ownerId: pid, x: p.x, y: p.y, path, pathIdx: 0, damage: 2 });
    pushEvent(state, { type: 'torpedo_fire', pid, projId, sx: p.x, sy: p.y, tx, ty, public: true });
    state.turnLog.push(`${p.name} が魚雷を発射 (→${tx},${ty})`);
  } else if (cmd.op === 'guided') {
    const tx = cmd.target?.x != null ? Math.round(Number(cmd.target.x)) : p.x;
    const ty = cmd.target?.y != null ? Math.round(Number(cmd.target.y)) : p.y;
    const gd = DIR_DELTA[p.dir];
    const fwdDot  = (tx - p.x) * gd.dx + (ty - p.y) * gd.dy;
    const crossMag = Math.abs((tx - p.x) * gd.dy - (ty - p.y) * gd.dx);
    if (fwdDot <= 0 || crossMag > fwdDot) return;
    const path = _computeProjPath(p.x, p.y, tx, ty, GUIDED_RANGE);
    projectiles.push({ id: projId, type: 'guided', ownerId: pid, x: p.x, y: p.y, path, pathIdx: 0, damage: 1, targetX: tx, targetY: ty, rerouteTick: 0, stepCount: 0, prevX: p.x, prevY: p.y });
    pushEvent(state, { type: 'guided_fire', pid, projId, sx: p.x, sy: p.y, tx, ty, public: true });
    state.turnLog.push(`${p.name} が追尾魚雷を発射 (→${tx},${ty})`);
  } else if (cmd.op === 'shotgun') {
    const fwd  = DIR_DELTA[p.dir];
    const lDir = rotateDir(p.dir, -1), rDir = rotateDir(p.dir, 1);
    [
      [clamp(p.x + fwd.dx,                              0, GRID_SIZE - 1), clamp(p.y + fwd.dy,                              0, GRID_SIZE - 1)],
      [clamp(p.x + DIR_DELTA[lDir].dx + fwd.dx,         0, GRID_SIZE - 1), clamp(p.y + DIR_DELTA[lDir].dy + fwd.dy,         0, GRID_SIZE - 1)],
      [clamp(p.x + DIR_DELTA[rDir].dx + fwd.dx,         0, GRID_SIZE - 1), clamp(p.y + DIR_DELTA[rDir].dy + fwd.dy,         0, GRID_SIZE - 1)],
    ].forEach(([tx, ty], i) => {
      projectiles.push({ id: `${projId}_${i}`, type: 'shotgun', ownerId: pid, x: p.x, y: p.y,
        path: _computeProjPath(p.x, p.y, tx, ty, 1), pathIdx: 0, damage: 1 });
    });
    pushEvent(state, { type: 'shotgun_fire', pid, projId, dir: p.dir, sx: p.x, sy: p.y, public: true });
    state.turnLog.push(`${p.name} が散弾を発射`);
  }
}

/**
 * atan2 で発射元→目標の角度を求め、直線補間で最大 maxSteps セル分の経路を返す。
 * 各ステップは「スタートから i × (cos・sin) 進んだ位置を Math.round」で決定。
 * 隔逸ステップが同一セルになる場合は重複を除去（斜め方向で自然発生）。
 * 目標を超えても同方向で直進。盤外 or maxSteps で経路終端。
 */
function _computeProjPath(sx, sy, tx, ty, maxSteps) {
  if (sx === tx && sy === ty) return [];
  const angle = Math.atan2(ty - sy, tx - sx);
  const cosA = Math.cos(angle), sinA = Math.sin(angle);
  const path = [];
  let prevX = sx, prevY = sy;
  for (let i = 1; i <= maxSteps; i++) {
    const nx = Math.round(sx + cosA * i);
    const ny = Math.round(sy + sinA * i);
    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) break;
    if (nx !== prevX || ny !== prevY) {
      path.push({ x: nx, y: ny });
      prevX = nx; prevY = ny;
    }
  }
  return path;
}

/**
 * 全飛翔体を 1 ステップ前進させ、ヒット/射程切れを処理する。
 */
function _advanceProjectiles(state, projectiles) {
  const toRemove = new Set();
  for (const proj of projectiles) {
    if (toRemove.has(proj.id)) continue;

    // 追尾魚雷: GUIDED_REROUTE_INTERVAL ティックかぞに角度修正
    if (proj.type === 'guided') {
      proj.stepCount = (proj.stepCount ?? 0) + 1;
      _rerouteGuided(proj, state);
    }

    if (proj.pathIdx >= proj.path.length) {
      pushEvent(state, { type: 'projectile_miss', projId: proj.id, projType: proj.type, ownerId: proj.ownerId, x: proj.x, y: proj.y, public: true });
      toRemove.add(proj.id);
      continue;
    }
    const next = proj.path[proj.pathIdx++];
    proj.x = next.x; proj.y = next.y;
    const hit = alivePlayers(state).find(eid =>
      eid !== proj.ownerId && state.players[eid].x === proj.x && state.players[eid].y === proj.y
    );
    if (hit) {
      if (proj.type === 'guided' && state.players[hit].buffs.chaffActive) {
        state.players[hit].buffs.chaffActive = false;
        state.turnLog.push(`${state.players[hit].name} のチャフが追尾魚雷を無効化`);
        pushEvent(state, { type: 'chaff_block',    pid: hit,        public: false, to: hit });
        pushEvent(state, { type: 'projectile_hit', projId: proj.id, projType: proj.type, ownerId: proj.ownerId, x: proj.x, y: proj.y, blocked: true, public: true });
      } else {
        applyDamage(state, hit, proj.damage, proj.type, proj.ownerId);
        pushEvent(state, { type: 'projectile_hit', projId: proj.id, projType: proj.type, ownerId: proj.ownerId, x: proj.x, y: proj.y, public: true });
      }
      toRemove.add(proj.id);
    } else {
      pushEvent(state, { type: 'projectile_tick', projId: proj.id, projType: proj.type, ownerId: proj.ownerId, x: proj.x, y: proj.y, public: true });
    }
  }
  for (const id of toRemove) {
    const i = projectiles.findIndex(p => p.id === id);
    if (i >= 0) projectiles.splice(i, 1);
  }
}

/**
 * 追尾魚雷: `GUIDED_REROUTE_INTERVAL` ティックごとに最近傍敵への角度を atan2 で再計算する。
 * 恵瓟インターバル内は元の経路をなぞる。
 */
function _rerouteGuided(proj, state) {
  // 追尾射程外（GUIDED_TRACK_STEPS 超過）は追尾しない
  if ((proj.stepCount ?? 0) > GUIDED_TRACK_STEPS) return;

  proj.rerouteTick = (proj.rerouteTick ?? 0) + 1;
  if (proj.rerouteTick % GUIDED_REROUTE_INTERVAL !== 0) return;

  let nearest = null, bestDist = Infinity;
  alivePlayers(state).forEach(eid => {
    if (eid === proj.ownerId) return;
    const ep = state.players[eid];
    const d = Math.hypot(ep.x - proj.x, ep.y - proj.y);
    if (d < bestDist) { nearest = ep; bestDist = d; }
  });
  if (!nearest) return;

  // 現在の進行角度（prevX/prevY から計算）
  const prevX = proj.prevX ?? proj.x, prevY = proj.prevY ?? proj.y;
  const curAngle = Math.atan2(proj.y - prevY, proj.x - prevX);
  // 新角度（目標への方向）
  const newAngle = Math.atan2(nearest.y - proj.y, nearest.x - proj.x);
  // 角度差を -π〜+π に正規化
  let delta = newAngle - curAngle;
  while (delta >  Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const MAX_TURN = Math.PI / 4; // ±45度

  let finalAngle;
  if (Math.abs(delta) <= MAX_TURN) {
    finalAngle = newAngle;
  } else {
    finalAngle = curAngle + Math.sign(delta) * MAX_TURN;
  }

  // clamp後の角度で終点を計算して経路再計算
  const targetX = Math.round(proj.x + Math.cos(finalAngle) * GUIDED_RANGE);
  const targetY = Math.round(proj.y + Math.sin(finalAngle) * GUIDED_RANGE);
  const newPath = _computeProjPath(proj.x, proj.y, targetX, targetY, GUIDED_RANGE);
  if (newPath.length > 0) { proj.path = newPath; proj.pathIdx = 0; }
  proj.targetX = nearest.x; proj.targetY = nearest.y;
  // 次ティックの角度計算用に現在位置を保存
  proj.prevX = proj.x; proj.prevY = proj.y;
}

function activateChaff(state, pid) {
  const p = state.players[pid];
  if ((p.inventory.chaff ?? 0) <= 0) return;
  p.inventory.chaff--;
  p.buffs.chaffActive = true;
  pushEvent(state, { type: 'buff', pid, op: 'chaff', public: false, to: pid });
  state.turnLog.push(`${p.name} がチャフを展開`);
}

function resolveMine(state, pid, cmd) {
  const p = state.players[pid];
  const tx = cmd.target?.x ?? p.x;
  const ty = cmd.target?.y ?? p.y;
  state.mines.push({ x: tx, y: ty, ownerId: pid });
  pushEvent(state, { type: 'mine_place', pid, x: tx, y: ty, public: false, to: pid });
  state.turnLog.push(`${p.name} が機雷を設置 (${tx},${ty})`);}

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

  // ソナー検知中の敵プレイヤーIDセット（次ターンのコマンド・行動フェーズ中も見える）
  const sonarVisible = new Set(
    (me?.sonarResults || []).map(r => r.playerId)
  );

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
      // ドッグファイト中は相手座標・コマンドを公開
      if (me && me.dogfightWith === id && o.alive) {
        revealed.x = o.x; revealed.y = o.y; revealed.dir = o.dir;
        revealed.commandQueue = o.commandQueue;
      }
      // ソナー検知中は次ターンまで座標を公開
      if (sonarVisible.has(id) && o.alive) {
        revealed.x = o.x; revealed.y = o.y;
        revealed.sonarDetected = true;
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
    actionPhaseStartedAt: state.actionPhaseStartedAt,
    actionEvents: state.actionEvents.filter(e =>
      e.public || e.to === playerId || (Array.isArray(e.pids) && e.pids.includes(playerId))
    ),
    myMines: state.mines.filter(m => m.ownerId === playerId),
    // 自機からチェビシェフ3マス以内の敵機雷・近接敵
    nearbyMines: state.mines.filter(m => m.ownerId !== playerId && me && chebyshev(me.x, me.y, m.x, m.y) <= 3),
    nearbyEnemies: (() => {
      if (!me) return [];
      return state.playerOrder
        .filter(id => id !== playerId && state.players[id].alive)
        .map(id => state.players[id])
        .filter(ep => chebyshev(me.x, me.y, ep.x, ep.y) <= 3)
        .map(ep => ({ id: ep.id, name: ep.name, x: ep.x, y: ep.y, dir: ep.dir }));
    })(),
  };
}

/* ============================================================
   6. ユーティリティ（gameSequence.js からも使用するため export）
   ============================================================ */
export function alivePlayers(state) {
  return state.playerOrder.filter(id => state.players[id].alive);
}
export function allAliveDone(state, pred) {
  return state.playerOrder.every(id => !state.players[id].alive || pred(state.players[id]));
}
export function pushEvent(state, ev) { state.actionEvents.push(ev); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function chebyshev(x1, y1, x2, y2) { return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)); }
function findEnemiesInRadius(state, pid, cx, cy, r) {
  return alivePlayers(state)
    .filter(eid => eid !== pid)
    .map(eid => state.players[eid])
    .filter(ep => chebyshev(cx, cy, ep.x, ep.y) <= r);
}

function applyDamage(state, pid, amount, source, attackerId) {
  const p = state.players[pid];
  if (!p.alive) return;
  p.hp -= amount;
  pushEvent(state, { type: 'damage', pid, dmg: amount, source, attackerId, hp: p.hp, public: source !== 'mine' });
  const _sourceLabel = { torpedo: '魚雷', guided: '追尾魚雷', shotgun: '散弾', mine: '機雷', shrink: '収縮' };
  state.turnLog.push(`${p.name} が ${_sourceLabel[source] || source} で ${amount} ダメージ (HP:${p.hp})`);
  if (p.hp <= 0 && attackerId && state.players[attackerId]) {
    state.players[attackerId].kills++;
    state.turnLog.push(`${state.players[attackerId].name} がキル (計${state.players[attackerId].kills}キル)`);
    if (state.players[attackerId].kills >= WIN_KILLS) state.winner = attackerId;
  }
}
