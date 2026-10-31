# 会議室の予約

- 問題ID：`reservation-booking`
- 直接開く：`src/index.html?drill=reservation-booking`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

空いている会議室を予約し、予約結果を利用者に伝えたい。満室なら別日時を選べるようにする。 今回の図の対象：社員が会議室を予約する流れ。空き状況によって、予約が確定するか、選び直しになるかが変わる。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 空き状況は、利用者が選んだ日時と会議室を組み合わせて調べる。（内部種別：要件・要求／根拠：日時と会議室を選択 → 空き状況を確認）
2. 空きがあれば予約できる。埋まっている場合は別日時の選び直しを案内する。（内部種別：要件・要求／根拠：空き状況を確認 → 予約を確定、空き状況を確認 → 別日時を選び直す）
3. 会議室の壁紙はオンライン会議の背景に映っても文字が見づらくならない柄にしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| reservation-booking-doc-04 | 予約の通知には確定した部屋と日時を載せる。 | 要件・要求 | 予約を確定 → 予約完了を通知 |

## ヒント

空き状況を確認した結果で、その後の行き先が変わります。予約できない場合の動きも探してみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `reservation-booking-n1` | 必要 | 日時と会議室を選択 |
| `reservation-booking-n2` | 必要 | 空き状況を確認 |
| `reservation-booking-n3` | 必要 | 予約を確定 |
| `reservation-booking-n4` | 必要 | 予約完了を通知 |
| `reservation-booking-n5` | 必要 | 別日時を選び直す |
| `reservation-booking-x1` | 余分・参考 | 会議室の壁紙 |

## グループ

- **予約条件の確認**：`reservation-booking-n1`, `reservation-booking-n2`
- **確認結果**：`reservation-booking-n3`, `reservation-booking-n4`, `reservation-booking-n5`

## 正解の接続

- `reservation-booking-n1` → `reservation-booking-n2`
- `reservation-booking-n2` → `reservation-booking-n3`
- `reservation-booking-n3` → `reservation-booking-n4`
- `reservation-booking-n2` → `reservation-booking-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `reservation-booking-n1` | 0.13 | 0.5 |
| `reservation-booking-n2` | 0.377 | 0.5 |
| `reservation-booking-n3` | 0.623 | 0.22 |
| `reservation-booking-n5` | 0.623 | 0.78 |
| `reservation-booking-n4` | 0.87 | 0.5 |

## 解説

この図では、日時と会議室を選択 → 空き状況を確認 → 予約を確定 → 予約完了を通知 → 別日時を選び直すの関係を整理します。空きがない場合と空いている場合を分けます。「会議室の壁紙」は今回の流れに含めません。

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
