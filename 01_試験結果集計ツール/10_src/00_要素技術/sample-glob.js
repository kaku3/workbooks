// package追加 :
// npm i glob --save
// 実行 :
// node ./sample-glob.js

// 指定されたフォルダ内のファイル一覧を取得

const glob = require('glob').sync;

const jsonFiles = glob(
  '**/*.json',      // ** : サブフォルダも含めて検索
  {
    cwd: './files'  // ファイル検索ルート
  }
);

// 色々な for 文で表示サンプル

console.group('Array.forEach');
jsonFiles.forEach(file => {
  console.log(file)
});
console.groupEnd();

console.group('for of jsonFiles');
for(file of jsonFiles) {
  console.log(file);
}
console.groupEnd();

console.group('for in jsonFiles');
for(i in jsonFiles) {
  console.log(jsonFiles[i]);
}
console.groupEnd();

console.group('for ;;');
for(let i = 0; i < jsonFiles.length; i++) {
  console.log(jsonFiles[i]);
}
console.groupEnd();

// メモ : for of と for in
// of : value
// in : index
