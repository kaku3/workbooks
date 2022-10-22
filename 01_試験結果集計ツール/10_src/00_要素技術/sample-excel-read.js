// package追加 :
// npm install xlsx --save
//
// 実行 :
// node ./sample-excel-read.js

const XLSX = require('xlsx');

// excel ファイル読み込み
const book = XLSX.readFile('./試験項目書/sample-単体試験項目書.xlsx');

// シート名表示
book.SheetNames.forEach(name => {
    console.log(name);
})

// 単体試験シートを json として読み込み
const sheet = book.Sheets['単体試験'];
const json = XLSX.utils.sheet_to_json(sheet);

console.log(json);
