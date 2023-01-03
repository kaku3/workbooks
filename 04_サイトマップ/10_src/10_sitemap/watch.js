const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { exec } = require('child_process')

const args = yargs(hideBin(process.argv))
  .option({
    in: {
      description: 'sitemap yml 入力ファイル',
      demandOption: true,
      alias: 'i' 
    },
    outFolder: {
      description: 'sitemap html 出力フォルダ',
      demandOption: true,
      alias: 'o' 
    },    
    target: {
      description: '監視対象フォルダ',
      demandOption: true,
      alias: 't' 
    }
  })
  .usage('[usage]node $0 -i out/yml/@sitemap-index.yml -o out/html -t out')
  .argv;


let _file = null

fs.watch(path.join(args.target, 'yml'), { recursive: true }, (e, file) => {
  updateHtml(file)
})
// .drawio.png が編集していないのに反応するので監視対象にしない。
// fs.watch(path.join(args.target, './html/images'), { recursive: true }, (e, file) => {
//   updateHtml(file)
// })
function updateHtml(file) {
  console.log(file);
  // 4回更新イベントが発行されるため、同一ファイルであれば一定時間はコマンド実行しない。
  if(_file !== file) {
    _file = file
    setTimeout(() => {
      _file = null
    }, 200)
    exec(`node create-html.js -i ${args.in} -o ${args.outFolder}`, (err, stdout, stderr) => {
      if(err) {
        console.error(stderr)
      }
      console.log(stdout)
    })
  }
}