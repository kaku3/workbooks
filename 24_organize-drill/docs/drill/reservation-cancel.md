# 予約キャンセル待ち

- 問題ID：`reservation-cancel`
- 直接開く：`src/index.html?drill=reservation-cancel`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

満席の施設でキャンセル待ちを受け付け、空席が出たら待ち順に予約を案内したい。 今回の図の対象：満席の予約に対してキャンセル待ちを受け付け、空きが出たときに利用者へ案内する流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. キャンセル待ちの登録対象は、満席で予約できなかった利用者とする。（内部種別：要件・要求／根拠：満席を確認 → キャンセル待ちを登録）
2. 待ち登録がある状態で既存予約の取消を受けることを、空席案内のきっかけにする。（内部種別：要件・要求／根拠：キャンセル待ちを登録 → 予約の取消を受け付ける）
3. 利用者が訪問先を見つけやすいよう、施設の外観写真を案内ページに載せたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| reservation-cancel-doc-04 | 取消で空いた枠の案内先は、待ち順の先頭から調べる。 | 要件・要求 | 予約の取消を受け付ける → 待ち順の先頭を確認 |
| reservation-cancel-doc-05 | 空席の連絡は、先頭として確認できた利用者に送る。 | 要件・要求 | 待ち順の先頭を確認 → 空席案内を送信 |
| reservation-cancel-doc-06 | 案内を受け取った利用者が予約を確定する。案内だけでは予約済みにしない。 | 要件・要求 | 空席案内を送信 → 利用者が予約を確定 |

## ヒント

満席の時点で行うことと、後から空きが出た時に行うことを時間の流れでつないでみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `reservation-cancel-n1` | 必要 | 満席を確認 |
| `reservation-cancel-n2` | 必要 | キャンセル待ちを登録 |
| `reservation-cancel-n3` | 必要 | 予約の取消を受け付ける |
| `reservation-cancel-n4` | 必要 | 待ち順の先頭を確認 |
| `reservation-cancel-n5` | 必要 | 空席案内を送信 |
| `reservation-cancel-n6` | 必要 | 利用者が予約を確定 |
| `reservation-cancel-x1` | 余分・参考 | 施設の外観写真 |

## グループ

- **待ち登録**：`reservation-cancel-n1`, `reservation-cancel-n2`
- **空席案内**：`reservation-cancel-n3`, `reservation-cancel-n4`, `reservation-cancel-n5`, `reservation-cancel-n6`

## 正解の接続

- `reservation-cancel-n1` → `reservation-cancel-n2`
- `reservation-cancel-n2` → `reservation-cancel-n3`
- `reservation-cancel-n3` → `reservation-cancel-n4`
- `reservation-cancel-n4` → `reservation-cancel-n5`
- `reservation-cancel-n5` → `reservation-cancel-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `reservation-cancel-n1` | 0.18 | 0.25 |
| `reservation-cancel-n2` | 0.18 | 0.75 |
| `reservation-cancel-n3` | 0.5 | 0.25 |
| `reservation-cancel-n4` | 0.5 | 0.75 |
| `reservation-cancel-n5` | 0.82 | 0.25 |
| `reservation-cancel-n6` | 0.82 | 0.75 |

## 解説

この図では、満席を確認 → キャンセル待ちを登録 → 予約の取消を受け付ける → 待ち順の先頭を確認 → 空席案内を送信 → 利用者が予約を確定の関係を整理します。満席時の登録と、後日空席が出た後の処理をつなぎます。「施設の外観写真」は今回の流れに含めません。

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
