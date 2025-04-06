import fs from 'fs/promises';
import path from 'path';
import { UsersConfigSchema, type UsersConfig } from '../models/user';
import { getTrakDataPath } from './config';

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
