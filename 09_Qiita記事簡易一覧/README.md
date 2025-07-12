# Qiita記事簡易一覧ジェネレーター

このプロジェクトは、Qiita APIを利用して特定のQiitaユーザーの投稿記事を取得し、JavaScriptファイルとして出力するスクリプトです。

生成されたデータは、WebページなどでQiita記事の一覧を表示するために利用できます。

## 機能

- 指定したQiitaユーザーの公開記事をQiita API v2経由で取得します。
- 取得した記事データ（タイトル、URLなど）をJSON形式で整形し、JavaScriptファイル (`templates/data/articles.js`) として出力します。
- ページネーションに対応しており、最大5ページ（1ページあたり100記事）まで取得します。

## 使い方

1. **リポジトリのクローンまたはダウンロード**

2. **設定ファイルの準備**
   `10_src/config.sample.js` を `10_src/config.js` にリネームし、内容を編集します。

   ```javascript
   // 10_src/config.js
   module.exports = {
     // Qiitaの個人用アクセストークン
     // https://qiita.com/settings/applications で作成し、read_qiitaスコープを付与してください。
     token: 'YOUR_QIITA_API_TOKEN'
   };
   ```
   `token` には、Qiitaの[設定ページ](https://qiita.com/settings/applications)で発行したアクセストークンを設定してください。`read_qiita` スコープが必要です。

3. **依存ライブラリのインストール**
   プロジェクトルートの `10_src` ディレクトリで以下のコマンドを実行します。
   ```bash
   cd 10_src
   npm install
   ```

4. **スクリプトの実行**
   `10_src` ディレクトリで以下のコマンドを実行します。
   ```bash
   node index.js
   ```

5. **結果の確認**
   `10_src/templates/data/articles.js` に、取得した記事データがJavaScriptの変数 `ARTICLES` として出力されます。

## 技術要素

- Node.js
- `axios` (HTTPクライアント)
- `fs` (ファイルシステム操作)

## 注意事項

- Qiita APIのレートリミットにご注意ください。
- `config.js` に設定するアクセストークンは公開リポジトリにコミットしないように注意してください。
