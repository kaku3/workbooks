# 施設利用の予約

- 問題ID：`facility-reservation`
- 直接開く：`src/index.html?drill=facility-reservation`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

施設の空き状況と承認条件に応じて予約を確定したい。今回は空きのある日時の予約を扱う。 今回の図の対象：社員が施設を予約する流れ。条件によっては、管理者の承認を待ってから確定する。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 空き状況を調べるには、希望する利用日時が必要になる。（内部種別：要件・要求／根拠：利用日時を選ぶ → 空き状況を確認）
2. 空いている利用枠について、管理者の承認が必要かを確認する。（内部種別：要件・要求／根拠：空き状況を確認 → 承認が必要か判定）
3. 施設の案内写真では、入口と車椅子用の通路が分かるようにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| facility-reservation-doc-04 | 承認不要の枠はそのまま予約できる。承認が必要な枠は管理者の判断を求める。 | 要件・要求 | 承認が必要か判定 → 予約を確定<br>承認が必要か判定 → 管理者が承認 |
| facility-reservation-doc-05 | 承認が必要な枠の予約は、管理者の承認を得た場合だけ確定する。 | 要件・要求 | 管理者が承認 → 承認後に予約確定 |

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
