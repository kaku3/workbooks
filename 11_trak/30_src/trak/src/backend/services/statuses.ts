import fs from 'fs';
import path from 'path';
import { getTrakDataPath } from './config';

export interface Status {
  id: string;
  name: string;
  color: string;
}

export interface StatusConfig {
  statuses: Status[];
}

/**
 * ステータス設定を読み込む
 */
export const loadStatuses = (): StatusConfig => {
  const statusesPath = path.join(getTrakDataPath(), 'configs', 'statuses.json');
  
  try {
    return JSON.parse(fs.readFileSync(statusesPath, 'utf8'));
  } catch (error) {
    throw new Error(`ステータスデータの読み込みに失敗しました: ${error}`);
  }
};
