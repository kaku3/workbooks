# 予約キャンセル待ち

- 問題ID：`reservation-cancel`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「予約キャンセル待ち」の打ち合わせ後に残った資料です。

### 課題

資料の順番に惑わされず、必要な付箋を選んで図にしてください。

## 資料の断片（現行データ）

### 要求仕様

- 「空席案内を送信」の後に「利用者が予約を確定」を行いたい
- 「キャンセル待ちを登録」の後に「予約の取消を受け付ける」を行いたい
- 導入時期は繁忙期を避ける

### 要件

_（記載なし）_

### 外部設計

- 「待ち順の先頭を確認」の次に「空席案内を送信」を行う
- 「予約の取消を受け付ける」の次に「待ち順の先頭を確認」を行う

### 詳細設計（現行データ）

- 「施設の外観写真」は担当者間で認識が異なる
- 「満席を確認」完了後に「キャンセル待ちを登録」を呼び出す
- 保存先テーブル名は開発標準に従う

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
