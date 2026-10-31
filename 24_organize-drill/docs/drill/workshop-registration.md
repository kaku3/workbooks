# 研修への参加登録

- 問題ID：`workshop-registration`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「研修への参加登録」の打ち合わせ後に残った資料です。

### 課題

資料の順番に惑わされず、必要な付箋を選んで図にしてください。

## 資料の断片（現行データ）

### 要求仕様

- 導入時期は繁忙期を避ける
- 「定員に空きがあるか確認」の結果で「上長承認が必要か確認」／「キャンセル待ちへ登録」を使い分けたい
- 「研修会場の写真」は担当者間で認識が異なる
- 「上長承認が必要か確認」の後に「参加を確定」を行いたい

### 要件

- 「キャンセル待ちへ登録」完了後に「申込者へ結果を通知」へ進む

### 外部設計

- 「研修に申し込む」の次に「定員に空きがあるか確認」を行う

### 詳細設計（現行データ）

- 保存先テーブル名は開発標準に従う
- 「参加を確定」完了後に「申込者へ結果を通知」を呼び出す

## ヒント

空席があることだけで参加が決まるとは限りません。承認の必要性も含め、申込結果が決まる条件を探しましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `workshop-registration-n1` | 必要 | 研修に申し込む |
| `workshop-registration-n2` | 必要 | 定員に空きがあるか確認 |
| `workshop-registration-n3` | 必要 | 上長承認が必要か確認 |
| `workshop-registration-n4` | 必要 | 参加を確定 |
| `workshop-registration-n5` | 必要 | キャンセル待ちへ登録 |
| `workshop-registration-n6` | 必要 | 申込者へ結果を通知 |
| `workshop-registration-x1` | 余分・参考 | 研修会場の写真 |

## グループ

- **申込条件の確認**：`workshop-registration-n1`, `workshop-registration-n2`, `workshop-registration-n3`
- **申込結果**：`workshop-registration-n4`, `workshop-registration-n5`, `workshop-registration-n6`

## 正解の接続

- `workshop-registration-n1` → `workshop-registration-n2`
- `workshop-registration-n2` → `workshop-registration-n3`
- `workshop-registration-n2` → `workshop-registration-n5`
- `workshop-registration-n3` → `workshop-registration-n4`
- `workshop-registration-n4` → `workshop-registration-n6`
- `workshop-registration-n5` → `workshop-registration-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `workshop-registration-n1` | 0.13 | 0.5 |
| `workshop-registration-n2` | 0.315 | 0.5 |
| `workshop-registration-n3` | 0.5 | 0.22 |
| `workshop-registration-n5` | 0.5 | 0.78 |
| `workshop-registration-n4` | 0.685 | 0.5 |
| `workshop-registration-n6` | 0.87 | 0.5 |

## 解説

この図では、研修に申し込む → 定員に空きがあるか確認 → 上長承認が必要か確認 → 参加を確定 → キャンセル待ちへ登録 → 申込者へ結果を通知の関係を整理します。空席と承認の条件を確認して参加可否を決めます。「研修会場の写真」は今回の流れに含めません。

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
