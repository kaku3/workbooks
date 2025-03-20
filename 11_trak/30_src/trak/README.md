# Trak

チケット管理システム

## 機能

- チケットの作成・編集・削除
- テンプレートベースのチケット作成
- Markdownによるチケット内容の記述
- ユーザー割り当て
- ステータス管理

## 開発環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## ディレクトリ構成

```
trak/
├── src/
│   ├── app/          # Next.js アプリケーション
│   │   └── api/      # APIエンドポイント
│   ├── components/   # Reactコンポーネント
│   ├── lib/          # ユーティリティ関数
│   └── styles/       # スタイルシート
├── trak-data/        # アプリケーションデータ
│   ├── configs/      # 設定ファイル
│   │   ├── templates.json  # テンプレート設定
│   │   ├── users.json      # ユーザー設定
│   │   └── statuses.json   # ステータス設定
│   └── templates/    # テンプレートファイル
│       ├── bug.md         # バグ報告
│       ├── feature.md     # 機能要望
│       └── task.md        # タスク
└── public/           # 静的ファイル

## 設定ファイル

### users.json
ユーザー情報を管理するファイル。
各ユーザーのID、名前、メールアドレス、ロールを定義。

### statuses.json
チケットのステータスを定義するファイル。
ステータスごとの名前、色を設定可能。

### templates.json
チケットテンプレートの設定ファイル。
テンプレートの種類と対応するMarkdownファイルを定義。

## テンプレート

テンプレートはMarkdown形式で管理され、`trak-data/templates/`ディレクトリに配置。

- `bug.md`: バグ報告用テンプレート
- `feature.md`: 機能要望用テンプレート
- `task.md`: タスク用テンプレート

## スタイリング

- CSSモジュールを使用
- カラーシステムはカスタムプロパティで管理
- レスポンシブデザイン対応
- アクセシビリティに配慮したUI

## 使用技術

- Next.js (App Router)
- TypeScript
- SCSS Modules
- Markdown
