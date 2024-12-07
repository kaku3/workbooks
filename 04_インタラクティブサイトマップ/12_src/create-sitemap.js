import yargs from 'yargs/yargs';
import fs from 'fs';
import fse from 'fs-extra';
import Path from 'path';
import MarkdownUtil from "./utils/markdown-util.js";

const argv = yargs(process.argv.slice(2))
  .alias('m', 'mdFile')
  .alias('o', 'outFolder')
  .argv;

const { mdFile, outFolder } = argv;
console.info('+ create-sitemap');
console.info({ mdFile, outFolder });

const outDataFolder = Path.join(outFolder, 'data');

const ast = MarkdownUtil.loadAst(mdFile);
const screens = MarkdownUtil.parseMarkdownToScreens(ast.children);

if(!fs.existsSync(outDataFolder)) {
  fs.mkdirSync(outDataFolder, { recursive: true });
}
fse.copySync('template', outFolder);

fs.writeFileSync(Path.join(outDataFolder, 'screens.js'), `const SCREENS=${JSON.stringify(screens, null, 2)};`, 'utf-8');
fs.writeFileSync(Path.join(outDataFolder, 'sitemap.ast'), JSON.stringify(ast, null, 2), 'utf-8');

console.info('- create-sitemap');
