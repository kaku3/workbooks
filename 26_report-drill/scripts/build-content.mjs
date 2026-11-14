import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const folders = ['scenarios', 'problems'];

function parseMarkdown(text, name) {
  const data = {};
  const sections = [...text.matchAll(/^## (\w+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  for (const [, key, body] of sections) {
    if (Object.hasOwn(data, key)) throw new Error(`${name}: duplicate section ${key}`);
    if (key === 'scenes') {
      data.scenes = {};
      for (const [, id, version, lines] of body.matchAll(/^### (\S+) \(version (\d+)\)\r?\n([\s\S]*?)(?=^### |$(?![\s\S]))/gm)) {
        if (Object.hasOwn(data.scenes, id)) throw new Error(`${name}: duplicate scene ${id}`);
        const dialogue = [];
        for (const line of lines.split(/\r?\n/).filter(line => line.trim())) {
          const match = line.match(/^- (\w+)( \[thought\])?: (.+)$/);
          if (!match) throw new Error(`${name}: invalid dialogue: ${line}`);
          dialogue.push({ speaker: match[1], ...(match[2] ? { kind: 'thought' } : {}), text: match[3] });
        }
        if (!dialogue.length) throw new Error(`${name}: empty scene ${id}`);
        data.scenes[id] = { version: Number(version), lines: dialogue };
      }
      if (!Object.keys(data.scenes).length) throw new Error(`${name}: no scenes`);
    } else {
      const blocks = [...body.matchAll(/^```json\r?\n([\s\S]*?)^```/gm)];
      if (blocks.length !== 1) throw new Error(`${name}: ${key} requires one JSON block`);
      data[key] = JSON.parse(blocks[0][1]);
    }
  }
  if (data.schemaVersion !== 1 || !data.caseId) throw new Error(`${name}: missing metadata`);
  return data;
}

// Validate both manuscripts before writing either generated file.
const entries = [];
for (const folder of folders) {
  const base = new URL(`docs/${folder}/01_watermark`, root);
  const text = await readFile(new URL(`${base.href}.md`), 'utf8');
  entries.push({ folder, base, data: parseMarkdown(text, folder) });
}
const [scenario, problem] = entries.map(entry => entry.data);
if (scenario.caseId !== problem.caseId) throw new Error('caseId mismatch');
const speakers = new Set(scenario.characters.map(character => character.id));
for (const scene of Object.values(scenario.scenes)) {
  for (const line of scene.lines) if (!speakers.has(line.speaker)) throw new Error(`Unknown speaker: ${line.speaker}`);
}
function validateReferences(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (['scene', 'fallback'].includes(key) && !scenario.scenes[child]) throw new Error(`Unknown scene: ${child}`);
    validateReferences(child);
  }
}
validateReferences(problem);
for (const question of problem.questions) {
  if (question.elements && (question.reactions?.length !== 4 || question.reactions.some(id => !scenario.scenes[id]))) throw new Error(`Invalid report reactions: ${question.id}`);
}
for (const id of Object.values(scenario.events)) if (!scenario.scenes[id]) throw new Error(`Unknown event: ${id}`);
for (const entry of entries) {
  const output = `${JSON.stringify(entry.data, null, 2)}\n`;
  const target = new URL(`${entry.base.href}.json`);
  if (process.argv.includes('--check')) {
    const current = (await readFile(target, 'utf8')).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    if (current !== output) throw new Error(`Generated JSON differs: ${entry.folder}`);
  } else await writeFile(target, output, 'utf8');
  console.log(`${entry.folder}: ${process.argv.includes('--check') ? 'OK' : 'built'}`);
}
const runtime = `// Generated from docs Markdown. Do not edit.\nexport const scenario = ${JSON.stringify(scenario, null, 2)};\nexport const problem = ${JSON.stringify(problem, null, 2)};\n`;
const runtimeUrl = new URL('src/data/content.mjs', root);
if (process.argv.includes('--check')) {
  if (await readFile(runtimeUrl, 'utf8') !== runtime) throw new Error('Runtime data differs. Run npm run build.');
} else {
  await mkdir(new URL('src/data/', root), { recursive: true });
  await writeFile(runtimeUrl, runtime, 'utf8');
}
console.log('src/data/content.mjs: OK');
