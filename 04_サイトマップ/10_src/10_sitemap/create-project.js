const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { parse } = require('csv-parse/sync');
const nunjucks = require('nunjucks');

const args = yargs(hideBin(process.argv))
  .option({
    in: {
      description: 'sitemap.src',
      demandOption: true,
      alias: 'i' 
    },
    outFolder: {
      description: 'sitemap yml 出力フォルダ',
      demandOption: true,
      alias: 'o' 
    },
    rootPath: {
      description: 'URL ROOT path',
      demandOption: false,
      alias: 'r'
    },
    categoryName: {
      description: 'category 名',
      demandOption: false,
      alias: 'n'
    }
  })
  .default('rootPath', '/')
  .default('categoryName', 'sample')
  .usage('[usage]node $0 -i in/sitemap.src -o out/yml -r /some/service -n sample')
  .argv;

const ymlPageTemplate = fs.readFileSync('templates/yml/page.yml', 'utf-8');

let sitemap = [ 'categories:', `  - name: ${args.categoryName}`, '    pages:' ]

const csv = fs.readFileSync(path.join(__dirname, args.in), 'utf-8');
const rows = parse(csv);

// ヘッダ行を除外
rows.shift();
for(let [ title, _path, description ] of rows) {
  const pagePath = path.join(args.rootPath, _path).replace(/\\/g, '/');
  _path += '.yml'

  // _path にフォルダがあればフォルダを作成する。
  const paths = _path.split('/');
  paths.pop();

  const d = path.join(args.outFolder, paths.join('/'));
  if(!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true});
  }
  const f = path.join(args.outFolder, _path);
  const yml = nunjucks.compile(ymlPageTemplate);
  if(!fs.existsSync(f)) {
    fs.writeFileSync(
      f,
      yml.render({
        title,
        path: pagePath,
        description: description || '{説明文}'
      }),
      'utf-8'
    );
  }
  sitemap.push(`      - !!inc/file ${_path}`);
}
sitemap = sitemap.join('\n');

const sitemapFile = path.join(args.outFolder, '@sitemap-index.yml');
if(!fs.existsSync(sitemapFile)) {
  fs.writeFileSync(sitemapFile, sitemap, 'utf-8');
}
