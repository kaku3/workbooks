import * as vscode from 'vscode';
import * as path from 'path';
import { PromptProvider } from './promptProvider';
import { HistoryManager } from './historyManager';
import { DashboardViewProvider } from './dashboardView';
import { TemplateManager } from './templateManager';
import { PromptItem } from './types';

export function activate(context: vscode.ExtensionContext) {
  console.log('Mentor AI Prompt Collection is now active!');

  // ワークスペースルートの取得
  const workspaceRoot = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';

  if (!workspaceRoot) {
    vscode.window.showErrorMessage('ワークスペースが開かれていません');
    return;
  }

  // テンプレートマネージャーの初期化
  const templateManager = new TemplateManager(context.extensionPath, workspaceRoot);

  // 初回セットアップチェック
  if (!templateManager.isInitialized()) {
    vscode.window.showInformationMessage(
      '🎯 Mentor AI を初めて使用します。セットアップを開始しますか？',
      'はい',
      '後で'
    ).then(async (selection) => {
      if (selection === 'はい') {
        await templateManager.initializeWorkspace();
        await templateManager.generateReadme();
        // セットアップ後にプロンプトを再読み込み
        promptProvider.refresh();
      }
    });
  }

  // プロバイダーの初期化
  const promptProvider = new PromptProvider(workspaceRoot, context);
  const historyManager = new HistoryManager(context, workspaceRoot);
  const dashboardProvider = new DashboardViewProvider(
    context.extensionUri,
    historyManager,
    promptProvider
  );

  // TreeViewの登録
  const promptTreeView = vscode.window.createTreeView('mentor-ai-prompts', {
    treeDataProvider: promptProvider,
    showCollapseAll: true
  });

  // WebviewViewの登録
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'mentor-ai-dashboard',
      dashboardProvider
    )
  );

  // コマンドの登録

  // プロンプトをコピー
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.copyPrompt', async (item) => {
      console.log('copyPrompt called', item);
      const prompt = item?.prompt as PromptItem;
      console.log('prompt:', prompt);
      if (prompt) {
        await vscode.env.clipboard.writeText(prompt.content);
        vscode.window.showInformationMessage(`「${prompt.name}」をコピーしました`);
        
        // 使用履歴を記録
        await historyManager.recordUsage(prompt.id, prompt.name);
        promptProvider.refresh();
        dashboardProvider.refresh();
      } else {
        console.error('プロンプトが見つかりません', item);
        vscode.window.showErrorMessage('プロンプトが見つかりません');
      }
    })
  );

  // プロンプトを挿入
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.insertPrompt', async (item) => {
      console.log('insertPrompt called', item);
      const prompt = item?.prompt as PromptItem;
      if (prompt) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const formattedContent = `- メンターAI プロンプト\n\`\`\`\n${prompt.content}\n\`\`\`\n- メンターAIコメント\n\n`;
          await editor.edit(editBuilder => {
            editBuilder.insert(editor.selection.active, formattedContent);
          });
          vscode.window.showInformationMessage(`「${prompt.name}」を挿入しました`);
          
          // 使用履歴を記録
          await historyManager.recordUsage(prompt.id, prompt.name);
          promptProvider.refresh();
          dashboardProvider.refresh();
        } else {
          vscode.window.showWarningMessage('エディタが開かれていません');
        }
      } else {
        console.error('プロンプトが見つかりません', item);
        vscode.window.showErrorMessage('プロンプトが見つかりません');
      }
    })
  );

  // プロンプト詳細を表示
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.showPromptDetail', async (prompt: PromptItem) => {
      const panel = vscode.window.createWebviewPanel(
        'promptDetail',
        prompt.name,
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      const stats = await historyManager.getStats();
      const promptStat = stats.promptStats[prompt.id];

      // まとめプロンプトも表示
      const reflectionSection = prompt.reflectionPrompt ? `
        <h2>📝 まとめプロンプト</h2>
        <p>セッション後に使用して、学びを記録しましょう。</p>
        <div class="prompt-content">${escapeHtml(prompt.reflectionPrompt)}</div>
        <div class="actions">
          <button onclick="copyReflection()">📋 まとめプロンプトをコピー</button>
        </div>
      ` : '';

      panel.webview.html = getPromptDetailHtml(prompt, promptStat, reflectionSection);

      // メッセージハンドラ
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
            case 'copy':
              await vscode.env.clipboard.writeText(prompt.content);
              vscode.window.showInformationMessage('コピーしました');
              await historyManager.recordUsage(prompt.id, prompt.name);
              promptProvider.refresh();
              dashboardProvider.refresh();
              break;
            case 'insert':
              const editor = vscode.window.activeTextEditor;
              if (editor) {
                const formattedContent = `- メンターAI プロンプト\n\`\`\`\n${prompt.content}\n\`\`\`\n- メンターAIコメント\n\n`;
                await editor.edit(editBuilder => {
                  editBuilder.insert(editor.selection.active, formattedContent);
                });
                vscode.window.showInformationMessage('挿入しました');
                await historyManager.recordUsage(prompt.id, prompt.name);
                promptProvider.refresh();
                dashboardProvider.refresh();
              } else {
                vscode.window.showWarningMessage('エディタが開かれていません');
              }
              break;
            case 'copyReflection':
              if (prompt.reflectionPrompt) {
                await vscode.env.clipboard.writeText(prompt.reflectionPrompt);
                vscode.window.showInformationMessage('まとめプロンプトをコピーしました');
              }
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );

  // お気に入り切り替え
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.toggleFavorite', async (item) => {
      const prompt = item.prompt as PromptItem;
      if (prompt) {
        await promptProvider.toggleFavorite(prompt);
        vscode.window.showInformationMessage(
          prompt.isFavorite 
            ? `「${prompt.name}」をお気に入りに追加しました`
            : `「${prompt.name}」をお気に入りから削除しました`
        );
      }
    })
  );

  // プロンプト一覧を更新
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.refreshPrompts', () => {
      promptProvider.refresh();
      vscode.window.showInformationMessage('プロンプト一覧を更新しました');
    })
  );

  // ダッシュボードを開く
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.openDashboard', () => {
      dashboardProvider.refresh();
    })
  );

  // 初回セットアップ
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.initializeWorkspace', async () => {
      await templateManager.initializeWorkspace();
      await templateManager.generateReadme();
      promptProvider.refresh();
    })
  );

  // テンプレート更新
  context.subscriptions.push(
    vscode.commands.registerCommand('mentor-ai.updateTemplates', async () => {
      await templateManager.updateTemplates();
      promptProvider.refresh();
    })
  );

  // ステータスバーアイテム
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'mentor-ai.openDashboard';
  statusBarItem.text = '$(book) プロンプト集';
  statusBarItem.tooltip = 'Mentor AI ダッシュボードを開く';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // 毎日のリマインダー（実験的）
  const checkStreak = async () => {
    const stats = await historyManager.getStats();
    const today = new Date().toISOString().split('T')[0];
    
    if (!stats.dailyActivity[today] && stats.currentStreak >= 3) {
      const config = vscode.workspace.getConfiguration('mentorAi');
      if (config.get('enableNotifications')) {
        vscode.window.showInformationMessage(
          `🔥 ${stats.currentStreak}日連続使用中です！今日も続けましょう。`,
          'ダッシュボードを開く'
        ).then(selection => {
          if (selection) {
            vscode.commands.executeCommand('mentor-ai.openDashboard');
          }
        });
      }
    }
  };

  // 1時間ごとにチェック
  setInterval(checkStreak, 60 * 60 * 1000);

  vscode.window.showInformationMessage('🎯 Mentor AI プロンプト集がアクティブになりました！');
}

function getPromptDetailHtml(prompt: PromptItem, stats?: any, reflectionSection: string = ''): string {
  const usageInfo = stats ? `
    <div class="usage-info">
      <h3>📊 使用統計</h3>
      <p>使用回数: ${stats.count}回</p>
      <p>初回使用: ${stats.firstUsed ? new Date(stats.firstUsed).toLocaleString('ja-JP') : '未使用'}</p>
      <p>最終使用: ${stats.lastUsed ? new Date(stats.lastUsed).toLocaleString('ja-JP') : '未使用'}</p>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prompt.name}</title>
  <style>
    body {
      padding: 20px;
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
      line-height: 1.6;
    }
    h1 {
      border-bottom: 2px solid var(--vscode-textLink-foreground);
      padding-bottom: 10px;
    }
    h2 {
      margin-top: 30px;
      border-bottom: 1px solid var(--vscode-panel-border);
      padding-bottom: 8px;
    }
    .description {
      background: var(--vscode-textBlockQuote-background);
      border-left: 4px solid var(--vscode-textLink-foreground);
      padding: 16px;
      margin: 20px 0;
    }
    .prompt-content {
      background: var(--vscode-editor-background);
      border: 1px solid var(--vscode-panel-border);
      padding: 16px;
      margin: 20px 0;
      white-space: pre-wrap;
      font-family: var(--vscode-editor-font-family);
      font-size: 14px;
    }
    .actions {
      display: flex;
      gap: 10px;
      margin: 20px 0;
    }
    button {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 14px;
    }
    button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .usage-info {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--vscode-panel-border);
    }
    .usage-info h3 {
      margin-bottom: 10px;
    }
    .usage-info p {
      margin: 5px 0;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <h1>${prompt.name}</h1>
  
  <div class="description">
    <p>${prompt.description}</p>
  </div>

  <h2>📝 トレーナープロンプト</h2>
  <p>このプロンプトをAIに渡して、文書をチェックしてもらいましょう。</p>
  <div class="prompt-content">${escapeHtml(prompt.content)}</div>

  <div class="actions">
    <button onclick="copyPrompt()">📋 コピー</button>
    <button onclick="insertPrompt()">✏️ 挿入</button>
  </div>

  ${reflectionSection}

  ${usageInfo}

  <script>
    const vscode = acquireVsCodeApi();

    function copyPrompt() {
      vscode.postMessage({ command: 'copy' });
    }

    function insertPrompt() {
      vscode.postMessage({ command: 'insert' });
    }

    function copyReflection() {
      vscode.postMessage({ command: 'copyReflection' });
    }
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function deactivate() {}
