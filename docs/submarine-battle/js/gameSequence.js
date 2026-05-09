// ============================================================
// gameSequence.js  フェーズ進行管理
//   ゲームロジック（gameLogic.js）と分離し、
//   コマンド確定・フェーズ遷移・ターン進行のみを担う。
// ============================================================
import { OPS, INITIAL_HP, INITIAL_INVENTORY, BASE_TIME, GRID_SIZE, DIR_DELTA, rotateDir } from './constants.js';
import { resolveActions, alivePlayers, allAliveDone, pushEvent } from './gameLogic.js';

/* ============================================================
   コスト計算
   ============================================================ */
export function calcTimeCost(opIds) {
  return opIds.reduce((sum, id) => sum + (OPS[id]?.cost ?? 0), 0);
}

/* ============================================================
   コマンド確定（各プレイヤーがコマンドフェーズに呼ぶ）
   ============================================================ */
export function handleCommand(state, playerId, opIds, targets) {
  const p = state.players[playerId];
  if (!p || !p.alive || state.phase !== 'command') return false;
  if (!opIds.every(id => !!OPS[id])) return false;
  const cost = calcTimeCost(opIds);
  if (cost > p.time) return false;

  // 在庫確認（移動中の補給通過を考慮した逐次判定）
  if (!_canQueueWithSupply(state, p, opIds)) return false;

  p.commandQueue = opIds.map((op, i) => ({ op, target: targets[i] || {} }));
  p.commandConfirmed = true;

  // 全員確定したらアクションフェーズへ
  if (allAliveDone(state, pl => pl.commandConfirmed)) {
    resolveActions(state);
  }
  return true;
}

function _canQueueWithSupply(state, p, opIds) {
  const v = {
    x: p.x,
    y: p.y,
    dir: p.dir,
    inventory: { ...p.inventory },
  };

  for (const id of opIds) {
    const op = OPS[id];
    if (!op) return false;

    if (op.invKey) {
      if ((v.inventory[op.invKey] ?? 0) <= 0) return false;
      v.inventory[op.invKey]--;
    }

    if (op.cat === 'move') {
      _applyVirtualMove(v, op.id);
      _applyVirtualSupply(v, state.supplyPoints || []);
    }
  }
  return true;
}

function _applyVirtualMove(v, opId) {
  const clamp = (n) => Math.max(0, Math.min(GRID_SIZE - 1, n));
  switch (opId) {
    case 'forward': {
      const d = DIR_DELTA[v.dir];
      v.x = clamp(v.x + d.dx);
      v.y = clamp(v.y + d.dy);
      break;
    }
    case 'turn_left':
      v.dir = rotateDir(v.dir, -1);
      break;
    case 'turn_right':
      v.dir = rotateDir(v.dir, 1);
      break;
    case 'strafe_l': {
      const d = DIR_DELTA[rotateDir(v.dir, -1)];
      v.x = clamp(v.x + d.dx);
      v.y = clamp(v.y + d.dy);
      break;
    }
    case 'strafe_r': {
      const d = DIR_DELTA[rotateDir(v.dir, 1)];
      v.x = clamp(v.x + d.dx);
      v.y = clamp(v.y + d.dy);
      break;
    }
  }
}

function _applyVirtualSupply(v, supplyPoints) {
  for (const sp of supplyPoints) {
    if (v.x !== sp.x || v.y !== sp.y) continue;
    if (sp.type === 'ammo') {
      v.inventory = { ...INITIAL_INVENTORY };
    }
  }
}

/* ============================================================
   強制確定（タイムアウト時にホストが呼ぶ）
   ============================================================ */
export function forceConfirmAll(state) {
  if (state.phase !== 'command') return;
  alivePlayers(state).forEach(id => {
    const p = state.players[id];
    if (!p.commandConfirmed) { p.commandQueue = []; p.commandConfirmed = true; }
  });
  resolveActions(state);
}

/* ============================================================
   次ターンへ進める（アクションアニメ完了後にホストが呼ぶ）
   ============================================================ */
export function advanceToNextTurn(state) {
  if (state.winner) { state.phase = 'ended'; return; }
  if (state.phase === 'ended') return;
  state.turn++;
  _prepareNextTurn(state);
}

/* ============================================================
   ターン開始準備（内部）
   ============================================================ */
function _prepareNextTurn(state) {
  // リスポーン処理
  state.playerOrder.forEach(id => {
    const p = state.players[id];
    if (p.respawning) {
      const pos = _getRandomRespawnPos(state);
      p.x = pos.x; p.y = pos.y; p.dir = pos.dir;
      p.hp = INITIAL_HP;
      p.alive = true;
      p.respawning = false;
      p.inventory = { ...INITIAL_INVENTORY };
      p.buffs = { chaffActive: false };
      // 復活は全員に公開（ただし座標は本人のみ）
      pushEvent(state, { type: 'respawn', pid: id, public: true });
      pushEvent(state, { type: 'respawn_coords', pid: id, x: pos.x, y: pos.y, public: false, to: id });
      state.turnLog.push(`${p.name} が外縁に復活`); // 座標は全体ログに出さない
    }
  });

  state.phase = 'command';
  alivePlayers(state).forEach(id => {
    const p = state.players[id];
    p.time = BASE_TIME;
    // ソナー結果: 有効期限切れのみ削除（次ターンのコマンド＋行動フェーズまで表示し続ける）
    p.sonarResults = (p.sonarResults || []).filter(r => r.expiresAfterTurn >= state.turn);
    p.commandQueue = [];
    p.commandConfirmed = false;
    // dogfightWith はリセットしない（解除はresolveDogfightが行う）
  });
}

/* ============================================================
   ランダムリスポーン位置（内部）
   ============================================================ */
function _getRandomRespawnPos(state) {
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
