# 経費精算フローの再設計

- 問題ID：`zukai-expense-redesign`
- 直接開く：`src/index.html?drill=zukai-expense-redesign`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

経費をWebで申請し、不備の修正や承認を経て支払いたい。申請者は自分の進捗をWebで確認できること。 今回の図の対象：Web申請を導入する経費精算で、入力の確認から承認、支払い、進捗の確認までを新しい流れに整理する。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. Webで受け付けた申請は入力確認の対象になる。同時に申請者向けの進捗確認も可能にしたい。（内部種別：要件・要求／根拠：申請者がWeb申請 → 入力内容をチェック、申請者がWeb申請 → 進捗をWebで確認）
2. 不備があれば申請者に差し戻す。部門長に判断を求めるのは、入力がそろった申請とする。（内部種別：要件・要求／根拠：入力内容をチェック → 不備を差し戻す、入力内容をチェック → 部門長へ承認依頼）
3. 経理担当者の異動後も申請内容を参照できるよう、担当の引継先を一覧にしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| zukai-expense-redesign-doc-04 | 支払いの対象は、部門長が承認した申請だけ。 | 要件・要求 | 部門長へ承認依頼 → 承認後に支払い |
| zukai-expense-redesign-doc-05 | 月末に申請が集中しても、通常時と同じ操作で入力できる応答速度を保ちたい。 | スコープ外 | —（図に含めない） |

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
