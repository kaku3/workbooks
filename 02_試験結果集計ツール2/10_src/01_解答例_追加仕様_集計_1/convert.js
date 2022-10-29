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
 * [追加仕様_集計_1]
 * 各試験結果レコードに、displayTestDate を追加する
 * @param {*} test 
 */
function addDisplayTestDate(test) {
  test.tests.forEach(t => t.displayTestDate = t.testDate ? df('MM/dd', ExcelDate.dateFromSn(t.testDate)) : '')
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

const tests = [];

const excelFiles = glob('*.xlsx', {
  cwd: args.inExcelFolder
});

console.group('---- main');
excelFiles.forEach(f => {
  console.log(f);
  let testFile = readExcelAsTest(path.join(args.inExcelFolder, f));
  if(testFile) {
    testFile = addDisplayTestDate(testFile);
    testFile = aggreagetTest(testFile);
    tests.push(testFile);
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