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
// readAndAggregateExcel();
// 実際は、エクセルを試験項目として読み込んで、それを集計しているハズなので以下の様な関数になっている方がよさそう。
// const test = readExcelAsTest();
// test = aggreagetTest(test);
//
// - Excel : 条件付き書式
// ステータスに応じて行の色を設定している。
// 視覚的に進捗が分かりやすくなる。

const fs = require('fs');
const path = require('path');
const glob = require('glob').sync;
const xlsx = require('xlsx');
const yargs = require('yargs/yargs');
const {
  hideBin
} = require('yargs/helpers');

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
  .argv;

console.group('---- args');
console.info('inExcelFolder', args.inExcelFolder);
console.info('outJson', args.outJson);
console.groupEnd();

/**
 * 試験仕様書を Test として読み込む
 * @param {*} excelPath 試験仕様書 Excel ファイルパス
 * @returns 
 */
function readExcelAsTest(excelPath) {
  try {
    const book = xlsx.readFile(excelPath);
    const sheet = book.Sheets['単体試験'];
    const range = xlsx.utils.decode_range(sheet['!ref']);
    range.s.r = 1;

    // *header : 後でプログラムで利用しやすいようにしておく。
    // header を指定する場合は、1行目を読み飛ばす必要があるため、range.s.r = 1 (start, row = 0 -> 1) としておく。
    const tests = xlsx.utils.sheet_to_json(sheet, {
      range,
      blankrows: false,
      header: ['no', 'category', 'title', 'content', 'expect', 'result', 'tester', 'testDate', 'remarks']
    });

    return {
      file: path.basename(excelPath),
      tests
    };
  } catch(e) {
    console.error(e.message);
    return null;
  }
}

/**
 * Test を集計する。
 * @param {*} test 
 * @returns 
 */
function aggreagetTest(test) {
  const tests = test.tests;
  const count = tests.length;
  const ok = tests.filter(t => t.result === 'OK').length;
  const ng = tests.filter(t => t.result === 'NG').length;
  const pending = tests.filter(t => t.result === '保留').length;
  const confirmOk = tests.filter(t => t.result === '確認OK').length;
  const fixOk = tests.filter(t => t.result === '修正OK').length;

  console.info({ count, ok, ng, pending, confirmOk, fixOk });
  return {
    ...test,
    count,
    ok,
    ng,
    pending,
    confirmOk,
    fixOk,
    tests
  };
}

const tests = [];

const excelFiles = glob('*.xlsx', {
  cwd: args.inExcelFolder
});

console.group('---- main');
excelFiles.forEach(f => {
  console.log(f);
  let test = readExcelAsTest(path.join(args.inExcelFolder, f));
  if(test) {
    test = aggreagetTest(test);
    tests.push(test);
  }
});
console.groupEnd();

if(tests.length > 0) {
  try {
    fs.writeFileSync(args.outJson, JSON.stringify(tests), "utf-8");
  } catch(e) {
    console.error(e.message);
  }
} else {
  console.warn('Excel ファイルがありませんでした。');
}