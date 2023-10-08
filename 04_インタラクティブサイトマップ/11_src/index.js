const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const xlsx = require('xlsx');
const argv = require('yargs/yargs')(process.argv.slice(2))
  .alias('i', 'in')
  .alias('o', 'out')
  .argv;

const excelPath = argv.in;
const outPath = argv.out;
const book = xlsx.readFile(excelPath);
const sheet = book.Sheets['index'];

const items = xlsx.utils.sheet_to_json(sheet)
                .map(json => {
                  const item = {
                    name: json['名称'],
                    url: json['URL'],
                    layout: json['配置'] || '',
                    link: {
                      name: json['画面遷移：名称'],
                      url: json['画面遷移：URL']
                    },
                    content: json['内容'] || '',
                    depth: json['階層'] || 1,
                    pos: json['位置'] || 0
                  }
                  if(item.name) {
                    delete item['layout'];
                    delete item['link'];
                  } else {
                    delete item['depth']
                  }
                  return item;
                });

let _page = null;
let _layout = null;

const pages = [];
items.forEach(item => {
  if(item.name && item.name !== _page?.name) {
    _page = item;
    _layout = item.layout;

    pages.push(_page);
  }
  if(item.layout) {
    _layout = item.layout;
  }
  if(item.link) {
    if(!_page.links) {
      _page.links = []
    }
    _page.links.push({
      layout: _layout,
      ...item.link
    });
  }
})

if(!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

fse.copySync('templates', outPath);
fs.writeFileSync(path.join(outPath, 'data/pages.js'), `const PAGES = ${JSON.stringify(pages)}`, 'utf-8');
