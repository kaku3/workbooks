import { readdir, readFile, writeFile } from 'node:fs/promises';
const dir = new URL('../docs/story/', import.meta.url), scenes = {}, sceneVersions = {};
const speakers = new Set(['player', 'sales', 'lead', 'client', 'accountant']);
for (const file of (await readdir(dir)).filter(name => /^\d\d_.*\.md$/.test(name)).sort()) {
  let current;
  for (const line of (await readFile(new URL(file, dir), 'utf8')).split(/\r?\n/)) {
    if (/^## /.test(line)) current = null;
    const match = line.match(/`(\d\d-\d\d\.(?:intro|clear))`/);
    if (match) { current = match[1]; if (scenes[current]) throw new Error(`Duplicate event: ${current}`); scenes[current] = []; sceneVersions[current] = Number(line.match(/version\s+(\d+)/)?.[1] || 1); }
    else if (current && line.startsWith('|')) {
      const parts = line.replace(/^\||\|$/g, '').split('|').map(v => v.trim());
      if (speakers.has(parts[0]) && parts.length === 2) scenes[current].push({ speaker: parts[0], text: parts[1] });
    }
  }
}
for (const [id, lines] of Object.entries(scenes)) if (!lines.length || lines.length > 8) throw new Error(`Invalid scene: ${id}`);
await writeFile(new URL('../src/story-data.mjs', import.meta.url), `export const scenes = ${JSON.stringify(scenes, null, 2)};\nexport const sceneVersions = ${JSON.stringify(sceneVersions, null, 2)};\n`);
console.log(`Built ${Object.keys(scenes).length} story events`);
