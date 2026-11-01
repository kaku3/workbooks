import assert from 'node:assert/strict';
import { stages, readProgress, saveProgress, startStory, completeStage, storyAllowed, resolveStoryDrill, chapterUnlocked, cleanProgress } from '../src/story.mjs';
import { scenes, sceneVersions } from '../src/story-data.mjs';
const store = new Map(); globalThis.localStorage = { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v) };
assert.equal(chapterUnlocked(1), true); assert.equal(chapterUnlocked(2), false);
assert.equal(storyAllowed(stages[1]), false);
assert.equal(resolveStoryDrill('approval-system'), 'order-basics');
startStory(true);
for (const stage of stages) {
  assert.equal(storyAllowed(stage), true);
  for (const timing of stage === stages.at(-1) ? ['intro', 'clear'] : ['intro']) {
    const key = `${stage.id}.${timing}`, lines = scenes[key]; assert.ok(lines.length >= 1 && lines.length <= 8);
    assert.ok(Number.isInteger(sceneVersions[key]) && sceneVersions[key] > 0);
    assert.ok(lines.every(l => l.speaker && l.text));
  }
  completeStage(stage.drillId);
}
assert.equal(readProgress().completedStages.length, 8);
assert.equal(chapterUnlocked(2), true);
completeStage(stages[0].drillId); assert.equal(readProgress().completedStages.length, 8);
const saved = readProgress(); saved.seenEvents.push('01-01.intro.v1'); saveProgress(saved);
startStory(true); assert.equal(readProgress().completedStages.length, 8); assert.ok(readProgress().seenEvents.includes('01-01.intro.v1'));
assert.equal(readProgress().currentStage, '01-01');
assert.deepEqual(cleanProgress({ completedStages: ['bogus'], seenEvents: [1], currentStage: 'bogus' }).completedStages, []);
assert.deepEqual(cleanProgress({ seenEvents: ['01-02.intro.v1', '01-02.intro.v2'] }).seenEvents, ['01-02.intro.v1', '01-02.intro.v2']);
console.log(`PASS: eight required intros, final clear, ${Object.keys(scenes).length} authored scenes, event versions, unlocks and preserved progress`);
