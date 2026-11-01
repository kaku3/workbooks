import assert from 'node:assert/strict';
import { approvalDrills, approvalSolution } from '../src/approval-drills.mjs';
import { createRun, finish, clone, execute } from '../src/engine.mjs';
for (const drill of approvalDrills) {
  const initial = drill.tests.map(t => finish(createRun(drill.initialGraph, t)).pass);
  assert.ok(initial.includes(false), `${drill.id} needs repairs`);
  const canonical = approvalSolution();
  const graph = clone(drill.initialGraph);
  graph.nodes.push(...clone(drill.availableBlocks));
  for (const n of graph.nodes) Object.assign(n, clone(canonical.nodes.find(b => b.id === n.id)));
  if (drill.id === 'approval-basics' || drill.id === 'approval-return') graph.nodes.find(n => n.id === 'decision').success = 'approved';
  if (drill.id === 'approval-retry') graph.nodes.find(n => n.id === 'decision').success = 'END';
  for (const n of graph.nodes) {
    assert.ok(n.operations.every(o => drill.allowedOperations.includes(o)), `${drill.id} uses permitted cards`);
    for (const key of ['success', 'failure']) if (!graph.nodes.some(b => b.id === n[key])) n[key] = 'END';
  }
  for (const t of drill.tests) {
    const run = createRun(graph, t), result = finish(run);
    assert.equal(result.pass, true, `${drill.id} ${t.id}: ${JSON.stringify(result.checks.filter(c => !c.pass))}`);
  }
  console.log(`${drill.id}: initial ${initial.filter(Boolean).length}/${initial.length}; repaired all pass`);
}
const test = approvalDrills[3].tests.find(t => t.id === 'AS-02');
const before = clone(test.initialState);
assert.equal(execute(before, 'R-01', 'checkApprover', test.events[0]).status, 'failure');
assert.deepEqual(before, test.initialState);
// A later correction cannot erase an unauthorized decision from the event history.
const invalid = approvalSolution(); invalid.nodes.find(n => n.id === 'decision').operations = ['recordDecision', 'checkApprover'];
assert.equal(finish(createRun(invalid, test)).pass, false);
console.log('PASS: approval scenarios, revision checks, retry, permission refusal and immutable failures');
