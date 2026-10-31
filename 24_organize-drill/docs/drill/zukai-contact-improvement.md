# 問い合わせ対応の設計改善

- 問題ID：`zukai-contact-improvement`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「問い合わせ対応の設計改善」の設計見直しで出た記述です。

### 課題

資料の順番に惑わされず、必要な付箋を選んで図にしてください。

## 資料の断片（現行データ）

### 要求仕様

- 「過去回答候補を表示」の後に「担当者が回答を作成」を行いたい

### 要件

- 参考：座席レイアウト変更
- 操作ログは1年間保存
- 「顧客へ回答」完了後に「回答を履歴として保存」へ進む
- 「担当者が回答を作成」完了後に「顧客へ回答」へ進む

### 外部設計

- エラー表示の色は共通スタイルに合わせる
- 「類似問い合わせを検索」の次に「過去回答候補を表示」を行う
- 「問い合わせを受け付ける」の次に「類似問い合わせを検索」を行う
- 「担当者の所属一覧」も論点に挙がったが未決定

### 詳細設計（現行データ）

_（記載なし）_

## ヒント

過去の回答を探すことは、今回の回答だけでなく次の問い合わせにもつながります。情報が残る場所に注目しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-contact-improvement-n1` | 必要 | 問い合わせを受け付ける |
| `zukai-contact-improvement-n2` | 必要 | 類似問い合わせを検索 |
| `zukai-contact-improvement-n3` | 必要 | 過去回答候補を表示 |
| `zukai-contact-improvement-n4` | 必要 | 担当者が回答を作成 |
| `zukai-contact-improvement-n5` | 必要 | 顧客へ回答 |
| `zukai-contact-improvement-n6` | 必要 | 回答を履歴として保存 |
| `zukai-contact-improvement-x1` | 余分・参考 | 座席レイアウト変更 |
| `zukai-contact-improvement-x2` | 余分・参考 | 担当者の所属一覧 |

## グループ

- **検索支援**：`zukai-contact-improvement-n2`, `zukai-contact-improvement-n3`
- **回答と蓄積**：`zukai-contact-improvement-n4`, `zukai-contact-improvement-n5`, `zukai-contact-improvement-n6`

## 正解の接続

- `zukai-contact-improvement-n1` → `zukai-contact-improvement-n2`
- `zukai-contact-improvement-n2` → `zukai-contact-improvement-n3`
- `zukai-contact-improvement-n3` → `zukai-contact-improvement-n4`
- `zukai-contact-improvement-n4` → `zukai-contact-improvement-n5`
- `zukai-contact-improvement-n5` → `zukai-contact-improvement-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-contact-improvement-n1` | 0.18 | 0.25 |
| `zukai-contact-improvement-n2` | 0.18 | 0.75 |
| `zukai-contact-improvement-n3` | 0.5 | 0.25 |
| `zukai-contact-improvement-n4` | 0.5 | 0.75 |
| `zukai-contact-improvement-n5` | 0.82 | 0.25 |
| `zukai-contact-improvement-n6` | 0.82 | 0.75 |

## 解説

この図では、問い合わせを受け付ける → 類似問い合わせを検索 → 過去回答候補を表示 → 担当者が回答を作成 → 顧客へ回答 → 回答を履歴として保存の関係を整理します。検索候補を使って回答し、回答を履歴へ残す循環を示します。「座席レイアウト変更」「担当者の所属一覧」は今回の流れに含めません。

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
