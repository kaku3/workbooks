import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class TemplateManager {
  private extensionPath: string;
  private workspaceRoot: string;

  constructor(extensionPath: string, workspaceRoot: string) {
    this.extensionPath = extensionPath;
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * .mentor-ai フォルダが存在するか確認（templatesフォルダの存在もチェック）
   */
  isInitialized(): boolean {
    const targetPath = path.join(this.workspaceRoot, '.mentor-ai');
    const templatesPath = path.join(this.workspaceRoot, '.mentor-ai', 'templates');
    return fs.existsSync(targetPath) && fs.existsSync(templatesPath);
  }

  /**
   * 初回セットアップ：テンプレートをワークスペースにコピー
   */
  async initializeWorkspace(): Promise<void> {
    const sourcePath = path.join(this.extensionPath, 'src', '.mentor-ai');
    const targetPath = path.join(this.workspaceRoot, '.mentor-ai');
    const templatesPath = path.join(targetPath, 'templates');

    // templatesフォルダが既に存在する場合はスキップ
    if (fs.existsSync(templatesPath)) {
      vscode.window.showInformationMessage('.mentor-ai フォルダは既に存在します');
      return;
    }

    try {
      // .mentor-ai フォルダを作成（存在しない場合）
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      // templates フォルダをコピー
      const sourceTemplatesPath = path.join(sourcePath, 'templates');
      if (fs.existsSync(sourceTemplatesPath)) {
        await this.copyDirectory(sourceTemplatesPath, templatesPath);
      }
      
      // history フォルダを作成（存在しない場合）
      const historyPath = path.join(targetPath, 'history');
      if (!fs.existsSync(historyPath)) {
        fs.mkdirSync(historyPath, { recursive: true });
      }

      vscode.window.showInformationMessage(
        '✅ .mentor-ai フォルダをセットアップしました！プロンプトを使い始めることができます。'
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `セットアップに失敗しました: ${error}`
      );
      throw error;
    }
  }

  /**
   * ディレクトリを再帰的にコピー
   */
  private async copyDirectory(source: string, target: string): Promise<void> {
    // ターゲットディレクトリを作成
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    // ソースディレクトリの内容を読み取り
    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);

      if (entry.isDirectory()) {
        // ディレクトリの場合は再帰的にコピー
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        // ファイルの場合はコピー
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }

  /**
   * テンプレートを更新（既存の .mentor-ai を上書き）
   */
  async updateTemplates(): Promise<void> {
    const result = await vscode.window.showWarningMessage(
      '既存の .mentor-ai/templates フォルダを上書きしますか？（カスタマイズした内容は失われます）',
      'はい',
      'いいえ'
    );

    if (result !== 'はい') {
      return;
    }

    const sourcePath = path.join(this.extensionPath, 'src', '.mentor-ai', 'templates');
    const targetPath = path.join(this.workspaceRoot, '.mentor-ai', 'templates');

    try {
      // 既存のテンプレートフォルダを削除
      if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }

      // 新しいテンプレートをコピー
      await this.copyDirectory(sourcePath, targetPath);

      vscode.window.showInformationMessage(
        '✅ テンプレートを更新しました！'
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `テンプレートの更新に失敗しました: ${error}`
      );
      throw error;
    }
  }

  /**
   * README を生成
   */
  async generateReadme(): Promise<void> {
    const readmePath = path.join(this.workspaceRoot, '.mentor-ai', 'README.md');
    
    const content = `# Mentor AI - プロンプト集

このフォルダには、Mentor AI Extension のプロンプトテンプレートと使用履歴が保存されます。

## フォルダ構造

\`\`\`
.mentor-ai/
├── templates/          # プロンプトテンプレート
│   ├── 報告書作成/
│   ├── 返信作成/
│   ├── 方針提案/
│   ├── 落とし所提案/
│   ├── 結論ファースト調査/
│   └── ヒント出し回答/
└── history/           # 使用履歴（自動生成）
    ├── 2026/
    └── stats.json
\`\`\`

## カスタマイズ

各テンプレートフォルダ内のファイルは自由に編集できます：

- **概要.md** - プロンプトの説明
- **トレーナープロンプト.md** - AIに渡すメインプロンプト
- **まとめプロンプト.md** - 振り返り用プロンプト

## 注意事項

- このフォルダは Extension によって自動管理されます
- \`history/\` フォルダ内のファイルは自動生成されます
- テンプレートを編集した後は、Extension の「更新」ボタンで反映してください

## バックアップ

大切なカスタマイズ内容は定期的にバックアップすることをおすすめします。
`;

    fs.writeFileSync(readmePath, content, 'utf-8');
  }
}
