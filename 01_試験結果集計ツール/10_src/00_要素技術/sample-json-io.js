// package追加 :
// file 操作部は、sample-file-io.js と同じ
//
// 実行 :
// node ./sample-file-io.js

const fs = require('fs')
const path = require('path')

const fileFolder = './files/json'

// utf-8 としてファイル読み込み
const text = fs.readFileSync(path.join(fileFolder, 'in.json'), 'utf-8')

// json Object に変換
// 読み込む配列が json Object の配列なので、json Object Array に変換される
const objs= JSON.parse(text)

// 項目の編集
objs[0].a = 2

// 要素の追加 : 異なる形式の Object も追加可能
// 変数名と、json の項目名が同じ時は、値の記述を省略できる
const d = 4
objs.push({
  d
})

// スプレッド構文で Object を連結

const editedObjs = [
  {
    e: 5
  },
  ...objs,
  {
    f: 6
  }
]

// ファイルに書き出す時はテキストに戻す。
const editedText = JSON.stringify(editedObjs, null, 2)

fs.writeFileSync(path.join(fileFolder, 'out.json'), editedText, 'utf-8')

//------------------------------------------------------------------------------
// メモ：スプレッド構文について
// 配列やオブジェクトを定義する時に、`...` を頭につけた配列やオブジェクトを指定することで、それらを配列やオブジェクトの一部とすることができる。
//
// ex)
// const a1 = [ 1, 2, 3 ]
// const a2 = [ 4, 5, 6 ]
// const aa = [ ...a1, ...a2 ] // = [ 1, 2, 3, 4, 5, 6 ]
//
// const j1 = { a: 1, b: 2 }
// const j2 = { c: 3, d: 4 }
// const jj = { ...j1, ...j2 } // = { a:1, b:2, c:3, d:4 }