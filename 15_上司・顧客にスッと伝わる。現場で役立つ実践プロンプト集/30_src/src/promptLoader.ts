import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { PromptItem } from './types';

export class PromptLoader {
  private workspaceRoot: string;
  private prompts: PromptItem[] = [];

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  async loadPrompts(): Promise<PromptItem[]> {
    this.prompts = [];
    
    // .mentor-ai/templates から読み込む
    const templatesPath = path.join(this.workspaceRoot, '.mentor-ai', 'templates');
    
    if (!fs.existsSync(templatesPath)) {
      console.log('.mentor-ai/templates フォルダが見つかりません');
      return this.prompts;
    }

    // 各プロンプトフォルダを読み込む
    const promptFolders = [
      { id: 'report', name: '報告書作成', folder: '報告書作成' },
      { id: 'reply', name: '返信作成', folder: '返信作成' },
      { id: 'policy', name: '方針提案', folder: '方針提案' },
      { id: 'compromise', name: '落とし所提案', folder: '落とし所提案' },
      { id: 'conclusion', name: '結論ファースト調査', folder: '結論ファースト調査' },
      { id: 'hint', name: 'ヒント出し回答', folder: 'ヒント出し回答' }
    ];

    for (const folder of promptFolders) {
      const folderPath = path.join(templatesPath, folder.folder);
      
      if (fs.existsSync(folderPath)) {
        const prompt = await this.loadPromptFromFolder(folder.id, folder.name, folderPath);
        if (prompt) {
          this.prompts.push(prompt);
        }
      }
    }

    return this.prompts;
  }

  private async loadPromptFromFolder(id: string, name: string, folderPath: string): Promise<PromptItem | null> {
    try {
      const summaryPath = path.join(folderPath, '概要.md');
      const trainerPath = path.join(folderPath, 'トレーナープロンプト.md');
      const reflectionPath = path.join(folderPath, 'まとめプロンプト.md');
      
      let description = '';
      let content = '';
      let reflectionPrompt = '';

      // 概要.md から説明を読み込む
      if (fs.existsSync(summaryPath)) {
        const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
        const lines = summaryContent.split('\n');
        // "## 概要" セクションから説明を抽出
        let inOverview = false;
        let descLines: string[] = [];
        for (const line of lines) {
          if (line.startsWith('## 概要')) {
            inOverview = true;
            continue;
          }
          if (inOverview && line.startsWith('##')) {
            break;
          }
          if (inOverview && line.trim()) {
            descLines.push(line.trim());
          }
        }
        description = descLines.slice(0, 2).join(' '); // 最初の2行を使用
      }

      // トレーナープロンプト.md からメインプロンプトを読み込む
      if (fs.existsSync(trainerPath)) {
        content = fs.readFileSync(trainerPath, 'utf-8');
      }

      // まとめプロンプト.md から振り返りプロンプトを読み込む
      if (fs.existsSync(reflectionPath)) {
        reflectionPrompt = fs.readFileSync(reflectionPath, 'utf-8');
      }

      if (!content) {
        console.log(`プロンプトが見つかりません: ${folderPath}`);
        return null;
      }

      return {
        id,
        categoryId: id,
        name,
        description,
        content,
        reflectionPrompt,
        usageCount: 0,
        isFavorite: false
      };
    } catch (error) {
      console.error(`Error loading prompt from ${folderPath}:`, error);
      return null;
    }
  }

  getPrompts(): PromptItem[] {
    return this.prompts;
  }

  getPromptById(id: string): PromptItem | undefined {
    return this.prompts.find(p => p.id === id);
  }
}
