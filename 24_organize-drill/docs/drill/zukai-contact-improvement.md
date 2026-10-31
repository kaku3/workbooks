# 問い合わせ対応の設計改善

- 問題ID：`zukai-contact-improvement`
- 直接開く：`src/index.html?drill=zukai-contact-improvement`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「問い合わせ対応の設計改善」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。

### 課題

資料の順番に惑わされず、必要な付箋を選んで図にしてください。

## 段階開示資料

左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。

### 最初に表示する3枚

1. 外部設計｜処理概要（外部設計）：問い合わせへの回答を、過去の回答を活用しながら作成し、次回にも生かせるようにする流れ。
2. 総務メモ（スコープ外）：座席レイアウト変更は、総務が別途進めている。
3. 未決事項（スコープ外）：入力項目の桁数・型はテーブル定義に従う。画面項目の詳細は別途確認する。

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| 外部設計｜処理順序 | 「問い合わせを受け付ける」の次は「類似問い合わせを検索」を行う。 | 外部設計 | 問い合わせを受け付ける → 類似問い合わせを検索 |
| 外部設計｜処理順序 | 「類似問い合わせを検索」が終わったら、「過去回答候補を表示」に移る。 | 外部設計 | 類似問い合わせを検索 → 過去回答候補を表示 |
| 要求メモ | 「過去回答候補を表示」が終わったら、「担当者が回答を作成」に移る。 | 要件・要求 | 過去回答候補を表示 → 担当者が回答を作成 |
| 詳細設計｜内部処理 | 「担当者が回答を作成」が終わったら、「顧客へ回答」に移る。 | 詳細設計 | 担当者が回答を作成 → 顧客へ回答 |
| 詳細設計｜内部処理 | 「顧客へ回答」を行った後に、「回答を履歴として保存」へ進む。 | 詳細設計 | 顧客へ回答 → 回答を履歴として保存 |
| 名簿メモ | 担当者の所属一覧は、人事の名簿を参照する。 | スコープ外 | —（図に含めない） |
| 要求メモ | 導入時期は繁忙期を避けたい。 | スコープ外 | —（図に含めない） |

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
