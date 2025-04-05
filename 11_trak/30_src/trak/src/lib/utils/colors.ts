const USER_COLORS = [
  '#EF4444', // より鮮やかな赤
  '#F97316', // より鮮やかなオレンジ
  '#22C55E', // より鮮やかな緑
  '#06B6D4', // より鮮やかなシアン
  '#3B82F6', // より鮮やかな青
  '#8B5CF6', // より鮮やかな紫
  '#EC4899', // より鮮やかなピンク
  '#F59E0B'  // より鮮やかな琥珀色
];

// ユーザーIDから色を生成
export function getUserColor(id: string): string {
  // 文字列からハッシュ値を生成
  const hash = id.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // 配列からインデックスを選択
  const colorIndex = Math.abs(hash % USER_COLORS.length);
  return USER_COLORS[colorIndex];
}

/**
 * 色の明度を判定して文字色を返す
 * 輝度が0.8より大きい場合は暗い文字色、そうでない場合は明るい文字色
 * @param backgroundColor 
 * @returns 
 */
export function getTextColor(backgroundColor: string): string {
  const { r, g, b } = hexToRgb(backgroundColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.8 ? '#1e293b' : '#ffffff';
}

/**
 * タイムラインバーの色を取得する関数
 * @param backgroundColor 
 * @returns 
 */
export function getTimelineBarColor(id: string): string {
  const color = getUserColor(id);
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, 0.2)`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const hexWithoutHash = hex.replace('#', '');
  return {
    r: parseInt(hexWithoutHash.substring(0, 2), 16),
    g: parseInt(hexWithoutHash.substring(2, 4), 16),
    b: parseInt(hexWithoutHash.substring(4, 6), 16)
  };
}