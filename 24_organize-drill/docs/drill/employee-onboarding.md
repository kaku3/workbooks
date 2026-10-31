# 新入社員の受け入れ

- 問題ID：`employee-onboarding`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「新入社員の受け入れ」の設計見直しで出た記述です。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

_（記載なし）_

### 要件

- 「利用権限を設定」完了後に「初日の案内を送信」へ進む
- 参考：オフィスの座席写真
- 「端末と備品を準備」完了後に「初日の案内を送信」へ進む
- 同時利用は最大50人
- 「アカウントを発行」完了後に「利用権限を設定」へ進む

### 外部設計

- エラー表示の色は共通スタイルに合わせる

### 詳細設計（現行データ）

- 「入社情報を受領」の戻り値で「アカウントを発行」／「端末と備品を準備」を切り替える

## ヒント

準備作業のすべてが一本道とは限りません。並行して進められる作業と、案内を送る前に必要な準備を探しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `employee-onboarding-n1` | 必要 | 入社情報を受領 |
| `employee-onboarding-n2` | 必要 | アカウントを発行 |
| `employee-onboarding-n3` | 必要 | 端末と備品を準備 |
| `employee-onboarding-n4` | 必要 | 利用権限を設定 |
| `employee-onboarding-n5` | 必要 | 初日の案内を送信 |
| `employee-onboarding-x1` | 余分・参考 | オフィスの座席写真 |

## グループ

- **受け入れ準備**：`employee-onboarding-n1`, `employee-onboarding-n2`, `employee-onboarding-n3`, `employee-onboarding-n4`
- **初日案内**：`employee-onboarding-n5`

## 正解の接続

- `employee-onboarding-n1` → `employee-onboarding-n2`
- `employee-onboarding-n1` → `employee-onboarding-n3`
- `employee-onboarding-n2` → `employee-onboarding-n4`
- `employee-onboarding-n3` → `employee-onboarding-n5`
- `employee-onboarding-n4` → `employee-onboarding-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `employee-onboarding-n1` | 0.13 | 0.5 |
| `employee-onboarding-n2` | 0.377 | 0.22 |
| `employee-onboarding-n3` | 0.377 | 0.78 |
| `employee-onboarding-n4` | 0.623 | 0.5 |
| `employee-onboarding-n5` | 0.87 | 0.5 |

## 解説

この図では、入社情報を受領 → アカウントを発行 → 端末と備品を準備 → 利用権限を設定 → 初日の案内を送信の関係を整理します。アカウントと備品の準備は並行し、必要な準備後に案内します。「オフィスの座席写真」は今回の流れに含めません。

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
