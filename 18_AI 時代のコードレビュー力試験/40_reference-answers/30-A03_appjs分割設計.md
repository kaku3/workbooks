# A-03: `app.js` をどう分割するか — 模範解答

## 設問 1：`app.js` が担っている責務

1. **Express アプリの設定**：ミドルウェア登録、ポート設定
2. **認証**：ログイン、ログアウト、トークン生成・検証
3. **ユーザー管理**：ユーザー情報取得
4. **商品管理**：商品一覧取得、商品追加（管理者）
5. **カート処理**：カートへの追加・削除
6. **注文処理**：注文作成、注文一覧取得、注文詳細取得
7. **在庫管理**：在庫デクリメントエンドポイント
8. **クーポン管理**：クーポンコード検証
9. **管理者操作**：管理者向け全注文取得
10. **ファイル DB の直接操作**：`fs.readFileSync` / `fs.writeFileSync` が各ルートに散在

> **採点ポイント**：8〜10 個程度列挙できているかを見る。「ルートとロジック」だけでは △。

## 設問 2：推奨するディレクトリ構成

```
/
├── app.js              # Express 設定、ミドルウェア登録のみ（エントリーポイント）
├── routes/
│   ├── auth.js         # POST /api/login, POST /api/logout
│   ├── users.js        # GET /api/users/:id
│   ├── products.js     # GET /api/products, POST /api/admin/products
│   ├── cart.js         # GET/POST/DELETE /api/cart
│   ├── orders.js       # GET/POST /api/orders, GET /api/orders/:id
│   ├── stock.js        # POST /api/stock/:id/decrement
│   ├── coupons.js      # GET /api/coupons/:code
│   └── admin.js        # GET /api/admin/orders （または products.js に統合）
├── services/
│   ├── authService.js  # トークン生成・検証のビジネスロジック
│   ├── orderService.js # 注文作成、在庫確認のビジネスロジック
│   └── couponService.js# クーポン検証のビジネスロジック
├── middleware/
│   ├── authenticate.js # 認証チェックミドルウェア
│   └── requireAdmin.js # 管理者ロールチェックミドルウェア
└── db/                 # 既存の JSON ファイル
    ├── users.json
    ├── products.json
    └── orders.json
```

ポイント：
- `routes/` は「どの URL に何をするか」のマッピングのみ
- `services/` はビジネスロジック（計算・検証・DB操作）
- `middleware/` は横断的な関心事（認証・認可）

> **採点ポイント**：routes と services を分けているかを見る。「routes だけ」では △。middleware の切り出しが言及されれば ◎。

## 設問 3：どこから分割を始めるか

**認証・認可のミドルウェアから始めるのが最優先**。

理由：
- 現状、認証チェックのコードが各ルートに重複しているか、または存在しない（A-01 の問題）
- ミドルウェアを先に整備すると、以降のルート実装に一貫して適用できる
- 認証の不整合（トークン偽造問題）の修正と合わせて対応できる

分割の順序例：
1. `middleware/authenticate.js` を作成（認証チェックの共通化）
2. `services/authService.js` を作成（トークン生成・検証を集約）
3. `routes/auth.js` を作成してルートを移動
4. 残りのルートを順次移動

**注意**：`utils.js` の `readDB`/`writeDB` はデッドコードの可能性がある（`app.js` は直接 `fs.readFileSync` を使用）。利用状況を確認してから、使うなら統一・使わないなら削除。

> **採点ポイント**：「どこから始めるか」の判断とその理由を説明できているかを見る。「全部一度に分割する」は現実的でない。

## 設問 4：分割時のリスクと軽減策

**リスク**：
1. **動作確認漏れ**：分割中にルートが消えた、ミドルウェアの適用順が変わった等のバグが混入しやすい
2. **`require` パスの破損**：ファイルを移動するとパスが変わり、コンパイルエラーまたは実行時エラーになる
3. **デッドコードの誤存続**：`utils.js` の未使用関数を整理しないまま分割すると、混乱が続く

**軽減策**：
- 分割前に API の手動テストケースを整理し、分割後に同じテストを実行してリグレッションを確認する
- 1ファイルずつ移動してコミットする（小さいコミット粒度）
- `readDB`/`writeDB` が使われているか grep で確認してから判断する

> **採点ポイント**：リスクを技術面（バグ混入）と作業面（抜け漏れ）の両面から言及できているかを見る。
