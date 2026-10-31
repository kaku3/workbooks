# 出荷依頼API連携

- 問題ID：`zukai-shipping-api`
- 直接開く：`src/index.html?drill=zukai-shipping-api`
- 難易度：hard
- 出典：`src/data/problems.json`

## 要求仕様

出荷依頼の受付と出荷の完了を区別して管理したい。外部の受付応答と非同期の結果から、注文の状態を更新する。 今回の図の対象：注文確定後の出荷依頼を外部へ送り、受付時の応答と、あとから届く結果で注文の状態を更新する流れ。結果は非同期で届く。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 外部への出荷依頼で受付に成功するとIDが返る。受付自体に失敗した場合は記録を残し、担当者に知らせる。（内部種別：要件・要求／根拠：出荷依頼APIを送信 → 受付IDを受領、出荷依頼APIを送信 → 受付失敗を記録して担当者へ通知）
2. 受付IDがある依頼を「出荷依頼中」として管理する。受付だけでは出荷済みにしない。（内部種別：要件・要求／根拠：受付IDを受領 → 出荷依頼中へ更新）
3. 受信したWebhookが正規の倉庫から届いたものか、署名と共有鍵で検証したい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| zukai-shipping-api-doc-04 | 出荷依頼中の注文は、後からWebhookで届く結果を待つ。 | 要件・要求 | 出荷依頼中へ更新 → Webhookで結果を受信 |
| zukai-shipping-api-doc-05 | Webhookの成功結果で出荷済みとする。失敗結果なら出荷保留にして対応できるようにする。 | 要件・要求 | Webhookで結果を受信 → 成功時に出荷済みへ更新<br>Webhookで結果を受信 → 失敗時に出荷保留へ更新 |

## ヒント

依頼を受け付けた時点と、後から処理結果が届いた時点は同じではありません。時間差のある処理を意識してみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-shipping-api-n1` | 必要 | 出荷依頼APIを送信 |
| `zukai-shipping-api-n2` | 必要 | 受付IDを受領 |
| `zukai-shipping-api-n3` | 必要 | 出荷依頼中へ更新 |
| `zukai-shipping-api-n4` | 必要 | Webhookで結果を受信 |
| `zukai-shipping-api-n5` | 必要 | 成功時に出荷済みへ更新 |
| `zukai-shipping-api-n6` | 必要 | 失敗時に出荷保留へ更新 |
| `zukai-shipping-api-x1` | 余分・参考 | Webhook署名方式の詳細 |
| `zukai-shipping-api-n7` | 必要 | 受付失敗を記録して担当者へ通知 |

## グループ

- **受付時の処理**：`zukai-shipping-api-n1`, `zukai-shipping-api-n2`, `zukai-shipping-api-n3`
- **後続結果の処理**：`zukai-shipping-api-n4`, `zukai-shipping-api-n5`, `zukai-shipping-api-n6`

## 正解の接続

- `zukai-shipping-api-n1` → `zukai-shipping-api-n2`
- `zukai-shipping-api-n1` → `zukai-shipping-api-n7`
- `zukai-shipping-api-n2` → `zukai-shipping-api-n3`
- `zukai-shipping-api-n3` → `zukai-shipping-api-n4`
- `zukai-shipping-api-n4` → `zukai-shipping-api-n5`
- `zukai-shipping-api-n4` → `zukai-shipping-api-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-shipping-api-n1` | 0.13 | 0.5 |
| `zukai-shipping-api-n2` | 0.315 | 0.5 |
| `zukai-shipping-api-n3` | 0.5 | 0.5 |
| `zukai-shipping-api-n4` | 0.685 | 0.5 |
| `zukai-shipping-api-n5` | 0.87 | 0.22 |
| `zukai-shipping-api-n6` | 0.87 | 0.78 |
| `zukai-shipping-api-n7` | 0.3 | 0.88 |

## 解説

API受付が成功すると受付IDを受け取り、出荷依頼中へ更新します。受付自体が失敗した場合は記録して担当者に通知します。Webhook受信後も成功なら出荷済み、失敗なら出荷保留へ分岐します。

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
