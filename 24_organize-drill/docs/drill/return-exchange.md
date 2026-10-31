# 返品・交換の受付

- 問題ID：`return-exchange`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「返品・交換の受付」に関する資料の断片です。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 資料の断片（現行データ）

### 要求仕様

_（記載なし）_

### 要件

- 「返品条件を判定」の後は状況に応じて「返送方法を案内」／「対象外の理由を通知」へ進む
- 参考：返品受付画面の配色

### 外部設計

- 帳票レイアウトは別紙参照

### 詳細設計（現行データ）

- 「返送品を受領」完了後に「返金または交換を処理」を呼び出す
- 「返送方法を案内」完了後に「返送品を受領」を呼び出す
- 「購入情報を確認」完了後に「返品条件を判定」を呼び出す
- 保存先テーブル名は開発標準に従う
- 「返品を申請」完了後に「購入情報を確認」を呼び出す

## ヒント

申請内容を確認した後、条件に合う場合と合わない場合で案内が変わります。その後の処理も追ってみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `return-exchange-n1` | 必要 | 返品を申請 |
| `return-exchange-n2` | 必要 | 購入情報を確認 |
| `return-exchange-n3` | 必要 | 返品条件を判定 |
| `return-exchange-n4` | 必要 | 返送方法を案内 |
| `return-exchange-n5` | 必要 | 対象外の理由を通知 |
| `return-exchange-n6` | 必要 | 返送品を受領 |
| `return-exchange-n7` | 必要 | 返金または交換を処理 |
| `return-exchange-x1` | 余分・参考 | 返品受付画面の配色 |

## グループ

- **申請と条件確認**：`return-exchange-n1`, `return-exchange-n2`, `return-exchange-n3`
- **返品後の処理**：`return-exchange-n4`, `return-exchange-n6`, `return-exchange-n7`

## 正解の接続

- `return-exchange-n1` → `return-exchange-n2`
- `return-exchange-n2` → `return-exchange-n3`
- `return-exchange-n3` → `return-exchange-n4`
- `return-exchange-n3` → `return-exchange-n5`
- `return-exchange-n4` → `return-exchange-n6`
- `return-exchange-n6` → `return-exchange-n7`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `return-exchange-n1` | 0.13 | 0.5 |
| `return-exchange-n2` | 0.31 | 0.5 |
| `return-exchange-n3` | 0.49 | 0.5 |
| `return-exchange-n4` | 0.67 | 0.25 |
| `return-exchange-n5` | 0.67 | 0.75 |
| `return-exchange-n6` | 0.84 | 0.25 |
| `return-exchange-n7` | 0.84 | 0.75 |

## 解説

この図では、返品を申請 → 購入情報を確認 → 返品条件を判定 → 返送方法を案内 → 対象外の理由を通知 → 返送品を受領 → 返金または交換を処理の関係を整理します。返品条件の判定後に案内を分岐します。「返品受付画面の配色」は今回の流れに含めません。

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
