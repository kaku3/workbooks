const fs = require('fs');
const ejs = require('ejs');

const testData = fs.readFileSync('./data/test.json', 'utf-8');

ejs.renderFile(
  // template file.
  './templates/index2.html.ejs',
  // template に渡すパラメータ(json形式)
  {
    title: '解答例 : 追加仕様UI1',
    testData
  },
  // 置き換え結果を受け取るコールバック
  function(err, html) {
    // template に渡すパラメータが足りない、文法エラーなどでエラーとなる。
    if(err) {
      console.error(err);
    } else {
      fs.writeFileSync('index.html', html, 'utf-8')
    }
  });
