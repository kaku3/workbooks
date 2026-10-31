# 勤怠システムの責務分離

- 問題ID：`zukai-attendance-role`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「勤怠システムの責務分離」に関する資料の断片です。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「社員が出退勤を打刻」の後に「システムが勤務時間を算出」を行いたい

### 要件

- 「上長が休暇を承認」完了後に「人事が勤怠を確認」へ進む
- 「社員が休暇を申請」完了後に「上長が休暇を承認」へ進む
- 「システムが勤務時間を算出」完了後に「人事が勤怠を確認」へ進む
- 操作ログは1年間保存

### 外部設計

- 「人事が勤怠を確認」の次に「給与計算へ勤務データを連携」を行う
- 「部署ごとの休憩ルール詳細」も論点に挙がったが未決定

### 詳細設計（現行データ）

- 保存先テーブル名は開発標準に従う
- 参考：Excelへの二重転記

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
