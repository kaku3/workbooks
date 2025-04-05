import fs from 'fs/promises';
import path from 'path';
import { UsersConfigSchema, type UsersConfig } from '../models/user';

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

/**
 * ユーザー設定を読み込む
 */
export const loadUsers = async (): Promise<UsersConfig> => {
  const configPath = path.join(getTrakDataPath(), 'configs', 'users.json');
  
  try {
    const data = await fs.readFile(configPath, 'utf-8');
    const json = JSON.parse(data);
    return UsersConfigSchema.parse(json);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load users config: ${error.message}`);
    }
    throw error;
  }
};
