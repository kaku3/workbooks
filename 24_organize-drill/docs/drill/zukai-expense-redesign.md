# 経費精算フローの再設計

- 問題ID：`zukai-expense-redesign`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「経費精算フローの再設計」について集めたメモです。

### 課題

資料の順番に惑わされず、必要な付箋を選んで図にしてください。

## 資料の断片（現行データ）

### 要求仕様

- 参考：申請集中の現状
- 「経理担当者の異動予定」も論点に挙がったが未決定
- 導入時期は繁忙期を避ける
- 「入力内容をチェック」の結果で「不備を差し戻す」／「部門長へ承認依頼」を使い分けたい

### 要件

- 「部門長へ承認依頼」完了後に「承認後に支払い」へ進む

### 外部設計

_（記載なし）_

### 詳細設計（現行データ）

- 「申請者がWeb申請」の戻り値で「入力内容をチェック」／「進捗をWebで確認」を切り替える
- 保存先テーブル名は開発標準に従う

## ヒント

新しい申請の流れと、現状の課題・背景情報を分けて考えましょう。利用者が途中経過を確認する動きもあります。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-expense-redesign-n1` | 必要 | 申請者がWeb申請 |
| `zukai-expense-redesign-n2` | 必要 | 入力内容をチェック |
| `zukai-expense-redesign-n3` | 必要 | 不備を差し戻す |
| `zukai-expense-redesign-n4` | 必要 | 部門長へ承認依頼 |
| `zukai-expense-redesign-n5` | 必要 | 承認後に支払い |
| `zukai-expense-redesign-n6` | 必要 | 進捗をWebで確認 |
| `zukai-expense-redesign-x1` | 余分・参考 | 経理担当者の異動予定 |
| `zukai-expense-redesign-x2` | 余分・参考 | 申請集中の現状 |

## グループ

- **申請と確認**：`zukai-expense-redesign-n1`, `zukai-expense-redesign-n2`, `zukai-expense-redesign-n3`
- **承認と支払い**：`zukai-expense-redesign-n4`, `zukai-expense-redesign-n5`

## 正解の接続

- `zukai-expense-redesign-n1` → `zukai-expense-redesign-n2`
- `zukai-expense-redesign-n2` → `zukai-expense-redesign-n3`
- `zukai-expense-redesign-n2` → `zukai-expense-redesign-n4`
- `zukai-expense-redesign-n4` → `zukai-expense-redesign-n5`
- `zukai-expense-redesign-n1` → `zukai-expense-redesign-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-expense-redesign-n1` | 0.13 | 0.5 |
| `zukai-expense-redesign-n2` | 0.377 | 0.22 |
| `zukai-expense-redesign-n6` | 0.377 | 0.78 |
| `zukai-expense-redesign-n3` | 0.623 | 0.22 |
| `zukai-expense-redesign-n4` | 0.623 | 0.78 |
| `zukai-expense-redesign-n5` | 0.87 | 0.5 |

## 解説

この図では、申請者がWeb申請 → 入力内容をチェック → 不備を差し戻す → 部門長へ承認依頼 → 承認後に支払い → 進捗をWebで確認の関係を整理します。現行の課題や人員事情は背景情報で、新方式の処理と分けます。「経理担当者の異動予定」「申請集中の現状」は今回の流れに含めません。

## レビュー・見直しメモ

### 問題の狙い

_（記入）_

### 要求仕様として自然か

_（記入）_

### 要件・外部設計の粒度は適切か

_（記入）_

### 図にする範囲・正解接続に無理がないか

_（記入）_

### ヒントの改善案

_（記入）_
