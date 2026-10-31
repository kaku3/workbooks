const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8');
const start = source.indexOf('function scorePlacement(');
const end = source.indexOf('function assessComposition(', start);
const score = vm.runInNewContext(source.slice(start, end) + '\nscorePlacement;');
const node = (x, y, id) => ({ id, x, y, left: x - 50, right: x + 50, top: y - 20, bottom: y + 20 });
const row = xs => xs.map((x, i) => node(x, 0, i));
const five = row([0, 128, 256, 384, 512]);
for (const nodes of [five, five.map(n => node(0, n.x, n.id))]) {
  const result = score(nodes, true, 0);
  assert.equal(result.alignmentPoints, 4);
  assert.equal(result.spacingPoints, 4);
  assert.equal(result.points, 9);
  assert.equal(result.maxPoints, 9);
}
const partial = score(row([0, 128, 256, 476, 776]), true, 0);
assert.equal(partial.alignmentPoints, 4);
assert.equal(partial.spacingPoints, 2);
assert.equal(partial.points, 7);
const grid = score([node(0, 0, 0), node(128, 0, 1), node(0, 68, 2), node(128, 68, 3)], true, 0);
assert.equal(grid.alignmentPoints, 3);
assert.equal(grid.spacingPoints, 3);
assert.equal(grid.points, 7);
assert.equal(score(row([0, 128]), true, 0).points, 3);
assert.equal(score(row([0, 180]), true, 0).spacingPoints, 0);
const overlap = score(row([0, 0, 0, 0, 0]), true, 0);
assert.equal(overlap.points, 0);
assert.equal(overlap.alignmentPoints, 0);
assert.equal(score(five, false, 0).points, 0);
assert.equal(score(five, true, 2).points, 7);
assert.equal(score(five, true, 20).points, 0);
for (const nodes of [[], [node(0, 0, 0)]]) {
  assert.equal(score(nodes, true, 0).points, 0);
  assert.equal(score(nodes, true, 0).maxPoints, 0);
}
const rewards = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/career.json'), 'utf8')).rewards;
assert.equal(rewards.practiceCorrect, 10);
assert.equal(rewards.dailyCorrect, 20);
assert.equal(rewards.compositionPoint, 1);
console.log('PASS: horizontal/vertical five-card scores, partial spacing, grid deduplication, pairs, overlaps, untouched, penalties, empty/single card, reward settings');
