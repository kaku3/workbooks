# 不審なログインの確認

- 問題ID：`suspicious-login`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「不審なログインの確認」について集めたメモです。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 導入時期は繁忙期を避ける

### 要件

- 同時利用は最大50人
- 「通常と異なるログインを検知」完了後に「追加認証を要求」へ進む

### 外部設計

- 「追加認証を要求」の次に「認証結果を確認」を行う
- 「ログイン画面の背景」は担当者間で認識が異なる
- 「アカウントを一時ロック」の次に「本人へ通知」を行う
- 「認証結果を確認」の結果で「ログインを許可」／「アカウントを一時ロック」に分岐

### 詳細設計（現行データ）

_（記載なし）_

## ヒント

通常と異なるログインでは、認証の結果によって許可するか止めるかが変わります。判断の後を見てみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `suspicious-login-n1` | 必要 | 通常と異なるログインを検知 |
| `suspicious-login-n2` | 必要 | 追加認証を要求 |
| `suspicious-login-n3` | 必要 | 認証結果を確認 |
| `suspicious-login-n4` | 必要 | ログインを許可 |
| `suspicious-login-n5` | 必要 | アカウントを一時ロック |
| `suspicious-login-n6` | 必要 | 本人へ通知 |
| `suspicious-login-x1` | 余分・参考 | ログイン画面の背景 |

## グループ

- **検知と追加認証**：`suspicious-login-n1`, `suspicious-login-n2`, `suspicious-login-n3`
- **認証結果**：`suspicious-login-n4`, `suspicious-login-n5`, `suspicious-login-n6`

## 正解の接続

- `suspicious-login-n1` → `suspicious-login-n2`
- `suspicious-login-n2` → `suspicious-login-n3`
- `suspicious-login-n3` → `suspicious-login-n4`
- `suspicious-login-n3` → `suspicious-login-n5`
- `suspicious-login-n5` → `suspicious-login-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `suspicious-login-n1` | 0.13 | 0.5 |
| `suspicious-login-n2` | 0.315 | 0.5 |
| `suspicious-login-n3` | 0.5 | 0.5 |
| `suspicious-login-n4` | 0.685 | 0.22 |
| `suspicious-login-n5` | 0.685 | 0.78 |
| `suspicious-login-n6` | 0.87 | 0.5 |

## 解説

この図では、通常と異なるログインを検知 → 追加認証を要求 → 認証結果を確認 → ログインを許可 → アカウントを一時ロック → 本人へ通知の関係を整理します。追加認証の成功・失敗で次の処理を分けます。「ログイン画面の背景」は今回の流れに含めません。

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
