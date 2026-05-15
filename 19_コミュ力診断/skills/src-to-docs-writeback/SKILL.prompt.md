---
name: src-to-docs-writeback
description: "src から docs へ現在の実装を仕様書として書き戻す。実装事実ベースで docs/ReadMe.md を更新し、変更しやすいチェック項目は別冊 CHECKLIST.md を参照して検証する。"
user-invocable: true
---

# Src To Docs Writeback

## 目的

`src` の現行実装を一次情報として扱い、`docs/ReadMe.md` を実装準拠に更新する。

## 入出力

- 入力:
  - `src/index.html`
  - `src/check.html`
  - `src/types.html`
  - `src/history.html`
  - `src/data.js`
  - `src/style.css`
  - `docs/ReadMe.md`
  - `CHECKLIST.md`（このスキルと同じフォルダ）
- 出力:
  - 更新済み `docs/ReadMe.md`
  - 必要に応じて `docs` 配下の補助ドキュメント

## 作業原則

1. 実装に存在しない仕様を追記しない。
2. 実装に存在するが仕様に未記載の項目は追記する。
3. 推測ではなく、コード上の根拠を持って記述する。
4. チェック観点の追加・削除は `CHECKLIST.md` にのみ反映する（本体に重複保持しない）。
5. 仕様書本文は読み手向け、チェックは運用者向けとして責務分離する。

## 手順

1. `CHECKLIST.md` を読み、対象観点を確定する。
2. `src` の実装から事実を抽出する。
3. `docs/ReadMe.md` の章立てに沿って反映する。
4. 仕様に残すべき「判断待ち」項目が解消済みなら、解消内容へ更新する。
5. 最後に `CHECKLIST.md` を使って差分漏れを検証する。

## 書き戻しルール

- 画面構成は実在ページを正として更新する（例: `history.html` の有無）。
- 設問数・設問文・重み行列は `data.js` を正とする。
- 判定閾値・正規化ロジックは `data.js` の関数実装を正とする。
- ローカル保存・URL共有・履歴仕様は `check.html` / `history.html` の実装を正とする。
- 見た目の方針は `style.css` と各HTML内スタイルの実装を正とする。

## 非目標

- `src` の機能追加・リファクタリング
- デザイン改修
- 仕様策定会議向けの提案書作成

## 完了条件

- `docs/ReadMe.md` が実装と矛盾しない。
- 主要ロジック（設問、採点、判定、画面、保存）が記載済み。
- 検証は `CHECKLIST.md` の全項目で確認済み。

## メンテナンス

チェック観点の仕様変更は `CHECKLIST.md` のみを編集し、`SKILL.md` には原則手順のみを保持する。
