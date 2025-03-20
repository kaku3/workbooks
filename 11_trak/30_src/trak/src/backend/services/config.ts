import fs from 'fs/promises';
import path from 'path';
import { UsersConfigSchema, type UsersConfig } from '../models/user';

/**
 * trak-dataディレクトリのパスを取得
 * 開発時は ./trak-data を使用
 */
const getTrakDataPath = () => {
  // TODO: 環境変数などで切り替え可能にする
  return path.join(process.cwd(), 'trak-data');
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
