# 決済オーソリ

- 問題ID：`zukai-payment-auth`
- 直接開く：`src/index.html?drill=zukai-payment-auth`
- 難易度：hard
- 出典：`src/data/problems.json`

## 要求仕様

購入内容が妥当で決済の承認が得られた注文を確定したい。不備や承認失敗は、利用者が修正できるように案内する。 今回の図の対象：購入確定の操作から、内容検証と決済結果に応じた注文の扱いまでを対象とする。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 購入確定の操作で送られた内容を、決済に回せるか検証する。（内部種別：要件・要求／根拠：購入確定を実行 → 購入内容を検証）
2. 不備がある購入内容は修正を依頼する。決済代行に渡せるのは検証済みの内容だけ。（内部種別：要件・要求／根拠：購入内容を検証 → 決済代行へ承認要求、購入内容を検証 → 購入内容の修正を依頼）
3. 配送先の表示は、郵便番号、住所、宛名の順にそろえ、利用者が確認しやすくしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| zukai-payment-auth-doc-04 | 注文の確定に使う承認結果は、今回の決済代行への要求に対する応答で確認する。 | 要件・要求 | 決済代行へ承認要求 → 承認結果を判定 |
| zukai-payment-auth-doc-05 | 決済の承認が得られれば注文を成立させる。承認されない場合は支払い方法を入力し直してもらう。 | 要件・要求 | 承認結果を判定 → 注文を確定<br>承認結果を判定 → 支払い方法を再入力 |
| zukai-payment-auth-doc-06 | 利用者に表示する注文番号は、成立した注文に発行された番号とする。 | 要件・要求 | 注文を確定 → 注文番号を表示 |

## ヒント

購入内容の確認と、決済代行から返る結果は別の段階です。結果によって次の行き先が変わるところを探しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-payment-auth-n1` | 必要 | 購入確定を実行 |
| `zukai-payment-auth-n2` | 必要 | 決済代行へ承認要求 |
| `zukai-payment-auth-n3` | 必要 | 承認結果を判定 |
| `zukai-payment-auth-n4` | 必要 | 注文を確定 |
| `zukai-payment-auth-n5` | 必要 | 注文番号を表示 |
| `zukai-payment-auth-n6` | 必要 | 支払い方法を再入力 |
| `zukai-payment-auth-x1` | 余分・参考 | 配送先住所の表示順 |
| `zukai-payment-auth-n7` | 必要 | 購入内容を検証 |
| `zukai-payment-auth-n8` | 必要 | 購入内容の修正を依頼 |

## グループ

- **決済要求と判定**：`zukai-payment-auth-n1`, `zukai-payment-auth-n2`, `zukai-payment-auth-n3`
- **承認後の完了**：`zukai-payment-auth-n4`, `zukai-payment-auth-n5`

## 正解の接続

- `zukai-payment-auth-n1` → `zukai-payment-auth-n7`
- `zukai-payment-auth-n7` → `zukai-payment-auth-n2`
- `zukai-payment-auth-n7` → `zukai-payment-auth-n8`
- `zukai-payment-auth-n2` → `zukai-payment-auth-n3`
- `zukai-payment-auth-n3` → `zukai-payment-auth-n4`
- `zukai-payment-auth-n4` → `zukai-payment-auth-n5`
- `zukai-payment-auth-n3` → `zukai-payment-auth-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-payment-auth-n1` | 0.13 | 0.5 |
| `zukai-payment-auth-n2` | 0.315 | 0.5 |
| `zukai-payment-auth-n3` | 0.5 | 0.5 |
| `zukai-payment-auth-n4` | 0.685 | 0.22 |
| `zukai-payment-auth-n6` | 0.685 | 0.78 |
| `zukai-payment-auth-n5` | 0.87 | 0.5 |
| `zukai-payment-auth-n7` | 0.3 | 0.88 |
| `zukai-payment-auth-n8` | 0.88 | 0.88 |

## 解説

購入内容の検証で問題が見つかった場合は修正を依頼し、問題がなければ決済代行へ承認を要求します。承認時は注文と注文番号を確定し、非承認時は支払い方法の再入力へ進みます。

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
