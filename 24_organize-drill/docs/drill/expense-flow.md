# 経費申請の確認を整理する

- 問題ID：`expense-flow`
- 難易度：hard
- 出典：`src/data/problems.json`

## 問題文

「経費申請の確認を整理する」の設計見直しで出た記述です。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「申請者が経費を申請する」の結果で「上長が承認可否を判定する」／「経理が領収書の不備を確認する」を使い分けたい
- 操作研修の資料は別途用意

### 要件

- 「申請者が経費を申請する」完了後に「上長が承認可否を判定する」へ進む
- 同時利用は最大50人

### 外部設計

- エラー表示の色は共通スタイルに合わせる
- 「上長が承認可否を判定する」の結果で「経理が振込を依頼する」／「申請者へ却下理由を通知する」に分岐

### 詳細設計（現行データ）

- 「人事が研修予定を更新する」は担当者間で認識が異なる
- 「経理が領収書の不備を確認する」の戻り値で「経理が振込を依頼する」／「領収書の修正を依頼する」を切り替える
- 「経理が振込を依頼する」完了後に「申請者へ結果を通知する」を呼び出す

## ヒント

確認することが複数あり、同時に進められるものもありそうです。判断の結果と、複数の確認がそろった後の処理に注目しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `submit-expense` | 必要 | 申請者が経費を申請する |
| `manager-approve` | 必要 | 上長が承認可否を判定する |
| `check-receipt` | 必要 | 経理が領収書の不備を確認する |
| `request-transfer` | 必要 | 経理が振込を依頼する |
| `notify-applicant` | 必要 | 申請者へ結果を通知する |
| `update-training` | 余分・参考 | 人事が研修予定を更新する |
| `manager-reject` | 必要 | 申請者へ却下理由を通知する |
| `receipt-correction` | 必要 | 領収書の修正を依頼する |

## グループ

- **並行する2つの確認**：`manager-approve`, `check-receipt`
- **支払いと結果連絡**：`request-transfer`, `notify-applicant`

## 正解の接続

- `submit-expense` → `manager-approve`
- `submit-expense` → `check-receipt`
- `manager-approve` → `request-transfer`
- `manager-approve` → `manager-reject`
- `check-receipt` → `request-transfer`
- `check-receipt` → `receipt-correction`
- `request-transfer` → `notify-applicant`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `submit-expense` | 0.16 | 0.5 |
| `manager-approve` | 0.42 | 0.23 |
| `check-receipt` | 0.42 | 0.77 |
| `request-transfer` | 0.62 | 0.5 |
| `notify-applicant` | 0.84 | 0.5 |
| `manager-reject` | 0.72 | 0.86 |
| `receipt-correction` | 0.88 | 0.86 |

## 解説

上長が承認し、領収書に不備がない場合に振込へ進みます。却下時は理由を申請者に知らせ、領収書に不備があれば修正を依頼します。人事の研修予定はこの処理に含めません。

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
