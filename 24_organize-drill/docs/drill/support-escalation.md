# 問い合わせのエスカレーション

- 問題ID：`support-escalation`
- 直接開く：`src/index.html?drill=support-escalation`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

問い合わせを窓口で確認し、必要なら専門部署の協力を得て利用者に回答したい。 今回の図の対象：窓口に届いた問い合わせについて、窓口で解決するか専門部署へ引き継ぐかを判断し、利用者へ回答する流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 窓口の確認担当は、受け付けた問い合わせの内容を読む。（内部種別：要件・要求／根拠：問い合わせを受け付ける → 窓口で内容を確認）
2. 窓口で解決できるかは、内容を確認してから判断する。（内部種別：要件・要求／根拠：窓口で内容を確認 → 窓口で解決可能か判定）
3. 担当者の座席配置では、窓口から専門担当へ声をかけやすいようにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| support-escalation-doc-04 | 窓口で解決できる内容はそのまま利用者へ回答する。難しい内容だけを専門部署へ引き継ぐ。 | 要件・要求 | 窓口で解決可能か判定 → 利用者へ回答する<br>窓口で解決可能か判定 → 専門部署へ引き継ぐ |
| support-escalation-doc-05 | 専門部署には、引き継がれた問い合わせについて回答を作ってもらう。 | 要件・要求 | 専門部署へ引き継ぐ → 専門部署が回答を作成 |
| support-escalation-doc-06 | 専門部署が作った回答も、利用者への回答として届ける。 | 要件・要求 | 専門部署が回答を作成 → 利用者へ回答する |

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
