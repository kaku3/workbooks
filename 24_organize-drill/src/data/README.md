# data/

`problems.json`で全50問の文章、難易度、カード候補、正解の接続関係、完成例、ヒント、解説を管理します。難易度は`easy`（初級）・`normal`（中級）・`hard`（上級）のいずれかです。資料（prompt）は付箋として段階的に開示し、必要なカードと接続を資料から一意に読み取れるようにします。上級問題には条件分岐を2か所以上設定します。最初の5問に加えて、20_zukai-drillの10テーマをフロー図問題に再構成した問題と独自の練習問題を収録しています。`career.json`はポイント報酬とステージの設定です。

## 問題データの項目

- `id`: 一意の問題ID
- `title`: 問題タイトル
- `prompt`: `intro`（冒頭文）・`task`（課題文）・`documents`（段階開示する資料。下記）
- `hint`: 考える手がかり
- `items`: キャンバスに配置するカード候補。`kind`は`required`（必要）または`extra`（不要）
- `groups`: 任意。意味上ひとまとまりとして扱うカード群。各要素の`itemIds`にカードIDを指定し、見た目のまとまり評価に使う
- `connections`: 正解の有向接続。`[始点ID, 終点ID]`の配列
- `connectionAlternatives`: 任意。`connections`以外にも正解として認める接続セットの配列。配置や接続の解釈に複数の妥当な答えがある場合に使う
- `layout`: 完成例の配置。各ノードの`x`・`y`を0〜1の比率で指定
- `explanation`: 要素選択や接続の考え方

知識の正誤は必要なカードの選択と有向接続（始点・終点）で判定し、配置座標は正誤に影響させません。配置の整い方は別枠の「図の整いポイント」で評価します。完成例の配置は比較用の一例です。接続に複数の妥当な解釈がある場合は、`connectionAlternatives`に許容する接続セットを明示します。データにない接続を自動で意味判定するものではありません。

```json
{
  "connections": [["start", "review"], ["review", "finish"]],
  "connectionAlternatives": [
    [["start", "finish"], ["start", "review"], ["review", "finish"]]
  ]
}
```

この例では、直接の関係を表す2本の矢印と、全体の流れを示す「start→finish」も加えた3本の矢印をどちらも正解として扱います。

## 段階開示資料（prompt.documents）

左側のホワイトボードに付箋として表示する資料です。

```json
{
  "prompt": {
    "intro": "冒頭文",
    "task": "課題文",
    "documents": {
      "initial": [
        { "id": "…-doc-01", "kind": "external", "title": "外部設計｜処理概要", "text": "…" },
        { "id": "…-doc-02", "kind": "scope", "title": "画面仕様メモ", "text": "…" },
        { "id": "…-doc-03", "kind": "scope", "title": "共通デザインメモ", "text": "…" }
      ],
      "additional": [
        { "id": "…-doc-04", "kind": "external", "title": "外部設計｜処理順序", "text": "…", "covers": ["from->to"] },
        { "id": "…-doc-08", "kind": "scope", "title": "運用メモ", "text": "…" }
      ]
    }
  }
}
```

- `initial`: 最初から見える3枚。**外部設計1枚（処理の概要）＋スコープ外2枚**。接続の根拠になる記述は入れない
- `additional`: 「（ヒントを見る）」を押すたびに1枚ずつ開く追加資料。必要な情報とスコープ外を混ぜて置き、開示順は画面側で毎回ランダムにする。開くたびに1点減点する
- `kind`: `external`（外部設計）／`requirement`（要件・要求）／`detail`（詳細設計）／`scope`（図に含めないスコープ外）。付箋の色が変わる
- `covers`: その資料が根拠になる正解接続（`始点ID->終点ID`）。画面では使わず、レビュー用と検証用。`connections`の全接続が、追加資料のどれか1枚にちょうど1回ずつ入る
- 付箋はユーザーがドラッグで自由に動かせる。追加資料は既存の付箋と重ならない空きに置く

## 資料の生成

```
node data/build-problems.mjs      # problems.json を作り直す（必要な場合のみ）
node data/build-documents.mjs     # prompt を段階開示資料に作り直す
node data/build-review-docs.mjs   # ../docs/drill/*.md を作り直す
```

- `build-problems.mjs`は`problems.json`全体を作り直すため、実行したあとに`build-documents.mjs`をもう一度実行してください
- `build-documents.mjs`は同じ入力なら同じ結果になります。必要な資料は`connections`から自動生成します（起点カードごとに1枚。分岐・並行・やり直しは文を書き分けます）
- 手書きの部分は`documents-source.json`に置きます。問題ごとの`overview`（最初の外部設計）、`scope`（`extra`カードごとのスコープ外資料）、並行して進む起点を示す`parallel`、自動生成せずそのまま使う`documents`（`zukai-payment-auth`）があります。スコープ外の追加資料のうち汎用的なものは`build-documents.mjs`の`NOISE`から選びます
- 生成時に「最初は外部設計1枚＋スコープ外2枚」「全接続が資料に対応」「スコープ外資料に必要なカードの文言が入っていない」を検証し、満たさなければエラーにします
- `build-review-docs.mjs`は「レビュー・見直しメモ」の記入内容を保持したまま、それ以外を`problems.json`から書き直します
