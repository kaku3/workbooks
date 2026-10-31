# クーポン適用

- 問題ID：`coupon-application`
- 難易度：hard
- 出典：`src/data/problems.json`

## 問題文

「クーポン適用」について集めたメモです。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 資料の断片（現行データ）

### 要求仕様

- 「有効期限を確認」の結果で「対象商品を確認」／「利用できない理由を表示」を使い分けたい

### 要件

- 操作ログは1年間保存
- 「対象商品を確認」完了後に「割引を適用」へ進む
- 参考：キャンペーンバナーの色
- 「対象商品を確認」の後は状況に応じて「割引を適用」／「利用できない理由を表示」へ進む
- 「クーポンコードを入力」完了後に「有効期限を確認」へ進む

### 外部設計

- 帳票レイアウトは別紙参照

### 詳細設計（現行データ）

- 保存先テーブル名は開発標準に従う

## ヒント

割引には複数の条件がありそうです。確認が一つ終わっただけで適用してよいか、結果による行き先の違いを考えましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `coupon-application-n1` | 必要 | クーポンコードを入力 |
| `coupon-application-n2` | 必要 | 有効期限を確認 |
| `coupon-application-n3` | 必要 | 対象商品を確認 |
| `coupon-application-n4` | 必要 | 割引を適用 |
| `coupon-application-n5` | 必要 | 利用できない理由を表示 |
| `coupon-application-x1` | 余分・参考 | キャンペーンバナーの色 |

## グループ

- **適用条件の確認**：`coupon-application-n1`, `coupon-application-n2`, `coupon-application-n3`
- **判定結果**：`coupon-application-n4`, `coupon-application-n5`

## 正解の接続

- `coupon-application-n1` → `coupon-application-n2`
- `coupon-application-n2` → `coupon-application-n3`
- `coupon-application-n2` → `coupon-application-n5`
- `coupon-application-n3` → `coupon-application-n4`
- `coupon-application-n3` → `coupon-application-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `coupon-application-n1` | 0.13 | 0.5 |
| `coupon-application-n2` | 0.377 | 0.5 |
| `coupon-application-n3` | 0.623 | 0.5 |
| `coupon-application-n4` | 0.87 | 0.22 |
| `coupon-application-n5` | 0.87 | 0.78 |

## 解説

この図では、クーポンコードを入力 → 有効期限を確認 → 対象商品を確認 → 割引を適用 → 利用できない理由を表示の関係を整理します。期限と対象商品の両方を満たす場合だけ割引します。「キャンペーンバナーの色」は今回の流れに含めません。

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
