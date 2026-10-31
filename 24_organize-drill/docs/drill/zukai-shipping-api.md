# 出荷依頼API連携

- 問題ID：`zukai-shipping-api`
- 難易度：hard
- 出典：`src/data/problems.json`

## 問題文

「出荷依頼API連携」に関する資料の断片です。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「出荷依頼APIを送信」の結果で「受付IDを受領」／「受付失敗を記録して担当者へ通知」を使い分けたい
- 画面の雰囲気は現行システムに近づける
- 「Webhook署名方式の詳細」も論点に挙がったが未決定

### 要件

- 「受付IDを受領」完了後に「出荷依頼中へ更新」へ進む
- 「Webhookで結果を受信」の後は状況に応じて「成功時に出荷済みへ更新」／「失敗時に出荷保留へ更新」へ進む
- 同時利用は最大50人

### 外部設計

- 「出荷依頼中へ更新」の次に「Webhookで結果を受信」を行う
- 帳票レイアウトは別紙参照

### 詳細設計（現行データ）

- 「Webhookで結果を受信」完了後に「失敗時に出荷保留へ更新」を呼び出す

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
