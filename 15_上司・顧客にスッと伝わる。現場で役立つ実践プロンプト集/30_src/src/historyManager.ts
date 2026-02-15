import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { UserStats, UsageSession, PromptStats, DailyStats } from './types';

export class HistoryManager {
  private context: vscode.ExtensionContext;
  private workspaceRoot: string;
  private historyPath: string;

  constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
    this.context = context;
    this.workspaceRoot = workspaceRoot;
    this.historyPath = path.join(workspaceRoot, '.mentor-ai', 'history');
    this.ensureHistoryDir();
  }

  private ensureHistoryDir(): void {
    if (!fs.existsSync(this.historyPath)) {
      fs.mkdirSync(this.historyPath, { recursive: true });
    }
  }

  async recordUsage(promptId: string, promptName: string): Promise<void> {
    const stats = await this.getStats();
    
    // 統計更新
    stats.totalUsage++;
    
    // プロンプト別統計更新
    if (!stats.promptStats[promptId]) {
      stats.promptStats[promptId] = {
        count: 0,
        firstUsed: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };
    }
    stats.promptStats[promptId].count++;
    stats.promptStats[promptId].lastUsed = new Date().toISOString();

    // 日次アクティビティ更新
    const today = this.getDateString(new Date());
    stats.dailyActivity[today] = (stats.dailyActivity[today] || 0) + 1;

    // ストリーク計算
    this.updateStreak(stats);

    // バッジチェック
    this.checkAndAwardBadges(stats);

    await this.saveStats(stats);

    // セッション記録
    await this.saveSession(promptId, promptName);

    // 通知
    if (vscode.workspace.getConfiguration('mentorAi').get('enableNotifications')) {
      this.showUsageNotification(stats, promptName);
    }
  }

  private updateStreak(stats: UserStats): void {
    const dates = Object.keys(stats.dailyActivity).sort().reverse();
    if (dates.length === 0) {
      stats.currentStreak = 0;
      return;
    }

    let streak = 0;
    const today = this.getDateString(new Date());
    let checkDate = new Date();

    // 今日から過去に向かって連続日数をカウント
    while (true) {
      const dateStr = this.getDateString(checkDate);
      if (stats.dailyActivity[dateStr] && stats.dailyActivity[dateStr] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    stats.currentStreak = streak;
    if (streak > stats.longestStreak) {
      stats.longestStreak = streak;
    }
  }

  private checkAndAwardBadges(stats: UserStats): void {
    const badges = new Set(stats.badges);
    let newBadges: string[] = [];

    // 初回使用
    if (stats.totalUsage === 1 && !badges.has('first_step')) {
      badges.add('first_step');
      newBadges.push('🎉 First Step バッジを獲得！');
    }

    // 使用回数マイルストーン
    if (stats.totalUsage >= 10 && !badges.has('getting_started')) {
      badges.add('getting_started');
      newBadges.push('⚡ Getting Started バッジを獲得！');
    }
    if (stats.totalUsage >= 50 && !badges.has('regular_user')) {
      badges.add('regular_user');
      newBadges.push('🌟 Regular User バッジを獲得！');
    }
    if (stats.totalUsage >= 100 && !badges.has('power_user')) {
      badges.add('power_user');
      newBadges.push('💪 Power User バッジを獲得！');
    }

    // ストリークバッジ
    if (stats.currentStreak >= 7 && !badges.has('week_warrior')) {
      badges.add('week_warrior');
      newBadges.push('🔥 Week Warrior バッジを獲得！（7日連続）');
    }
    if (stats.currentStreak >= 30 && !badges.has('monthly_master')) {
      badges.add('monthly_master');
      newBadges.push('👑 Monthly Master バッジを獲得！（30日連続）');
    }

    stats.badges = Array.from(badges);

    // 新しいバッジの通知
    if (newBadges.length > 0 && vscode.workspace.getConfiguration('mentorAi').get('showBadges')) {
      vscode.window.showInformationMessage(newBadges.join('\n'));
    }
  }

  private showUsageNotification(stats: UserStats, promptName: string): void {
    const count = stats.promptStats[Object.keys(stats.promptStats).find(k => 
      stats.promptStats[k].lastUsed === new Date().toISOString()
    ) || '']?.count || 0;

    if (count === 5) {
      vscode.window.showInformationMessage(
        `🎖️ 「${promptName}」を5回使用しました！習慣化できていますね。`
      );
    }

    if (stats.currentStreak === 7) {
      vscode.window.showInformationMessage(
        `🔥 7日連続使用達成！素晴らしい継続力です！`
      );
    }
  }

  async saveSession(promptId: string, promptName: string): Promise<void> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const sessionDir = path.join(this.historyPath, String(year), month, day);
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const sessionFiles = fs.readdirSync(sessionDir).filter(f => f.startsWith('session-'));
    const sessionNum = sessionFiles.length + 1;
    const sessionFile = path.join(sessionDir, `session-${String(sessionNum).padStart(3, '0')}.md`);

    const content = `---
date: ${now.toISOString()}
prompt: ${promptName}
promptId: ${promptId}
---

# セッション記録

## 使用プロンプト
${promptName}

## 生成ファイル
（後で追記可能）

## 振り返りメモ
（後で追記可能）
`;

    fs.writeFileSync(sessionFile, content, 'utf-8');
  }

  async getStats(): Promise<UserStats> {
    const statsFile = path.join(this.historyPath, 'stats.json');
    
    if (fs.existsSync(statsFile)) {
      try {
        const content = fs.readFileSync(statsFile, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    // デフォルト統計
    return {
      totalUsage: 0,
      currentStreak: 0,
      longestStreak: 0,
      badges: [],
      promptStats: {},
      dailyActivity: {}
    };
  }

  async saveStats(stats: UserStats): Promise<void> {
    const statsFile = path.join(this.historyPath, 'stats.json');
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf-8');
  }

  private getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getDailyActivity(days: number = 365): Promise<{ [date: string]: number }> {
    const stats = await this.getStats();
    return stats.dailyActivity;
  }

  async getTopPrompts(limit: number = 5): Promise<Array<{ promptId: string; count: number }>> {
    const stats = await this.getStats();
    const entries = Object.entries(stats.promptStats)
      .map(([promptId, stat]) => ({ promptId, count: stat.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    return entries;
  }
}
