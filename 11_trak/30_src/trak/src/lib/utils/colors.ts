const USER_COLORS = [
  '#f87171', // red
  '#fb923c', // orange
  '#fbbf24', // amber 
  '#a3e635', // lime
  '#4ade80', // green
  '#2dd4bf', // teal
  '#38bdf8', // sky
  '#818cf8', // indigo
  '#a78bfa', // purple
  '#e879f9', // fuchsia
  '#fb7185', // rose
  '#f472b6', // pink
  '#9ca3af', // gray
  '#6ee7b7', // emerald
  '#93c5fd', // blue
  '#c084fc'  // violet
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

// 色の明度を判定して文字色を返す
export function getTextColor(backgroundColor: string): string {
  // カラーコードからRGB値を抽出
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 輝度を計算
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 輝度が0.8より大きい場合は暗い文字色、そうでない場合は明るい文字色
  return luminance > 0.8 ? '#1e293b' : '#ffffff';
}
