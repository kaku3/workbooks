import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync, strFromU8 } from 'fflate';
import { buildPlicy, outputDirectory, archivePath } from '../scripts/build-plicy.mjs';

const source = fileURLToPath(new URL('../src/', import.meta.url));
async function fingerprint(directory, prefix = '') {
  const entries = {};
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + item.name, path = join(directory, item.name);
    if (item.isDirectory()) Object.assign(entries, await fingerprint(path, `${name}/`));
    else if (item.isFile()) entries[name] = createHash('sha256').update(await readFile(path)).digest('hex');
  }
  return entries;
}
const before = await fingerprint(source);
await buildPlicy();
assert.deepEqual(await fingerprint(source), before, 'Build must not modify any source file');
const html = await readFile(join(outputDirectory, 'index.html'), 'utf8');
assert.doesNotMatch(html, /<script\b[^>]*\b(?:type=["']module|src=)/i);
assert.doesNotMatch(html, /<link\b[^>]*href=["'](?:style|hud)\.css/i);
const inline = html.match(/<script data-bundle="app.js">\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline, 'Inline bundle missing');
new Script(inline, { filename: 'inline-app.js' });
assert.doesNotMatch(inline, /import\.meta/);
assert.doesNotMatch(inline, /\.reload\s*\(/, 'Distribution must not reload the host frame');
assert.match(html, /id="plicyGameRoot"/);
const files = unzipSync(await readFile(archivePath));
assert.ok(files['index.html'] && files['app.js'], 'ZIP must start at index.html, not a parent directory');
assert.equal(strFromU8(files['index.html']), html);
assert.equal(Object.keys(files).filter(name => name.endsWith('.mjs')).length, 0);
for (const name of Object.keys(before).filter(name => name.startsWith('assets/'))) assert.ok(files[name], `Missing asset: ${name}`);
assert.equal(Object.keys(files).some(name => name.includes('node_modules/')), false);
console.log('PASS: classic-script syntax, inline JS/CSS, ZIP layout, all assets and unchanged source');
