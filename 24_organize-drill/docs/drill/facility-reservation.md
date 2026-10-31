# 施設利用の予約

- 問題ID：`facility-reservation`
- 直接開く：`src/index.html?drill=facility-reservation`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「施設利用の予約」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 段階開示資料

左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。

### 最初に表示する3枚

1. 外部設計｜処理概要（外部設計）：社員が施設を予約する流れ。条件によっては、管理者の承認を待ってから確定する。
2. 開発標準メモ（スコープ外）：保存先テーブル名は開発標準に従う。
3. 広報メモ（スコープ外）：施設の案内写真は、広報が年度ごとに更新している。

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| 要件メモ | 「利用日時を選ぶ」が終わったら、「空き状況を確認」に移る。 | 要件・要求 | 利用日時を選ぶ → 空き状況を確認 |
| 詳細設計｜内部処理 | 「空き状況を確認」が終わったら、「承認が必要か判定」に移る。 | 詳細設計 | 空き状況を確認 → 承認が必要か判定 |
| 要件メモ | 「承認が必要か判定」の結果に応じて、「予約を確定」、「管理者が承認」のいずれかへ進む。 | 要件・要求 | 承認が必要か判定 → 予約を確定<br>承認が必要か判定 → 管理者が承認 |
| 詳細設計｜内部処理 | 「管理者が承認」を受けて、「承認後に予約確定」につなぐ。 | 詳細設計 | 管理者が承認 → 承認後に予約確定 |
| 帳票メモ | 帳票レイアウトは別紙を参照する。 | スコープ外 | —（図に含めない） |
| 研修メモ | 操作研修の資料は別途用意する。 | スコープ外 | —（図に含めない） |

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
