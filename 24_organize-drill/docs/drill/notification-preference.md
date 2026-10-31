# 通知設定の変更

- 問題ID：`notification-preference`
- 直接開く：`src/index.html?drill=notification-preference`
- 難易度：easy
- 出典：`src/data/problems.json`

## 要求仕様

利用者が通知方法を変更し、妥当な設定を次回の通知から適用できるようにしたい。 今回の図の対象：利用者が通知方法を変更し、その設定が次回の通知から反映されるまでの流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 通知設定を開いた利用者が、希望する通知方法を選ぶ。（内部種別：要件・要求／根拠：通知設定を開く → 通知方法を選ぶ）
2. 検証対象は利用者が選んだ通知方法の組み合わせとする。（内部種別：要件・要求／根拠：通知方法を選ぶ → 設定内容を検証）
3. 設定画面のアイコンは、メールとアプリ通知を形でも見分けられるものにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| notification-preference-doc-04 | 保存できるのは、設定内容の検証を通った組み合わせだけ。 | 要件・要求 | 設定内容を検証 → 通知設定を保存 |
| notification-preference-doc-05 | 次回の通知で使う方法は、保存された設定を参照する。未保存の選択は反映しない。 | 要件・要求 | 通知設定を保存 → 次回通知から反映 |

## ヒント

設定を選ぶだけでは反映されません。内容の確認、保存、その後の通知への反映を順に考えましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `notification-preference-n1` | 必要 | 通知設定を開く |
| `notification-preference-n2` | 必要 | 通知方法を選ぶ |
| `notification-preference-n3` | 必要 | 設定内容を検証 |
| `notification-preference-n4` | 必要 | 通知設定を保存 |
| `notification-preference-n5` | 必要 | 次回通知から反映 |
| `notification-preference-x1` | 余分・参考 | 設定画面のアイコン |

## グループ

- **設定変更**：`notification-preference-n1`, `notification-preference-n2`, `notification-preference-n3`
- **保存と反映**：`notification-preference-n4`, `notification-preference-n5`

## 正解の接続

- `notification-preference-n1` → `notification-preference-n2`
- `notification-preference-n2` → `notification-preference-n3`
- `notification-preference-n3` → `notification-preference-n4`
- `notification-preference-n4` → `notification-preference-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `notification-preference-n1` | 0.13 | 0.5 |
| `notification-preference-n2` | 0.315 | 0.5 |
| `notification-preference-n3` | 0.5 | 0.5 |
| `notification-preference-n4` | 0.685 | 0.5 |
| `notification-preference-n5` | 0.87 | 0.5 |

## 解説

この図では、通知設定を開く → 通知方法を選ぶ → 設定内容を検証 → 通知設定を保存 → 次回通知から反映の関係を整理します。選択内容を確認してから保存し、以降の通知に反映します。「設定画面のアイコン」は今回の流れに含めません。

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
