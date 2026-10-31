# アカウントの一時停止

- 問題ID：`account-suspension`
- 直接開く：`src/index.html?drill=account-suspension`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

不審な利用を本人に確認し、期限までに応答がなければ一時停止したい。本人と確認できたアカウントは利用できる状態にする。 今回の図の対象：不審な利用が見つかったアカウントについて、本人確認の結果に応じて停止または再開する流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. いつもと違う利用を検知したアカウントについて、本人に確認を求める。（内部種別：要件・要求／根拠：不審な利用を検知 → 本人へ確認を依頼）
2. 確認依頼には応答期限を設ける。本人からの回答があれば本人確認を行い、まだなければ期限まで待つ。（内部種別：要件・要求／根拠：本人へ確認を依頼 → 確認期限まで応答を待つ、本人へ確認を依頼 → 本人確認を完了）
3. アカウント画面は明るいテーマと暗いテーマを選べるようにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| account-suspension-doc-04 | 期限まで応答が得られないアカウントは一時停止する。 | 要件・要求 | 確認期限まで応答を待つ → アカウントを一時停止 |
| account-suspension-doc-05 | 本人の利用だと確認できたアカウントは、再び利用できる状態にする。 | 要件・要求 | 本人確認を完了 → アカウントを再開 |

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
