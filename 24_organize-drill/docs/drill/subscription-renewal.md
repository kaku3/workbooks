# サブスクリプション更新

- 問題ID：`subscription-renewal`
- 直接開く：`src/index.html?drill=subscription-renewal`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「サブスクリプション更新」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 段階開示資料

左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。

### 最初に表示する3枚

1. 外部設計｜処理概要（外部設計）：更新日を迎えた契約について、決済の結果に応じて継続または利用の一時停止へ進む流れ。
2. 利用メモ（スコープ外）：同時利用は最大50人を想定している。
3. 共通デザインメモ（スコープ外）：料金表の表示色は、料金改定のたびにデザイナーが調整する。

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| 要件メモ | 「更新日を迎える」を行った後に、「契約状態を確認」へ進む。 | 要件・要求 | 更新日を迎える → 契約状態を確認 |
| 外部設計｜処理順序 | 「契約状態を確認」の次は「更新料金を決済」を行う。 | 外部設計 | 契約状態を確認 → 更新料金を決済 |
| 詳細設計｜内部処理 | 「更新料金を決済」の後は、状況によって「継続期間を更新」／「決済失敗を通知」に分かれる。 | 詳細設計 | 更新料金を決済 → 継続期間を更新<br>更新料金を決済 → 決済失敗を通知 |
| 要求メモ | 「決済失敗を通知」を受けて、「利用を一時停止」につなぐ。 | 要件・要求 | 決済失敗を通知 → 利用を一時停止 |
| 非機能メモ | 応答時間は3秒以内を目標とする。性能の検討は別の資料で行う。 | スコープ外 | —（図に含めない） |
| 共通デザインメモ | エラー表示の色は共通スタイルに合わせる。 | スコープ外 | —（図に含めない） |

## ヒント

決済が成功した場合と失敗した場合で、契約の扱いが変わります。利用を続けられる条件を考えてみましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `subscription-renewal-n1` | 必要 | 更新日を迎える |
| `subscription-renewal-n2` | 必要 | 契約状態を確認 |
| `subscription-renewal-n3` | 必要 | 更新料金を決済 |
| `subscription-renewal-n4` | 必要 | 継続期間を更新 |
| `subscription-renewal-n5` | 必要 | 決済失敗を通知 |
| `subscription-renewal-n6` | 必要 | 利用を一時停止 |
| `subscription-renewal-x1` | 余分・参考 | 料金表の表示色 |

## グループ

- **更新処理**：`subscription-renewal-n1`, `subscription-renewal-n2`, `subscription-renewal-n3`
- **決済結果**：`subscription-renewal-n4`, `subscription-renewal-n5`, `subscription-renewal-n6`

## 正解の接続

- `subscription-renewal-n1` → `subscription-renewal-n2`
- `subscription-renewal-n2` → `subscription-renewal-n3`
- `subscription-renewal-n3` → `subscription-renewal-n4`
- `subscription-renewal-n3` → `subscription-renewal-n5`
- `subscription-renewal-n5` → `subscription-renewal-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `subscription-renewal-n1` | 0.13 | 0.5 |
| `subscription-renewal-n2` | 0.315 | 0.5 |
| `subscription-renewal-n3` | 0.5 | 0.5 |
| `subscription-renewal-n4` | 0.685 | 0.22 |
| `subscription-renewal-n5` | 0.685 | 0.78 |
| `subscription-renewal-n6` | 0.87 | 0.5 |

## 解説

この図では、更新日を迎える → 契約状態を確認 → 更新料金を決済 → 継続期間を更新 → 決済失敗を通知 → 利用を一時停止の関係を整理します。決済成功時と失敗時の処理を分けます。「料金表の表示色」は今回の流れに含めません。

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
