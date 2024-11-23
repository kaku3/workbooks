import fs from 'fs';
import MarkdownUtil from "./utils/markdown-util.js";

const ast = MarkdownUtil.loadAst('in/sitemap.md');
const screens = MarkdownUtil.parseMarkdownToScreens(ast.children);

// ローカル html から読み込めるように json を js の変数として保存
fs.writeFileSync('out/data/screens.js', `const SCREENS=${JSON.stringify(screens, null, 2)};`, 'utf-8');
// debug用に出力
fs.writeFileSync('out/data/sitemap.ast', JSON.stringify(ast, null, 2), 'utf-8');
