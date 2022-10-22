const fs = require('fs');
const xlsx = require('xlsx');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// yargs で必須パラメータの定義 / parse
// 引数に不備があるとパラメータ表示、エラー表示して終了してくれる。
const args = yargs(hideBin(process.argv))
  .option({
    inExcel: {
      description: '試験項目書 Excel',
      demandOption: true,
      alias: 'i' 
    },
    outJson: {
      description: '出力 json',
      demandOption: true,
      alias: 'o' 
    },
  })
  // 使い捨てツールは、しばらくするとパラメータが分からなくて使えないことが多い。
  // 動作するパラメータをusage に記載するとよい
  .usage('[usage]node $0 -i in/sample-単体試験項目書.xlsx -o out/test.json')
  .argv;


// 『何もしていないのに動かなくなった』という問い合わせを受ける事がある。
// 『何もしていないなら動かないのでは？』という素朴な疑問は心にしまっておくのがオトナ。
// 『何をしたか』が分かるようなログ出力を行っておくことが望ましい。
console.info('---- args');
console.info('inExcel', args.inExcel);
console.info('outJson', args.outJson);
console.info('---- args');

try {
  const book = xlsx.readFile(args.inExcel);
  const sheet = book.Sheets['単体試験'];
  const range = xlsx.utils.decode_range(sheet['!ref']);
  range.s.r = 1;

  // *header : 後でプログラムで利用しやすいようにしておく。
  // header を指定する場合は、1行目を読み飛ばす必要があるため、range.s.r = 1 (start, row = 0 -> 1) としておく。
  const tests = xlsx.utils.sheet_to_json(sheet, {
    range,
    blankrows: false,
    header: [ 'no', 'category', 'title', 'content', 'expect', 'result', 'tester', 'testDate', 'remarks']
  });

  // 件数と、ステータス毎の集計
  const count = tests.length;
  const ok = tests.filter(test => test.result === 'OK').length;
  const ng = tests.filter(test => test.result === 'NG').length;
  const pending = tests.filter(test => test.result === '保留').length;
  const confirmOk = tests.filter(test => test.result === '確認OK').length;
  const fixOk = tests.filter(test => test.result === '修正OK').length;

  const test = {
    file: args.inExcel,
    count,
    ok,
    ng,
    pending,
    confirmOk,
    fixOk,
    tests
  };
  console.info({ count, ok, ng, pending, confirmOk, fixOk });

  fs.writeFileSync(args.outJson, JSON.stringify(test), "utf-8");
} catch(e) {
  console.error(e.message);
}

// 課題
// - 日付
//  1970/1/1 からの日付が格納されている。
//  これをそのまま表示しても分からないのでどこかで加工が必要
//
// - Excel フォーマットチェック
//  エラーチェックは今回は省略している。
//  追加実装してみてみるとよい。
