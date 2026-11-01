import assert from 'node:assert/strict';
import { drills } from '../src/drills.mjs';
import { initialGraph } from '../src/data.mjs';
import { clone, createRun, finish } from '../src/engine.mjs';
const expected = [[false, true, false, false, false, false, false], [false, false], [false, false, false], [false, false, false, false, false, false, false]];
for (const [i, drill] of drills.entries()) {
  assert.deepEqual(drill.tests.map(t => finish(createRun(drill.initialGraph, t)).pass), expected[i], `${drill.id}: initial failures`);
  const repair = clone(initialGraph); repair.nodes = repair.nodes.filter(n => drill.initialGraph.nodes.some(b => b.id === n.id));
  const failed = repair.nodes.find(n => n.id === 'failed'); if (failed) failed.success = 'END';
  for (const test of drill.tests) assert.equal(finish(createRun(repair, test)).pass, true, `${drill.id}: ${test.id} repair`);
  if (failed) {
    failed.success = 'notify'; const notify = repair.nodes.find(n => n.id === 'notify'); notify.operations = ['guard', 'email']; notify.failure = 'END';
    for (const test of drill.tests) assert.equal(finish(createRun(repair, test)).pass, true, `${drill.id}: alternative ${test.id}`);
  }
}
assert.equal(new Set(drills.map(d => d.id)).size, 4);
// 後処理と失敗通知だけ直しても、重複確認なしの受付では二重要求が失敗する。
const medium = drills.find(d => d.id === 'cancel-consistency');
const partial = clone(medium.initialGraph);
partial.nodes.find(n => n.id === 'cleanup').operations = ['release', 'refund', 'confirm'];
partial.nodes.find(n => n.id === 'failed').success = 'END';
assert.deepEqual(medium.tests.map(t => finish(createRun(partial, t)).pass), [true, true, false]);
const repeated = createRun(partial, medium.tests[2]); finish(repeated);
assert.equal(repeated.state.orders['ORD-001'].cancellationStatus, 'failed');
partial.nodes.find(n => n.id === 'request').operations = ['cancel'];
assert.deepEqual(medium.tests.map(t => finish(createRun(partial, t)).pass), [true, true, true]);
console.log('PASS: four drills, initial failure patterns, complete repairs and alternative notification guards');
