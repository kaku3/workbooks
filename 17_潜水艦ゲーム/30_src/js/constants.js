// ============================================================
// constants.js  カード定義・マップ設定・ゲーム定数
// ============================================================

export const GRID_SIZE = 10;
export const MAX_HAND = 8;
export const INITIAL_HP = 4;
export const BASE_FUEL = 10;
export const COMMAND_TIME_LIMIT = 25; // 秒
export const INITIAL_HAND_SIZE = 5;
export const DRAWS_PER_TURN = 2;
export const RESPAWN_DRAWS = 3;   // 復活ターンのドロー数（通常+1）
export const WIN_KILLS = 3;       // 先取キル数で勝利

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

// カードカテゴリ
export const CAT = {
  MOVE: 'move',
  RECON: 'recon',
  ATTACK: 'attack',
  SPECIAL: 'special', // 特殊 + バフ + デバフ
};

// --- 移動系カード ---
// ※「前進」「方向転換」は固定コマンド(VIRTUAL_MOVES)に移行して廃止
// ※「急速推進」はターボ移動に統合して廃止
export const CARD_MOVE = [
  { id: 'cruise',        name: '巡航',       cat: CAT.MOVE, fuel: 2, count: 3, icon: 'explore',            desc: '任意の方向に1マス移動' },
  { id: 'reverse',       name: '反転機動',   cat: CAT.MOVE, fuel: 2, count: 2, icon: 'u_turn_left',        desc: '180度転換し、2マス後退' },
  { id: 'escape',        name: '緊急離脱',   cat: CAT.MOVE, fuel: 4, count: 2, icon: 'flight_takeoff',     desc: '任意方向に4マス移動。ソナー検知無効。ドッグファイト中も通常コスト' },
  { id: 'turbo_move',    name: 'ターボ移動', cat: CAT.MOVE, fuel: 2, count: 2, icon: 'rocket_launch',      desc: '前方に3マス一気に移動（通常前進の3倍）' },
  { id: 'high_output',   name: '高出力推進', cat: CAT.MOVE, fuel: 2, count: 2, icon: 'speed',              desc: 'このターンの全移動距離2倍（他の移動カードと組合せ）', subtype: 'move_buff' },
  { id: 'strafe_left',   name: '左横移動', cat: CAT.MOVE, fuel: 2, count: 2, icon: 'arrow_back',    desc: '向きを変えずに左に1マス横移動（高出力時2マス）' },
  { id: 'strafe_right',  name: '右横移動', cat: CAT.MOVE, fuel: 2, count: 2, icon: 'arrow_forward', desc: '向きを変えずに右に1マス横移動（高出力時2マス）' },
];

// --- 仮想コマンド（手札消費なし・固定スロット）---
export const VIRTUAL_MOVES = [
  { id: 'free_turn_left',  uid: '__free_turn_left__',  name: '左旋回', cat: CAT.MOVE, fuel: 1, virtual: true, icon: 'turn_left',    desc: '左に90°旋回（燃料1消費のみ・手札不要）' },
  { id: 'free_forward',   uid: '__free_forward__',    name: '前進',   cat: CAT.MOVE, fuel: 1, virtual: true, icon: 'arrow_upward', desc: '前方に1マス移動（燃料1消費のみ・手札不要）' },
  { id: 'free_turn_right', uid: '__free_turn_right__', name: '右旋回', cat: CAT.MOVE, fuel: 1, virtual: true, icon: 'turn_right',   desc: '右に90°旋回（燃料1消費のみ・手札不要）' },
];
export const VIRTUAL_CARD_MAP = Object.fromEntries(VIRTUAL_MOVES.map(c => [c.uid, c]));

// --- 索敵系カード ---
// ※「偵察魚雷」(考える時間がかかる)「欺瞞信号」(煩雑) は廃止
export const CARD_RECON = [
  { id: 'passive_sonar', name: 'パッシブソナー',   cat: CAT.RECON, fuel: 1, count: 3, icon: 'hearing',   desc: '半径3マス以内を索敵', sideEffect: null },
  { id: 'hydrophone',    name: '水中マイク',       cat: CAT.RECON, fuel: 1, count: 2, icon: 'graphic_eq', desc: '指定した行or列に潜水艦がいるか確認', sideEffect: null },
  { id: 'active_sonar',  name: 'アクティブソナー', cat: CAT.RECON, fuel: 3, count: 2, icon: 'radar',      desc: '半径5マス以内を全索敵', sideEffect: 'area_leak' },
  { id: 'tracking_buoy', name: '追跡ブイ',         cat: CAT.RECON, fuel: 4, count: 2, icon: 'podcasts',   desc: '指定マスに設置、3ターン自動索敵', sideEffect: 'place_sound' },
];

// --- 攻撃系カード (11枚) ---
export const CARD_ATTACK = [
  { id: 'torpedo',       name: '魚雷',       cat: CAT.ATTACK, fuel: 3, count: 4, icon: 'rocket_launch',    desc: '正面のみ射程6マス直線攻撃、命中でHP-2', range: 6, sideEffect: 'line_leak' },
  { id: 'harpoon',       name: 'ハープーン', cat: CAT.ATTACK, fuel: 3, count: 3, icon: 'compare_arrows', desc: '左右横方向のみ射程3マス直線攻撃、盤面で目標指定、命中でHP-1', range: 3, sideEffect: 'line_leak' },
  { id: 'guided_torpedo', name: '誘導魚雷',   cat: CAT.ATTACK, fuel: 4, count: 2, icon: 'assistant_navigation', desc: '直線3マス+最大2回方向転換', range: 3, sideEffect: 'area_leak' },
  { id: 'depth_charge',  name: '広域爆雷',   cat: CAT.ATTACK, fuel: 4, count: 2, icon: 'explosion',        desc: '半径2マス全方向、HP-1', radius: 2, sideEffect: 'area_leak' },
  { id: 'mine',          name: '機雷敷設',   cat: CAT.ATTACK, fuel: 2, count: 2, icon: 'dangerous',        desc: '指定マスに機雷を設置', sideEffect: null },
  { id: 'barrage',       name: '連装魚雷',   cat: CAT.ATTACK, fuel: 5, count: 1, icon: 'bolt',             desc: '前方2方向に同時発射', range: 6, sideEffect: 'line_leak' },
];

// --- 特殊系カード ---
// ※「艦底放流」(手札入替が煩雑)「乗っ取り信号」(対象選択が煩雑) は廃止
export const CARD_SPECIAL_CORE = [
  { id: 'repair', name: '緊急修理',   cat: CAT.SPECIAL, fuel: 2, count: 2, icon: 'build',     desc: 'HP+1回復', subtype: 'utility' },
  { id: 'emp',    name: '電磁パルス', cat: CAT.SPECIAL, fuel: 4, count: 1, icon: 'flash_off', desc: '半径3マスの索敵・通信を次ターン無効化', subtype: 'utility' },
];

// --- バフカード (5枚) ---
export const CARD_BUFF = [
  { id: 'overcharge',    name: '高出力炉起動',   cat: CAT.SPECIAL, fuel: 0, count: 1, icon: 'battery_charging_full', desc: '次ターンの燃料上限+4', subtype: 'buff' },
  { id: 'torpedo_lock',  name: '魚雷追尾装置',   cat: CAT.SPECIAL, fuel: 2, count: 1, icon: 'gps_fixed',             desc: '次の魚雷の射程+3', subtype: 'buff' },
  { id: 'enhanced_sonar', name: '強化ソナー',     cat: CAT.SPECIAL, fuel: 1, count: 1, icon: 'settings_input_antenna', desc: '次のソナーの探知範囲+2', subtype: 'buff' },
  { id: 'armor',          name: '装甲板展開',     cat: CAT.SPECIAL, fuel: 2, count: 1, icon: 'shield',                desc: '次のダメージを1軽減', subtype: 'buff' },
  { id: 'barrage_prep',   name: '連装砲準備',     cat: CAT.SPECIAL, fuel: 1, count: 1, icon: 'dynamic_form',          desc: '次の攻撃カードの燃料コスト-2', subtype: 'buff' },
];

// --- デバフカード (2枚) ---
export const CARD_DEBUFF = [
  { id: 'chaff',         name: 'チャフ展開',     cat: CAT.SPECIAL, fuel: 1, count: 1, icon: 'blur_on',     desc: '2ターン誘導魚雷の追尾無効化', subtype: 'debuff' },
  { id: 'smokescreen',   name: '煙幕散布',       cat: CAT.SPECIAL, fuel: 2, count: 1, icon: 'cloud',       desc: 'このターン、ソナー検知を無効化', subtype: 'debuff' },
];

// 全カードテンプレートを統合
export const ALL_CARD_TEMPLATES = [
  ...CARD_MOVE, ...CARD_RECON, ...CARD_ATTACK,
  ...CARD_SPECIAL_CORE, ...CARD_BUFF, ...CARD_DEBUFF,
];

/**
 * デッキを生成する（各カードを count 枚ずつ、ユニークID付き）
 */
export function buildDeck(category) {
  const templates = ALL_CARD_TEMPLATES.filter(c => c.cat === category);
  const deck = [];
  for (const t of templates) {
    for (let i = 0; i < t.count; i++) {
      deck.push({ ...t, uid: `${t.id}_${i}`, count: undefined });
    }
  }
  return shuffle(deck);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 補給ポイント設定
export const SUPPLY_TYPES = ['fuel', 'repair', 'armory'];
export const SUPPLY_FIXED = [
  { x: 3, y: 3, type: 'fuel' },
  { x: 6, y: 3, type: 'repair' },
  { x: 2, y: 6, type: 'armory' },
];

// 収縮テーブル
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

// カードカテゴリ表示名
// (VIRTUAL_MOVES / VIRTUAL_CARD_MAP は constants.js 上部で定義済み)
export const CAT_LABELS = {
  [CAT.MOVE]: '移動',
  [CAT.RECON]: '索敵',
  [CAT.ATTACK]: '攻撃',
  [CAT.SPECIAL]: '特殊/バフ',
};

// カードカテゴリ色
export const CAT_COLORS = {
  [CAT.MOVE]: '#00bcd4',
  [CAT.RECON]: '#00e5ff',
  [CAT.ATTACK]: '#ff6600',
  [CAT.SPECIAL]: '#ffe066',
};
