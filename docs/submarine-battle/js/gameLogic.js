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
  const supplyVisited = new Map();
  let projSeq = 0;
  let prevT = -1;
  let i = 0;
  while (i < timeline.length) {
    const t = timeline[i].t;
    const batch = [];
    while (i < timeline.length && timeline[i].t === t) {
      batch.push(timeline[i]);
      i++;
    }

    // ─ ティック境界: 飛翔体を1ステップ前進させてから衝突判定 ─
    if (prevT >= 0) {
      const plannedTrails = _buildPlannedMoveTrails(state, batch);
      _advanceProjectiles(state, projectiles, plannedTrails);
      _tickEnterCheck(state);
    }
    prevT = t;

    for (const { pid, cmd } of batch) {
      if (!state.players[pid].alive) continue;
      const opDef = OPS[cmd.op];
      if (opDef?.invKey && cmd.op !== 'chaff') {
        const inv = state.players[pid].inventory;
        if ((inv[opDef.invKey] ?? 0) <= 0) continue;
        inv[opDef.invKey]--;
      }
      const cat = opDef?.cat;
      if      (cat === 'move')     { resolveMove(state, pid, cmd); resolveSupplyAtPosition(state, pid, supplyVisited); }
      else if (cmd.op === 'sonar') resolveSonar(state, pid, cmd);
      else if (cat === 'weapon')   _spawnProjectile(state, pid, cmd, projectiles, projSeq++);
      else if (cmd.op === 'mine')  resolveMine(state, pid, cmd);
    }
  }
  // 最終ティック後: 残存飛翔体を射程が尽きるまで前進させる
  for (let extra = 0; extra < GRID_SIZE && projectiles.length > 0; extra++) {
    _advanceProjectiles(state, projectiles);
  }
  _tickEnterCheck(state);

  // 4) 最終位置で補給（行動中に通過した補給点は既に適用済み。重複適用はしない）
  alivePlayers(state).forEach(pid => resolveSupplyAtPosition(state, pid, supplyVisited));

  // 5) 前方警戒
  resolveForwardWarning(state, alivePlayers(state));

  // 6) 脱落チェック
  checkEliminations(state);
}

function _buildPlannedMoveTrails(state, batch) {
  const trails = {};
  for (const { pid, cmd } of batch) {
    const p = state.players[pid];
    if (!p?.alive) continue;
    const cat = OPS[cmd?.op]?.cat;
    if (cat !== 'move') continue;
    const next = _predictMoveResult(p, cmd?.op);
    if (!next) continue;
    if (next.x === p.x && next.y === p.y) continue;
    trails[pid] = { x0: p.x, y0: p.y, x1: next.x, y1: next.y };
  }
  return trails;
}

function _predictMoveResult(player, op) {
  const p = { x: player.x, y: player.y, dir: player.dir };
  switch (op) {
    case 'forward':
      p.x = clamp(p.x + DIR_DELTA[p.dir].dx, 0, GRID_SIZE - 1);
      p.y = clamp(p.y + DIR_DELTA[p.dir].dy, 0, GRID_SIZE - 1);
      return { x: p.x, y: p.y };
    case 'turn_left':
    case 'turn_right':
      return { x: p.x, y: p.y };
    case 'strafe_l': {
      const d = DIR_DELTA[rotateDir(p.dir, -1)];
      return { x: clamp(p.x + d.dx, 0, GRID_SIZE - 1), y: clamp(p.y + d.dy, 0, GRID_SIZE - 1) };
    }
    case 'strafe_r': {
      const d = DIR_DELTA[rotateDir(p.dir, 1)];
      return { x: clamp(p.x + d.dx, 0, GRID_SIZE - 1), y: clamp(p.y + d.dy, 0, GRID_SIZE - 1) };
    }
    default:
      return null;
  }
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
      pushEvent(state, { type: 'dogfight_end', pid, otherId: partnerId, public: false, to: pid });
      pushEvent(state, { type: 'dogfight_end', pid: partnerId, otherId: pid, public: false, to: partnerId });
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
  // fog-of-war: 移動後の位置を観測できるプレイヤーにのみ公開
  const aliveNow = alivePlayers(state);
  const seenBy = aliveNow.filter(obsId =>
    canObservePosition(state, obsId, pid, { includeDogfight: false, includeSonar: true })
  );
  const moveEv = { type: 'move', pid, op: cmd.op, fromX, fromY, fromDir, x: p.x, y: p.y, dir: p.dir };
  if (seenBy.length === aliveNow.length) {
    pushEvent(state, { ...moveEv, public: true });
  } else {
    pushEvent(state, { ...moveEv, public: false, pids: seenBy });
  }
}

function resolveSonar(state, pid, cmd) {
  const p = state.players[pid];
  const cx = cmd.target?.x ?? p.x;
  const cy = cmd.target?.y ?? p.y;
  const r = 1;  // Chebyshev1（前ステップで移動より先に解決するため1で十分）
  const hits = [];
  findEnemiesInRadius(state, pid, cx, cy, r).forEach(ep => {
    const hit = { x: ep.x, y: ep.y, playerId: ep.id, expiresAfterTurn: state.turn + 1 };
    const hasSameTarget = (p.sonarResults || []).some(r0 => r0.playerId === ep.id && r0.expiresAfterTurn >= state.turn);
    if (!hasSameTarget) p.sonarResults.push(hit);
    hits.push(hit);
    // 検知された側に警告イベントを通知
    pushEvent(state, { type: 'sonar_detected', pid: ep.id, detectedBy: pid, public: false, to: ep.id });
  });
  pushEvent(state, { type: 'sonar', pid, op: 'sonar', cx, cy, r, hits, public: false, to: pid });
}

/* ── 飛翔体スポーン・管理 ─────────────────────────────────── */
const TORPEDO_RANGE = 8;
const GUIDED_RANGE  = 12;
/** 追尾魚雷の角度修正間隔（ティック数）― 小さいほど追尾強度が強まる */
const GUIDED_REROUTE_INTERVAL = 4;
/** 追尾魚雷が追尾を終了する移動歩数（これを超えたら追尾しない） */
const GUIDED_TRACK_STEPS = 6;
/** ヒット判定半径（グリッド単位）― プレイヤー座標との距離がこれ未満で命中 */
const HIT_RADIUS = 0.6;

/**
 * 武器コマンドを飛翔体として登録する。
 * 飛翔体は angle（ラジアン）と distTraveled（移動済み距離）で管理し、
 * 毎ティック cos/sin で 1 単位前進する（グリッド座標は浮動小数）。
 * ヒット判定は Math.hypot(player.x - proj.x, player.y - proj.y) < HIT_RADIUS。
 */
function _spawnProjectile(state, pid, cmd, projectiles, seq) {
  const p = state.players[pid];
  const projId = `pj${seq}`;
  if (cmd.op === 'torpedo') {
    const tx = cmd.target?.x != null ? Number(cmd.target.x) : null;
    const ty = cmd.target?.y != null ? Number(cmd.target.y) : null;
    if (tx == null || ty == null) return;
    const td = DIR_DELTA[p.dir];
    const tFwd   = (tx - p.x) * td.dx + (ty - p.y) * td.dy;
    const tCross = Math.abs((tx - p.x) * td.dy - (ty - p.y) * td.dx);
    if (tFwd <= 0 || tCross > tFwd) return;
    const angle = Math.atan2(ty - p.y, tx - p.x);
    projectiles.push({ id: projId, type: 'torpedo', ownerId: pid,
      x: p.x, y: p.y, angle, distMax: TORPEDO_RANGE, distTraveled: 0, damage: 2 });
    pushEvent(state, { type: 'torpedo_fire', pid, projId, sx: p.x, sy: p.y, tx, ty, public: true });
    state.turnLog.push(`${p.name} が魚雷を発射 (→${toCellLabel(tx, ty)})`);
  } else if (cmd.op === 'guided') {
    const tx = cmd.target?.x != null ? Number(cmd.target.x) : p.x;
    const ty = cmd.target?.y != null ? Number(cmd.target.y) : p.y;
    const gd = DIR_DELTA[p.dir];
    const fwdDot   = (tx - p.x) * gd.dx + (ty - p.y) * gd.dy;
    const crossMag = Math.abs((tx - p.x) * gd.dy - (ty - p.y) * gd.dx);
    if (fwdDot <= 0 || crossMag > fwdDot) return;
    const angle = Math.atan2(ty - p.y, tx - p.x);
    projectiles.push({ id: projId, type: 'guided', ownerId: pid,
      x: p.x, y: p.y, angle, distMax: GUIDED_RANGE, distTraveled: 0, damage: 1,
      rerouteTick: 0, stepCount: 0 });
    pushEvent(state, { type: 'guided_fire', pid, projId, sx: p.x, sy: p.y, tx, ty, public: true });
    state.turnLog.push(`${p.name} が追尾魚雷を発射 (→${toCellLabel(tx, ty)})`);
  } else if (cmd.op === 'shotgun') {
    const fwd  = DIR_DELTA[p.dir];
    const lDir = rotateDir(p.dir, -1), rDir = rotateDir(p.dir, 1);
    [
      [fwd.dx,                                        fwd.dy                                       ],
      [DIR_DELTA[lDir].dx + fwd.dx,                   DIR_DELTA[lDir].dy + fwd.dy                  ],
      [DIR_DELTA[rDir].dx + fwd.dx,                   DIR_DELTA[rDir].dy + fwd.dy                  ],
    ].forEach(([ddx, ddy], i) => {
      const angle = Math.atan2(ddy, ddx);
      projectiles.push({ id: `${projId}_${i}`, type: 'shotgun', ownerId: pid,
        x: p.x, y: p.y, angle, distMax: 1.5, distTraveled: 0, damage: 1 });
    });
    pushEvent(state, { type: 'shotgun_fire', pid, projId, dir: p.dir, sx: p.x, sy: p.y, public: true });
    state.turnLog.push(`${p.name} が散弾を発射`);
  }
}

/**
 * 全飛翔体を 1 ステップ（1グリッド単位）前進させ、ヒット/射程切れを処理する。
 * 飛翔体の x/y は浮動小数グリッド座標。ヒット判定は距離 < HIT_RADIUS。
 */
function _advanceProjectiles(state, projectiles, plannedMoveTrails = null) {
  const toRemove = new Set();
  const hitRadiusSq = HIT_RADIUS * HIT_RADIUS;

  for (const proj of projectiles) {
    if (toRemove.has(proj.id)) continue;

    // 追尾魚雷: GUIDED_REROUTE_INTERVAL ティックごとに角度修正
    if (proj.type === 'guided') {
      proj.stepCount = (proj.stepCount ?? 0) + 1;
      _rerouteGuided(proj, state);
    }

    // 前進（1グリッド単位）
    const prevX = proj.x;
    const prevY = proj.y;
    proj.x += Math.cos(proj.angle);
    proj.y += Math.sin(proj.angle);
    proj.distTraveled = (proj.distTraveled ?? 0) + 1;

    // 射程切れ or 盤外
    if (proj.distTraveled >= proj.distMax ||
        proj.x < -0.5 || proj.x >= GRID_SIZE - 0.5 ||
        proj.y < -0.5 || proj.y >= GRID_SIZE - 0.5) {
      pushEvent(state, { type: 'projectile_miss', projId: proj.id, projType: proj.type, ownerId: proj.ownerId, x: proj.x, y: proj.y, public: true });
      toRemove.add(proj.id);
      continue;
    }

    // 機雷に命中したら機雷を破壊し、飛翔体も消える
    const hitMineIdx = state.mines.findIndex(m => distSq(m.x, m.y, proj.x, proj.y) < hitRadiusSq);
    if (hitMineIdx >= 0) {
      const mine = state.mines[hitMineIdx];
      state.mines.splice(hitMineIdx, 1);
      pushEvent(state, { type: 'explosion', x: mine.x, y: mine.y, public: true });
      state.turnLog.push(`機雷 ${toCellLabel(mine.x, mine.y)} が攻撃で破壊された`);
      toRemove.add(proj.id);
      continue;
    }

    // ヒット判定（距離ベース）
    let hit = null;
    for (const eid of alivePlayers(state)) {
      if (eid === proj.ownerId) continue;
      const ep = state.players[eid];
      if (!ep?.alive) continue;
      if (distSq(ep.x, ep.y, proj.x, proj.y) < hitRadiusSq) {
        hit = eid;
        break;
      }
      const trail = plannedMoveTrails?.[eid];
      if (!trail) continue;
      if (_projectileCrossesMovingTarget(prevX, prevY, proj.x, proj.y, trail, hitRadiusSq)) {
        hit = eid;
        break;
      }
    }

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

function distSq(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function pointToSegmentDistSq(px, py, x1, y1, x2, y2) {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;
  const c1 = vx * wx + vy * wy;
  if (c1 <= 0) return distSq(px, py, x1, y1);
  const c2 = vx * vx + vy * vy;
  if (c2 <= c1) return distSq(px, py, x2, y2);
  const b = c1 / c2;
  const bx = x1 + b * vx;
  const by = y1 + b * vy;
  return distSq(px, py, bx, by);
}

function _projectileCrossesMovingTarget(px0, py0, px1, py1, trail, hitRadiusSq) {
  const tx0 = trail.x0;
  const ty0 = trail.y0;
  const tx1 = trail.x1;
  const ty1 = trail.y1;

  const projDx = px1 - px0;
  const projDy = py1 - py0;
  const trgDx = tx1 - tx0;
  const trgDy = ty1 - ty0;

  const relX = px0 - tx0;
  const relY = py0 - ty0;
  const relVx = projDx - trgDx;
  const relVy = projDy - trgDy;

  const vv = relVx * relVx + relVy * relVy;
  if (vv === 0) return relX * relX + relY * relY <= hitRadiusSq;

  const t = Math.max(0, Math.min(1, - (relX * relVx + relY * relVy) / vv));
  const cx = relX + relVx * t;
  const cy = relY + relVy * t;
  if (cx * cx + cy * cy <= hitRadiusSq) return true;

  return false;
}

/**
 * 追尾魚雷: GUIDED_REROUTE_INTERVAL ティックごとに最近傍敵方向へ angle を更新する。
 * ±45度の旋回制限あり。GUIDED_TRACK_STEPS を超えたら追尾停止。
 */
function _rerouteGuided(proj, state) {
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

  const newAngle = Math.atan2(nearest.y - proj.y, nearest.x - proj.x);
  let delta = newAngle - proj.angle;
  while (delta >  Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const MAX_TURN = Math.PI / 4; // ±45度
  proj.angle = proj.angle + Math.sign(delta) * Math.min(Math.abs(delta), MAX_TURN);
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
  state.turnLog.push(`${p.name} が機雷を設置 (${toCellLabel(tx, ty)})`);
}

function resolveSupplyAtPosition(state, pid, supplyVisited) {
  const p = state.players[pid];
  if (!p?.alive) return;
  if (!supplyVisited.has(pid)) supplyVisited.set(pid, new Set());
  const visited = supplyVisited.get(pid);

  for (const sp of state.supplyPoints) {
    if (p.x !== sp.x || p.y !== sp.y) continue;
    const key = `${sp.x},${sp.y}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (sp.type === 'ammo') {
      p.inventory = { ...INITIAL_INVENTORY };
      state.turnLog.push(`${p.name} が ${toCellLabel(sp.x, sp.y)} で弾薬を全回復`);
    } else if (sp.type === 'repair') {
      p.hp = Math.min(p.hp + 1, p.maxHp);
      state.turnLog.push(`${p.name} が ${toCellLabel(sp.x, sp.y)} でHP回復 (${p.hp}/${p.maxHp})`);
    }
    pushEvent(state, { type: 'supply', pid, supplyType: sp.type, x: sp.x, y: sp.y, public: false, to: pid });
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
      pushEvent(state, { type: 'eliminated', pid: id, x: p.x, y: p.y, respawning: true, public: true });
    }
  });
  // phase='ended' への遷移は advanceToNextTurn（アニメ完了後）で行う
  // → クライアントが先にアニメを再生してから勝利画面を表示できる
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
      // ドッグファイト / 近接 / ソナー検知に応じて相手座標を公開
      if (o.alive && canObservePosition(state, playerId, id, { includeDogfight: true, includeSonar: true })) {
        revealed.x = o.x; revealed.y = o.y; revealed.dir = o.dir;
      }
      // 死亡プレイヤー（respawning=true）は座標を公開（アニメーション巧し辺みのため、霧戦不要）
      if (!o.alive && o.respawning) {
        revealed.x = o.x; revealed.y = o.y; revealed.dir = o.dir;
      }
      // ソナー検知中の表示フラグ（UI表示用）
      if (isSonarTrackedBy(state, playerId, id) && o.alive) {
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
    actionEvents: state.actionEvents.filter(e => isEventVisibleToPlayer(e, playerId)),
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

function isEventVisibleToPlayer(event, playerId) {
  return event.public || event.to === playerId ||
    (Array.isArray(event.pids) && event.pids.includes(playerId));
}

function isSonarTrackedBy(state, observerId, targetId) {
  const obs = state.players[observerId];
  if (!obs || observerId === targetId) return false;
  return (obs.sonarResults || []).some(r => r.playerId === targetId);
}

function canObservePosition(state, observerId, targetId, options = {}) {
  const { includeDogfight = true, includeSonar = true } = options;
  if (observerId === targetId) return true;
  const observer = state.players[observerId];
  const target = state.players[targetId];
  if (!observer || !target) return false;
  if (typeof observer.x !== 'number' || typeof observer.y !== 'number') return false;
  if (typeof target.x !== 'number' || typeof target.y !== 'number') return false;
  if (includeDogfight && observer.dogfightWith === targetId) return true;
  if (chebyshev(observer.x, observer.y, target.x, target.y) <= 3) return true;
  return includeSonar && isSonarTrackedBy(state, observerId, targetId);
}

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
  if (!p.alive || p.hp <= 0) return;  // 死亡済み or 既にHP0（同ティック重複ヒット防止）
  p.hp -= amount;
  pushEvent(state, { type: 'damage', pid, dmg: amount, source, attackerId, hp: p.hp, public: source !== 'mine' });
  const _sourceLabel = { torpedo: '魚雷', guided: '追尾魚雷', shotgun: '散弾', mine: '機雷', shrink: '収縮' };
  state.turnLog.push(`${p.name} が ${_sourceLabel[source] || source} で ${amount} ダメージ (HP:${p.hp})`);
  if (p.hp <= 0 && attackerId && state.players[attackerId]) {
    state.players[attackerId].kills++;
    state.turnLog.push(`${state.players[attackerId].name} がキル (計${state.players[attackerId].kills}キル)`);
    if (state.players[attackerId].kills >= WIN_KILLS) state.winner = attackerId;
  }

  if (p.hp <= 0) {
    eliminatePlayer(state, pid);
  }
}

function eliminatePlayer(state, id) {
  const p = state.players[id];
  if (!p || !p.alive) return;
  p.alive = false;
  p.respawning = true;
  if (p.dogfightWith) {
    const partner = state.players[p.dogfightWith];
    if (partner) partner.dogfightWith = null;
  }
  p.dogfightWith = null;
  pushEvent(state, { type: 'eliminated', pid: id, x: p.x, y: p.y, respawning: true, public: true });
}

function toCellLabel(x, y) {
  const col = String.fromCharCode(65 + Number(x));
  const row = Number(y) + 1;
  return `${col}${row}`;
}
