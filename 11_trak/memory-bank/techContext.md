# 技術コンテキスト

## 技術スタック

### フロントエンド
- Next.js
  - React
  - TypeScript
  - Material-UI (@mui/material)
  - NextAuth.js (認証)
  - ガントチャート用ライブラリ（検討中）
  - テーブル用ライブラリ（検討中）

### バックエンド
- Next.js API Routes
- Node.js

### 開発環境
- VS Code
- Git

## システム要件

### 必須環境
- Node.js実行環境
- VS Code
- Git

### 依存関係
- Next.js ^14.1.0
- React ^18.2.0
- TypeScript ^5
- @mui/material ^6.4.8
- next-auth ^4.24.11
- zod ^3.24.2 (バリデーション)

## 技術的制約

### ファイルシステム
1. trak-data/フォルダ構造
   - すべてのデータファイルを一元管理
   - フォルダ構成の厳格な維持

2. チケットファイル（trak-data/tickets/）
   - 形式: Markdown
   - エンコーディング: UTF-8
   - 命名規則の厳守

3. トラッキングファイル（trak-data/trackings/）
   - 形式: JSON
   - 厳格なスキーマ定義

4. 設定ファイル（trak-data/configs/）
   - 形式: JSON
   - スキーマによる型定義
   - users.json: ユーザー認証情報の管理
     - id, name, email, role (admin/user)

5. テンプレートファイル（trak-data/templates/）
   - 形式: Markdown
   - 用途別のテンプレートファイル管理

### VS Code統合
- VS Code拡張機能として実装の可能性
- エディタとの円滑な連携

## 開発セットアップ

### 必要な開発ツール
- Node.js
- npm or yarn
- VS Code
- Git

### 開発フロー
1. ローカル開発環境
   - Next.js開発サーバー
   - ホットリロード対応
   - trak-data/フォルダの作成と初期化

2. バージョン管理
   - Gitによるバージョン管理
   - チケットファイルの変更追跡

3. デプロイメント
   - 検討中

## 認証システム

### 実装詳細
1. NextAuth.js による認証
   - JWT ベースのセッション管理
   - カスタムCredentialsプロバイダー
   - ロールベースのアクセス制御 (admin/user)

2. ファイル構成
   - src/auth/auth.ts: メイン認証設定
   - src/auth/serverAuth.ts: サーバーサイド認証
   - src/components/auth/: 認証関連コンポーネント

3. セッション管理
   - JWT strategy
   - セッション有効期限: 30日
   - カスタムセッション型定義

4. Next.js App Router対応
   - Server Components対応
   - Middleware による保護
   - クライアント/サーバーコンポーネントの適切な分離

## 実装時の注意点

### ファイルシステム操作
1. ファイルの読み書き
   - 非同期操作の適切な処理
   - エラーハンドリングの徹底
   - ファイルロックの考慮

2. テンプレート処理
   - 動的なテンプレート読み込み
   - フォームへの自動反映
   - 入力内容の検証

3. 同時編集対応
   - 競合の検出と解決
   - 楽観的ロックの実装検討

### データ整合性
1. トランザクション的な処理
   - チケットファイルとトラッキングファイルの同期
   - エラー時のロールバック考慮

2. バリデーション
   - スキーマに基づく検証
   - ビジネスルールの適用

### パフォーマンス考慮
1. ファイルアクセスの最適化
   - キャッシング戦略
   - 必要な情報のみ読み込み

2. 非同期処理
   - 効率的なファイル操作
   - UI応答性の確保
