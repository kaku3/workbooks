# 通知設定の変更

- 問題ID：`notification-preference`
- 直接開く：`src/index.html?drill=notification-preference`
- 難易度：easy
- 出典：`src/data/problems.json`

## 問題文

「通知設定の変更」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 段階開示資料

左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。

### 最初に表示する3枚

1. 外部設計｜処理概要（外部設計）：利用者が通知方法を変更し、その設定が次回の通知から反映されるまでの流れ。
2. 研修メモ（スコープ外）：操作研修の資料は別途用意する。
3. 共通デザインメモ（スコープ外）：設定画面のアイコンは、共通アイコンセットから選ぶ。

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| 詳細設計｜内部処理 | 「通知設定を開く」を受けて、「通知方法を選ぶ」につなぐ。 | 詳細設計 | 通知設定を開く → 通知方法を選ぶ |
| 外部設計｜処理順序 | 「通知方法を選ぶ」が終わったら、「設定内容を検証」に移る。 | 外部設計 | 通知方法を選ぶ → 設定内容を検証 |
| 外部設計｜処理順序 | 「設定内容を検証」を受けて、「通知設定を保存」につなぐ。 | 外部設計 | 設定内容を検証 → 通知設定を保存 |
| 外部設計｜処理順序 | 「通知設定を保存」の次は「次回通知から反映」を行う。 | 外部設計 | 通知設定を保存 → 次回通知から反映 |
| 帳票メモ | 帳票レイアウトは別紙を参照する。 | スコープ外 | —（図に含めない） |
| 要求メモ | 画面の雰囲気は現行システムに近づけたい。 | スコープ外 | —（図に含めない） |

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
