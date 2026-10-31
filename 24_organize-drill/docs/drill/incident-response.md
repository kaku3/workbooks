# 障害発生時の初動

- 問題ID：`incident-response`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「障害発生時の初動」について集めたメモです。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 導入時期は繁忙期を避ける

### 要件

- 「緊急度を判定」完了後に「担当チームへ連絡」へ進む
- 「影響範囲を確認」完了後に「緊急度を判定」へ進む

### 外部設計

- 「回避策を実施」の次に「状況を利用者へ告知」を行う

### 詳細設計（現行データ）

- 入力項目の桁数・型はテーブル定義に従う
- 「当番表の印刷方法」は担当者間で認識が異なる
- 「障害アラートを受信」完了後に「影響範囲を確認」を呼び出す
- 「担当チームへ連絡」完了後に「回避策を実施」を呼び出す

## ヒント

アラートを受けたらすぐに対応するのではなく、影響と緊急度を見極めます。判断の後に誰が何をするか整理しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `incident-response-n1` | 必要 | 障害アラートを受信 |
| `incident-response-n2` | 必要 | 影響範囲を確認 |
| `incident-response-n3` | 必要 | 緊急度を判定 |
| `incident-response-n4` | 必要 | 担当チームへ連絡 |
| `incident-response-n5` | 必要 | 回避策を実施 |
| `incident-response-n6` | 必要 | 状況を利用者へ告知 |
| `incident-response-x1` | 余分・参考 | 当番表の印刷方法 |

## グループ

- **検知と判断**：`incident-response-n1`, `incident-response-n2`, `incident-response-n3`
- **初動対応**：`incident-response-n4`, `incident-response-n5`, `incident-response-n6`

## 正解の接続

- `incident-response-n1` → `incident-response-n2`
- `incident-response-n2` → `incident-response-n3`
- `incident-response-n3` → `incident-response-n4`
- `incident-response-n4` → `incident-response-n5`
- `incident-response-n5` → `incident-response-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `incident-response-n1` | 0.18 | 0.25 |
| `incident-response-n2` | 0.18 | 0.75 |
| `incident-response-n3` | 0.5 | 0.25 |
| `incident-response-n4` | 0.5 | 0.75 |
| `incident-response-n5` | 0.82 | 0.25 |
| `incident-response-n6` | 0.82 | 0.75 |

## 解説

この図では、障害アラートを受信 → 影響範囲を確認 → 緊急度を判定 → 担当チームへ連絡 → 回避策を実施 → 状況を利用者へ告知の関係を整理します。影響と緊急度を確認してから担当へ連絡します。「当番表の印刷方法」は今回の流れに含めません。

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
