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

## コンポーネント構造

```mermaid
flowchart TD
    subgraph Pages
        Main[MainPage] --> Table[TableView]
        Main --> Gantt[GanttView]
        Main --> New[新規チケット]

        subgraph TableComponents
            Table --> Sort[SortHeader]
            Table --> Cells[Cell Components]
            Table --> Edit[Edit Components]
            
            subgraph Cells[Cell Components]
                Status[StatusCell]
                Id[IdCell]
                Date[DateCell]
                Estimate[EstimateCell]
            end

            subgraph Edit[Edit Components]
                Title[TitleInput]
                Assignee[AssigneeInput]
                AssigneeL[AssigneeList]
                DateE[DateInput]
                EstimateE[EstimateInput]
            end
        end
    end

    subgraph Forms
        TicketForm --> MetaInfo[メタ情報]
        TicketForm --> Editor[マークダウンエディタ]
        
        subgraph MetaInfo[メタ情報セクション]
            Title[タイトル]
            Row[横一列]
            Row --> Assignee[担当者]
            Row --> Status[ステータス]
            Row --> DueDate[期限]
            Row --> Estimate[見積]
        end
    end

    subgraph UI Components
        MUI[Material-UI]
        MDEditor[react-md-editor]
        Custom[カスタムコンポーネント]
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
   - ステータス定義（statuses.json）
     - ID
     - 名前
     - 説明
   - テンプレート管理（templates/）
     - タスクテンプレート
     - 障害票テンプレート

## 主要なデザインパターン

1. コンポーネントパターン
   - Atomic Design
     - Atoms: 基本入力要素
     - Molecules: フォームグループ
     - Organisms: フォーム全体
   - Container/Presentational
     - ロジック分離
     - UI再利用性向上

2. フォーム管理パターン
   - Controlled Components
   - バリデーション分離
   - エラーハンドリング集約

3. データフローパターン
   - 単方向データフロー
   - イミュータブルな状態管理
   - APIデータの適切なキャッシュ

4. レスポンシブパターン
   - モバイルファースト
   - フレックスボックスレイアウト
   - ブレークポイント管理

## UI/UXパターン

1. フォームデザイン
   - インライン検証
   - リアルタイムフィードバック
   - プログレッシブ拡張

2. インタラクション
   - インクリメンタルサーチ
   - ドラッグ＆ドロップ
   - ショートカットキー

3. エラー処理
   - エラーバウンダリ
   - フォールバックUI
   - グレースフルデグラデーション

## データ永続化パターン

1. ファイルベース
   - マークダウン（チケット本文）
   - JSON（メタデータ）
   - 設定ファイル

2. キャッシュ戦略
   - ブラウザキャッシュ
   - APIレスポンスキャッシュ
   - オートセーブ

3. 同期管理
   - 楽観的ロック
   - 競合解決
   - 差分マージ
