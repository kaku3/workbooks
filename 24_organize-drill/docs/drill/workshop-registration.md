# 研修への参加登録

- 問題ID：`workshop-registration`
- 直接開く：`src/index.html?drill=workshop-registration`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「研修への参加登録」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。

### 課題

関係する付箋を選び、情報のつながりを矢印で整理してください。

## 段階開示資料

左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。

### 最初に表示する3枚

1. 外部設計｜処理概要（外部設計）：社員が研修に申し込み、定員や承認の条件に応じて、参加確定またはキャンセル待ちになる流れ。
2. 設定メモ（スコープ外）：APIのタイムアウトは設定ファイルで管理する。
3. 広報メモ（スコープ外）：研修会場の写真は、案内メールの装飾に使っている。

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| 外部設計｜処理順序 | 「研修に申し込む」の次は「定員に空きがあるか確認」を行う。 | 外部設計 | 研修に申し込む → 定員に空きがあるか確認 |
| 外部設計｜分岐の扱い | 「定員に空きがあるか確認」の結果次第で、行き先（「上長承認が必要か確認」、「キャンセル待ちへ登録」）が決まる。 | 外部設計 | 定員に空きがあるか確認 → 上長承認が必要か確認<br>定員に空きがあるか確認 → キャンセル待ちへ登録 |
| 外部設計｜処理順序 | 「上長承認が必要か確認」を行った後に、「参加を確定」へ進む。 | 外部設計 | 上長承認が必要か確認 → 参加を確定 |
| 要求メモ | 「参加を確定」が終わったら、「申込者へ結果を通知」に移る。 | 要件・要求 | 参加を確定 → 申込者へ結果を通知 |
| 要求メモ | 「キャンセル待ちへ登録」が終わったら、「申込者へ結果を通知」に移る。 | 要件・要求 | キャンセル待ちへ登録 → 申込者へ結果を通知 |
| 開発標準メモ | 保存先テーブル名は開発標準に従う。 | スコープ外 | —（図に含めない） |
| 研修メモ | 操作研修の資料は別途用意する。 | スコープ外 | —（図に含めない） |

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
