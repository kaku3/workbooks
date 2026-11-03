import assert from 'node:assert/strict';
import { createRun, step, finish } from '../src/engine.mjs';
import { initialGraph, tests } from '../src/data.mjs';
import { approvalDrills, approvalSolution } from '../src/approval-drills.mjs';
import { inputLabel, resultPhase } from '../src/operation-ui.mjs';

for (const [graph, test, eventType] of [
  [initialGraph, tests.find(t => t.id === 'TC-05'), 'cancelCompletedEmail'],
  [approvalSolution(), approvalDrills.find(d => d.id === 'approval-retry').tests.find(t => t.id === 'AT-02'), 'transfer'],
]) {
  const run = createRun(graph, test);
  assert.equal(resultPhase(run), 'ready');
  step(run);
  assert.equal(resultPhase(run), 'running');
  while (run.tokens[0].status !== 'completed') step(run);
  assert.equal(run.state.effects.filter(e => e.type === eventType).length, 1);
  assert.equal(finish(run).pass, true);
  assert.equal(resultPhase(run), 'final');
  assert.equal(run.state.effects.filter(e => e.type === eventType).length, 1, 'second input must preserve the cumulative count');
  assert.deepEqual([...new Set(run.logs.map(log => log.inputIndex))], [1, 2]);
  assert.ok(run.logs.every(log => log.inputCount === 2 && inputLabel(log.inputEvent, run.graph)));
}
assert.equal(resultPhase({ status: 'waiting', step: 1 }), 'waiting');
assert.equal(resultPhase({ status: 'stopped', step: 1 }), 'final');
console.log('PASS: order/approval cumulative counts across both inputs, input labels and execution phases');
