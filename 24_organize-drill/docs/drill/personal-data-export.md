# 個人データの開示請求

- 問題ID：`personal-data-export`
- 難易度：easy
- 出典：`src/data/problems.json`

## 問題文

「個人データの開示請求」に関する資料の断片です。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「対象データを抽出」の後に「データファイルを作成」を行いたい
- 「データファイルを作成」を実現したい
- 「開示請求を受け付ける」を実現したい
- 「対象データを抽出」を実現したい
- 「本人確認を行う」を実現したい
- 「データ保管場所の詳細」も論点に挙がったが未決定
- 「開示請求を受け付ける」の後に「本人確認を行う」を行いたい

### 要件

_（記載なし）_

### 外部設計

- 「本人確認を行う」の次に「対象データを抽出」を行う
- 利用者から見える動き：本人へ受取方法を案内

### 詳細設計（現行データ）

- 「データファイルを作成」完了後に「本人へ受取方法を案内」を呼び出す
- 保存先テーブル名は開発標準に従う

## ヒント

個人データを抽出する前に、本人からの請求か確認する必要があります。確認と抽出の順番に注目しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `personal-data-export-n1` | 必要 | 開示請求を受け付ける |
| `personal-data-export-n2` | 必要 | 本人確認を行う |
| `personal-data-export-n3` | 必要 | 対象データを抽出 |
| `personal-data-export-n4` | 必要 | データファイルを作成 |
| `personal-data-export-n5` | 必要 | 本人へ受取方法を案内 |
| `personal-data-export-x1` | 余分・参考 | データ保管場所の詳細 |

## グループ

- **請求と本人確認**：`personal-data-export-n1`, `personal-data-export-n2`
- **データ準備**：`personal-data-export-n3`, `personal-data-export-n4`, `personal-data-export-n5`

## 正解の接続

- `personal-data-export-n1` → `personal-data-export-n2`
- `personal-data-export-n2` → `personal-data-export-n3`
- `personal-data-export-n3` → `personal-data-export-n4`
- `personal-data-export-n4` → `personal-data-export-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `personal-data-export-n1` | 0.13 | 0.5 |
| `personal-data-export-n2` | 0.315 | 0.5 |
| `personal-data-export-n3` | 0.5 | 0.5 |
| `personal-data-export-n4` | 0.685 | 0.5 |
| `personal-data-export-n5` | 0.87 | 0.5 |

## 解説

この図では、開示請求を受け付ける → 本人確認を行う → 対象データを抽出 → データファイルを作成 → 本人へ受取方法を案内の関係を整理します。本人確認が終わってからデータを抽出します。「データ保管場所の詳細」は今回の流れに含めません。

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
