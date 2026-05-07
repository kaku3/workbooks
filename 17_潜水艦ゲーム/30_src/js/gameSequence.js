// ============================================================
// gameSequence.js  フェーズ進行管理
//   ゲームロジック（gameLogic.js）と分離し、
//   コマンド確定・フェーズ遷移・ターン進行のみを担う。
// ============================================================
import { OPS, INITIAL_HP, INITIAL_INVENTORY, BASE_TIME, GRID_SIZE } from './constants.js';
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

  // 在庫確認
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

  // 全員確定したらアクションフェーズへ
  if (allAliveDone(state, pl => pl.commandConfirmed)) {
    resolveActions(state);
  }
  return true;
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
    p.forwardWarning = null;
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
