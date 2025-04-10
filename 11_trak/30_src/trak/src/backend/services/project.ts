import fs from 'fs';
import path from 'path';
import { getTrakDataPath } from './config';
import { type Project } from '../models/project';

/**
 * プロジェクト設定を読み込む
 */
export const loadProject = (): Project => {
  const projectPath = path.join(getTrakDataPath(), 'configs', 'project.json');
  
  try {
    return JSON.parse(fs.readFileSync(projectPath, 'utf8'));
  } catch (error) {
    throw new Error(`プロジェクト情報の読み込みに失敗しました: ${error}`);
  }
};
