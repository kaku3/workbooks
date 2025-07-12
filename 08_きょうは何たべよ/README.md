# きょうは何たべよ？

優柔不断なあなたへ。ランチやディナーのメニュー選びに困ったときに、現在地周辺の飲食店を検索・提案してくれるWebアプリケーションです。

## 機能

- **現在地取得:** ブラウザのGeolocation APIを利用して現在地を自動取得します。
- **予算・ジャンル選択:** 予算帯や料理ジャンルを複数選択して、検索条件を絞り込めます。
- **飲食店検索:** Hot Pepper WebサービスAPIを利用して、選択された条件と現在地に基づいて飲食店を検索します。
- **検索結果表示:** 検索結果を一覧で表示し、各店舗の詳細情報（店名、ジャンル、予算、アクセス、キャッチコピー、ロゴ画像）を確認できます。
- **地図連携:** Googleマップへのリンクが提供され、店舗の場所を地図上で確認できます。

## 使い方

1. `10_src/yummy-picker.html` をWebブラウザで開きます。
2. ブラウザから位置情報へのアクセス許可を求められたら許可します。
3. 予算やジャンルのチェックボックスを選択します。
4. 「さがす」ボタンをクリックすると、条件に合った飲食店が一覧表示されます。

## 技術要素

- HTML
- CSS (Bootstrap, Font Awesome)
- JavaScript (jQuery)
- Hot Pepper WebサービスAPI
- Nominatim OpenStreetMap API (住所取得)

## APIキーの設定

Hot Pepper WebサービスAPIを利用するには、APIキーの設定が必要です。

1. `10_src/api-key.js` ファイルを作成します。
2. 以下の内容を記述し、`YOUR_HOTPEPPER_API_KEY` の部分をHot Pepper Webサービスで取得したAPIキーに置き換えます。

   ```javascript
   const HOTPEPPER_API_KEY = 'YOUR_HOTPEPPER_API_KEY';
   ```

**注意:** APIキーは公開リポジトリにコミットしないように、`.gitignore` に `api-key.js` を追加することを推奨します。
