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

fs.watch(path.join(args.target, 'yml'), (e, file) => {
  updateHtml(file)
})
fs.watch(path.join(args.target, './html/images'), (e, file) => {
  updateHtml(file)
})
function updateHtml(file) {
  // 4回更新イベントが発行される
  if(_file !== file) {
    _file = file
    setTimeout(() => {
      _file = null
    }, 100)
    exec(`node create-html.js -i ${args.in} -o ${args.outFolder}`, (err, stdout, stderr) => {
      if(err) {
        console.error(stderr)
      }
      console.log(stdout)
    })
  }
}