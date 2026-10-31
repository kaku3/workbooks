# 文書の改訂

- 問題ID：`document-revision`
- 直接開く：`src/index.html?drill=document-revision`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

関係者の指摘を反映して承認された文書を公開し、改訂履歴を残したい。 今回の図の対象：文書の改訂案を作り、レビューと承認を経て公開版に反映し、履歴を残す流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. レビューに渡す対象は、作成した改訂案とする。（内部種別：要件・要求／根拠：改訂案を作成 → 関係者がレビュー）
2. 指摘が残る改訂案は修正する。指摘が解消した案は承認の確認対象にできる。（内部種別：要件・要求／根拠：関係者がレビュー → 指摘を反映、関係者がレビュー → 承認を確認）
3. 文書テンプレートは見出しと本文を色でも区別し、読みやすくしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| document-revision-doc-04 | 修正しただけではレビュー済みにしない。指摘を反映した案も関係者に確認してもらう。 | 要件・要求 | 指摘を反映 → 関係者がレビュー |
| document-revision-doc-05 | 公開版にできるのは承認を確認できた文書だけ。 | 要件・要求 | 承認を確認 → 公開版を更新 |
| document-revision-doc-06 | 改訂履歴には、実際に公開版として更新した内容を記録する。 | 要件・要求 | 公開版を更新 → 改訂履歴を記録 |

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
