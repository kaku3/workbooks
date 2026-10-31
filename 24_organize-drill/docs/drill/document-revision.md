# 文書の改訂

- 問題ID：`document-revision`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「文書の改訂」の設計見直しで出た記述です。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「関係者がレビュー」の結果で「指摘を反映」／「承認を確認」を使い分けたい
- 参考：文書テンプレートの色
- 導入時期は繁忙期を避ける

### 要件

- 「公開版を更新」完了後に「改訂履歴を記録」へ進む
- 同時利用は最大50人
- 「指摘を反映」完了後に「関係者がレビュー」へ進む
- 「改訂案を作成」完了後に「関係者がレビュー」へ進む

### 外部設計

_（記載なし）_

### 詳細設計（現行データ）

- 「承認を確認」完了後に「公開版を更新」を呼び出す

## ヒント

レビューで指摘が出た場合、そこで終わりではありません。修正後にどこへ戻るか、承認へ進む条件は何かを考えましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `document-revision-n1` | 必要 | 改訂案を作成 |
| `document-revision-n2` | 必要 | 関係者がレビュー |
| `document-revision-n3` | 必要 | 指摘を反映 |
| `document-revision-n4` | 必要 | 承認を確認 |
| `document-revision-n5` | 必要 | 公開版を更新 |
| `document-revision-n6` | 必要 | 改訂履歴を記録 |
| `document-revision-x1` | 余分・参考 | 文書テンプレートの色 |

## グループ

- **改訂とレビュー**：`document-revision-n1`, `document-revision-n2`, `document-revision-n3`
- **承認と公開**：`document-revision-n4`, `document-revision-n5`, `document-revision-n6`

## 正解の接続

- `document-revision-n1` → `document-revision-n2`
- `document-revision-n2` → `document-revision-n3`
- `document-revision-n3` → `document-revision-n2`
- `document-revision-n2` → `document-revision-n4`
- `document-revision-n4` → `document-revision-n5`
- `document-revision-n5` → `document-revision-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `document-revision-n1` | 0.13 | 0.5 |
| `document-revision-n2` | 0.43 | 0.25 |
| `document-revision-n3` | 0.76 | 0.25 |
| `document-revision-n4` | 0.43 | 0.78 |
| `document-revision-n5` | 0.76 | 0.78 |
| `document-revision-n6` | 0.9 | 0.5 |

## 解説

この図では、改訂案を作成 → 関係者がレビュー → 指摘を反映 → 承認を確認 → 公開版を更新 → 改訂履歴を記録の関係を整理します。レビュー指摘がある場合は修正して再確認します。「文書テンプレートの色」は今回の流れに含めません。

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
