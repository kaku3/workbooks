# アンケート結果の公開

- 問題ID：`survey-publish`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「アンケート結果の公開」の設計見直しで出た記述です。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「アンケート画面のデザイン」も論点に挙がったが未決定
- 画面の雰囲気は現行システムに近づける
- 「回答期間を終了」の後に「回答データを集計」を行いたい

### 要件

- 「公開不可の箇所を除外」完了後に「集計結果を公開」へ進む

### 外部設計

- 「公開可能か判定」の結果で「集計結果を公開」／「公開不可の箇所を除外」に分岐
- 「個人特定の可能性を確認」の次に「公開可能か判定」を行う

### 詳細設計（現行データ）

- 「回答データを集計」完了後に「個人特定の可能性を確認」を呼び出す
- APIのタイムアウトは設定ファイルで管理

## ヒント

集計結果をそのまま公開できるとは限りません。公開できない情報があった場合の扱いを考えてみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `survey-publish-n1` | 必要 | 回答期間を終了 |
| `survey-publish-n2` | 必要 | 回答データを集計 |
| `survey-publish-n3` | 必要 | 個人特定の可能性を確認 |
| `survey-publish-n4` | 必要 | 公開可能か判定 |
| `survey-publish-n5` | 必要 | 集計結果を公開 |
| `survey-publish-n6` | 必要 | 公開不可の箇所を除外 |
| `survey-publish-x1` | 余分・参考 | アンケート画面のデザイン |

## グループ

- **集計と確認**：`survey-publish-n1`, `survey-publish-n2`, `survey-publish-n3`, `survey-publish-n4`
- **公開処理**：`survey-publish-n5`, `survey-publish-n6`

## 正解の接続

- `survey-publish-n1` → `survey-publish-n2`
- `survey-publish-n2` → `survey-publish-n3`
- `survey-publish-n3` → `survey-publish-n4`
- `survey-publish-n4` → `survey-publish-n5`
- `survey-publish-n4` → `survey-publish-n6`
- `survey-publish-n6` → `survey-publish-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `survey-publish-n1` | 0.16 | 0.25 |
| `survey-publish-n2` | 0.16 | 0.75 |
| `survey-publish-n3` | 0.5 | 0.25 |
| `survey-publish-n4` | 0.5 | 0.75 |
| `survey-publish-n6` | 0.84 | 0.25 |
| `survey-publish-n5` | 0.84 | 0.75 |

## 解説

この図では、回答期間を終了 → 回答データを集計 → 個人特定の可能性を確認 → 公開可能か判定 → 集計結果を公開 → 公開不可の箇所を除外の関係を整理します。個人が特定される箇所は除外してから公開します。「アンケート画面のデザイン」は今回の流れに含めません。

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
