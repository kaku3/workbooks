// package追加 :
// npm install yargs --save
//
// 実行 :
// node ./sample-args.js --option=abc -t=12345 --key=value

// プログラムの起動引数は process.argv に格納されている。
// それを毎回読み取って解釈する（パースする）のは面倒くさいので、yargs を利用してパースする。
// ググると様々なパッケージが出てくるので好みに合うものを利用するとよい。

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// コマンドラインに指定された引数をそのまま表示。
console.log(process.argv)

// yargs でパースした結果を表示
const argv = yargs(hideBin(process.argv)).argv

console.log('option', argv.option)
console.log('t', argv.t)
console.log('key', argv.key)

//------------------------------------------------------------------------------
// メモ： コマンドライン引数の `-`, `--` について
//
// コマンドライン引数は、-- または、 - で定義する習慣がある。
// --full-argument-name
//  フルネーム。
//  ex) --version
// -abbreviate-argument-name
//  省略名
//  ex) -v
