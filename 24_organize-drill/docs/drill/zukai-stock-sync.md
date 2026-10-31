# 在庫連携バッチ

- 問題ID：`zukai-stock-sync`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「在庫連携バッチ」の設計見直しで出た記述です。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 資料の断片（現行データ）

### 要求仕様

- 「在庫CSVを送信」の後に「処理結果CSVを受信」を行いたい

### 要件

- 「CSVの列順の詳細」は担当者間で認識が異なる
- 参考：実行サーバー名
- 操作ログは1年間保存

### 外部設計

- 「処理結果CSVを受信」の結果で「成功時刻を記録」／「失敗行を担当者へ通知」に分岐

### 詳細設計（現行データ）

- 「毎時バッチを開始」完了後に「在庫CSVを送信」を呼び出す
- 保存先テーブル名は開発標準に従う

## ヒント

データを送った後、結果を受け取ります。成功した場合と問題があった場合で、記録や連絡が変わる点に注目しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-stock-sync-n1` | 必要 | 毎時バッチを開始 |
| `zukai-stock-sync-n2` | 必要 | 在庫CSVを送信 |
| `zukai-stock-sync-n3` | 必要 | 処理結果CSVを受信 |
| `zukai-stock-sync-n4` | 必要 | 成功時刻を記録 |
| `zukai-stock-sync-n5` | 必要 | 失敗行を担当者へ通知 |
| `zukai-stock-sync-x1` | 余分・参考 | CSVの列順の詳細 |
| `zukai-stock-sync-x2` | 余分・参考 | 実行サーバー名 |

## グループ

- **外部連携**：`zukai-stock-sync-n2`, `zukai-stock-sync-n3`
- **結果処理**：`zukai-stock-sync-n4`, `zukai-stock-sync-n5`

## 正解の接続

- `zukai-stock-sync-n1` → `zukai-stock-sync-n2`
- `zukai-stock-sync-n2` → `zukai-stock-sync-n3`
- `zukai-stock-sync-n3` → `zukai-stock-sync-n4`
- `zukai-stock-sync-n3` → `zukai-stock-sync-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-stock-sync-n1` | 0.13 | 0.5 |
| `zukai-stock-sync-n2` | 0.377 | 0.5 |
| `zukai-stock-sync-n3` | 0.623 | 0.5 |
| `zukai-stock-sync-n4` | 0.87 | 0.22 |
| `zukai-stock-sync-n5` | 0.87 | 0.78 |

## 解説

この図では、毎時バッチを開始 → 在庫CSVを送信 → 処理結果CSVを受信 → 成功時刻を記録 → 失敗行を担当者へ通知の関係を整理します。CSVの列順などの詳細設定は今回の処理の流れから分けます。「CSVの列順の詳細」「実行サーバー名」は今回の流れに含めません。

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
