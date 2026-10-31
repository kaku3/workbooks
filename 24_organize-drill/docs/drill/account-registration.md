# アカウント登録

- 問題ID：`account-registration`
- 直接開く：`src/index.html?drill=account-registration`
- 難易度：easy
- 出典：`src/data/problems.json`

## 要求仕様

入力情報とメールアドレスを確認した利用者が、アカウントを使い始められるようにしたい。 今回の図の対象：利用者がアカウントを登録し、メールでの確認を経て利用を始められるようになるまでの流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 登録フォームから届いた情報を、入力検証の対象にする。（内部種別：要件・要求／根拠：登録情報を入力 → 入力内容を検証）
2. 確認用のメールは、入力が妥当な登録先だけに送る。（内部種別：要件・要求／根拠：入力内容を検証 → 確認メールを送信）
3. 登録画面のロゴから運営会社が分かるようにし、スマートフォンでも読める大きさにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| account-registration-doc-04 | 利用者には届いたメール内の確認リンクを開いてもらう。 | 要件・要求 | 確認メールを送信 → 確認リンクを開く |
| account-registration-doc-05 | メールの持ち主と確認できた登録だけを有効にする。 | 要件・要求 | 確認リンクを開く → アカウントを有効化 |

## ヒント

登録情報を受け取った直後に利用開始できるとは限りません。メールでの確認が何を区切っているか考えましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `account-registration-n1` | 必要 | 登録情報を入力 |
| `account-registration-n2` | 必要 | 入力内容を検証 |
| `account-registration-n3` | 必要 | 確認メールを送信 |
| `account-registration-n4` | 必要 | 確認リンクを開く |
| `account-registration-n5` | 必要 | アカウントを有効化 |
| `account-registration-x1` | 余分・参考 | 登録画面のロゴ |

## グループ

- **登録受付**：`account-registration-n1`, `account-registration-n2`, `account-registration-n3`
- **利用開始**：`account-registration-n4`, `account-registration-n5`

## 正解の接続

- `account-registration-n1` → `account-registration-n2`
- `account-registration-n2` → `account-registration-n3`
- `account-registration-n3` → `account-registration-n4`
- `account-registration-n4` → `account-registration-n5`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `account-registration-n1` | 0.13 | 0.5 |
| `account-registration-n2` | 0.315 | 0.5 |
| `account-registration-n3` | 0.5 | 0.5 |
| `account-registration-n4` | 0.685 | 0.5 |
| `account-registration-n5` | 0.87 | 0.5 |

## 解説

この図では、登録情報を入力 → 入力内容を検証 → 確認メールを送信 → 確認リンクを開く → アカウントを有効化の関係を整理します。メール確認が終わる前にアカウントを有効化しません。「登録画面のロゴ」は今回の流れに含めません。

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
