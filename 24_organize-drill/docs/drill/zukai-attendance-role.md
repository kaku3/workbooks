# 勤怠システムの責務分離

- 問題ID：`zukai-attendance-role`
- 直接開く：`src/index.html?drill=zukai-attendance-role`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

打刻と休暇申請を勤怠に反映し、人事の確認した勤務データを給与計算へ渡したい。 今回の図の対象：勤怠の打刻と休暇の申請を、人事の確認を経て給与計算へ渡すまでの役割分担を整理する。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 勤務時間の算出には、社員が記録した出勤・退勤の時刻を使う。（内部種別：要件・要求／根拠：社員が出退勤を打刻 → システムが勤務時間を算出）
2. 休暇の承認対象は、社員本人から届いた申請とする。（内部種別：要件・要求／根拠：社員が休暇を申請 → 上長が休暇を承認）
3. 現在のExcelへの二重転記を減らし、月次集計の入力負担を小さくしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| zukai-attendance-role-doc-04 | 人事はシステムが算出した勤務時間を勤怠確認に使う。 | 要件・要求 | システムが勤務時間を算出 → 人事が勤怠を確認 |
| zukai-attendance-role-doc-05 | 人事が確認する勤怠には、上長が承認した休暇も反映する。勤務時間と休暇の両方をそろえたい。 | 要件・要求 | 上長が休暇を承認 → 人事が勤怠を確認 |
| zukai-attendance-role-doc-06 | 給与計算に渡すのは、人事が確認を終えた勤務データだけ。 | 要件・要求 | 人事が勤怠を確認 → 給与計算へ勤務データを連携 |
| zukai-attendance-role-doc-07 | 部署ごとに異なる休憩時間の計算条件を設定で変更できるようにしたい。 | スコープ外 | —（図に含めない） |

## ヒント

打刻と休暇申請は別々に始まります。担当者ごとの作業と、それらの結果を受けて行う確認を見分けましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-attendance-role-n1` | 必要 | 社員が出退勤を打刻 |
| `zukai-attendance-role-n2` | 必要 | システムが勤務時間を算出 |
| `zukai-attendance-role-n3` | 必要 | 社員が休暇を申請 |
| `zukai-attendance-role-n4` | 必要 | 上長が休暇を承認 |
| `zukai-attendance-role-n5` | 必要 | 人事が勤怠を確認 |
| `zukai-attendance-role-n6` | 必要 | 給与計算へ勤務データを連携 |
| `zukai-attendance-role-x1` | 余分・参考 | Excelへの二重転記 |
| `zukai-attendance-role-x2` | 余分・参考 | 部署ごとの休憩ルール詳細 |

## グループ

- **打刻と休暇承認**：`zukai-attendance-role-n1`, `zukai-attendance-role-n2`, `zukai-attendance-role-n3`, `zukai-attendance-role-n4`
- **確認と連携**：`zukai-attendance-role-n5`, `zukai-attendance-role-n6`

## 正解の接続

- `zukai-attendance-role-n1` → `zukai-attendance-role-n2`
- `zukai-attendance-role-n3` → `zukai-attendance-role-n4`
- `zukai-attendance-role-n2` → `zukai-attendance-role-n5`
- `zukai-attendance-role-n4` → `zukai-attendance-role-n5`
- `zukai-attendance-role-n5` → `zukai-attendance-role-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-attendance-role-n1` | 0.13 | 0.22 |
| `zukai-attendance-role-n3` | 0.13 | 0.78 |
| `zukai-attendance-role-n2` | 0.377 | 0.22 |
| `zukai-attendance-role-n4` | 0.377 | 0.78 |
| `zukai-attendance-role-n5` | 0.623 | 0.5 |
| `zukai-attendance-role-n6` | 0.87 | 0.5 |

## 解説

この図では、社員が出退勤を打刻 → システムが勤務時間を算出 → 社員が休暇を申請 → 上長が休暇を承認 → 人事が勤怠を確認 → 給与計算へ勤務データを連携の関係を整理します。社員・上長・システム・人事の担当範囲を意識します。「Excelへの二重転記」「部署ごとの休憩ルール詳細」は今回の流れに含めません。

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
