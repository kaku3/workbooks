// docs/drill/<問題ID>.md を problems.json から作り直す
// 使い方: node data/build-review-docs.mjs
//
// problems.json を正として、1問＝1ファイルのレビュー用ドキュメントを書き出す。
// 「## レビュー・見直しメモ」以降は手書きの記録なので、既存ファイルの内容をそのまま引き継ぐ。
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync(new URL('./problems.json', import.meta.url), 'utf8'));
const outDir = new URL('../../docs/drill/', import.meta.url);

const REVIEW_HEADING = '## レビュー・見直しメモ';
const REVIEW_TEMPLATE = `${REVIEW_HEADING}

### 問題の狙い

_（記入）_

### 要求仕様として自然か

_（記入）_

### 要件・外部設計の粒度は適切か

_（記入）_

### 図にする範囲・正解接続に無理がないか

_（記入）_

### ヒントの改善案

_（記入）_
`;

const kindLabel = { external: '外部設計', requirement: '要件・要求', detail: '詳細設計', scope: 'スコープ外' };
const cell = text => String(text).replace(/\|/g, '\\|');

function keepReviewNotes(file) {
  if (!fs.existsSync(file)) return REVIEW_TEMPLATE;
  const text = fs.readFileSync(file, 'utf8');
  const start = text.indexOf(REVIEW_HEADING);
  if (start < 0) return REVIEW_TEMPLATE;
  const next = text.indexOf('\n## ', start + REVIEW_HEADING.length);
  return `${text.slice(start, next < 0 ? text.length : next).trimEnd()}\n`;
}

function render(problem, reviewNotes) {
  const label = new Map(problem.items.map(item => [item.id, item.label]));
  const { intro, task, documents } = problem.prompt;
  const lines = [];
  lines.push(`# ${problem.title}`, '');
  lines.push(`- 問題ID：\`${problem.id}\``);
  lines.push(`- 直接開く：\`src/index.html?drill=${problem.id}\``);
  lines.push(`- 難易度：${problem.difficulty}`);
  lines.push('- 出典：`src/data/problems.json`', '');

  lines.push('## 問題文', '', intro, '', '### 課題', '', task, '');

  lines.push('## 段階開示資料', '');
  lines.push('左側のホワイトボードに付箋として表示します。最初は外部設計1枚＋スコープ外2枚。「（ヒントを見る）」を押すたびに追加資料を1枚開示し、開くたびに1点減点します。追加資料は必要な情報とスコープ外の情報が混ざっており、開示順は毎回ランダムです。付箋はドラッグで自由に動かせます。', '');
  lines.push('### 最初に表示する3枚', '');
  documents.initial.forEach((doc, i) => lines.push(`${i + 1}. ${doc.title}（${kindLabel[doc.kind] || doc.kind}）：${doc.text}`));
  lines.push('', '### 追加で開示する資料（順不同）', '');
  lines.push('| 資料 | 内容 | 種別 | 根拠になる正解接続 |', '|---|---|---|---|');
  documents.additional.forEach(doc => {
    const covers = (doc.covers || []).map(edge => { const [from, to] = edge.split('->'); return `${label.get(from)} → ${label.get(to)}`; }).join('<br>');
    lines.push(`| ${cell(doc.title)} | ${cell(doc.text)} | ${kindLabel[doc.kind] || doc.kind} | ${cell(covers || '—（図に含めない）')} |`);
  });
  lines.push('');

  lines.push('## ヒント', '', problem.hint, '');

  lines.push('## 付箋', '', '| ID | 種別 | ラベル |', '|---|---|---|');
  problem.items.forEach(item => lines.push(`| \`${item.id}\` | ${item.kind === 'required' ? '必要' : '余分・参考'} | ${cell(item.label)} |`));
  lines.push('');

  if (problem.groups?.length) {
    lines.push('## グループ', '');
    problem.groups.forEach(group => lines.push(`- **${group.label}**：${group.itemIds.map(id => `\`${id}\``).join(', ')}`));
    lines.push('');
  }

  lines.push('## 正解の接続', '');
  problem.connections.forEach(([from, to]) => lines.push(`- \`${from}\` → \`${to}\``));
  lines.push('');
  if (problem.connectionAlternatives?.length) {
    lines.push('## 許容する別解', '');
    problem.connectionAlternatives.forEach((set, i) => { lines.push(`### 別解${i + 1}`, ''); set.forEach(([from, to]) => lines.push(`- \`${from}\` → \`${to}\``)); lines.push(''); });
  }

  lines.push('## 正解例の配置', '', '| 付箋ID | x | y |', '|---|---:|---:|');
  Object.entries(problem.layout).forEach(([id, p]) => lines.push(`| \`${id}\` | ${p.x} | ${p.y} |`));
  lines.push('');

  lines.push('## 解説', '', problem.explanation, '');
  lines.push(reviewNotes);
  return lines.join('\n');
}

let written = 0;
for (const problem of data.problems) {
  const file = new URL(`${problem.id}.md`, outDir);
  fs.writeFileSync(file, render(problem, keepReviewNotes(file)), 'utf8');
  written++;
}
console.log(`wrote ${written} review documents to docs/drill/`);
