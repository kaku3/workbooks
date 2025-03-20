1.
日本語でお願いします。
00_要件/要件.md を見て、memory-bank を作成してください。

2.
日本語でお願いします。
00_要件/要件.md を見て、10_外部設計/ フォルダに外部設計書を作成してください。
- 機能仕様書
- 画面仕様書
- データ・設定ファイル仕様書

3.
チケットテンプレートは templates/ フォルダに複数持てるようにしてください。

templates/
  タスク.md
  障害票.md

起票画面で、テンプレート選択もできるようにしてください。

4.
各データや設定ファイルフォルダは、trak-data/ フォルダの配下としてください。

5.
update memory bank

6. (手動)
next プロジェクト作成
```
cd 30_src
npx create-next-app@latest --ts

√ What is your project named? ... trak
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like your code inside a `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to use Turbopack for `next dev`? ... No / Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No / Yes
```

7.
日本語でお願いします。
10_外部設計/ に従って、30_src/trak/ フォルダに nextjs アプリを作成してください。

ベースとなるフォルダ構成は以下としてください。
util 等必要なフォルダは適宜追加してください。

```
app/ # app router
auth/ # 認証処理
components/ # ui components
viewmodels/ # 表示用モデル
repository/ # フロントエンドからバックエンドのデータ操作
backend/ # backend
  logic/ # ビジネスロジック
  services/ # データ操作サービス
  models/ # データモデル
```

認証には、NextAuth を利用してください。

--
ちなみにファイル管理でデータベースは利用しない想定でしたが、prisma はオンメモリDBとかなにかですか？

--
基本的にはスタンドアローンでステータスやチケット更新ができれば大丈夫です。
他のユーザーとの共有は、track-data/ を git にコミットすることで共有できればいいと考えます。
(同じチケットの同時更新はほぼ発生しない想定)

--
方向性大丈夫です。
ユーザーは trak-data/configs/users.json から読み込む形にしてください。
