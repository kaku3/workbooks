const fs = require('fs');
const path = require('path');
const glob = require('glob').sync;
const xlsx = require('xlsx');
const yargs = require('yargs/yargs');
const {
  hideBin
} = require('yargs/helpers');

const df = require('date-format')
const ExcelDate = require('./utils/ExcelDate')


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
 * 各試験結果レコードに、displayTestDate を追加する
 * @param {*} test 
 */
function addDisplayTestDate(test) {
  test.tests.forEach(t => t.displayTestDate = t.testDate ? df('yyyy/MM/dd', ExcelDate.dateFromSn(t.testDate)) : '')
  return test
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

function readExcelFiles() {
  const testFiles = [];

  const excelFiles = glob('*.xlsx', {
    cwd: args.inExcelFolder
  });
  
  excelFiles.forEach(f => {
    console.log(f);
    let testFile = readExcelAsTest(path.join(args.inExcelFolder, f));
    if(testFile) {
      testFile = addDisplayTestDate(testFile);
      testFile = aggreagetTest(testFile);
      testFiles.push(testFile);
    }
  });
  return testFiles;
}

/**
 * 
 * @param {*} tests 
 */
function aggreagetByDate(tests) {
  // 日付を重複なく、小さい順に並べ替えて取得
  const _dates = Array.from(new Set(tests.map(t => t.testDate))).sort((v1, v2) => v1 - v2)
  console.log(_dates);


}

function main() {
  const testFiles = readExcelFiles();
  if(testFiles.length === 0) {
    console.warn('Excel ファイルがありませんでした。');
    return;
  }
  const tests = testFiles.flatMap(f => f.tests)

  const dates = aggreagetByDate(tests)

  try {
    fs.writeFileSync(args.outJson, JSON.stringify(testFiles), "utf-8");
  } catch(e) {
    console.error(e.message);
  }
}

main();