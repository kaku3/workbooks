// 課題2のポイント
//
// - 関数
// 課題1では1 Excel 読み込むだけだが、課題2では複数の Excel 読み込みを行う。
// 関数を用いて処理を書くとスッキリ書ける。
// 関数名は「動詞」＋「名詞」のキャメルケースで書くとよい。
// ※言語によってはスネークケースやパスカルケースが推奨される。
// 例)readExcel
// 正しく関数の内容を表す動詞をつけるのが大事。
// 難しい動詞になったり、複数の動詞になる場合は関数の実装自体が複雑なことが懸念される。
//
// (悪いかもしれない例)
// readAndAggregateExcel()
// 実際は、エクセルを試験項目として読み込んで、それを集計しているハズなので以下の様な関数になっている方がよさそう。
// const test = readExcelAsTest()
// test = aggreagetTest(test)
//
// - Excel : 条件付き書式
// ステータスに応じて行の色を設定している。
// 視覚的に進捗が分かりやすくなる。

const fs = require('fs')
const xlsx = require('xlsx')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// yargs で必須パラメータの定義 / parse
// 引数に不備があるとパラメータ表示、エラー表示して終了してくれる。
const args = yargs(hideBin(process.argv))
  .option({
    inExcelFolder: {
      description: '試験項目書が格納されているフォルダ',
      demandOption: true,
      alias: 'i' 
    },
    outJson: {
      description: '出力 json',
      demandOption: true,
      alias: 'o' 
    },
  })
  .usage('[usage]node $0 -i in -o out/test.json')
  .argv

console.info('---- args')
console.info('inExcelFolder', args.inExcelFolder)
console.info('outJson', args.outJson)
console.info('---- args')
  