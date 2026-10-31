# 出荷依頼API連携

- 問題ID：`zukai-shipping-api`
- 直接開く：`src/index.html?drill=zukai-shipping-api`
- 難易度：hard
- 出典：`src/data/problems.json`

## 問題文

「出荷依頼API連携」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 段階開示資料

左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。

### 最初に表示する3枚

1. 外部設計｜処理概要（外部設計）：注文確定後の出荷依頼を外部へ送り、受付時の応答と、あとから届く結果で注文の状態を更新する流れ。結果は非同期で届く。
2. 要求メモ（スコープ外）：画面の雰囲気は現行システムに近づけたい。
3. セキュリティメモ（スコープ外）：Webhook署名方式の詳細は、別途セキュリティ担当と詰める。

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| 外部設計｜分岐の扱い | 「出荷依頼APIを送信」の後は、状況によって「受付IDを受領」／「受付失敗を記録して担当者へ通知」に分かれる。 | 外部設計 | 出荷依頼APIを送信 → 受付IDを受領<br>出荷依頼APIを送信 → 受付失敗を記録して担当者へ通知 |
| 詳細設計｜内部処理 | 「受付IDを受領」の次は「出荷依頼中へ更新」を行う。 | 詳細設計 | 受付IDを受領 → 出荷依頼中へ更新 |
| 外部設計｜処理順序 | 「出荷依頼中へ更新」を受けて、「Webhookで結果を受信」につなぐ。 | 外部設計 | 出荷依頼中へ更新 → Webhookで結果を受信 |
| 詳細設計｜内部処理 | 「Webhookで結果を受信」の結果に応じて、「成功時に出荷済みへ更新」、「失敗時に出荷保留へ更新」のいずれかへ進む。 | 詳細設計 | Webhookで結果を受信 → 成功時に出荷済みへ更新<br>Webhookで結果を受信 → 失敗時に出荷保留へ更新 |
| 設定メモ | APIのタイムアウトは設定ファイルで管理する。 | スコープ外 | —（図に含めない） |
| 要求メモ | 導入時期は繁忙期を避けたい。 | スコープ外 | —（図に含めない） |

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
