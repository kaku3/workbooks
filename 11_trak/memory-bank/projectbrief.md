# プロジェクト概要

Trakは、VS Code + gitを用いたチケット管理システムです。AIエージェント(Cline)との連携を考慮し、チケットはデータベースではなくファイルシステムで管理します。

## 主要目標

- VS Code環境でのチケット管理の実現
- AIエージェントとの効率的な連携
- 柔軟な閲覧・管理機能の提供

## スコープ

### コア機能
- チケット管理（発行、編集、ステータス変更）
- 複数ビュー形式での閲覧（ガントチャート、テーブル等）
- ユーザー管理・認証
- 設定管理

### 技術要件
- Next.jsアプリケーション
- VS Code統合
- Gitバージョン管理
- Node.js実行環境

## 重要な制約条件

1. チケットはマークダウンファイルとして管理
   - 1チケット1マークダウンファイル
   - ファイル名規則: {4桁連番}_{タイトル}.md

2. チケット情報の管理
   - チケットファイル: tickets/フォルダ
   - トラッキング情報: trackings/フォルダ（JSON形式）

3. 設定情報
   - configs/フォルダで管理
   - 項目別ファイル分割
