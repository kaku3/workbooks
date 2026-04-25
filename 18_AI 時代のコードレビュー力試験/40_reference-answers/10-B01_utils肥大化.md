# B-01: `utils.js` が育ちすぎた — 模範解答

## 設問 1：`utils.js` が担っている責務

1. **日付フォーマット**：`formatDate`、`formatDateTime`
2. **金額フォーマット・税計算**：`formatPrice`、`calcTax`、`calcTaxIncluded`
3. **バリデーション**：`isValidEmail`、`isValidPhone`、`isValidPostalCode`
4. **認証トークンの生成・解析**：`generateToken`、`getUserIdFromToken`
5. **DB 読み書き**：`readDB`、`writeDB`
6. **ユーザー取得**：`findUserById`、`findUserByEmail`
7. **カート計算**：`calcCartSubtotal`、`applyDiscount`
8. **注文ステータス変換**：`ORDER_STATUS`、`getStatusLabel`

> **採点ポイント**：8 つの責務がある。5 つ以上列挙できていれば ○。「日付と金額」程度では △。

## 設問 2：メール送信処理を追加することの問題

問題はある。

- `utils.js` はすでに「認証」「DB 操作」「ビジネスロジック」「フォーマット」が同居しており、凝集度が著しく低い
- ここにメール送信（外部サービス呼び出し・設定情報・リトライロジック等）まで加えると、責務がさらに膨張する
- 将来「メール処理だけ変えたい」とき、utils.js 全体の変更リスクが発生する
- テストもしにくくなる（メール送信の有無を気にしながら全関数をテストしなければならない）

> **採点ポイント**：「動くが良くない」だけでは △。「なぜ良くないか・何が起きるか」まで書けているかを見る。

## 設問 3：分割案

```
lib/
├── format.js        # formatDate, formatDateTime, formatPrice
├── validate.js      # isValidEmail, isValidPhone, isValidPostalCode
├── auth.js          # generateToken, getUserIdFromToken
├── db.js            # readDB, writeDB
├── userRepo.js      # findUserById, findUserByEmail（DB 操作 + ユーザードメイン）
├── cart.js          # calcCartSubtotal, applyDiscount
├── orderStatus.js   # ORDER_STATUS, getStatusLabel
└── mailer.js        # 新規追加するメール処理
```

補足：`userRepo.js` と `db.js` を分けるか統合するかは規模次第。小さいうちは `db.js` に `findUserById` を入れても許容範囲。重要なのは「メール処理を他と混ぜない」こと。

> **採点ポイント**：分割の粒度は幅があって当然。「何を基準に分けたか」の説明があれば ○。「helpers.js と utils.js に分ける」だけでは △。

## 設問 4：なぜ「何でも屋」になるか

**技術的な原因**
- `require('./utils')` と書けばどこからでも呼び出せるため、「どこに置くか」の摩擦がない
- 「どこに置くべきか」を考えるための設計指針（モジュール分割ルール）がないと、既存ファイルに追加し続けるのが最小抵抗経路になる

**チームの習慣・文化的な原因**
- 「とりあえず utils に置く」が慣習化すると、新メンバーも同じことをする
- コードレビューで「責務を分けてほしい」と指摘されなかった / 指摘が通らなかった
- 小さいうちは「まとまっている方が見やすい」と感じてしまうため問題が見えにくい
- 締め切りの圧力で「後で整理する」が積み重なる

> **採点ポイント**：技術面のみ or 文化面のみは △。両面から説明できているかを見る。
