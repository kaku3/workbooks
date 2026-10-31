# アカウントの一時停止

- 問題ID：`account-suspension`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「アカウントの一時停止」の設計見直しで出た記述です。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 画面の雰囲気は現行システムに近づける

### 要件

- 「アカウント画面のテーマ色」は担当者間で認識が異なる
- 「本人確認を完了」完了後に「アカウントを再開」へ進む
- 同時利用は最大50人
- 「確認期限まで応答を待つ」完了後に「アカウントを一時停止」へ進む

### 外部設計

_（記載なし）_

### 詳細設計（現行データ）

- 「不審な利用を検知」完了後に「本人へ確認を依頼」を呼び出す
- 「本人へ確認を依頼」の戻り値で「確認期限まで応答を待つ」／「本人確認を完了」を切り替える

## ヒント

本人から返事がない場合と、本人確認ができた場合では、その後が変わります。待つ処理と判断後の処理を見分けましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `account-suspension-n1` | 必要 | 不審な利用を検知 |
| `account-suspension-n2` | 必要 | 本人へ確認を依頼 |
| `account-suspension-n3` | 必要 | 確認期限まで応答を待つ |
| `account-suspension-n4` | 必要 | アカウントを一時停止 |
| `account-suspension-n5` | 必要 | 本人確認を完了 |
| `account-suspension-n6` | 必要 | アカウントを再開 |
| `account-suspension-x1` | 余分・参考 | アカウント画面のテーマ色 |

## グループ

- **検知と確認**：`account-suspension-n1`, `account-suspension-n2`, `account-suspension-n3`
- **停止と再開**：`account-suspension-n4`, `account-suspension-n5`, `account-suspension-n6`

## 正解の接続

- `account-suspension-n1` → `account-suspension-n2`
- `account-suspension-n2` → `account-suspension-n3`
- `account-suspension-n3` → `account-suspension-n4`
- `account-suspension-n2` → `account-suspension-n5`
- `account-suspension-n5` → `account-suspension-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `account-suspension-n1` | 0.13 | 0.5 |
| `account-suspension-n2` | 0.377 | 0.5 |
| `account-suspension-n3` | 0.623 | 0.22 |
| `account-suspension-n5` | 0.623 | 0.78 |
| `account-suspension-n4` | 0.87 | 0.22 |
| `account-suspension-n6` | 0.87 | 0.78 |

## 解説

この図では、不審な利用を検知 → 本人へ確認を依頼 → 確認期限まで応答を待つ → アカウントを一時停止 → 本人確認を完了 → アカウントを再開の関係を整理します。応答がない場合の停止と、確認完了後の再開を分けます。「アカウント画面のテーマ色」は今回の流れに含めません。

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
