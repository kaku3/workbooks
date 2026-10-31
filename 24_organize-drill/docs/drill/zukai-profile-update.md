# プロフィール更新

- 問題ID：`zukai-profile-update`
- 難易度：easy
- 出典：`src/data/problems.json`

## 問題文

「プロフィール更新」の打ち合わせ後に残った資料です。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 資料の断片（現行データ）

### 要求仕様

- 「表示名を編集して保存」の後に「文字数をチェック」を行いたい
- 「データを保存」を実現したい

### 要件

- 同時利用は最大50人
- 機能要件：文字数をチェック
- 機能要件：完了メッセージを表示
- 「データを保存」完了後に「完了メッセージを表示」へ進む
- 「将来の画像変更機能」も論点に挙がったが未決定

### 外部設計

_（記載なし）_

### 詳細設計（現行データ）

- 内部処理：表示名を編集して保存
- 「保存ボタンの色」は担当者間で認識が異なる
- 「文字数をチェック」完了後に「データを保存」を呼び出す

## ヒント

今回は、表示名を変更して保存する一連の流れが対象です。見た目や将来の機能は、処理そのものと分けて考えましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `zukai-profile-update-n1` | 必要 | 表示名を編集して保存 |
| `zukai-profile-update-n2` | 必要 | 文字数をチェック |
| `zukai-profile-update-n3` | 必要 | データを保存 |
| `zukai-profile-update-n4` | 必要 | 完了メッセージを表示 |
| `zukai-profile-update-x1` | 余分・参考 | 将来の画像変更機能 |
| `zukai-profile-update-x2` | 余分・参考 | 保存ボタンの色 |

## グループ

- **入力から保存まで**：`zukai-profile-update-n1`, `zukai-profile-update-n2`, `zukai-profile-update-n3`, `zukai-profile-update-n4`

## 正解の接続

- `zukai-profile-update-n1` → `zukai-profile-update-n2`
- `zukai-profile-update-n2` → `zukai-profile-update-n3`
- `zukai-profile-update-n3` → `zukai-profile-update-n4`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `zukai-profile-update-n1` | 0.13 | 0.5 |
| `zukai-profile-update-n2` | 0.377 | 0.5 |
| `zukai-profile-update-n3` | 0.623 | 0.5 |
| `zukai-profile-update-n4` | 0.87 | 0.5 |

## 解説

この図では、表示名を編集して保存 → 文字数をチェック → データを保存 → 完了メッセージを表示の関係を整理します。将来機能や画面の見た目は今回の処理に含めません。「将来の画像変更機能」「保存ボタンの色」は今回の流れに含めません。

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
