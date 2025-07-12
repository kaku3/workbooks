# 投票率データ処理スクリプト

このプロジェクトは、特定のExcelファイルから過去の選挙における推定投票率データを読み込み、年齢層別の投票率を抽出・整形し、JavaScriptファイルとして出力するスクリプトです。

生成されたデータは、Webアプリケーションでの可視化や分析に利用することを想定しています。

## 機能

- Excelファイル (`senkyobetu_suitei_ichiran3.xlsx`) から投票率データを読み込みます。
- 過去の選挙執行年月日と、特定の年齢層（5歳刻みなど）の投票率を抽出します。
- 抽出したデータをJavaScriptのオブジェクト形式に整形し、`vote-rates.js`として出力します。

## 使い方

1. 必要な依存関係をインストールします。
   ```bash
   npm install
   ```
2. 入力となるExcelファイル (`senkyobetu_suitei_ichiran3.xlsx`) を `10_src/in/` ディレクトリに配置します。
3. スクリプトを実行します。
   ```bash
   node 10_src/index.js
   ```
4. 処理されたデータは `10_src/out/vote-rates.js` に出力されます。

## 技術要素

- Node.js
- `xlsx` (Excelファイル読み込み)
- `fs` (ファイルシステム操作)
