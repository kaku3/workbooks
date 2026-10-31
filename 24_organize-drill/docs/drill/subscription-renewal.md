# サブスクリプション更新

- 問題ID：`subscription-renewal`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「サブスクリプション更新」の設計見直しで出た記述です。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 導入時期は繁忙期を避ける
- 「更新料金を決済」の結果で「継続期間を更新」／「決済失敗を通知」を使い分けたい
- 「更新日を迎える」の後に「契約状態を確認」を行いたい

### 要件

- 「決済失敗を通知」完了後に「利用を一時停止」へ進む

### 外部設計

- 「料金表の表示色」は担当者間で認識が異なる
- 「契約状態を確認」の次に「更新料金を決済」を行う

### 詳細設計（現行データ）

- 保存先テーブル名は開発標準に従う

## ヒント

決済が成功した場合と失敗した場合で、契約の扱いが変わります。利用を続けられる条件を考えてみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `subscription-renewal-n1` | 必要 | 更新日を迎える |
| `subscription-renewal-n2` | 必要 | 契約状態を確認 |
| `subscription-renewal-n3` | 必要 | 更新料金を決済 |
| `subscription-renewal-n4` | 必要 | 継続期間を更新 |
| `subscription-renewal-n5` | 必要 | 決済失敗を通知 |
| `subscription-renewal-n6` | 必要 | 利用を一時停止 |
| `subscription-renewal-x1` | 余分・参考 | 料金表の表示色 |

## グループ

- **更新処理**：`subscription-renewal-n1`, `subscription-renewal-n2`, `subscription-renewal-n3`
- **決済結果**：`subscription-renewal-n4`, `subscription-renewal-n5`, `subscription-renewal-n6`

## 正解の接続

- `subscription-renewal-n1` → `subscription-renewal-n2`
- `subscription-renewal-n2` → `subscription-renewal-n3`
- `subscription-renewal-n3` → `subscription-renewal-n4`
- `subscription-renewal-n3` → `subscription-renewal-n5`
- `subscription-renewal-n5` → `subscription-renewal-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `subscription-renewal-n1` | 0.13 | 0.5 |
| `subscription-renewal-n2` | 0.315 | 0.5 |
| `subscription-renewal-n3` | 0.5 | 0.5 |
| `subscription-renewal-n4` | 0.685 | 0.22 |
| `subscription-renewal-n5` | 0.685 | 0.78 |
| `subscription-renewal-n6` | 0.87 | 0.5 |

## 解説

この図では、更新日を迎える → 契約状態を確認 → 更新料金を決済 → 継続期間を更新 → 決済失敗を通知 → 利用を一時停止の関係を整理します。決済成功時と失敗時の処理を分けます。「料金表の表示色」は今回の流れに含めません。

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
