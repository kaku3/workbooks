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
  const { requirements, task, documents } = problem.prompt;
  const lines = [];
  lines.push(`# ${problem.title}`, '');
  lines.push(`- 問題ID：\`${problem.id}\``);
  lines.push(`- 直接開く：\`src/index.html?drill=${problem.id}\``);
  lines.push(`- 難易度：${problem.difficulty}`);
  lines.push('- 出典：`src/data/problems.json`', '');

  lines.push('## 要求仕様', '', requirements, '', '### 操作', '', task, '');

  lines.push('## 段階開示資料', '');
  lines.push('左側にはヒアリングメモを本文だけの付箋で表示します。最初は3枚で、判断の根拠も含みます。「（他のメモも見る）」で追加メモをランダムに1枚開示し、1点減点します。付箋は移動・ゴミ箱への整理・復元ができます。復元による再減点はありません。以下の種別と正解接続はレビュー用の内部情報です。', '');
  lines.push('### 最初に表示する3枚', '');
  documents.initial.forEach((doc, i) => {
    const covers = (doc.covers || []).map(edge => edge.split('->').map(id => label.get(id)).join(' → ')).join('、');
    lines.push(`${i + 1}. ${doc.text}（内部種別：${kindLabel[doc.kind] || doc.kind}／根拠：${covers || '対象外'}）`);
  });
  lines.push('', '### 追加で開示する資料（順不同）', '');
  lines.push('| 資料 | 内容 | 種別 | 根拠になる正解接続 |', '|---|---|---|---|');
  documents.additional.forEach(doc => {
    const covers = (doc.covers || []).map(edge => { const [from, to] = edge.split('->'); return `${label.get(from)} → ${label.get(to)}`; }).join('<br>');
    lines.push(`| ${cell(doc.id)} | ${cell(doc.text)} | ${kindLabel[doc.kind] || doc.kind} | ${cell(covers || '—（図に含めない）')} |`);
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
