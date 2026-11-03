import assert from 'node:assert/strict';
import { operations, createRun, step, clone } from '../src/engine.mjs';
import { drills } from '../src/drills.mjs';
import { operationChanges, effectLines } from '../src/operation-ui.mjs';
for (const id of Object.keys(operations)) assert.ok(operationChanges[id], `${id}: missing state change description`);
assert.deepEqual(effectLines({ diff: [{ path: 'inventory.ITEM-A', before: 10, after: 8 }] }), ['在庫 10 → 8 (-2)']);
assert.deepEqual(effectLines({ diff: [{ path: 'requests.R-01.approvedRevision', before: null, after: 2 }] }), ['承認版 なし → 2']);
assert.deepEqual(effectLines({ diff: [{ path: 'effects', before: [{ type: 'audit' }], after: [{ type: 'audit' }, { type: 'transfer' }] }] }), ['振込 +1']);
assert.deepEqual(effectLines({ diff: [] }), []);
for (const drill of drills) for (const test of drill.tests) {
  const run = createRun(clone(drill.initialGraph), test);
  for (let i = 0; i < 30 && !['completed', 'stopped', 'waiting'].includes(run.status); i++) {
    const log = step(run); if (log) assert.ok(effectLines(log).every(line => typeof line === 'string'));
  }
}
console.log('PASS: all processing descriptions, numeric deltas, unset values, new effects and actual scenario logs');
