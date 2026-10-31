# サブスクリプション更新

- 問題ID：`subscription-renewal`
- 直接開く：`src/index.html?drill=subscription-renewal`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

更新日を迎えた契約を確認して課金し、支払いに応じて継続または利用停止を管理したい。 今回の図の対象：更新日を迎えた契約について、決済の結果に応じて継続または利用の一時停止へ進む流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 契約状態を調べるきっかけは、契約の更新日を迎えたこととする。（内部種別：要件・要求／根拠：更新日を迎える → 契約状態を確認）
2. 今回は更新可能な契約を対象とする。確認した契約の料金を決済に使う。（内部種別：要件・要求／根拠：契約状態を確認 → 更新料金を決済）
3. 料金表では現在のプランを色と枠で見つけやすくしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| subscription-renewal-doc-04 | 料金を払えた契約だけ継続期間を延ばす。決済失敗なら利用者に知らせる。 | 要件・要求 | 更新料金を決済 → 継続期間を更新<br>更新料金を決済 → 決済失敗を通知 |
| subscription-renewal-doc-05 | 利用停止の前に、決済できなかったことを利用者に伝える必要がある。 | 要件・要求 | 決済失敗を通知 → 利用を一時停止 |

## ヒント

決済が成功した場合と失敗した場合で、契約の扱いが変わります。利用を続けられる条件を考えてみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `subscription-renewal-n1` | 必要 | 更新日を迎える |
| `subscription-renewal-n2` | 必要 | 契約状態を確認 |
| `subscription-renewal-n3` | 必要 | 更新料金を決済 |
| `subscription-renewal-n4` | 必要 | 継続期間を更新 |
| `subscription-renewal-n5` | 必要 | 決済失敗を通知 |
| `subscription-renewal-n6` | 必要 | 利用を一時停止 |
| `subscription-renewal-x1` | 余分・参考 | 料金表の表示色 |

## グループ

- **更新処理**：`subscription-renewal-n1`, `subscription-renewal-n2`, `subscription-renewal-n3`
- **決済結果**：`subscription-renewal-n4`, `subscription-renewal-n5`, `subscription-renewal-n6`

## 正解の接続

- `subscription-renewal-n1` → `subscription-renewal-n2`
- `subscription-renewal-n2` → `subscription-renewal-n3`
- `subscription-renewal-n3` → `subscription-renewal-n4`
- `subscription-renewal-n3` → `subscription-renewal-n5`
- `subscription-renewal-n5` → `subscription-renewal-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `subscription-renewal-n1` | 0.13 | 0.5 |
| `subscription-renewal-n2` | 0.315 | 0.5 |
| `subscription-renewal-n3` | 0.5 | 0.5 |
| `subscription-renewal-n4` | 0.685 | 0.22 |
| `subscription-renewal-n5` | 0.685 | 0.78 |
| `subscription-renewal-n6` | 0.87 | 0.5 |

## 解説

この図では、更新日を迎える → 契約状態を確認 → 更新料金を決済 → 継続期間を更新 → 決済失敗を通知 → 利用を一時停止の関係を整理します。決済成功時と失敗時の処理を分けます。「料金表の表示色」は今回の流れに含めません。

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
