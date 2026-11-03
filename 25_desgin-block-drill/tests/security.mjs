import assert from 'node:assert/strict';
import { securityDrills, securitySolution } from '../src/security-drills.mjs';
import { securityOperations, executeSecurity } from '../src/security.mjs';
import { createRun, step, finish, judge, clone } from '../src/engine.mjs';

for (const [i, drill] of securityDrills.entries()) {
  assert.equal(drill.tests.length, [3, 5, 5, 15][i]);
  const before = drill.tests.map(test => finish(createRun(drill.initialGraph, test)).pass);
  assert.ok(before.includes(false), `${drill.id} must require repairs`);
  const canonical = securitySolution(), graph = clone(drill.initialGraph);
  graph.nodes.push(...clone(drill.availableBlocks));
  for (const node of graph.nodes) {
    Object.assign(node, clone(canonical.nodes.find(n => n.id === node.id)));
    assert.ok(node.operations.every(op => drill.allowedOperations.includes(op)));
    for (const branch of ['success', 'failure']) if (!graph.nodes.some(n => n.id === node[branch])) node[branch] = 'END';
  }
  if (drill.id === 'security-login') graph.nodes.find(n => n.id === 'login').success = 'password';
  for (const test of drill.tests) {
    const result = finish(createRun(graph, test));
    assert.equal(result.pass, true, `${drill.id}/${test.id}: ${JSON.stringify(result.checks.filter(c => !c.pass))}`);
    assert.equal(finish(createRun(graph, test)).pass, true, 'independent deterministic rerun');
  }
  console.log(`${drill.id}: initial ${before.filter(Boolean).length}/${before.length}; repaired all pass`);
}

const integrated = securityDrills[3], canonical = securitySolution();
const test = integrated.tests.find(t => t.id === 'SX-01');
const initial = clone(test.initialState), event = test.events[1];
const failure = executeSecurity(initial, 'checkMfa', event);
assert.equal(failure.status, 'failure'); assert.equal(failure.state, initial);
assert.deepEqual(initial, test.initialState, 'failure must be atomic');

let r = executeSecurity(initial, 'recordLoginFailure', event);
assert.equal(r.state.users['A-01'].failedCount, 1);
r = executeSecurity(r.state, 'recordLoginFailure', event);
assert.equal(r.status, 'no_op'); assert.equal(r.state.users['A-01'].failedCount, 1);

// An unverified session really gets created, but later revocation cannot hide it.
const badState = executeSecurity(initial, 'issueSession', event).state;
assert.equal(badState.effects.at(-1).valid, false);
assert.equal(badState.sessions['S-A'].authenticated, false);
const revoked = executeSecurity(badState, 'revokeSession', { type: 'logout', inputId: 'extra', actorId: 'A-01', sessionId: 'S-A', now: 10 }).state;
assert.equal(revoked.effects.filter(e => e.type === 'sessionIssued' && !e.valid).length, 1);

// Checkpoint assertions detect bad intermediate state even after final-state repair.
const checkpointTest = integrated.tests.find(t => t.id === 'SK-05');
const run = createRun(canonical, checkpointTest); finish(run);
assert.equal(judge(run).pass, true);
run.inputStates[2].users['U-01'].failedCount = 0;
assert.equal(judge(run).pass, false);

// Borrowed, logged-out and boundary-expired sessions must fail without mutation.
for (const id of ['SS-03', 'SS-04', 'SS-05']) {
  const t = integrated.tests.find(t => t.id === id), run = createRun(canonical, t);
  while (!['completed', 'stopped'].includes(run.status)) step(run);
  assert.equal(run.state.effects.filter(e => e.type === 'adminAction').length, 0);
}
assert.equal(Object.keys(securityOperations).length, 13);
console.log('PASS: security cases, input checkpoints, no double counting, immutable failures and irreversible violation history');
