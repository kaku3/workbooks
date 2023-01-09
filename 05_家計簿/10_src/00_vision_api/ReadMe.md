@import "./style.less"

# Cloud Vision API

手書きや印刷された文字列を含む画像から、文字列抽出する OCR 機能などを API で利用可能。
API 1,000回呼び出しまで無料。

- [Cloud Vision API : 試してみましょう](https://cloud.google.com/vision/docs/drag-and-drop?hl=ja)
- [Cloud Vision API : 画像内のテキストを検出する](https://cloud.google.com/vision/docs/ocr?hl=ja)


## GCPアカウント作成

[Google Cloud](https://cloud.google.com/?hl=ja) ページで [無料で利用開始] をクリックして Google アカウントでGCPを利用可能にする。


## プロジェクトの作成~実行
(参考)
[クイックスタート](https://cloud.google.com/vision/docs/quickstarts?hl=ja)

client library を利用する場合は、APIキーを作成するのではなく、サービスアカウントの作成を行う。

1. プロジェクトの作成
@import "./images/00-new-project.png"

2. Vision API を検索
@import "./images/01-00-cloud-vision-api.png"

3. [有効にする]をクリックし Vision API を有効化
@import "./images/01-01-cloud-vision-api.png"

4. サービスアカウント作成
@import "./images/01-10-cloud-vision-api.png"
@import "./images/01-11-cloud-vision-api.png"
@import "./images/01-12-cloud-vision-api.png"

5. 認証鍵作成を作成しダウンロード
@import "./images/01-13-cloud-vision-api.png"
@import "./images/01-14-cloud-vision-api.png"

## Vision クライアントライブラリインストール

(参考)
[Vision クライアント ライブラリ](https://cloud.google.com/vision/docs/libraries#client-libraries-install-nodejs)

- ライブラリインストール
```.ps
npm i --save @google-cloud/vision
```

- 認証情報設定
```.ps
# windows, powershell
# ダウンロードした認証鍵のパスを指定
$ENV:GOOGLE_APPLICATION_CREDENTIALS="/path/to/expenses-xxxxxxxxxxxxxxxxxxx.json"
```

## コード作成

`vision`, `client` などを ctrl + click して利用可能メソッドを読み取り実装していく。

@import "./index.js" {code_block=true}


## コード実行

```
# receipt.jpgを読み込んで、 receipt.json を出力
node .\index.js
```
