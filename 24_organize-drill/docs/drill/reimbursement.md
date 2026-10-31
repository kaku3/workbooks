# 出張経費の精算

- 問題ID：`reimbursement`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「出張経費の精算」について集めたメモです。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

_（記載なし）_

### 要件

- 「社員が経費を申請」完了後に「領収書を添付」へ進む
- 「上長が承認」完了後に「経費を支払う」へ進む
- 「経理が金額を確認」の後は状況に応じて「不備を差し戻す」／「上長が承認」へ進む

### 外部設計

- 帳票レイアウトは別紙参照

### 詳細設計（現行データ）

- 「領収書を添付」完了後に「経理が金額を確認」を呼び出す
- 保存先テーブル名は開発標準に従う
- 参考：出張先の観光情報

## ヒント

金額の確認で不備が見つかった場合、承認へ進む前に対応が必要です。確認結果の違いに注目しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `reimbursement-n1` | 必要 | 社員が経費を申請 |
| `reimbursement-n2` | 必要 | 領収書を添付 |
| `reimbursement-n3` | 必要 | 経理が金額を確認 |
| `reimbursement-n4` | 必要 | 不備を差し戻す |
| `reimbursement-n5` | 必要 | 上長が承認 |
| `reimbursement-n6` | 必要 | 経費を支払う |
| `reimbursement-x1` | 余分・参考 | 出張先の観光情報 |

## グループ

- **申請と確認**：`reimbursement-n1`, `reimbursement-n2`, `reimbursement-n3`
- **確認後の処理**：`reimbursement-n4`, `reimbursement-n5`, `reimbursement-n6`

## 正解の接続

- `reimbursement-n1` → `reimbursement-n2`
- `reimbursement-n2` → `reimbursement-n3`
- `reimbursement-n3` → `reimbursement-n4`
- `reimbursement-n3` → `reimbursement-n5`
- `reimbursement-n5` → `reimbursement-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `reimbursement-n1` | 0.13 | 0.5 |
| `reimbursement-n2` | 0.315 | 0.5 |
| `reimbursement-n3` | 0.5 | 0.5 |
| `reimbursement-n4` | 0.685 | 0.22 |
| `reimbursement-n5` | 0.685 | 0.78 |
| `reimbursement-n6` | 0.87 | 0.5 |

## 解説

この図では、社員が経費を申請 → 領収書を添付 → 経理が金額を確認 → 不備を差し戻す → 上長が承認 → 経費を支払うの関係を整理します。証憑や金額に不備があれば承認前に差し戻します。「出張先の観光情報」は今回の流れに含めません。

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
