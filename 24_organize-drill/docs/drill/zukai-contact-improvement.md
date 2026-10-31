# 問い合わせ対応の設計改善

- 問題ID：`zukai-contact-improvement`
- 直接開く：`src/index.html?drill=zukai-contact-improvement`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

問い合わせ対応で過去の回答を活用したい。担当者が回答を作り、顧客に伝えた内容を次回の対応にも使えるようにする。 今回の図の対象：問い合わせへの回答を、過去の回答を活用しながら作成し、次回にも生かせるようにする流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 受け付けた問い合わせの内容を、過去事例を探す検索条件にする。（内部種別：要件・要求／根拠：問い合わせを受け付ける → 類似問い合わせを検索）
2. 担当者に見せる候補は、今回の問い合わせに類似すると検索された回答とする。（内部種別：要件・要求／根拠：類似問い合わせを検索 → 過去回答候補を表示）
3. 窓口担当者が相談しやすいよう、チームごとに座席をまとめたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| zukai-contact-improvement-doc-04 | 回答候補は参考資料として担当者に見せる。顧客へ送る文章は担当者が作成する。 | 要件・要求 | 過去回答候補を表示 → 担当者が回答を作成 |
| zukai-contact-improvement-doc-05 | 顧客に伝えるのは、担当者が内容を確認して作った回答とする。 | 要件・要求 | 担当者が回答を作成 → 顧客へ回答 |
| zukai-contact-improvement-doc-06 | 履歴には下書きではなく、顧客へ実際に伝えた回答を保存したい。 | 要件・要求 | 顧客へ回答 → 回答を履歴として保存 |
| zukai-contact-improvement-doc-07 | 担当者の一覧では、所属部署と専門分野を検索できるようにしたい。 | スコープ外 | —（図に含めない） |

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
