// 手書き原稿を問題データへ組み込み、根拠と対象外候補を検証する。
// 使い方: node data/build-documents.mjs [--check]
import fs from 'node:fs';
const dataFile = new URL('./problems.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const source = JSON.parse(fs.readFileSync(new URL('./documents-source.json', import.meta.url), 'utf8'));
if (source.version !== 2) throw new Error('documents-source.json は version: 2 が必要です');

export function buildPrompt(problem, entry) {
  const fail = message => { throw new Error(`${problem.id}: ${message}`); };
  if (!entry?.requirements?.trim()) fail('要求仕様がありません');
  if (!entry.documents || !Array.isArray(entry.documents.initial) || !Array.isArray(entry.documents.additional)) fail('初期・追加のメモが必要です');
  if (entry.documents.initial.length !== 3) fail('初期メモは3枚にしてください');
  let index = 0;
  const number = doc => { index++; return { ...doc, id: doc.id || `${problem.id}-doc-${String(index).padStart(2, '0')}` }; };
  const documents = { initial: entry.documents.initial.map(number), additional: entry.documents.additional.map(number) };
  const docs = [...documents.initial, ...documents.additional];
  if (new Set(docs.map(d => d.id)).size !== docs.length) fail('メモIDが重複しています');
  const itemIds = new Set(problem.items.map(item => item.id));
  const expected = new Set([problem.connections, ...(problem.connectionAlternatives || [])].flatMap(set => set.map(([a, b]) => `${a}->${b}`)));
  const covered = new Set(), scoped = new Set();
  for (const doc of docs) {
    if (!doc.text?.trim()) fail('メモ本文が空です');
    if (!['requirement', 'external', 'detail', 'scope'].includes(doc.kind)) fail(`不明なメモ種別: ${doc.kind}`);
    if (doc.text.includes('→') || /今回の.{0,8}(?:扱わない|含めない)|別紙を参照|詳細は後日/.test(doc.text)) fail(`本文に答えや対象外の明示があります: ${doc.text}`);
    if (doc.kind === 'scope' && doc.covers?.length) fail('対象外メモに正解接続は指定できません');
    for (const edge of doc.covers || []) {
      if (!expected.has(edge)) fail(`不明な接続: ${edge}`);
      covered.add(edge);
    }
    for (const id of doc.itemIds || []) {
      if (!itemIds.has(id)) fail(`不明なカード: ${id}`);
      if (doc.kind === 'scope') {
        if (problem.items.find(item => item.id === id).kind !== 'extra') fail(`必要なカードが対象外に指定されています: ${id}`);
        scoped.add(id);
      }
    }
  }
  const missing = [...expected].filter(edge => !covered.has(edge));
  if (missing.length) fail(`根拠のない接続: ${missing.join(', ')}`);
  const missingExtras = problem.items.filter(item => item.kind === 'extra' && !scoped.has(item.id));
  if (missingExtras.length) fail(`対象外の根拠がないカード: ${missingExtras.map(item => item.id).join(', ')}`);
  return { requirements: entry.requirements, intro: entry.requirements,
    task: '要求仕様と左側のメモを読み、右側のカードで必要な処理と関係を図にしてください。', documents };
}
for (const problem of data.problems) {
  const prompt = buildPrompt(problem, source.problems[problem.id]);
  if (process.argv.includes('--check')) {
    if (JSON.stringify(prompt) !== JSON.stringify(problem.prompt)) throw new Error(`${problem.id}: 問題データが原稿と一致しません。再生成してください`);
  } else problem.prompt = prompt;
}
if (!process.argv.includes('--check')) fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`${process.argv.includes('--check') ? 'validated' : 'rewrote'} ${data.problems.length} authored prompts`);
