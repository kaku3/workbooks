# PLiCy向けバンドル版

## 方針

開発用の `src/*.mjs` は変更せず、ビルド時だけ通常のJavaScript（IIFE形式）へまとめる。PLiCy側が `.mjs` を `www/unknown` で配信しても、配布版はモジュールを取得しないため、そのMIMEエラーを回避できる。

配布版の `index.html` にはJavaScriptとCSSを埋め込む。`type="module"`、実行時のimport、外部JavaScript/CSSファイルの読み込みは使わない。画像・faviconは `assets/` に同梱する。元のJavaScriptの `import.meta.url` はビルド時だけ `document.baseURI` に置き換え、立ち絵を配布HTMLからの相対パスで取得する。

`app.js`・`style.css`・`hud.css` も通常ファイルとして同梱するが、配布HTMLの実行にそれらのMIME判定は必要ない。Google Fontsのリンクは元のまま残し、接続できなければ指定済みの代替フォントで表示する。

## 画面遷移

配布版だけ、ステージ・モード・再生フラグをブラウザー内に保存し、同じページ内のゲームDOMを入れ替える。パス・クエリー・フラグメントを一切書き換えず、ページ・フレームの再読み込みも行わない。以前のクエリー方式・ハッシュ方式・再読み込み方式はPLiCy上で動作しなかったため廃止した。

遷移先はsessionStorageへ保存し、フレームが作り直された場合に備えてlocalStorageにも60秒間有効な一度限りの引継ぎデータを置く。次の起動時に引継ぎを消費して画面を復元する。ホストが入口パスを変えても同じゲーム用キーで復元する。

「はじめから」「つづきから」、ドリル一覧、次ステージ、章末会話、タイトル復帰、replayフラグの除去に適用する。HTML冒頭の画面判定も復元した遷移情報を参照する。互換処理はビルド時に注入し、`src/` とGitHub Pages用のクエリー方式は変更しない。実際のPLiCy環境への再投稿は別途必要で、ローカル検証の成功を実機動作の保証とはしない。

ビルド時にアプリの開始処理を関数化し、`plicyGameRoot` 内だけを再作成する。ホスト側のDOMは置き換えない。前画面のタイマー、アニメーションフレーム、ResizeObserver、window/documentリスナーを解除し、読み込み待ちの旧会話が次画面を上書きしないようにする。

## 作成手順

プロジェクトディレクトリ `25_desgin-block-drill` で実行する。

```powershell
npm ci
npm run build:plicy
```

依存のインストールは初回または依存更新時に必要。以降のソース修正後は `npm run build:plicy` だけで再作成できる。

シナリオのMarkdownを変更した場合は、先に既存の会話生成を行う。

```powershell
node scripts/build-story.mjs
npm run build:plicy
```

ビルド自身は原稿・ソースを更新しない。GitHub Pages用の `docs/design-block-drill` も上書きしない。

## 出力と投稿

- `dist/plicy/`：HTTPサーバーで確認できる配布フォルダ。
- `dist/design-block-drill-plicy.zip`：PLiCyにアップロードするZIP。

ZIP直下に `index.html`・`app.js`・CSS・`assets/` を置く。`plicy/` などの親フォルダ、開発依存、`.mjs`、テストは含めない。生成済みZIPをそのまま投稿し、PLiCy上のテストプレイで起動・表示・保存を確認する。配布先が変わるので、GitHub Pages側のブラウザー保存データは引き継がれない。

ビルドし直すと `dist/plicy/` とZIPを置き換える。生成物を直接編集せず、修正は `src/` に行う。

## 検証

```powershell
npm run test:bundle
npm run test:plicy
```

- `test:bundle`：全ソースがビルド前後で不変、通常スクリプトとして構文解析可能、JS/CSS埋め込み、ZIP構造、画像同梱を確認。
- `test:plicy`：上記に加え、JS・MJS・CSSを `www/unknown`、`X-Content-Type-Options: nosniff` で返し、ゲーム用クエリーを除去するローカルサーバー上でEdgeによる実画面検証を行う。「はじめから」、全28ケース、会話・章進行・ログ・保存移行・スマホ幅を確認。画面切替でDocumentとURLが変わらず、ホスト用パラメーターが残ることも検証する。
- ブラウザーテストはWindowsのEdgeを既定で使用する。別の実行ファイルは `EDGE_PATH` で指定できる。
- 実際のPLiCyへの投稿・公開操作は自動では行わない。

## 参照

- [PLiCy公式：HTML5ゲームのトラブルシューティング](https://plicy.net/ToolFAQ/HTML5)
- [esbuild：バンドル形式](https://esbuild.github.io/api/#format)
