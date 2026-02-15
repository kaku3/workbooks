# Mentor AI - プロンプト集 Extension 開発ガイド

## 開発環境のセットアップ

### 前提条件
- Node.js 20.x 以上
- npm 9.x 以上
- VS Code 1.85.0 以上

### インストール手順

1. 依存関係のインストール:
```powershell
cd mentor-ai\30_src
npm install
```

2. TypeScript のコンパイル:
```powershell
npm run compile
```

3. 開発モード（自動コンパイル）:
```powershell
npm run watch
```

### VS Code でのデバッグ

1. VS Code で `mentor-ai\30_src` フォルダを開く
2. F5 キーを押して Extension Development Host を起動
3. 新しいウィンドウで拡張機能がアクティブになる

## プロジェクト構造

```
mentor-ai/30_src/
├── src/
│   ├── extension.ts          # メインエントリポイント
│   ├── types.ts               # 型定義
│   ├── promptLoader.ts        # プロンプト読み込み
│   ├── promptProvider.ts      # TreeView プロバイダー
│   ├── historyManager.ts      # 履歴管理
│   └── dashboardView.ts       # ダッシュボード Webview
├── out/                       # コンパイル済み JavaScript
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript 設定
└── README.md                  # ドキュメント
```

## 主要コンポーネント

### extension.ts
- Extension のライフサイクル管理
- コマンド登録
- プロバイダーの初期化

### promptLoader.ts
- ワークスペースからプロンプトを読み込む
- 20_note.md と 90_prompt.md を解析

### promptProvider.ts
- サイドバーの TreeView を提供
- プロンプト一覧の表示
- お気に入り管理

### historyManager.ts
- 使用履歴の記録
- 統計データの管理
- バッジシステム
- ストリーク計算

### dashboardView.ts
- ダッシュボード Webview の提供
- ヒートマップの生成
- 統計の可視化

## 開発タスク

### 実装済み機能（Phase 1-3）
- ✅ プロンプト読み込み
- ✅ サイドバー表示
- ✅ コピー・挿入機能
- ✅ 使用履歴記録
- ✅ 統計ダッシュボード
- ✅ ヒートマップ表示
- ✅ バッジシステム
- ✅ ストリーク機能
- ✅ セッション記録

### 今後の実装（Phase 4）
- [ ] カスタムプロンプト追加機能
- [ ] テンプレートのインポート/エクスポート
- [ ] 目標設定機能
- [ ] 月次レポート生成
- [ ] 通知リマインダー

## テスト

### 手動テスト
1. F5 でデバッグ起動
2. サイドバーからプロンプト一覧を確認
3. プロンプトをコピー・挿入
4. ダッシュボードで統計を確認
5. 複数回使用してバッジ獲得を確認

### テストシナリオ
- [ ] プロンプトの読み込み
- [ ] コピー機能
- [ ] 挿入機能
- [ ] 履歴記録
- [ ] 統計表示
- [ ] バッジ獲得
- [ ] ストリーク計算
- [ ] お気に入り機能

## ビルド

### 開発ビルド
```powershell
npm run compile
```

### 本番ビルド
```powershell
npm run vscode:prepublish
```

### VSIX パッケージ作成
```powershell
# npx を使用（推奨 - グローバルインストール不要）
npx @vscode/vsce package

# または、グローバルインストールする場合
# npm install -g @vscode/vsce
# vsce package
```

**トラブルシューティング:**
- Volta 使用時に `npm install -g` でエラーが出る場合は `npx` を使用してください
- パッケージ作成時に Publisher が必要なエラーが出た場合は、`package.json` の `publisher` フィールドを確認してください

## 公開

### VS Code Marketplace への公開
```powershell
vsce publish
```

## トラブルシューティング

### コンパイルエラー
- `npm run compile` を実行
- `out/` フォルダを削除して再コンパイル

### Extension が読み込まれない
- VS Code を再起動
- Extension Development Host を再起動
- `package.json` のアクティベーションイベントを確認

### プロンプトが表示されない
- ワークスペースに各プロンプトフォルダが存在するか確認
- `20_note.md` と `90_prompt.md` が存在するか確認

## コントリビューションガイド

1. Issue を作成して議論
2. フォークしてブランチ作成
3. コードを実装
4. テストを実行
5. プルリクエストを作成

## ライセンス

MIT License
