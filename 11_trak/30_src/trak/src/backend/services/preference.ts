import fs from 'fs';
import path from 'path';
import { getTrakDataPath } from './config';
import { type Preference } from '../models/preference';

/**
 * ユーザー設定を保存するディレクトリのパスを取得
 */
const getPreferencesDir = () => {
  const dir = path.join(getTrakDataPath(), 'preferences');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

/**
 * ユーザー設定を読み込む
 */
export const loadPreferences = (userEmail: string): Preference => {
  const preferencesPath = path.join(getPreferencesDir(), `${userEmail}.json`);
  
  if (!fs.existsSync(preferencesPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(preferencesPath, 'utf-8'));
};

/**
 * ユーザー設定を保存
 */
export const savePreferences = (userEmail: string, preferences: Preference): void => {
  const preferencesPath = path.join(getPreferencesDir(), `${userEmail}.json`);
  fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));
};
