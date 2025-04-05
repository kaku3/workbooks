# 技術コンテキスト

## 技術スタック

### フロントエンド
- Next.js
  - React
  - TypeScript
  - Material-UI (@mui/material)
  - NextAuth.js (認証)
  - カスタムガントチャート実装
    - Timeline コンポーネント
    - TaskList コンポーネント
    - Grid システム
    - 日付計算ユーティリティ

### バックエンド
- Next.js API Routes
  - RESTful APIエンドポイント
  - サービスレイヤーアーキテクチャ
  - TypeScript型安全性
- Node.js
- サービスレイヤー実装
  - preferences: ユーザー設定管理
  - config: システム設定管理
  - project: プロジェクト管理
  - statuses: ステータス定義管理
  - tags: タグ管理
  - templates: テンプレート管理
  - tickets: チケット操作
  - ticket-sort: 表示順序管理

### 開発環境
- VS Code
- Git
- APIエンドポイントテスト
  - Thunder Client
  - REST Client

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
- fs-extra ^11.2.0 (高度なファイル操作)

## 技術的制約

### サービスレイヤー設計
1. 責務の分離
   - 各サービスは単一の責務を持つ
   - ビジネスロジックとデータアクセスの分離
   - 再利用可能なユーティリティ関数の共有

2. エラーハンドリング
   - 統一されたエラー型の使用
   - エラーメッセージの標準化
   - エラー状態の適切な伝播

3. 非同期処理
   - Promise/async-await ベース
   - 適切なエラーバウンダリ
   - キャンセル処理の考慮

4. トランザクション管理
   - ファイル操作の整合性確保
   - ロールバックメカニズム
   - 競合解決戦略

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

## TableViewの実装詳細

### コンポーネント構成
1. メインコンポーネント
   - TableView: テーブル全体のコンテナ
   - StatusFilter: ステータスによるフィルタリング
   - SortHeader: カラムヘッダーとソート制御
   - TableCell: セルのレンダリングと編集

2. 特殊セルコンポーネント
   - HandleCell: ドラッグ&ドロップハンドル
   - IdCell: チケットID表示
   - TitleCell: タイトル表示と編集
   - StatusCell: ステータス表示と選択
   - DateCell: 日付表示と編集
   - EstimateCell: 見積もり表示と編集
   - AssigneeCell: 担当者表示と選択
   - DeleteCell: 削除操作

### 状態管理
1. useTableState
   ```typescript
   interface TableState {
     sortColumn: ColumnKey | null;
     sortDirection: SortDirection;
     selectedStatuses: string[];
     editingCell: { id: string; key: ColumnKey } | null;
   }
   ```

2. useDragAndDrop
   ```typescript
   interface DragAndDropState {
     activeId: string | null;
     handleDragStart: (id: string) => void;
     handleDragEnd: (sourceId: string, destinationId: string, direction: 'top' | 'bottom') => Promise<void>;
   }
   ```

### データモデル
1. カラム定義
   ```typescript
   interface Column {
     key: ColumnKey;
     label: string;
     sortable: boolean;
   }
   ```

2. チケットデータ
   ```typescript
   interface TicketData {
     id?: string;
     title: string;
     status: string;
     assignees: string[];
     startDate: string;
     dueDate: string;
     estimate: number;
     tags?: string[];
     userOrder?: number;
   }
   ```

### インタラクション制御
1. ドラッグ&ドロップ
   - HTML5 Drag and Drop API使用
   - ドラッグ中の視覚的フィードバック
   - 順序の自動更新と永続化

2. セル編集
   - クリックによる編集モード開始
   - クリックアウトによる保存
   - バリデーションと即時フィードバック

3. ソートとフィルタリング
   - カラムヘッダーによるソート切り替え
   - マルチステータスフィルタリング
   - カスタムソート順の保持

### スタイリング
1. モジュラーCSS
   - TableView.module.css: メインレイアウト
   - DragDrop.module.css: ドラッグ&ドロップ関連
   - 各セル専用のスタイルモジュール

2. レスポンシブ対応
   - フレックスボックスベースのレイアウト
   - ビューポートに応じた表示調整
   - タッチデバイス対応
