import * as vscode from 'vscode';
import { PromptItem } from './types';
import { PromptLoader } from './promptLoader';
import { HistoryManager } from './historyManager';

export class PromptTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly prompt?: PromptItem,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);

    if (prompt) {
      this.tooltip = prompt.description;
      this.description = prompt.usageCount > 0 ? `⚡×${prompt.usageCount}` : '';
      this.contextValue = 'prompt';
      
      // アイコン
      if (prompt.isFavorite) {
        this.iconPath = new vscode.ThemeIcon('star-full');
      } else {
        this.iconPath = new vscode.ThemeIcon('file-text');
      }
    }
  }
}

export class PromptProvider implements vscode.TreeDataProvider<PromptTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<PromptTreeItem | undefined | null | void> = 
    new vscode.EventEmitter<PromptTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<PromptTreeItem | undefined | null | void> = 
    this._onDidChangeTreeData.event;

  private promptLoader: PromptLoader;
  private historyManager: HistoryManager;
  private prompts: PromptItem[] = [];

  constructor(
    private workspaceRoot: string,
    private context: vscode.ExtensionContext
  ) {
    this.promptLoader = new PromptLoader(workspaceRoot);
    this.historyManager = new HistoryManager(context, workspaceRoot);
    this.loadPrompts();
  }

  refresh(): void {
    this.loadPrompts();
    this._onDidChangeTreeData.fire();
  }

  private async loadPrompts(): Promise<void> {
    this.prompts = await this.promptLoader.loadPrompts();
    console.log(`プロンプトを ${this.prompts.length} 件読み込みました`, this.prompts.map(p => p.name));
    
    // 統計からusageCountを読み込む
    const stats = await this.historyManager.getStats();
    for (const prompt of this.prompts) {
      if (stats.promptStats[prompt.id]) {
        prompt.usageCount = stats.promptStats[prompt.id].count;
      }
    }
  }

  getTreeItem(element: PromptTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: PromptTreeItem): Promise<PromptTreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('ワークスペースが開かれていません');
      return [];
    }

    if (element) {
      return [];
    }

    // ルートレベル - プロンプト一覧を表示
    const items: PromptTreeItem[] = [];

    // お気に入りセクション
    const favorites = this.prompts.filter(p => p.isFavorite);
    if (favorites.length > 0) {
      items.push(
        new PromptTreeItem(
          `⭐ お気に入り (${favorites.length})`,
          vscode.TreeItemCollapsibleState.Expanded
        )
      );
    }

    // 各プロンプト
    for (const prompt of this.prompts) {
      const treeItem = new PromptTreeItem(
        prompt.name,
        vscode.TreeItemCollapsibleState.None,
        prompt,
        {
          command: 'mentor-ai.showPromptDetail',
          title: 'プロンプト詳細を表示',
          arguments: [prompt]
        }
      );
      items.push(treeItem);
    }

    console.log(`TreeViewに ${items.length} 件のアイテムを表示します`);
    return items;
  }

  getPromptById(id: string): PromptItem | undefined {
    return this.prompts.find(p => p.id === id);
  }

  getAllPrompts(): PromptItem[] {
    return this.prompts;
  }

  async toggleFavorite(prompt: PromptItem): Promise<void> {
    prompt.isFavorite = !prompt.isFavorite;
    this.refresh();
  }
}
