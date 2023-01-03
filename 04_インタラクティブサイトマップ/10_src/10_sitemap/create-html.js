const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const yaml = require('js-yaml')
const yamlinc = require('yaml-include')
const ejs = require('ejs')

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
  })
  .usage('[usage]node $0 -i out/yml/@sitemap-index.yml -o out/html')
  .argv;

yamlinc.setBaseFile(path.join(__dirname, args.in))
const baseYaml = fs.readFileSync(yamlinc.basefile, 'utf8')
const json = yaml.load(baseYaml, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile });

let serialId = 0;
let serialNo = 0;

let sitemapConnectors = [];
let trees = [];

// 深さを求める。
// 親から順に定義されている前提
function calcDepth(tree, me) {
  const parent = Object.values(tree).filter(t => t.links).find(t => t.links.find(l => l.to === me.path));
  if (parent) {
    me.parentPath = parent.path;
    return parent.depth + 1;
  }
  return 0;
}

function buildTree(categoryId, category) {
  const tree = {};
  category.pages.forEach(p => {
    tree[p.path] = p;

    // link が相対パス指定であれば自パスと結合してフルパスに変換
    if(p.links) {
      p.links.forEach(l => {
        if(l.to.startsWith('.')) {
          l.to = path.join(path.dirname(p.path), l.to).replace(/\\/g, '/');
        }
      });
    }
  });
  // 全ページ、親をたどって深さを求める。ついでに色々設定
  Object.values(tree).forEach(t => {

    t.categoryId = categoryId;
    t.categoryName = category.name;
    t.terminal = t.path.startsWith('$');

    t.id = ++serialId;
    if(!t.terminal) t.no = ++serialNo;
    t.depth = t.depth || calcDepth(tree, t);

    // link 部を aタグに置き換え
    t.comment = t.comment ? t.comment.replace(/(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g, '<a href="$1" target="_blank">$1</a>') : '';

    // 終端フラグが立っていなければ画像がある
    if(!t.terminal) {
      const img = t.image || (t.path.substr(1).replace(/#/, '_') + ".png");
      t.image = path.join('./images', img);
      t.noImage = !fs.existsSync(path.join(args.outFolder, t.image));
      if(t.noImage) {
        console.log(`image not found : ${t.image}`);
      }
      t.alert = t.noImage;
    }
  })

  return tree;
}

function buildCategory(categoryId, category) {
  const dummyElement = `<div class="card offset"></div>`;

  const tree = buildTree(categoryId, category);

  const maxDepth = Object.values(tree).map(t => t.depth).reduce((a, v) => Math.max(a, v));

  // リンク接続線
  const connectors = Object.values(tree)
    .filter(t => t.links)
    .map(t => t.links.map((l, i) => {
      const d = Object.values(tree).find(d => d.path === l.to);
      if(!d) {
        if(!l.to.startsWith('$')) {
          console.group(`link not found[$]`);
          console.log(`${t.categoryName}, ${t.no}, ${t.title}, ${t.path}`);
          console.log(`${l.label}, ${l.to}`);
          console.groupEnd();
          l.invalid = true;
          t.alert = true;
        }
        return '';
      }

      // 同じリンクが複数ある？
      const ds = t.links.map((ll, ii) => {
        return {
          to: ll.to,
          no: ii
        }
      }).filter(ll => ll.to === l.to);
      const no = ds.findIndex(ll => ll.no === i);
      const offsetY = ds.length === 1 ? 0 : (no - ds.length / 2) * 8;

      // $... は非表示ラベル
      const label = (l.label && l.label[0] === '$') ? '' : l.label;
      const terminal = d.terminal ? 'terminal' : '';

      return `<path id="connector-${t.id}-${d.id}-${i}" data-offset-y="${offsetY}" class="${terminal}" /><text id="text-${t.id}-${d.id}-${i}" text-anchor="middle" font-size="8" stroke-width="0.25" class="${terminal}">${label}</text>`;
    }).join(''));

  sitemapConnectors = [ ...sitemapConnectors, ...connectors ];
  
  // sitemap作成
  let sitemap = `<h3>${category.name}</h3>`;
  sitemap += `<section id="category-${categoryId}" class="sitemap-category">`;
  for (let depth = 0; depth <= maxDepth; depth++) {
    const items = Object.values(tree).filter(t => t.depth === depth);
    let position = 0;
    sitemap += `
          <div class="sitemap-col">
            ${items.map((i) => {
              let html = ''

              // 縦方向、隙間指定ありであれば、隙間を入れる。
              if(i.span) {
                for(let y = 0; y < i.span; y++, position++) {
                  html += dummyElement
                }
              }

              // 縦方向配置が親より上にいかないようにする。
              const parentPosition = i.parentPath ? tree[i.parentPath].position : 0
              for(;position < parentPosition; position++) {
                html += dummyElement
              }
              i.position = position++

              const terminal = i.terminal ? `terminal` : ''
              const noImage = (!i.terminal && i.noImage) ? `no-image` : ''

              html += `
<div id="page-${i.id}" class="card ${terminal} ${noImage}" role="sitemap-page" data-category-id="${categoryId}" data-path="${i.path}">
  <div class="card-body">
    <div class="title">${i.title}</div>
    <div class="path">${i.path}</div>
  </div>
</div>
                `

              return html
            }).join('')}
          </div>`.replace(/(\r?\n)/g, '');
  }
  sitemap += `</section>`;

  trees.push(tree);

  return sitemap;
}

console.log(new Date(), '+ update index.html');

const sitemap = json.categories.map((c, categoryId) => buildCategory(categoryId, c)).join('');


ejs.renderFile('templates/html/index.html.ejs', {
  sitemapConnector: `<svg class="sitemap-connector d-none">${sitemapConnectors.join('')}</svg>`,
  sitemap,
  trees: trees
}, function (err, html) {
  const d = path.join(__dirname, args.outFolder)
  if(!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }

  fs.writeFileSync(path.join(d, 'index.html'), html, 'utf8');
  console.log(new Date(), '- update index.html');
})