// 実行:
// node ./sample-arrays.js
//
// 近代言語の配列操作はとても便利。
// MDNを眺めよう :
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array

const scores = [
  {
    name: '田中',
    japanese: 10,
    english: 20,
    math: 15,
    science: 10,
    society: 30
  },
  {
    name: '佐藤',
    japanese: 5,
    english: 21,
    math: 25,
    science: 20,
    society: 40
  },
  {
    name: '鈴木',
    japanese: 75,
    english: 60,
    math: 45,
    science: 30,
    society: 60
  },
]

console.log('国語 50 点以上のデータ')
console.log(
  scores.filter(s => s.japanese >= 50)
)

console.log('国語の平均点')
console.log(
  scores
    .map(s => s.japanese)
    .reduce((a, v) => a += v) / scores.length
)

console.log('各人のデータに合計点を追加')
console.log(
  scores.map(s => {
    s.total = [ 'japanese', 'english', 'math', 'science', 'society' ]
      .map(subject => s[subject])
      .reduce((a, v) => a += v)
    return s
  })
)