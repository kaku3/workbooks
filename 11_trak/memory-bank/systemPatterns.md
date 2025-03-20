# システムパターン

## アーキテクチャ概要

```mermaid
flowchart TD
    UI[Next.js UI] --> Auth[NextAuth.js]
    UI --> API[API Routes]
    Auth --> API
    API --> FS[File System]
    FS --> TD[trak-data/]
    TD --> T[tickets/]
    TD --> TR[trackings/]
    TD --> C[configs/]
    TD --> TP[templates/]
```

## メインページ（SC201）コンポーネント構造

```mermaid
flowchart TD
    subgraph MainPage[メインページ]
        MC[MainContainer] --> TT[ツールバー]
        MC --> CV[コンテンツビュー]
        
        TT --> Tabs[ビュー切替]
        TT --> Search[検索バー]
        TT --> Filter[フィルター]
        TT --> New[新規チケット]
        
        CV --> TV[TableView]
        CV --> GV[GanttView]
        
        subgraph TableView[テーブルビュー]
            TC[テーブルコンテナ]
            CS[カラム設定]
            TH[ソートヘッダー]
        end
        
        subgraph GanttView[ガントチャートビュー]
            GC[ガントチャートコンテナ]
            Scale[スケール切替]
            TL[タイムライン]
        end
    end
```

## 認証アーキテクチャ

```mermaid
flowchart TD
    subgraph Client
        Pages[Pages] --> AuthProvider
        AuthProvider --> Session[SessionProvider]
    end
    
    subgraph Server
        Route[API Route] --> NextAuth
        NextAuth --> Users[users.json]
        NextAuth --> JWT[JWT Session]
    end
    
    subgraph Middleware
        Guard[Auth Middleware] --> Protected[Protected Routes]
    end
    
    Client --> Server
    Guard --> Client
```

## ファイルシステム設計

### データ管理（trak-data/）
すべてのデータを一元管理するルートフォルダ

1. チケットファイル（trak-data/tickets/）
   - 形式: マークダウン
   - 命名規則: `{4桁連番}_{タイトル}.md`
   - 内容: チケットの詳細情報

2. トラッキング情報（trak-data/trackings/）
   - 形式: JSON
   - 命名規則: `{4桁連番}.json`
   - 保持情報:
     - 担当者（複数可）
     - 起票日
     - 締め切り
     - 見積
     - ステータス

3. 設定管理（trak-data/configs/）
   - ユーザー管理（users.json）
     - ユーザーID
     - 名前
     - メールアドレス
     - ロール（admin/user）
   - チケットステータス定義（status.json）

4. テンプレート管理（trak-data/templates/）
   - 形式: マークダウン
   - 用途別テンプレート（例：タスク.md, 障害票.md）
   - チケット作成時に選択可能

## 主要なデザインパターン

1. コンポーネントパターン
   - メインページコンポーネント（MainPage）
     - 状態管理（viewMode, filters）
     - ビュー切替制御
   - ビューコンポーネント
     - TableView: ソート可能なテーブル表示
     - GanttView: タイムライン表示
   - 共通UIコンポーネント
     - 検索バー
     - フィルター
     - ボタン類

2. 一元管理パターン
   - trak-data/フォルダによるデータの集中管理
   - 明確なデータ分類と構造化

3. ファイルベースのデータストア
   - Git統合による変更追跡
   - AIエージェントとの連携容易性

4. マークダウン/JSONの分離
   - 人間可読性（マークダウン）
   - システム処理（JSON）の両立

## データフロー

```mermaid
sequenceDiagram
    participant UI as MainPage
    participant Table as TableView
    participant Gantt as GanttView
    participant API as API Routes
    participant Data as trak-data/

    UI->>API: チケット一覧要求
    API->>Data: データ読み込み
    Data-->>API: チケットデータ
    API-->>UI: チケット一覧
    
    Note over UI,Data: ビュー切替時
    UI->>Table: テーブル表示
    UI->>Gantt: ガントチャート表示
    
    Note over Table: ソート・フィルター
    Table->>Table: データ処理
    
    Note over Gantt: タイムライン表示
    Gantt->>Gantt: 期間計算
```

## セキュリティ考慮事項

1. 認証とアクセス制御
   - JWT ベースのセッション管理
   - ロールベースのアクセス制御（admin/user）
   - Protected Routes によるセキュリティ
   - Server/Client Component の適切な分離

2. ファイルアクセス制御
   - trak-data/フォルダへのアクセス制限
   - ユーザー権限に基づくファイル操作制御

3. データ整合性
   - Git管理による変更履歴追跡
   - 同時編集の競合管理

4. テンプレート管理
   - 承認されたテンプレートのみ使用可能
   - テンプレート更新時の変更管理
