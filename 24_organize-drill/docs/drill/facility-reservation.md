# 施設利用の予約

- 問題ID：`facility-reservation`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「施設利用の予約」の打ち合わせ後に残った資料です。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

_（記載なし）_

### 要件

- 「承認が必要か判定」の後は状況に応じて「予約を確定」／「管理者が承認」へ進む
- 「管理者が承認」完了後に「承認後に予約確定」へ進む
- 「利用日時を選ぶ」完了後に「空き状況を確認」へ進む
- 参考：施設の案内写真

### 外部設計

- 「空き状況を確認」の次に「承認が必要か判定」を行う
- 帳票レイアウトは別紙参照

### 詳細設計（現行データ）

- 保存先テーブル名は開発標準に従う

## ヒント

予約の条件によっては、すぐ確定せずに承認を待つ必要があります。判断の結果と確定までの順番を整理しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `facility-reservation-n1` | 必要 | 利用日時を選ぶ |
| `facility-reservation-n2` | 必要 | 空き状況を確認 |
| `facility-reservation-n3` | 必要 | 承認が必要か判定 |
| `facility-reservation-n4` | 必要 | 予約を確定 |
| `facility-reservation-n5` | 必要 | 管理者が承認 |
| `facility-reservation-n6` | 必要 | 承認後に予約確定 |
| `facility-reservation-x1` | 余分・参考 | 施設の案内写真 |

## グループ

- **日時と空き確認**：`facility-reservation-n1`, `facility-reservation-n2`, `facility-reservation-n3`
- **予約確定**：`facility-reservation-n4`, `facility-reservation-n5`, `facility-reservation-n6`

## 正解の接続

- `facility-reservation-n1` → `facility-reservation-n2`
- `facility-reservation-n2` → `facility-reservation-n3`
- `facility-reservation-n3` → `facility-reservation-n4`
- `facility-reservation-n3` → `facility-reservation-n5`
- `facility-reservation-n5` → `facility-reservation-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `facility-reservation-n1` | 0.13 | 0.5 |
| `facility-reservation-n2` | 0.315 | 0.5 |
| `facility-reservation-n3` | 0.5 | 0.5 |
| `facility-reservation-n4` | 0.685 | 0.22 |
| `facility-reservation-n5` | 0.685 | 0.78 |
| `facility-reservation-n6` | 0.87 | 0.5 |

## 解説

この図では、利用日時を選ぶ → 空き状況を確認 → 承認が必要か判定 → 予約を確定 → 管理者が承認 → 承認後に予約確定の関係を整理します。承認不要ならすぐ確定し、必要な場合は承認後に確定します。「施設の案内写真」は今回の流れに含めません。

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
