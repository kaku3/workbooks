// problems.json の prompt を問題ごとに付箋形式へ再構成する
// 使い方: node data/vary-prompts.mjs
import fs from 'node:fs';

const file = new URL('./problems.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const seedOf = text => { let h = 2166136261; for (const c of text) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const makeRng = seed => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = (list, rng) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (list, rng) => list[Math.floor(rng() * list.length)];

const LAYERS = ['要求仕様', '要件', '外部設計', '詳細設計'];
const KEYS = { 要求仕様: 'requirements', 要件: 'conditions', 外部設計: 'externalDesign', 詳細設計: 'detailedDesign' };
const LABELS = { requirements: '要求仕様', conditions: '要件', externalDesign: '外部設計', detailedDesign: '詳細設計' };
const nodeText = {
  要求仕様: l => `「${l}」を実現したい`,
  要件: l => `機能要件：${l}`,
  外部設計: l => `利用者から見える動き：${l}`,
  詳細設計: l => `内部処理：${l}`
};
const edgeText = {
  要求仕様: (a, b) => `「${a}」の後に「${b}」を行いたい`,
  要件: (a, b) => `「${a}」完了後に「${b}」へ進む`,
  外部設計: (a, b) => `「${a}」の次に「${b}」を行う`,
  詳細設計: (a, b) => `「${a}」完了後に「${b}」を呼び出す`
};
const branchText = {
  要求仕様: (a, bs) => `「${a}」の結果で${bs.map(b => `「${b}」`).join('／')}を使い分けたい`,
  要件: (a, bs) => `「${a}」の後は状況に応じて${bs.map(b => `「${b}」`).join('／')}へ進む`,
  外部設計: (a, bs) => `「${a}」の結果で${bs.map(b => `「${b}」`).join('／')}に分岐`,
  詳細設計: (a, bs) => `「${a}」の戻り値で${bs.map(b => `「${b}」`).join('／')}を切り替える`
};
const extraText = [
  x => `「${x}」も論点に挙がったが未決定`,
  x => `「${x}」は担当者間で認識が異なる`,
  x => `参考：${x}`
];
const noisePool = {
  要求仕様: ['画面の雰囲気は現行システムに近づける', '導入時期は繁忙期を避ける', '操作研修の資料は別途用意'],
  要件: ['応答時間は3秒以内', '操作ログは1年間保存', '同時利用は最大50人'],
  外部設計: ['画面文言は後日確定', 'エラー表示の色は共通スタイルに合わせる', '帳票レイアウトは別紙参照'],
  詳細設計: ['入力項目の桁数・型はテーブル定義に従う', 'APIのタイムアウトは設定ファイルで管理', '保存先テーブル名は開発標準に従う']
};
const intros = [
  t => `「${t}」に関する資料の断片です。`,
  t => `「${t}」について集めたメモです。`,
  t => `「${t}」の設計見直しで出た記述です。`,
  t => `「${t}」の打ち合わせ後に残った資料です。`
];
const tasks = [
  '図に必要な付箋を選び、処理の流れを矢印でつないでください。',
  '関係する付箋を選び、情報のつながりを矢印で整理してください。',
  '資料の順番に惑わされず、必要な付箋を選んで図にしてください。',
  '図に載せる情報を見極め、付箋を矢印でつないでください。'
];

function build(problem) {
  const rng = makeRng(seedOf(problem.id));
  const label = new Map(problem.items.map(item => [item.id, item.label]));
  const required = problem.items.filter(item => item.kind === 'required');
  const extras = problem.items.filter(item => item.kind === 'extra');
  const edges = problem.connections;
  const level = problem.difficulty === 'hard' ? 2 : problem.difficulty === 'normal' ? 1 : 0;
  const layerOf = () => pick(LAYERS, rng);
  const out = new Map(), inn = new Map();
  edges.forEach(([from, to]) => { (out.get(from) || out.set(from, []).get(from)).push(to); inn.set(to, (inn.get(to) || 0) + 1); });
  const lines = [];
  const covered = new Set();
  required.forEach(item => {
    const targets = out.get(item.id) || [];
    if (targets.length >= 2) {
      const layer = layerOf();
      lines.push({ layer, text: branchText[layer](label.get(item.id), targets.map(t => label.get(t))) });
      targets.forEach(t => covered.add(`${item.id}->${t}`));
    }
  });
  edges.forEach(([from, to]) => {
    if (covered.has(`${from}->${to}`)) return;
    const layer = layerOf();
    lines.push({ layer, text: edgeText[layer](label.get(from), label.get(to)) });
  });
  if (level === 2 && edges.length) {
    const [from, to] = pick(edges, rng);
    const used = new Set(lines.map(line => line.layer));
    const layer = pick(LAYERS.filter(l => !used.has(l)).concat(LAYERS), rng);
    lines.push({ layer, text: edgeText[layer](label.get(from), label.get(to)) });
  }
  required.forEach(item => {
    const inEdge = (out.get(item.id) || []).length || inn.get(item.id);
    if (!inEdge || level === 0) { const layer = layerOf(); lines.push({ layer, text: nodeText[layer](item.label) }); }
  });
  extras.forEach(item => { lines.push({ layer: layerOf(), text: pick(extraText, rng)(item.label) }); });
  const noiseCount = [1, 2, 3][level];
  shuffle(LAYERS, rng).slice(0, noiseCount).forEach(layer => lines.push({ layer, text: pick(noisePool[layer], rng) }));

  const prompt = { intro: pick(intros, rng)(problem.title) };
  for (const key of Object.values(KEYS)) prompt[key] = [];
  // 各設計段階の中でカード順を混ぜ、付箋として横並びにできるデータにする
  const grouped = Object.fromEntries(LAYERS.map(layer => [layer, shuffle(lines.filter(line => line.layer === layer), rng)]));
  for (const layer of LAYERS) prompt[KEYS[layer]] = grouped[layer].map(line => line.text);
  prompt.task = pick(tasks, rng);
  return prompt;
}

data.problems.forEach(problem => { problem.prompt = build(problem); });
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`rewrote ${data.problems.length} prompts as sticky-note groups`);
