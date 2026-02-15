import * as vscode from 'vscode';
import { HistoryManager } from './historyManager';
import { PromptProvider } from './promptProvider';

export class DashboardViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'mentor-ai-dashboard';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private historyManager: HistoryManager,
    private promptProvider: PromptProvider
  ) {}

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);

    // メッセージハンドラ
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'refresh':
          webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);
          break;
      }
    });
  }

  public async refresh() {
    if (this._view) {
      this._view.webview.html = await this._getHtmlForWebview(this._view.webview);
    }
  }

  private async _getHtmlForWebview(webview: vscode.Webview): Promise<string> {
    return await this._generateDashboardHtml();
  }

  private async _generateDashboardHtml(): Promise<string> {
    const stats = await this.historyManager.getStats();
    const topPrompts = await this.historyManager.getTopPrompts(5);
    const prompts = this.promptProvider.getAllPrompts();

    // ヒートマップデータ生成（過去90日）
    const heatmapData = this._generateHeatmapData(stats.dailyActivity);

    // 今日、今週、今月の統計
    const today = new Date();
    const todayStr = this._getDateString(today);
    const todayCount = stats.dailyActivity[todayStr] || 0;

    const weekCount = this._getCountForPastDays(stats.dailyActivity, 7);
    const monthCount = this._getCountForPastDays(stats.dailyActivity, 30);

    // バッジの描画
    const badgesHtml = this._generateBadgesHtml(stats.badges);

    // TOP 5プロンプトの描画
    const topPromptsHtml = topPrompts.map((tp, index) => {
      const prompt = prompts.find(p => p.id === tp.promptId);
      const name = prompt?.name || tp.promptId;
      return `<div class="top-prompt">
        <span class="rank">${index + 1}.</span>
        <span class="name">${name}</span>
        <span class="count">(${tp.count}回)</span>
      </div>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ダッシュボード</title>
  <style>
    body {
      padding: 16px;
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background-color: var(--vscode-editor-background);
    }
    h2 {
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid var(--vscode-panel-border);
      padding-bottom: 8px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: var(--vscode-editor-inactiveSelectionBackground);
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: var(--vscode-textLink-foreground);
    }
    .stat-label {
      font-size: 12px;
      margin-top: 4px;
      opacity: 0.8;
    }
    .heatmap {
      display: grid;
      grid-template-columns: repeat(13, 1fr);
      gap: 4px;
      margin: 16px 0;
    }
    .heatmap-cell {
      aspect-ratio: 1;
      border-radius: 2px;
      background: var(--vscode-input-background);
    }
    .heatmap-cell.level-0 { opacity: 0.2; }
    .heatmap-cell.level-1 { background: #0e4429; }
    .heatmap-cell.level-2 { background: #006d32; }
    .heatmap-cell.level-3 { background: #26a641; }
    .heatmap-cell.level-4 { background: #39d353; }
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 16px 0;
    }
    .badge {
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
    }
    .top-prompt {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    .top-prompt .rank {
      width: 30px;
      font-weight: bold;
    }
    .top-prompt .name {
      flex: 1;
    }
    .top-prompt .count {
      opacity: 0.7;
      font-size: 12px;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <h1>📊 ダッシュボード</h1>
  
  ${stats.totalUsage === 0 ? `
    <div class="empty-state">
      <p>📝 プロンプトを使ってみましょう！<br>使用するたびに統計が表示されます。</p>
    </div>
  ` : `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">🔥 ${stats.currentStreak}</div>
        <div class="stat-label">連続使用日数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${todayCount}</div>
        <div class="stat-label">今日</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalUsage}</div>
        <div class="stat-label">累計使用回数</div>
      </div>
    </div>

    <h2>📈 アクティビティ（過去90日）</h2>
    <div class="heatmap">
      ${heatmapData}
    </div>

    ${stats.badges.length > 0 ? `
      <h2>🏆 獲得バッジ</h2>
      <div class="badges">
        ${badgesHtml}
      </div>
    ` : ''}

    ${topPrompts.length > 0 ? `
      <h2>⭐ よく使うプロンプト TOP 5</h2>
      <div class="top-prompts">
        ${topPromptsHtml}
      </div>
    ` : ''}

    <div style="margin-top: 24px; padding: 16px; background: var(--vscode-textBlockQuote-background); border-radius: 8px;">
      <p style="margin: 0; font-size: 14px;">
        💪 今週の使用: ${weekCount}回<br>
        📅 今月の使用: ${monthCount}回
      </p>
    </div>
  `}
</body>
</html>`;
  }

  private _generateHeatmapData(dailyActivity: { [date: string]: number }): string {
    const cells: string[] = [];
    const today = new Date();
    
    // 過去90日分
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this._getDateString(date);
      const count = dailyActivity[dateStr] || 0;
      
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 5) level = 3;
      if (count >= 8) level = 4;
      
      cells.push(`<div class="heatmap-cell level-${level}" title="${dateStr}: ${count}回"></div>`);
    }
    
    return cells.join('');
  }

  private _generateBadgesHtml(badges: string[]): string {
    const badgeNames: { [key: string]: string } = {
      'first_step': '🎉 First Step',
      'getting_started': '⚡ Getting Started',
      'regular_user': '🌟 Regular User',
      'power_user': '💪 Power User',
      'week_warrior': '🔥 Week Warrior',
      'monthly_master': '👑 Monthly Master'
    };

    return badges.map(b => `<div class="badge">${badgeNames[b] || b}</div>`).join('');
  }

  private _getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private _getCountForPastDays(dailyActivity: { [date: string]: number }, days: number): number {
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this._getDateString(date);
      count += dailyActivity[dateStr] || 0;
    }
    
    return count;
  }
}
