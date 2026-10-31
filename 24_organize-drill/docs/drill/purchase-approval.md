# 備品購入の承認

- 問題ID：`purchase-approval`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「備品購入の承認」について集めたメモです。

### 課題

図に載せる情報を見極め、付箋を矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「備品を発注」の後に「申請者へ結果を通知」を行いたい
- 操作研修の資料は別途用意
- 「予算内か判定」の結果で「備品を発注」／「申請を差し戻す」を使い分けたい
- 「社員が購入申請」の後に「上長が内容を確認」を行いたい

### 要件

- 操作ログは1年間保存

### 外部設計

- 「上長が内容を確認」の次に「予算内か判定」を行う

### 詳細設計（現行データ）

- 参考：備品カタログの表紙
- 「申請を差し戻す」完了後に「申請者へ結果を通知」を呼び出す

## ヒント

判断の結果で処理が分かれますが、どちらの場合も申請者への連絡が必要そうです。最後の通知まで見てみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `purchase-approval-n1` | 必要 | 社員が購入申請 |
| `purchase-approval-n2` | 必要 | 上長が内容を確認 |
| `purchase-approval-n3` | 必要 | 予算内か判定 |
| `purchase-approval-n4` | 必要 | 備品を発注 |
| `purchase-approval-n5` | 必要 | 申請を差し戻す |
| `purchase-approval-n6` | 必要 | 申請者へ結果を通知 |
| `purchase-approval-x1` | 余分・参考 | 備品カタログの表紙 |

## グループ

- **申請と判断**：`purchase-approval-n1`, `purchase-approval-n2`, `purchase-approval-n3`
- **判断後の処理**：`purchase-approval-n4`, `purchase-approval-n5`, `purchase-approval-n6`

## 正解の接続

- `purchase-approval-n1` → `purchase-approval-n2`
- `purchase-approval-n2` → `purchase-approval-n3`
- `purchase-approval-n3` → `purchase-approval-n4`
- `purchase-approval-n3` → `purchase-approval-n5`
- `purchase-approval-n4` → `purchase-approval-n6`
- `purchase-approval-n5` → `purchase-approval-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `purchase-approval-n1` | 0.13 | 0.5 |
| `purchase-approval-n2` | 0.315 | 0.5 |
| `purchase-approval-n3` | 0.5 | 0.5 |
| `purchase-approval-n4` | 0.685 | 0.22 |
| `purchase-approval-n5` | 0.685 | 0.78 |
| `purchase-approval-n6` | 0.87 | 0.5 |

## 解説

この図では、社員が購入申請 → 上長が内容を確認 → 予算内か判定 → 備品を発注 → 申請を差し戻す → 申請者へ結果を通知の関係を整理します。予算内の場合と超過時の処理を分けます。「備品カタログの表紙」は今回の流れに含めません。

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
