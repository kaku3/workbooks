# 研修への参加登録

- 問題ID：`workshop-registration`
- 直接開く：`src/index.html?drill=workshop-registration`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

研修の定員と承認条件を確認し、参加確定またはキャンセル待ちの結果を申込者へ伝えたい。 今回の図の対象：社員が研修に申し込み、定員や承認の条件に応じて、参加確定またはキャンセル待ちになる流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 空き人数を調べる対象は、申し込まれた研修とする。（内部種別：要件・要求／根拠：研修に申し込む → 定員に空きがあるか確認）
2. 空きがあれば上長承認の条件を確認する。満員の場合はキャンセル待ちに登録する。（内部種別：要件・要求／根拠：定員に空きがあるか確認 → 上長承認が必要か確認、定員に空きがあるか確認 → キャンセル待ちへ登録）
3. 研修会場の写真で、机の配置と通路の幅を事前に確認できるようにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| workshop-registration-doc-04 | 今回は承認が不要、または承認を取得済みの申込みを扱う。承認の条件を満たせば参加を確定できる。 | 要件・要求 | 上長承認が必要か確認 → 参加を確定 |
| workshop-registration-doc-05 | 参加が確定した人には、その結果を知らせる。 | 要件・要求 | 参加を確定 → 申込者へ結果を通知 |
| workshop-registration-doc-06 | キャンセル待ちになった人にも、待ち登録の結果を知らせる。 | 要件・要求 | キャンセル待ちへ登録 → 申込者へ結果を通知 |

## ヒント

空席があることだけで参加が決まるとは限りません。承認の必要性も含め、申込結果が決まる条件を探しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `workshop-registration-n1` | 必要 | 研修に申し込む |
| `workshop-registration-n2` | 必要 | 定員に空きがあるか確認 |
| `workshop-registration-n3` | 必要 | 上長承認が必要か確認 |
| `workshop-registration-n4` | 必要 | 参加を確定 |
| `workshop-registration-n5` | 必要 | キャンセル待ちへ登録 |
| `workshop-registration-n6` | 必要 | 申込者へ結果を通知 |
| `workshop-registration-x1` | 余分・参考 | 研修会場の写真 |

## グループ

- **申込条件の確認**：`workshop-registration-n1`, `workshop-registration-n2`, `workshop-registration-n3`
- **申込結果**：`workshop-registration-n4`, `workshop-registration-n5`, `workshop-registration-n6`

## 正解の接続

- `workshop-registration-n1` → `workshop-registration-n2`
- `workshop-registration-n2` → `workshop-registration-n3`
- `workshop-registration-n2` → `workshop-registration-n5`
- `workshop-registration-n3` → `workshop-registration-n4`
- `workshop-registration-n4` → `workshop-registration-n6`
- `workshop-registration-n5` → `workshop-registration-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `workshop-registration-n1` | 0.13 | 0.5 |
| `workshop-registration-n2` | 0.315 | 0.5 |
| `workshop-registration-n3` | 0.5 | 0.22 |
| `workshop-registration-n5` | 0.5 | 0.78 |
| `workshop-registration-n4` | 0.685 | 0.5 |
| `workshop-registration-n6` | 0.87 | 0.5 |

## 解説

この図では、研修に申し込む → 定員に空きがあるか確認 → 上長承認が必要か確認 → 参加を確定 → キャンセル待ちへ登録 → 申込者へ結果を通知の関係を整理します。空席と承認の条件を確認して参加可否を決めます。「研修会場の写真」は今回の流れに含めません。

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
