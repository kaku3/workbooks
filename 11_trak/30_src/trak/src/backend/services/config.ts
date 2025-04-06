import path from 'path';

/**
 * trak-dataディレクトリのパスを取得
 * 環境変数 TRAK_DATA_FOLDER で指定されたパスを使用
 * 未指定の場合は ./trak-data を使用
 */
export const getTrakDataPath = () => {
  const dataPath = process.env.TRAK_DATA_FOLDER || 'trak-data';
  // 絶対パスの場合はそのまま使用し、相対パスの場合は process.cwd() からの相対パスとして扱う
  return path.isAbsolute(dataPath) ? dataPath : path.join(process.cwd(), dataPath);
};
