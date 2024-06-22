const XLSX = require('xlsx');
const fs = require('fs');

const VOTE_DATES = [
  "執行年月日",
  "19761205",
  "19770710",
  "19790408",
  "19790422",
  "19791007",
  "19800622",
  "19810705",
  "19830410",
  "19830424",
  "19830626",
  "19831218",
  "19850707",
  "19860706",
  "19870412",
  "19870426",
  "19890702",
  "19890723",
  "19900218",
  "19910407",
  "19910421",
  "19920726",
  "19930627",
  "19930718",
  "19950409",
  "19950423",
  "19950723",
  "19961020",
  "19970706",
  "19980712",
  "19990411",
  "19990425",
  "20000625",
  "20010624",
  "20010729",
  "20030413",
  "20030427",
  "20031109",
  "20040711",
  "20050703",
  "20050911",
  "20070408",
  "20070711",
  "20090712",
  "20090830",
  "20100711",
  "20110410",
  "20110424",
  "20121216",
  "20121216",
  "20130623",
  "20130721",
  "20140209",
  "20141214",
  "20160710",
  "20160731",
  "20170702",
  "20171022",
  "20190721",
  "20200705",
  "20210704",
  "20211031",
  "20220710",
]

// 0  １８歳
// 1  １９歳
// 2  １０歳代
// 3  ２０歳
// 4  ２１歳～２４歳
// 5  ２５歳～２９歳
// 6  ２０歳代
// 7  ３０歳～３４歳
// 8  ３５歳～３９歳
// 9  ３０歳代
// 10 ４０歳～４４歳
// 11 ４５歳～４９歳
// 12 ４０歳代
// 13 ５０歳～５４歳
// 14 ５５歳～５９歳
// 15 ５０歳代
// 16 ６０歳～６４歳
// 17 ６５歳～６９歳
// 18 ６０歳代
// 19 ７０歳代以上
// 20 都平均実投票率
const AGE_INDEXES = [ 2, 4,5, 7,8, 10,11, 13,14, 16,17, 19 ];

// excel ファイル読み込み
const book = XLSX.readFile('./in/senkyobetu_suitei_ichiran3.xlsx');

// シート名表示
book.SheetNames.forEach(name => {
    console.log(name);
})

// 単体試験シートを json として読み込み
const sheet = book.Sheets['推定投票率一覧表'];
const rows = XLSX.utils.sheet_to_json(sheet,
  {
    header: 1,
    defval: 0,
    blankrows: false
  });

// 5才単位だけ取れるようにする
rows.pop();

const columns = {};

// 和暦→西暦変更
rows[0].forEach((col, ci) => {
  if(ci === 0) return;

  rows[0][ci] = VOTE_DATES[ci];
})

// スペースで無理やり整形されているようなのでトリミングする
rows[1].forEach((col, ci) => {
  if(ci === 0) return;
  if(typeof col !== 'string') return;
  rows[1][ci] = rows[1][ci].replace(/\s+/g, '');
})

// 列（年月日）毎で整形
rows.forEach((row, ri) => {
  row.forEach((col, ci) => {
    if(ci === 0) {
      return;
    }
    if(ri === 0) {
      if(!col) {
        return;
      } else {
        columns[ci] = [];
      }
    }
    if(columns[ci]) {
      columns[ci].push(col);
    }
  })
})

// 使いやすい形に整形
const VOTE_RATES = Object.keys(columns).map(ci => {
  const d = columns[ci];
  return {
    date: d[0],
    election: d[1],
    values: d.slice(2).filter((_, i) => AGE_INDEXES.includes(i))
  }
});

fs.writeFileSync('./out/vote-rates.js', `const VOTE_RATES = ${JSON.stringify(VOTE_RATES)};`, 'utf-8');

console.log(VOTE_RATES);

