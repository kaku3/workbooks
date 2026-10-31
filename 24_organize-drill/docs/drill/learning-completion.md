# オンライン学習の修了

- 問題ID：`learning-completion`
- 直接開く：`src/index.html?drill=learning-completion`
- 難易度：normal
- 出典：`src/data/problems.json`

## 要求仕様

教材の理解度をテストで確認し、合格者に修了証を発行したい。基準に届かない場合は学び直しを案内する。 今回の図の対象：オンライン学習の受講後にテストを採点し、結果に応じて、修了または再受講を案内する流れ。

### 操作

要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。

## 段階開示資料

左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。

### 最初に表示する3枚

1. 理解度の確認テストは、教材を受講した学習者が提出する。（内部種別：要件・要求／根拠：教材を受講 → 確認テストを提出）
2. 採点の対象は、提出済みのテストとする。（内部種別：要件・要求／根拠：確認テストを提出 → テストを採点）
3. 教材ページの背景色は、長い説明文を読んでも疲れにくいものにしたい。（内部種別：スコープ外／根拠：対象外）

### 追加で開示する資料（順不同）

| 資料 | 内容 | 種別 | 根拠になる正解接続 |
|---|---|---|---|
| learning-completion-doc-04 | 合否の判定には、採点で得られた得点を使う。 | 要件・要求 | テストを採点 → 基準点以上か判定 |
| learning-completion-doc-05 | 基準点以上なら修了証を発行する。届かない場合は再受講を案内する。 | 要件・要求 | 基準点以上か判定 → 修了証を発行<br>基準点以上か判定 → 再受講を案内 |

## ヒント

受講しただけで修了になるとは限りません。判定結果によって、その後の案内がどう変わるか考えましょう。

## 付箋

| ID | 種別 | ラベル |
|---|---|---|
| `learning-completion-n1` | 必要 | 教材を受講 |
| `learning-completion-n2` | 必要 | 確認テストを提出 |
| `learning-completion-n3` | 必要 | テストを採点 |
| `learning-completion-n4` | 必要 | 基準点以上か判定 |
| `learning-completion-n5` | 必要 | 修了証を発行 |
| `learning-completion-n6` | 必要 | 再受講を案内 |
| `learning-completion-x1` | 余分・参考 | 教材ページの背景色 |

## グループ

- **受講と採点**：`learning-completion-n1`, `learning-completion-n2`, `learning-completion-n3`, `learning-completion-n4`
- **採点結果**：`learning-completion-n5`, `learning-completion-n6`

## 正解の接続

- `learning-completion-n1` → `learning-completion-n2`
- `learning-completion-n2` → `learning-completion-n3`
- `learning-completion-n3` → `learning-completion-n4`
- `learning-completion-n4` → `learning-completion-n5`
- `learning-completion-n4` → `learning-completion-n6`

## 正解例の配置

| 付箋ID | x | y |
|---|---:|---:|
| `learning-completion-n1` | 0.13 | 0.5 |
| `learning-completion-n2` | 0.315 | 0.5 |
| `learning-completion-n3` | 0.5 | 0.5 |
| `learning-completion-n4` | 0.685 | 0.5 |
| `learning-completion-n5` | 0.87 | 0.22 |
| `learning-completion-n6` | 0.87 | 0.78 |

## 解説

この図では、教材を受講 → 確認テストを提出 → テストを採点 → 基準点以上か判定 → 修了証を発行 → 再受講を案内の関係を整理します。基準点を満たす場合だけ修了証を発行します。「教材ページの背景色」は今回の流れに含めません。

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
