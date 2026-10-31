# 備品購入の承認

- 問題ID：`purchase-approval`
- 直接開く：`src/index.html?drill=purchase-approval`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

社員の備品購入を内容と予算から判断し、発注または差し戻しの結果を本人に伝えたい。 今回の図の対象：社員の備品購入の申請を、上長が確認して発注または差し戻しにするまでの流れ。結果は申請者に伝える。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 社員が購入したい備品と理由を上長に提出する。（内部種別：要件・要求／根拠：社員が購入申請 → 上長が内容を確認）
2. 予算の確認対象は、上長が購入内容を確認した申請とする。（内部種別：要件・要求／根拠：上長が内容を確認 → 予算内か判定）
3. 備品カタログの表紙には年度を大きく載せ、古い版を使わないようにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| purchase-approval-doc-04 | 予算に収まる申請を発注対象にする。超えるものは申請者に差し戻す。 | 要件・要求 | 予算内か判定 → 備品を発注<br>予算内か判定 → 申請を差し戻す |
| purchase-approval-doc-05 | 発注した場合、申請者には発注結果を知らせる。 | 要件・要求 | 備品を発注 → 申請者へ結果を通知 |
| purchase-approval-doc-06 | 差し戻した場合も、申請者への結果連絡が必要になる。 | 要件・要求 | 申請を差し戻す → 申請者へ結果を通知 |

## ヒント

判断の結果で処理が分かれますが、どちらの場合も申請者への連絡が必要そうです。最後の通知まで見てみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `purchase-approval-n1` | 必要 | 社員が購入申請 |
| `purchase-approval-n2` | 必要 | 上長が内容を確認 |
| `purchase-approval-n3` | 必要 | 予算内か判定 |
| `purchase-approval-n4` | 必要 | 備品を発注 |
| `purchase-approval-n5` | 必要 | 申請を差し戻す |
| `purchase-approval-n6` | 必要 | 申請者へ結果を通知 |
| `purchase-approval-x1` | 余分・参考 | 備品カタログの表紙 |

## グループ

- **申請と判断**：`purchase-approval-n1`, `purchase-approval-n2`, `purchase-approval-n3`
- **判断後の処理**：`purchase-approval-n4`, `purchase-approval-n5`, `purchase-approval-n6`

## 正解の接続

- `purchase-approval-n1` → `purchase-approval-n2`
- `purchase-approval-n2` → `purchase-approval-n3`
- `purchase-approval-n3` → `purchase-approval-n4`
- `purchase-approval-n3` → `purchase-approval-n5`
- `purchase-approval-n4` → `purchase-approval-n6`
- `purchase-approval-n5` → `purchase-approval-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `purchase-approval-n1` | 0.13 | 0.5 |
| `purchase-approval-n2` | 0.315 | 0.5 |
| `purchase-approval-n3` | 0.5 | 0.5 |
| `purchase-approval-n4` | 0.685 | 0.22 |
| `purchase-approval-n5` | 0.685 | 0.78 |
| `purchase-approval-n6` | 0.87 | 0.5 |

## 解説

この図では、社員が購入申請 → 上長が内容を確認 → 予算内か判定 → 備品を発注 → 申請を差し戻す → 申請者へ結果を通知の関係を整理します。予算内の場合と超過時の処理を分けます。「備品カタログの表紙」は今回の流れに含めません。

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
