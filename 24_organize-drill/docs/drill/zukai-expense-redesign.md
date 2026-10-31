# 経費精算フローの再設計

- 問題ID：`zukai-expense-redesign`
- 直接開く：`src/index.html?drill=zukai-expense-redesign`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「経費精算フローの再設計」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 段階開示資料

左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。

### 最初に表示する3枚

1. 外部設計｜処理概要（外部設計）：Web申請を導入する経費精算で、入力の確認から承認、支払い、進捗の確認までを新しい流れに整理する。
2. 現状メモ（スコープ外）：申請集中の現状は、運用改善の課題として別に整理している。
3. 帳票メモ（スコープ外）：帳票レイアウトは別紙を参照する。

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| 外部設計｜並行する作業 | 「申請者がWeb申請」のあとは、「入力内容をチェック」と「進捗をWebで確認」をそれぞれ進める。 | 外部設計 | 申請者がWeb申請 → 入力内容をチェック<br>申請者がWeb申請 → 進捗をWebで確認 |
| 外部設計｜分岐の扱い | 「入力内容をチェック」の結果に応じて、「不備を差し戻す」、「部門長へ承認依頼」のいずれかへ進む。 | 外部設計 | 入力内容をチェック → 不備を差し戻す<br>入力内容をチェック → 部門長へ承認依頼 |
| 詳細設計｜内部処理 | 「部門長へ承認依頼」を行った後に、「承認後に支払い」へ進む。 | 詳細設計 | 部門長へ承認依頼 → 承認後に支払い |
| 人事メモ | 経理担当者の異動予定は、来期の体制検討の中で扱っている。 | スコープ外 | —（図に含めない） |
| 研修メモ | 操作研修の資料は別途用意する。 | スコープ外 | —（図に含めない） |

## ヒント

新しい申請の流れと、現状の課題・背景情報を分けて考えましょう。利用者が途中経過を確認する動きもあります。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-expense-redesign-n1` | 必要 | 申請者がWeb申請 |
| `zukai-expense-redesign-n2` | 必要 | 入力内容をチェック |
| `zukai-expense-redesign-n3` | 必要 | 不備を差し戻す |
| `zukai-expense-redesign-n4` | 必要 | 部門長へ承認依頼 |
| `zukai-expense-redesign-n5` | 必要 | 承認後に支払い |
| `zukai-expense-redesign-n6` | 必要 | 進捗をWebで確認 |
| `zukai-expense-redesign-x1` | 余分・参考 | 経理担当者の異動予定 |
| `zukai-expense-redesign-x2` | 余分・参考 | 申請集中の現状 |

## グループ

- **申請と確認**：`zukai-expense-redesign-n1`, `zukai-expense-redesign-n2`, `zukai-expense-redesign-n3`
- **承認と支払い**：`zukai-expense-redesign-n4`, `zukai-expense-redesign-n5`

## 正解の接続

- `zukai-expense-redesign-n1` → `zukai-expense-redesign-n2`
- `zukai-expense-redesign-n2` → `zukai-expense-redesign-n3`
- `zukai-expense-redesign-n2` → `zukai-expense-redesign-n4`
- `zukai-expense-redesign-n4` → `zukai-expense-redesign-n5`
- `zukai-expense-redesign-n1` → `zukai-expense-redesign-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-expense-redesign-n1` | 0.13 | 0.5 |
| `zukai-expense-redesign-n2` | 0.377 | 0.22 |
| `zukai-expense-redesign-n6` | 0.377 | 0.78 |
| `zukai-expense-redesign-n3` | 0.623 | 0.22 |
| `zukai-expense-redesign-n4` | 0.623 | 0.78 |
| `zukai-expense-redesign-n5` | 0.87 | 0.5 |

## 解説

この図では、申請者がWeb申請 → 入力内容をチェック → 不備を差し戻す → 部門長へ承認依頼 → 承認後に支払い → 進捗をWebで確認の関係を整理します。現行の課題や人員事情は背景情報で、新方式の処理と分けます。「経理担当者の異動予定」「申請集中の現状」は今回の流れに含めません。

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
