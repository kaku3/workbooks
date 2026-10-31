# 通知設定の変更

- 問題ID：`notification-preference`
- 難易度：easy
- 出典：`src/data/problems.json`

## 問題文

「通知設定の変更」に関する資料の断片です。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 資料の断片（現行データ）

### 要求仕様

- 「通知設定を開く」の後に「通知方法を選ぶ」を行いたい
- 「次回通知から反映」を実現したい

### 要件

- 「通知設定を保存」完了後に「次回通知から反映」へ進む
- 機能要件：設定内容を検証
- 応答時間は3秒以内
- 参考：設定画面のアイコン

### 外部設計

- 利用者から見える動き：通知設定を保存
- 利用者から見える動き：通知設定を開く

### 詳細設計（現行データ）

- 「通知方法を選ぶ」完了後に「設定内容を検証」を呼び出す
- 内部処理：通知方法を選ぶ
- 「設定内容を検証」完了後に「通知設定を保存」を呼び出す

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
