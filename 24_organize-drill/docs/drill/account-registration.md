# アカウント登録

- 問題ID：`account-registration`
- 難易度：easy
- 出典：`src/data/problems.json`

## 問題文

「アカウント登録」に関する資料の断片です。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「登録情報を入力」の後に「入力内容を検証」を行いたい
- 「入力内容を検証」を実現したい
- 「登録情報を入力」を実現したい
- 「確認リンクを開く」を実現したい

### 要件

- 「登録画面のロゴ」も論点に挙がったが未決定

### 外部設計

- 画面文言は後日確定
- 「確認リンクを開く」の次に「アカウントを有効化」を行う
- 利用者から見える動き：確認メールを送信
- 利用者から見える動き：アカウントを有効化

### 詳細設計（現行データ）

- 「確認メールを送信」完了後に「確認リンクを開く」を呼び出す
- 「入力内容を検証」完了後に「確認メールを送信」を呼び出す

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
