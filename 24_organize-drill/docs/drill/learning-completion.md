# オンライン学習の修了

- 問題ID：`learning-completion`
- 難易度：normal
- 出典：`src/data/problems.json`

## 問題文

「オンライン学習の修了」について集めたメモです。

### 課題

図に必要な付箋を選び、処理の流れを矢印でつないでください。

## 資料の断片（現行データ）

### 要求仕様

- 「教材ページの背景色」は担当者間で認識が異なる
- 操作研修の資料は別途用意

### 要件

- 「基準点以上か判定」の後は状況に応じて「修了証を発行」／「再受講を案内」へ進む
- 「テストを採点」完了後に「基準点以上か判定」へ進む

### 外部設計

- エラー表示の色は共通スタイルに合わせる
- 「確認テストを提出」の次に「テストを採点」を行う

### 詳細設計（現行データ）

- 「教材を受講」完了後に「確認テストを提出」を呼び出す

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
