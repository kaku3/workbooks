// package追加 :
// # file操作package
// npm install fs --save
// # path操作パッケージ
// npm install path --save
// # スペース区切りで複数指定も可能
// npm install fs path --save
// # install パラメータは省略表記も可能
// npm i fs path --save
//
// 実行 :
// node ./sample-file-io.js

const fs = require('fs')
const path = require('path')

const fileFolder = './files'

// utf-8 としてファイル読み込み
let text = fs.readFileSync(path.join(fileFolder, 'in.txt'), 'utf-8')

// 編集
text += '-sample'

fs.writeFileSync(path.join(fileFolder, 'out.txt'), text, 'utf-8')

//------------------------------------------------------------------------------
// メモ：sync について
// fs には非同期的に実行を行うメソッドと、同期的に実行を行うメソッドがある。
// 非同期版 : readFile, writeFile
// 同期版 : readFileSync, writeFileSync
// サーバでは、ファイルの読み込み等「時間がかかる処理」は非同期で行うのが一般的だからだ。
// 例えば、読み込みに10秒かかるファイルに100人のユーザが同時にアクセスした時に、同期的に処理を行うと、100番目のユーザがアクセスできるのは1000秒後となってしまうため。
// 本ツールでは複数ユーザが同時に操作することは考慮しなくてよいので同期版のメソッドを利用する。
