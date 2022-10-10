@import "../../00_docs/style.less"

## 概要

Node.js で excel の読み込みを行うサンプル。

Node.js は「サーバサイドのJavaScript実行環境」として開発されたようですが、コマンドラインベースのツールも簡単に作れ、javascript の学習にも使えて便利です。


## 前提

- Node.js のインストール

Node.js 自体まだ開発が進んでいる。本稿執筆時点(2022/10/08)で、v16.17.1 が最新。
バージョンにより動くモジュール・動かないモジュールなどがあるため、プロジェクトにより異なるバージョンの Node.js を利用することになる。

PCの中に複数のバージョンの Node.js をインストールするためには、Node.js を直接インストールせずに、バージョンマネージャを利用してインストールする必要がある。

|バージョンマネージャ   |備考   |
|---|---|
|nodist |Windows では最も有名。ただしメンテナンスが終了したため他のバージョンマネージャを使う必要がある。   |
|[NVM for Windows](https://github.com/coreybutler/nvm-windows) |linux と同じ。筆者は利用していない。 |
|[Volta](https://volta.sh/) |高速・軽量・簡単。筆者はこれを利用している。 |

本稿も含めて、ネットの記事はあてにならないので実際にインストールして比べてみるのがよい。
[Googleトレンド](https://trends.google.co.jp/trends/explore?geo=JP&q=nodist,Volta,NVM%20for%20Windows)で調べてみるなども良いかもしれない。


## node のプロジェクトについて

昭和であれば、Excel ファイルをエライ苦労して読み込むプログラムを書いていたが、node であれば Excel を読み込む **パッケージ** があり簡単にExcel を読み込むことができる。

Excel の読み込みの様な処理を全てのプロジェクトで行いたいわけではないため、機能単位で **パッケージ** が作成されており、プロジェクト毎で必要なパッケージを取り込みプログラムを書くことになる。

※Java では、build.gradle に記載するような内容が、node では package.json に書かれる。

### パッケージマネージャについて

node のパッケージの管理はパッケージマネージャによって行われる。
パッケージマネージャには、npm、yarn と pnpm がある。

[npm と yarn と pnpm 比較（2021年4月版）](https://qiita.com/e99h2121/items/7e38e592dc45b7c0407d)

npm より yarn の方が速いと言われていたので yarn を愛用しているがどうも覇権を取れなそう。定期的にウォッチしておいた方がよいかもしれない。


## プロジェクトの初期化

node のプログラムを作成するフォルダで以下実行する。

```sh
# npm = node package manager
npm init
```

以下の様な package.json が作成され、追加したパッケージはこのファイルにて管理される。

```json
{
  "name": "tutorial",
  "version": "1.0.0",
  "description": "Node.js で excel の読み込みを行うサンプル。",
  "main": "aggregaton.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "kaku3",
  "license": "ISC"
}
```

## パッケージの追加

パッケージの追加、削除は npm コマンドを利用して行う。

```sh
npm install {package} --save
npm uninstall {package} --save
```

`--save` オプションをつけると、package.json にも保存される。

`--save-dev` オプションもあるが、理解が進んだらググってほしい。

今回は Excel 操作用のパッケージを読み込むので以下コマンドを実行する。

```sh
npm install xls --save
```

package.json に以下が追加され、
```
  "dependencies": {
    "xlsx": "^0.18.5"
  }
```

node_modules/ フォルダが生成され、その中に xlsx/ フォルダがあれば、パッケージの追加は成功。


## プロジェクトのパッケージ install

node_modules/ フォルダは、自作のソースではないため git には追加しない。
これでは、clone した他のメンバーは xlsx を利用することができない。

clone したメンバーの環境では、`install` コマンドを実行することで、package.json に記載されたパッケージがインストールされる。

```sh
npm install
```


## samples

|ファイル |内容 |
|---|---|
|sample-hello-world.js |Hello World を表示する。 |
|sample-yargs.js |起動引数解析サンプル。 |
|sample-excel-read.js |Excel読み込みサンプル。 |
|sample-file-io.js |file読み書きサンプル。 |
|sample-json-io.js |json読み書きサンプル。 |
|sample-arrays.js |配列操作サンプル。 |
|sample-glob.js|フォルダ内ファイル取得サンプル。 |


### sample実行

VS Code で、`/01_試験結果集計ツール/10_src/00_要素技術` フォルダを右クリック > 統合ターミナルで開くを選択し、統合ターミナルを開く。
実行したいサンプルを、各ファイルの内容に従って実行。

例)sample-hello-world.js
```sh
node sample-hello-world.js
```
