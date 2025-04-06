import fs from 'fs/promises';
import path from 'path';
import { getTrakDataPath } from './config';
import { type Template, type TemplatesConfig } from '../models/template';

/**
 * テンプレート設定とその内容を読み込む
 */
export const loadTemplates = async (): Promise<{ templates: Template[] }> => {
  // テンプレート設定の読み込み
  const configPath = path.join(getTrakDataPath(), 'configs', 'templates.json');
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    const { templates } = JSON.parse(configData) as TemplatesConfig;

    // 各テンプレートのmarkdownファイルを読み込む
    const templatesWithContent = await Promise.all(
      templates.map(async (template) => {
        const mdPath = path.join(getTrakDataPath(), 'templates', `${template.id}.md`);
        try {
          const content = await fs.readFile(mdPath, 'utf-8');
          return {
            ...template,
            content
          };
        } catch (error) {
          console.error(`テンプレート ${template.id} の読み込みに失敗:`, error);
          return {
            ...template,
            content: '## 内容\n\n'  // デフォルトの内容
          };
        }
      })
    );

    return { templates: templatesWithContent };
  } catch (error) {
    throw new Error(`テンプレートデータの読み込みに失敗しました: ${error}`);
  }
};
