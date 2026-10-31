# 請求書の支払い

- 問題ID：`invoice-payment`
- 難易度：easy
- 出典：`src/data/problems.json`

## 問題文

「請求書の支払い」の打ち合わせ後に残った資料です。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「請求書を受領」の後に「金額と明細を照合」を行いたい
- 「請求書を受領」を実現したい

### 要件

- 応答時間は3秒以内
- 機能要件：金額と明細を照合
- 「承認後に振込」完了後に「支払記録を保存」へ進む

### 外部設計

- 「金額と明細を照合」の次に「承認を依頼」を行う

### 詳細設計（現行データ）

- 「承認を依頼」完了後に「承認後に振込」を呼び出す
- 内部処理：承認後に振込
- 内部処理：承認を依頼
- 内部処理：支払記録を保存
- 参考：請求書の紙色

## ヒント

支払いに進む前に、内容の確認が必要です。問題が見つかった場合の戻し先も考えてみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `invoice-payment-n1` | 必要 | 請求書を受領 |
| `invoice-payment-n2` | 必要 | 金額と明細を照合 |
| `invoice-payment-n3` | 必要 | 承認を依頼 |
| `invoice-payment-n4` | 必要 | 承認後に振込 |
| `invoice-payment-n5` | 必要 | 支払記録を保存 |
| `invoice-payment-x1` | 余分・参考 | 請求書の紙色 |

## グループ

- **受領と照合**：`invoice-payment-n1`, `invoice-payment-n2`
- **承認と支払い**：`invoice-payment-n3`, `invoice-payment-n4`, `invoice-payment-n5`

## 正解の接続

- `invoice-payment-n1` → `invoice-payment-n2`
- `invoice-payment-n2` → `invoice-payment-n3`
- `invoice-payment-n3` → `invoice-payment-n4`
- `invoice-payment-n4` → `invoice-payment-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `invoice-payment-n1` | 0.13 | 0.5 |
| `invoice-payment-n2` | 0.315 | 0.5 |
| `invoice-payment-n3` | 0.5 | 0.5 |
| `invoice-payment-n4` | 0.685 | 0.5 |
| `invoice-payment-n5` | 0.87 | 0.5 |

## 解説

この図では、請求書を受領 → 金額と明細を照合 → 承認を依頼 → 承認後に振込 → 支払記録を保存の関係を整理します。明細に問題がある場合は承認へ回さず差し戻します。「請求書の紙色」は今回の流れに含めません。

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
