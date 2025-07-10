// data/ratingTable.js

/**
 * 各難易度におけるSランク達成の目標時間（秒）
 * difficulty (id) は1から始まるため、配列のインデックスと合わせるために0番目はダミー
 */
const _s_rank_target_time_base = 2;
window.S_RANK_TARGET_TIMES = [
  null, // difficulty 0 (dummy)
  20 * _s_rank_target_time_base, // difficulty 1
  24 * _s_rank_target_time_base, // difficulty 2
  30 * _s_rank_target_time_base, // difficulty 3
  36 * _s_rank_target_time_base, // difficulty 4
  44 * _s_rank_target_time_base, // difficulty 5
  54 * _s_rank_target_time_base, // difficulty 6
  66 * _s_rank_target_time_base, // difficulty 7
  80 * _s_rank_target_time_base, // difficulty 8
  98 * _s_rank_target_time_base, // difficulty 9
  120 * _s_rank_target_time_base // difficulty 10
];

/**
 * Sランク目標時間に対する各ランクの達成時間倍率
 */
window.RANK_MULTIPLIERS = {
  'S': 1.0,   // 目標時間以内
  'A': 1.8,   // 目標時間 × 1.8倍以内（甘め）
  'B': 2.7,   // 目標時間 × 2.7倍以内
  'C': 3.6,   // 目標時間 × 3.6倍以内
  'D': 5.0    // 目標時間 × 5.0倍以内
  // EランクはDランクの倍率を超える場合
};

/**
 * 指定された難易度と時間からランクを計算する関数
 * @param {number} difficulty - 問題の難易度 (1-10)
 * @param {number} timeTaken - 回答にかかった時間（秒）
 * @returns {string} ランク (S, A, B, C, D, E)
 */
window.calculateRank = function(difficulty, timeTaken) {
  if (difficulty < 1 || difficulty > 10) {
    console.warn("Invalid difficulty level:", difficulty);
    return 'E'; // Default to lowest rank for invalid difficulty
  }

  const sTargetTime = window.S_RANK_TARGET_TIMES[difficulty];
  if (!sTargetTime) {
    console.warn("S_RANK_TARGET_TIMES not defined for difficulty:", difficulty);
    return 'E';
  }

  if (timeTaken <= sTargetTime * window.RANK_MULTIPLIERS['S']) {
    return 'S';
  } else if (timeTaken <= sTargetTime * window.RANK_MULTIPLIERS['A']) {
    return 'A';
  } else if (timeTaken <= sTargetTime * window.RANK_MULTIPLIERS['B']) {
    return 'B';
  } else if (timeTaken <= sTargetTime * window.RANK_MULTIPLIERS['C']) {
    return 'C';
  } else if (timeTaken <= sTargetTime * window.RANK_MULTIPLIERS['D']) {
    return 'D';
  } else {
    return 'E';
  }
}
