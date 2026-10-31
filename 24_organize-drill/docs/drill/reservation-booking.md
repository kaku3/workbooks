# 会議室の予約

- 問題ID：`reservation-booking`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「会議室の予約」の打ち合わせ後に残った資料です。

### 課題

資料の順番に惑わされず、必要な付箋を選んで図にしてください。

## 資料の断片（現行データ）

### 要求仕様

- 画面の雰囲気は現行システムに近づける

### 要件

- 参考：会議室の壁紙

### 外部設計

- 「空き状況を確認」の結果で「予約を確定」／「別日時を選び直す」に分岐

### 詳細設計（現行データ）

- 「予約を確定」完了後に「予約完了を通知」を呼び出す
- 「日時と会議室を選択」完了後に「空き状況を確認」を呼び出す
- APIのタイムアウトは設定ファイルで管理

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
