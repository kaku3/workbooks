const fs = require('fs');
const ejs = require('ejs');

const testJson = fs.readFileSync('./data/test.json', 'utf-8');

ejs.renderFile(
  // template file.
  './templates/index2.html.ejs',
  // template に渡すパラメータ(json形式)
  {
    testJson
  },
  // 置き換え結果を受け取るコールバック
  function(err, html) {
    // FIXME:
    // template に渡すパラメータが足りない、または、パラメータに誤りがあるなどでエラーとなる。
    // エラーメッセージを参考に修正し、html 内容が表示されるようにすること。
    // エラーメッセージは英語で表示されるが落ち着いて読もう。
    // 変数名誤り(typo)で修正に半日かかるなどはたまによくある。
    if(err) {
      console.error(err);
    } else {
      console.log(html)
    }
  });
