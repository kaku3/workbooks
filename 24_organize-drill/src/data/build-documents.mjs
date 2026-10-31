// problems.json の prompt を「段階開示資料」形式に作り直す
// 使い方: node data/build-documents.mjs
//
// 最初に見せる資料 = 外部設計の概要1枚 + スコープ外2枚
// 追加資料       = 正解接続の根拠になる資料 + スコープ外の資料（画面側で順不同に開示）
//
// - 必要な資料は connections から生成する（起点カードごとに1枚。各接続がちょうど1枚に入る）
// - 概要文とスコープ外資料は documents-source.json の手書きを使う
// - 同じ入力なら同じ結果になる
import fs from 'node:fs';

const dataFile = new URL('./problems.json', import.meta.url);
const sourceFile = new URL('./documents-source.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8')).problems;

const seedOf = text => { let h = 2166136261; for (const c of text) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const makeRng = seed => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffle = (list, rng) => { const a = [...list]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (list, rng) => list[Math.floor(rng() * list.length)];

// どの問題にも混ぜられる、図の対象外になる資料
const NOISE = [
  ['運用メモ', '操作ログは1年間保存する。今回の処理フロー図では保存方式までは扱わない。'],
  ['未決事項', '入力項目の桁数・型はテーブル定義に従う。画面項目の詳細は別途確認する。'],
  ['非機能メモ', '応答時間は3秒以内を目標とする。性能の検討は別の資料で行う。'],
  ['共通デザインメモ', 'エラー表示の色は共通スタイルに合わせる。'],
  ['画面仕様メモ', '画面文言は後日確定する。'],
  ['帳票メモ', '帳票レイアウトは別紙を参照する。'],
  ['要求メモ', '導入時期は繁忙期を避けたい。'],
  ['研修メモ', '操作研修の資料は別途用意する。'],
  ['利用メモ', '同時利用は最大50人を想定している。'],
  ['設定メモ', 'APIのタイムアウトは設定ファイルで管理する。'],
  ['開発標準メモ', '保存先テーブル名は開発標準に従う。'],
  ['要求メモ', '画面の雰囲気は現行システムに近づけたい。']
];

const TASKS = [
  '関係する付箋を選び、情報のつながりを矢印で整理してください。',
  '図に必要な付箋を選び、処理の流れを矢印でつないでください。',
  '資料の順番に惑わされず、必要な付箋を選んで図にしてください。',
  '図に載せる情報を見極め、付箋を矢印でつないでください。'
];

// 必要な資料の種類（外部設計を中心に、要件・詳細設計を混ぜる）
const LAYERS = [
  { kind: 'external', weight: 55 },
  { kind: 'requirement', weight: 25 },
  { kind: 'detail', weight: 20 }
];
const pickLayer = rng => {
  let r = rng() * 100;
  for (const layer of LAYERS) { if ((r -= layer.weight) < 0) return layer.kind; }
  return 'external';
};
const titleOf = (kind, shape, rng) => {
  if (kind === 'external') return `外部設計｜${{ linear: '処理順序', loop: 'やり直し', decision: '分岐の扱い', parallel: '並行する作業' }[shape]}`;
  if (kind === 'requirement') return pick(['要件メモ', '要求メモ'], rng);
  return '詳細設計｜内部処理';
};

const q = label => `「${label}」`;
const linearTexts = [
  (a, b) => `${q(a)}を行った後に、${q(b)}へ進む。`,
  (a, b) => `${q(a)}が終わったら、${q(b)}に移る。`,
  (a, b) => `${q(a)}の次は${q(b)}を行う。`,
  (a, b) => `${q(a)}を受けて、${q(b)}につなぐ。`
];
const loopTexts = [
  (a, b) => `${q(a)}のあとは、再び${q(b)}に戻る。`,
  (a, b) => `${q(a)}を終えたら、もう一度${q(b)}を行う。`
];
const orList = bs => bs.map(q).join('、');
const decisionTexts = [
  (a, bs) => `${q(a)}の結果に応じて、${orList(bs)}のいずれかへ進む。`,
  (a, bs) => `${q(a)}の後は、状況によって${bs.map(q).join('／')}に分かれる。`,
  (a, bs) => `${q(a)}の結果次第で、行き先（${orList(bs)}）が決まる。`
];
const parallelTexts = [
  (a, bs) => `${q(a)}のあとは、${bs.map(q).join('と')}をそれぞれ進める。`,
  (a, bs) => `${q(a)}を受けて、${bs.map(q).join('と')}が並行して始まる。`
];

// 起点から深さ優先で辿り、探索中のカードへ戻る接続（やり直しの矢印）だけを返す
function findBackEdges(problem) {
  const out = new Map();
  const incoming = new Set();
  problem.connections.forEach(([from, to]) => { if (!out.has(from)) out.set(from, []); out.get(from).push(to); incoming.add(to); });
  const starts = [...out.keys()].filter(id => !incoming.has(id));
  if (!starts.length && out.size) starts.push(out.keys().next().value);
  const state = new Map();
  const back = new Set();
  const visit = node => {
    state.set(node, 1);
    for (const next of out.get(node) || []) {
      if (state.get(next) === 1) back.add(`${node}->${next}`);
      else if (!state.has(next)) visit(next);
    }
    state.set(node, 2);
  };
  starts.forEach(id => { if (!state.has(id)) visit(id); });
  return back;
}

function neededDocuments(problem, entry, rng) {
  const label = new Map(problem.items.map(item => [item.id, item.label]));
  const out = new Map();
  problem.connections.forEach(([from, to]) => { if (!out.has(from)) out.set(from, []); out.get(from).push(to); });
  const back = findBackEdges(problem);
  const parallel = new Set(entry.parallel || []);
  const docs = [];
  for (const [from, targets] of out) {
    const a = label.get(from);
    const covers = targets.map(to => `${from}->${to}`);
    let shape, text;
    if (targets.length === 1) {
      const loop = back.has(covers[0]);
      shape = loop ? 'loop' : 'linear';
      text = pick(loop ? loopTexts : linearTexts, rng)(a, label.get(targets[0]));
    } else if (parallel.has(a)) {
      shape = 'parallel';
      text = pick(parallelTexts, rng)(a, targets.map(to => label.get(to)));
    } else {
      shape = 'decision';
      text = pick(decisionTexts, rng)(a, targets.map(to => label.get(to)));
    }
    const kind = pickLayer(rng);
    docs.push({ kind, title: titleOf(kind, shape, rng), text, covers });
  }
  return docs;
}

function scopeDocuments(problem, entry, rng) {
  const extras = problem.items.filter(item => item.kind === 'extra');
  const fromExtras = shuffle(extras, rng).map(item => {
    const note = entry.scope?.[item.label];
    if (!note) throw new Error(`${problem.id}: 「${item.label}」のスコープ外資料が documents-source.json にありません`);
    return { kind: 'scope', title: note[0], text: note[1] };
  });
  const labels = problem.items.map(item => item.label);
  const noise = shuffle(NOISE, rng)
    .filter(([, text]) => !labels.some(l => text.includes(l)))
    .map(([title, text]) => ({ kind: 'scope', title, text }));
  const first = [fromExtras.shift() || noise.shift(), noise.shift()];
  const second = [...fromExtras, ...noise].slice(0, 2);
  return { initial: shuffle(first, rng), additional: second };
}

function build(problem) {
  const entry = source[problem.id];
  if (!entry) throw new Error(`${problem.id}: documents-source.json に項目がありません`);
  const rng = makeRng(seedOf(problem.id));
  const intro = `「${problem.title}」の見直しにあたり、関係者から集めたメモと設計資料です。今回整理する範囲を考えながら、必要な情報を集めてください。`;
  const task = entry.task || pick(TASKS, rng);
  if (entry.documents) return { intro, task, documents: entry.documents };

  const needed = neededDocuments(problem, entry, rng);
  const scope = scopeDocuments(problem, entry, rng);
  const overview = { kind: 'external', title: '外部設計｜処理概要', text: entry.overview };
  const number = (doc, index) => ({ id: `${problem.id}-doc-${String(index).padStart(2, '0')}`, ...doc });
  const initial = [overview, ...scope.initial].map((doc, i) => number(doc, i + 1));
  const additional = [...needed, ...scope.additional].map((doc, i) => number(doc, initial.length + i + 1));
  return { intro, task, documents: { initial, additional } };
}

function validate(problem) {
  const { documents } = problem.prompt;
  const fail = message => { throw new Error(`${problem.id}: ${message}`); };
  const { initial, additional } = documents;
  if (initial.length !== 3 || initial.filter(d => d.kind === 'external').length !== 1 || initial.filter(d => d.kind === 'scope').length !== 2) fail('最初の3枚は「外部設計1枚＋スコープ外2枚」にしてください');
  if (initial.some(d => d.covers)) fail('最初の資料に接続の根拠を含めないでください');
  const ids = [...initial, ...additional].map(d => d.id);
  if (new Set(ids).size !== ids.length) fail('資料IDが重複しています');
  const covered = additional.flatMap(d => d.covers || []);
  const expected = problem.connections.map(([from, to]) => `${from}->${to}`);
  const missing = expected.filter(edge => !covered.includes(edge));
  const unknown = covered.filter(edge => !expected.includes(edge));
  if (missing.length || unknown.length || new Set(covered).size !== covered.length) fail(`正解接続と資料の対応が一致しません 不足:${missing} 余分:${unknown}`);
  const requiredLabels = problem.items.filter(item => item.kind === 'required').map(item => item.label);
  [...initial, ...additional].filter(d => d.kind === 'scope').forEach(d => {
    if (requiredLabels.some(l => d.text.includes(l))) fail(`スコープ外資料に必要なカードの文言が含まれています: ${d.text}`);
  });
  if (additional.filter(d => d.kind === 'scope').length < 2) fail('追加資料にスコープ外が2枚以上必要です');
  if (initial.filter(d => d.kind === 'external')[0].text.includes('→')) fail('概要に矢印は使えません');
}

data.problems.forEach(problem => { problem.prompt = build(problem); });
data.problems.forEach(validate);
fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
const counts = data.problems.map(p => p.prompt.documents.additional.length);
console.log(`rewrote ${data.problems.length} prompts as staged documents (additional: min ${Math.min(...counts)}, max ${Math.max(...counts)})`);
