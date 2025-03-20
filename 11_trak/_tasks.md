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
10_外部設計/ に従って、30_src/trak/ フォルダに nextjs アプリを作成してください。
