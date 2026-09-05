# 図解ドリル 仕様書（現行実装ベース）

## 1. 概要

- 目的: 要求仕様の文章を整理し、伝わる図を描く力を鍛える。
- 配信方式: GitHub Pages で配信できる静的サイト。
- 実装方式: HTML + CSS + JavaScript + JSON（ビルド不要）。

## 2. 公開ディレクトリ

- 公開先: docs/zukai-drill
- 仕様書配置: 20_zukai-drill/docs/ReadMe.md

```text
docs/
  zukai-drill/
    index.html
    assets/
      styles.css
      app.js
    data/
      problems.json
```

## 3. 画面構成

### 3.1 全体レイアウト

- ヘッダー（ヒーロー）
- 左メニュー（設問ナビ + 完了状況）
- 右カラム（ランディング + 問題エリア）

### 3.2 左メニュー

- 設問一覧から直接遷移できる。
- 各設問に `完了 / 未了` を表示。
- 上部に `完了 x / 全y` のサマリーを表示。
- 進捗バー（全問分）を表示し、現在位置と完了状態を視覚化。

### 3.3 ランディング

- 見出し: なぜ図解が必要か
- 文脈: 認識ズレの発生と手戻り回避を説明。
- ボタン: はじめる（最初の設問へ遷移）

### 3.4 問題画面

- 問題文章
- 悪い図（SVG）
- Q1: 主情報の選択 + 自己採点
- Q2: 1-2文の要約
- 解答ボタン押下で解答セクション表示
  - 良い図（SVG）
  - 解説（転用ポイント）
  - 問2のAI採点用プロンプト（コピー可能）

## 4. 完了判定仕様

1. Q1を自己採点済みであること。
2. Q1でその問題の主情報（`isCore: true`）をすべて選択していること。
3. Q2に要約文が入力されていること（空白のみ不可）。
4. 解答を見るを押下済みであること。

上記をすべて満たしたとき、左メニューと進捗バーで完了扱いになる。

## 5. データ仕様（problems.json）

### 5.1 ルート

- `version`
- `meta.title`
- `meta.description`
- `problems[]`

### 5.2 problems[] の要素

- `id`: 一意ID
- `title`: 設問タイトル
- `difficultyLabel`: 難易度表示（例: ★☆☆）
- `learningGoal`: 学習目標
- `scenario`: 問題文章
- `tasks.focusOptions[]`: Q1選択肢
- `badDiagram`: 悪い図
  - `title`, `lines[]`, `mistakes[]`
- `goodDiagram`: 良い図
  - `title`, `lanes[]`, `principles[]`
- `transferTip`: 解説文

### 5.3 現在の問題数と難易度構成

- 合計10問
- 初級2問 + 初中級5問 + 中級〜上級3問
- 外部連携、決済、Webhookなど実装寄りテーマを含む

## 6. SVG描画仕様

- 悪い図・良い図は `app.js` で SVG を動的生成。
- ラベルは単語途中で分断しないよう、トークン単位で改行。
- 長文は行数制限を超える場合に省略記号を付与。
- 悪い図下部のノイズ楕円は viewBox 内に収まるよう配置計算。

## 7. 保存仕様（localStorage）

- 保存キー: `zukai-drill-progress-v1`
- 保存内容:
  - 表示中の問題インデックス
  - 問題ごとの進捗（Q1選択、自己採点済み、Q2入力、解答表示済み）
  - 問題ごとの選択肢シャッフル順
- 挙動:
  - ページ再読み込み時に復元
  - 問題追加時は既定値とマージして継続利用

## 8. 主な実装ファイル

- レイアウト/テンプレート: docs/zukai-drill/index.html
- スタイル: docs/zukai-drill/assets/styles.css
- ロジック: docs/zukai-drill/assets/app.js
- 問題データ: docs/zukai-drill/data/problems.json

## 9. ヒーロー画像生成プロンプト

以下は、ページ上部ヒーローに置く横長画像向けプロンプト。

### 9.1 推奨仕様

- アスペクト比: 16:5 〜 21:7
- 例: 1680x520, 1920x600
- 用途: ヒーロー背景またはヒーロー内ビジュアル

### 9.2 生成プロンプト（日本語）

```text
ビジネス向け学習サイトのヒーロー画像。
テーマは「情報を整理し、構造化して伝わる図を作る」。
ホワイトボード上に、付箋・矢印・ボックス・フローチャートの下書きが整然と並ぶ。
背景は明るいネイビーと白を基調に、黄色をアクセントとして少量使用。
清潔感、信頼感、知的さ。人物は入れないか、入れる場合は手元のみで顔は映さない。
テキストは画像内に入れない。
フラット寄りのモダンイラストまたはセミリアル。過度に装飾しない。
Webヒーロー向けの横長構図、左側に余白を確保し、見出しテキストを重ねやすくする。
```

### 9.3 生成プロンプト（英語）

```text
Create a wide hero image for a business learning website.
Concept: "organize information and design clear diagrams".
Show a clean whiteboard scene with sticky notes, arrows, boxes, and flowchart sketches arranged in a structured way.
Use a bright navy and white palette with small yellow accents.
Mood: trustworthy, intelligent, practical, minimal.
No text inside the image.
No faces; if people are included, show only hands interacting with diagram elements.
Style: modern flat or semi-realistic illustration.
Composition: panoramic banner with clear negative space on the left for headline overlay.
```

### 9.4 ネガティブ指定（必要な場合）

```text
文字, ロゴ, 透かし, 過度なグロー, サイバーパンク, 暗すぎる背景, 紫主体, ごちゃごちゃした装飾
```
