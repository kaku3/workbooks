# 休暇申請

- 問題ID：`leave-request`
- 難易度：hard
- 出典：`src/data/problems.json`

## 問題文

「休暇申請」について集めたメモです。

### 課題

資料の順番に惑わされず、必要な付箋を選んで図にしてください。

## 資料の断片（現行データ）

### 要求仕様

- 導入時期は繁忙期を避ける
- 「社員が休暇を申請」の後に「休暇日数の上限を確認」を行いたい

### 要件

- 「承認するか判定」完了後に「休暇予定を登録」へ進む
- 「却下理由を通知」完了後に「申請者へ結果を通知」へ進む
- 同時利用は最大50人

### 外部設計

- 画面文言は後日確定
- 「社内カレンダーの色」も論点に挙がったが未決定

### 詳細設計（現行データ）

- 「休暇予定を登録」完了後に「申請者へ結果を通知」を呼び出す
- 「承認するか判定」の戻り値で「休暇予定を登録」／「却下理由を通知」を切り替える
- 「上長が申請を確認」完了後に「承認するか判定」を呼び出す
- 「休暇日数の上限を確認」の戻り値で「上長が申請を確認」／「申請日数の修正を依頼」を切り替える

## ヒント

日数の確認と、上長の判断は別のチェックです。どの条件で予定を登録できるのか、結果の違いに注目しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `leave-request-n1` | 必要 | 社員が休暇を申請 |
| `leave-request-n2` | 必要 | 上長が申請を確認 |
| `leave-request-n3` | 必要 | 承認するか判定 |
| `leave-request-n4` | 必要 | 休暇予定を登録 |
| `leave-request-n5` | 必要 | 却下理由を通知 |
| `leave-request-n6` | 必要 | 申請者へ結果を通知 |
| `leave-request-x1` | 余分・参考 | 社内カレンダーの色 |
| `leave-request-n7` | 必要 | 休暇日数の上限を確認 |
| `leave-request-n8` | 必要 | 申請日数の修正を依頼 |

## グループ

- **申請と判断**：`leave-request-n1`, `leave-request-n2`, `leave-request-n3`
- **承認結果**：`leave-request-n4`, `leave-request-n5`, `leave-request-n6`

## 正解の接続

- `leave-request-n1` → `leave-request-n7`
- `leave-request-n7` → `leave-request-n2`
- `leave-request-n7` → `leave-request-n8`
- `leave-request-n2` → `leave-request-n3`
- `leave-request-n3` → `leave-request-n4`
- `leave-request-n3` → `leave-request-n5`
- `leave-request-n4` → `leave-request-n6`
- `leave-request-n5` → `leave-request-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `leave-request-n1` | 0.13 | 0.5 |
| `leave-request-n2` | 0.315 | 0.5 |
| `leave-request-n3` | 0.5 | 0.5 |
| `leave-request-n4` | 0.685 | 0.22 |
| `leave-request-n5` | 0.685 | 0.78 |
| `leave-request-n6` | 0.87 | 0.5 |
| `leave-request-n7` | 0.3 | 0.88 |
| `leave-request-n8` | 0.88 | 0.88 |

## 解説

日数が上限を超える場合は申請日数の修正を依頼し、範囲内なら上長確認へ進みます。上長の承認時は休暇予定を登録し、却下時は理由を通知します。どちらの結果も申請者へ知らせます。

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
