# 新入社員の受け入れ

- 問題ID：`employee-onboarding`
- 直接開く：`src/index.html?drill=employee-onboarding`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

新入社員が初日から働けるよう、アカウント・権限と端末をそろえて案内したい。 今回の図の対象：入社が決まった社員が初日を迎えられるように、アカウントや備品を準備して案内を送るまでの流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 入社情報はアカウントの発行担当と端末の準備担当に同時に渡す。どちらも相手の完了を待たずに始めてよい。（内部種別：要件・要求／根拠：入社情報を受領 → アカウントを発行、入社情報を受領 → 端末と備品を準備）
2. 利用権限は、発行済みのアカウントに設定する。（内部種別：要件・要求／根拠：アカウントを発行 → 利用権限を設定）
3. 新入社員が席を見つけられるよう、オフィスの座席写真を案内資料に載せたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| employee-onboarding-doc-04 | 初日の案内を送るには端末・備品の準備が済んでいる必要がある。 | 要件・要求 | 端末と備品を準備 → 初日の案内を送信 |
| employee-onboarding-doc-05 | 案内の送信条件には権限の設定完了も含める。端末だけ、アカウントだけでは案内を送らない。 | 要件・要求 | 利用権限を設定 → 初日の案内を送信 |

## ヒント

準備作業のすべてが一本道とは限りません。並行して進められる作業と、案内を送る前に必要な準備を探しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `employee-onboarding-n1` | 必要 | 入社情報を受領 |
| `employee-onboarding-n2` | 必要 | アカウントを発行 |
| `employee-onboarding-n3` | 必要 | 端末と備品を準備 |
| `employee-onboarding-n4` | 必要 | 利用権限を設定 |
| `employee-onboarding-n5` | 必要 | 初日の案内を送信 |
| `employee-onboarding-x1` | 余分・参考 | オフィスの座席写真 |

## グループ

- **受け入れ準備**：`employee-onboarding-n1`, `employee-onboarding-n2`, `employee-onboarding-n3`, `employee-onboarding-n4`
- **初日案内**：`employee-onboarding-n5`

## 正解の接続

- `employee-onboarding-n1` → `employee-onboarding-n2`
- `employee-onboarding-n1` → `employee-onboarding-n3`
- `employee-onboarding-n2` → `employee-onboarding-n4`
- `employee-onboarding-n3` → `employee-onboarding-n5`
- `employee-onboarding-n4` → `employee-onboarding-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `employee-onboarding-n1` | 0.13 | 0.5 |
| `employee-onboarding-n2` | 0.377 | 0.22 |
| `employee-onboarding-n3` | 0.377 | 0.78 |
| `employee-onboarding-n4` | 0.623 | 0.5 |
| `employee-onboarding-n5` | 0.87 | 0.5 |

## 解説

この図では、入社情報を受領 → アカウントを発行 → 端末と備品を準備 → 利用権限を設定 → 初日の案内を送信の関係を整理します。アカウントと備品の準備は並行し、必要な準備後に案内します。「オフィスの座席写真」は今回の流れに含めません。

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
