# 家計簿 (レシート読み取りPoC)

このプロジェクトは、レシートの画像を読み取り、Google Cloud Vision APIを用いてテキストを抽出し、その結果をUIで表示・編集する家計簿アプリケーションの概念実証（PoC）です。

## 構成

本プロジェクトは以下の2つの主要な部分で構成されています。

1.  **`00_vision_api`**: Google Cloud Vision APIを利用してレシート画像からテキストを抽出するNode.jsスクリプト。
2.  **`01_poc_input_from_receipt_ui`**: 抽出されたレシートデータを表示し、ユーザーが編集できるNuxt.js（Vue.js）ベースのWeb UI。

## 機能

### 00_vision_api

-   指定されたレシート画像（例: `receipt.jpg`）をGoogle Cloud Vision APIに送信します。
-   APIから返されたテキスト検出結果をJSON形式で保存します（`receipt.json`）。

### 01_poc_input_from_receipt_ui

-   `00_vision_api`で生成された`receipt.json`のデータを読み込み、Webインターフェース上に表示します。
-   ユーザーがレシートの項目（品目、金額など）を視覚的に確認し、必要に応じて修正できるUIを提供します。

## 使い方

### 1. Google Cloud Vision APIの設定

`00_vision_api` を利用するには、Google Cloud Platform (GCP) の設定が必要です。

1.  GCPプロジェクトを作成し、Cloud Vision APIを有効にします。
2.  サービスアカウントを作成し、認証情報（JSONキーファイル）をダウンロードします。
3.  ダウンロードしたキーファイルのパスを環境変数 `GOOGLE_APPLICATION_CREDENTIALS` に設定します。

    ```bash
    # Windows (PowerShell)
    $ENV:GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-key-file.json"
    # Linux/macOS
    export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-key-file.json"
    ```

### 2. レシートからのテキスト抽出

1.  `05_家計簿/10_src/00_vision_api` ディレクトリに移動します。
2.  必要な依存関係をインストールします。
    ```bash
    npm install
    ```
3.  処理したいレシート画像を `receipt.jpg` として配置し、スクリプトを実行します。
    ```bash
    node index.js
    ```
    これにより、`receipt.json` ファイルが生成されます。

### 3. UIの起動

1.  `05_家計簿/10_src/01_poc_input_from_receipt_ui` ディレクトリに移動します。
2.  必要な依存関係をインストールします。
    ```bash
    npm install
    ```
3.  開発サーバーを起動します。
    ```bash
    npm run dev
    ```
4.  ブラウザで `http://localhost:3000` にアクセスすると、レシートデータがUIに表示されます。

## 技術要素

-   **OCR/API:** Google Cloud Vision API, Node.js
-   **UI:** Nuxt.js (Vue.js), Vuetify (UIフレームワーク)

## 注意事項

-   本プロジェクトは概念実証のため、データの永続化や本格的な家計簿機能は含まれていません。
-   Google Cloud Vision APIの利用には費用が発生する場合があります。無料枠の範囲内でご利用ください。
