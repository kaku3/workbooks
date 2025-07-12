# Nintendo Switch eShop ソフトウェア一覧

このプロジェクトは、Nintendo SwitchのeShopからソフトウェア情報を収集し、それを表示するWebアプリケーションです。

## 構成

本プロジェクトは以下の2つの主要な部分で構成されています。

1.  **`nintendo-eshop-data`**: Nintendo Switch eShopからゲームデータを収集・処理するNode.jsスクリプト。
2.  **`nintendo-eshop`**: 収集したゲームデータを表示するNuxt.js (Vue.js) ベースのWeb UI。

## 機能

### `nintendo-eshop-data`

-   `nintendo-switch-eshop`ライブラリを使用して、Nintendo Switch eShopのゲーム情報を取得します。
-   `axios`や`cheerio`などを用いて、追加のデータ（画像など）をスクレイピングする可能性があります。
-   取得したデータを整形し、UI側で利用可能な形式で出力します。

### `nintendo-eshop`

-   `nintendo-eshop-data`で収集されたゲームデータを表示します。
-   Vuetifyを用いたモダンなUIで、ゲームタイトル、画像、価格などの情報を一覧表示します。
-   ユーザーがゲームを検索したり、フィルタリングしたりする機能を提供する可能性があります。

## 使い方

### 1. データ収集 (`nintendo-eshop-data`)

1.  `03_switch_eshop/10_src/nintendo-eshop-data` ディレクトリに移動します。
2.  必要な依存関係をインストールします。
    ```bash
    npm install
    ```
3.  データ収集スクリプトを実行します。（具体的な実行方法は`nintendo-eshop-data`内のスクリプトによるため、必要に応じて確認してください。）

### 2. UIの起動 (`nintendo-eshop`)

1.  `03_switch_eshop/10_src/nintendo-eshop` ディレクトリに移動します。
2.  必要な依存関係をインストールします。
    ```bash
    npm install
    ```
3.  開発サーバーを起動します。
    ```bash
    npm run dev
    ```
4.  ブラウザで表示されたURLにアクセスすると、Nintendo Switchのソフトウェア一覧が表示されます。

## 技術要素

-   **データ収集:** Node.js, `nintendo-switch-eshop`, `axios`, `cheerio`, `got`, `sharp`
-   **UI:** Nuxt.js (Vue.js), Vuetify

## 注意事項

-   データ収集スクリプトを実行する際は、Nintendo eShopの利用規約を遵守してください。
-   スクレイピングを行う場合、サイトの構造変更によりスクリプトが動作しなくなる可能性があります。
