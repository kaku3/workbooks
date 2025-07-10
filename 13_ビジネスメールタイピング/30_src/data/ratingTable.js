// data/ratingTable.js

/**
 * 各難易度におけるSランク達成の目標時間（秒）
 * difficulty (id) は1から始まるため、配列のインデックスと合わせるために0番目はダミー
 */
export const S_RANK_TARGET_TIMES = [
  null, // difficulty 0 (dummy)
  20, // difficulty 1
  24, // difficulty 2
  30, // difficulty 3
  36, // difficulty 4
  44, // difficulty 5
  54, // difficulty 6
  66, // difficulty 7
  80, // difficulty 8
  98, // difficulty 9
  120  // difficulty 10
];

/**
 * Sランク目標時間に対する各ランクの達成時間倍率
 */
export const RANK_MULTIPLIERS = {
  'S': 1.0,   // 目標時間以内
  'A': 1.5,   // 目標時間 × 1.5倍以内
  'B': 2.25,  // 目標時間 × 2.25倍以内
  'C': 3.0,   // 目標時間 × 3.0倍以内
  'D': 4.0    // 目標時間 × 4.0倍以内
  // EランクはDランクの倍率を超える場合
};

/**
 * 指定された難易度と時間からランクを計算する関数
 * @param {number} difficulty - 問題の難易度 (1-10)
 * @param {number} timeTaken - 回答にかかった時間（秒）
 * @returns {string} ランク (S, A, B, C, D, E)
 */
export function calculateRank(difficulty, timeTaken) {
  if (difficulty < 1 || difficulty > 10) {
    console.warn("Invalid difficulty level:", difficulty);
    return 'E'; // Default to lowest rank for invalid difficulty
  }

  const sTargetTime = S_RANK_TARGET_TIMES[difficulty];
  if (!sTargetTime) {
    console.warn("S_RANK_TARGET_TIMES not defined for difficulty:", difficulty);
    return 'E';
  }

  if (timeTaken <= sTargetTime * RANK_MULTIPLIERS['S']) {
    return 'S';
  } else if (timeTaken <= sTargetTime * RANK_MULTIPLIERS['A']) {
    return 'A';
  } else if (timeTaken <= sTargetTime * RANK_MULTIPLIERS['B']) {
    return 'B';
  } else if (timeTaken <= sTargetTime * RANK_MULTIPLIERS['C']) {
    return 'C';
  } else if (timeTaken <= sTargetTime * RANK_MULTIPLIERS['D']) {
    return 'D';
  } else {
    return 'E';
  }
}
