// ============================================================
// constants.js  v5.0 パネル操作制 ゲーム定数
// ============================================================

export const GRID_SIZE = 10;
export const INITIAL_HP = 4;
export const BASE_TIME = 10;        // 単位時間 / ターン
export const COMMAND_TIME_LIMIT = 30; // 秒
export const WIN_KILLS = 3;         // 先取キル数で勝利

// 方向
export const DIR = { N: 'N', S: 'S', E: 'E', W: 'W' };
export const DIR_DELTA = {
  N: { dx: 0, dy: -1 },
  S: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  W: { dx: -1, dy: 0 },
};
export const DIR_LIST = ['N', 'E', 'S', 'W'];
export function rotateDir(dir, times) {
  let i = DIR_LIST.indexOf(dir);
  return DIR_LIST[(i + times + 4) % 4];
}

// ============================================================
// v5.0 パネル操作定義
// ============================================================

/**
 * 操作定義 (OPS)
 * id: 操作ID (コマンドキューで使用)
 * cost: 単位時間コスト
 * cat: 'move' | 'recon' | 'weapon' | 'place' | 'defense'
 * invKey: 在庫キー (在庫消費操作のみ)
 */
export const OPS = {
  forward:   { id: 'forward',   name: '前進',     cost: 1, icon: 'arrow_upward',          cat: 'move' },
  turn_left: { id: 'turn_left', name: '←旋回',   cost: 3, icon: 'turn_left',             cat: 'move' },
  turn_right:{ id: 'turn_right',name: '旋回→',   cost: 3, icon: 'turn_right',            cat: 'move' },
  strafe_l:  { id: 'strafe_l',  name: '←横移',   cost: 2, icon: 'arrow_back',            cat: 'move' },
  strafe_r:  { id: 'strafe_r',  name: '横移→',   cost: 2, icon: 'arrow_forward',         cat: 'move' },
  sonar:     { id: 'sonar',     name: 'ソナー',   cost: 1, icon: 'radar',                 cat: 'recon' },
  torpedo:   { id: 'torpedo',   name: '魚雷',     cost: 1, icon: 'rocket_launch',         cat: 'weapon', invKey: 'torpedo' },
  guided:    { id: 'guided',    name: '追尾魚雷', cost: 2, icon: 'assistant_navigation',  cat: 'weapon', invKey: 'guided' },
  shotgun:   { id: 'shotgun',   name: '散弾',     cost: 1, icon: 'scatter_plot',          cat: 'weapon', invKey: 'shotgun' },
  decoy:     { id: 'decoy',     name: 'デコイ',   cost: 1, icon: 'help_outline',          cat: 'place',  invKey: 'decoy' },
  mine:      { id: 'mine',      name: '機雷',     cost: 1, icon: 'dangerous',             cat: 'place',  invKey: 'mine' },
  chaff:     { id: 'chaff',     name: 'チャフ',   cost: 1, icon: 'blur_on',               cat: 'defense',invKey: 'chaff' },
  armor:     { id: 'armor',     name: '装甲板',   cost: 2, icon: 'shield',                cat: 'defense',invKey: 'armor' },
};

/** 初期在庫 */
export const INITIAL_INVENTORY = {
  torpedo: 6,
  guided:  3,
  shotgun: 3,
  decoy:   3,
  mine:    3,
  chaff:   3,
  armor:   3,
};

// ============================================================
// 補給ポイント (ammo=在庫全回復 / repair=HP+1)
// ============================================================
export const SUPPLY_TYPES = ['ammo', 'repair'];
export const SUPPLY_FIXED = [
  { x: 3, y: 3, type: 'ammo' },
  { x: 6, y: 6, type: 'repair' },
  { x: 2, y: 7, type: 'ammo' },
];

// ============================================================
// 収縮テーブル
// ============================================================
export const SHRINK_TABLE = [
  { fromTurn: 1,  safe: 10, margin: 0 },
  { fromTurn: 4,  safe: 8,  margin: 1 },
  { fromTurn: 7,  safe: 6,  margin: 2 },
  { fromTurn: 10, safe: 4,  margin: 3 },
];

export function getSafeZone(turn) {
  let entry = SHRINK_TABLE[0];
  for (const e of SHRINK_TABLE) {
    if (turn >= e.fromTurn) entry = e;
  }
  return {
    minX: entry.margin,
    maxX: GRID_SIZE - 1 - entry.margin,
    minY: entry.margin,
    maxY: GRID_SIZE - 1 - entry.margin,
    margin: entry.margin,
  };
}

export function isInDanger(x, y, turn) {
  const z = getSafeZone(turn);
  return x < z.minX || x > z.maxX || y < z.minY || y > z.maxY;
}

// シャッフル (復活位置選択で使用)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
