# 問い合わせのエスカレーション

- 問題ID：`support-escalation`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「問い合わせのエスカレーション」に関する資料の断片です。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 画面の雰囲気は現行システムに近づける
- 「専門部署へ引き継ぐ」の後に「専門部署が回答を作成」を行いたい
- 参考：担当者の座席配置

### 要件

- 同時利用は最大50人
- 「窓口で解決可能か判定」の後は状況に応じて「利用者へ回答する」／「専門部署へ引き継ぐ」へ進む

### 外部設計

- 「問い合わせを受け付ける」の次に「窓口で内容を確認」を行う
- 「窓口で内容を確認」の次に「窓口で解決可能か判定」を行う
- 「専門部署が回答を作成」の次に「利用者へ回答する」を行う

### 詳細設計（現行データ）

_（記載なし）_

## ヒント

窓口で解決できる場合と、専門部署の助けが必要な場合があります。どちらも最終的に利用者へ返答する点に注目しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `support-escalation-n1` | 必要 | 問い合わせを受け付ける |
| `support-escalation-n2` | 必要 | 窓口で内容を確認 |
| `support-escalation-n3` | 必要 | 窓口で解決可能か判定 |
| `support-escalation-n4` | 必要 | 専門部署へ引き継ぐ |
| `support-escalation-n5` | 必要 | 専門部署が回答を作成 |
| `support-escalation-n6` | 必要 | 利用者へ回答する |
| `support-escalation-x1` | 余分・参考 | 担当者の座席配置 |

## グループ

- **受付と切り分け**：`support-escalation-n1`, `support-escalation-n2`, `support-escalation-n3`
- **専門対応**：`support-escalation-n4`, `support-escalation-n5`, `support-escalation-n6`

## 正解の接続

- `support-escalation-n1` → `support-escalation-n2`
- `support-escalation-n2` → `support-escalation-n3`
- `support-escalation-n3` → `support-escalation-n6`
- `support-escalation-n3` → `support-escalation-n4`
- `support-escalation-n4` → `support-escalation-n5`
- `support-escalation-n5` → `support-escalation-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `support-escalation-n1` | 0.16 | 0.25 |
| `support-escalation-n2` | 0.16 | 0.75 |
| `support-escalation-n3` | 0.5 | 0.25 |
| `support-escalation-n4` | 0.5 | 0.75 |
| `support-escalation-n5` | 0.84 | 0.25 |
| `support-escalation-n6` | 0.84 | 0.75 |

## 解説

この図では、問い合わせを受け付ける → 窓口で内容を確認 → 窓口で解決可能か判定 → 専門部署へ引き継ぐ → 専門部署が回答を作成 → 利用者へ回答するの関係を整理します。窓口で解決できる場合と、専門部署へ引き継ぐ場合を分けます。「担当者の座席配置」は今回の流れに含めません。

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
