export const stages = ['order-basics', 'cancel-consistency', 'shared-stock', 'order-system', 'approval-basics', 'approval-return', 'approval-retry', 'approval-system'].map((drillId, i) => ({ drillId, id: `${i < 4 ? '01' : '02'}-0${i % 4 + 1}`, chapter: i < 4 ? 1 : 2 }));
export const chapterNames = { 1: '注文システム', 2: '経費精算・承認' };
export const STORY_KEY = 'design-block-drill.story.v1';
let memory;
export function cleanProgress(value) {
  const ids = stages.map(s => s.id);
  const knownEvent = id => typeof id === 'string' && (id === 'palette.v1' || ids.some(stage => new RegExp(`^${stage}\\.(intro|clear)\\.v[1-9][0-9]*$`).test(id)));
  return { completedStages: [...new Set((Array.isArray(value?.completedStages) ? value.completedStages : []).filter(id => ids.includes(id)))], seenEvents: [...new Set((Array.isArray(value?.seenEvents) ? value.seenEvents : []).filter(id => knownEvent(id)))], currentStage: ids.includes(value?.currentStage) ? value.currentStage : ids[0], pendingClear: value?.pendingClear === ids.at(-1) ? value.pendingClear : null, started: value?.started === true };
}
export function readProgress() { let saved; try { saved = localStorage.getItem(STORY_KEY); } catch {} if (!saved) { try { saved = sessionStorage.getItem(STORY_KEY); } catch {} } if (saved) { try { memory = cleanProgress(JSON.parse(saved)); } catch {} } return cleanProgress(memory); }
export function saveProgress(value) { memory = cleanProgress(value); try { localStorage.setItem(STORY_KEY, JSON.stringify(memory)); } catch { try { sessionStorage.setItem(STORY_KEY, JSON.stringify(memory)); } catch {} } return memory; }
export function storyAllowed(stage, progress = readProgress()) { const index = stages.indexOf(stage); return index === 0 || (index > 0 && progress.completedStages.includes(stages[index - 1].id)); }
export function resolveStoryDrill(id, progress = readProgress()) {
  if (!id && progress.pendingClear) return stages.find(s => s.id === progress.pendingClear).drillId;
  const stage = stages.find(s => s.drillId === id);
  if (stage && storyAllowed(stage, progress)) return id;
  return stages.find(s => s.id === progress.currentStage && storyAllowed(s, progress))?.drillId || stages.find(s => !progress.completedStages.includes(s.id) && storyAllowed(s, progress))?.drillId || stages[0].drillId;
}
export function chapterUnlocked(chapter, progress = readProgress()) { return chapter === 1 || progress.completedStages.includes(stages.filter(s => s.chapter === chapter).at(-1)?.id); }
export function startStory(fromBeginning = false) {
  const p = readProgress(); p.started = true;
  if (fromBeginning) { p.currentStage = stages[0].id; p.pendingClear = null; }
  return saveProgress(p);
}
export function completeStage(drillId) {
  const p = readProgress(), stage = stages.find(s => s.drillId === drillId);
  if (!stage || !storyAllowed(stage, p)) return p;
  if (!p.completedStages.includes(stage.id)) p.completedStages.push(stage.id);
  p.pendingClear = stage === stages.at(-1) ? stage.id : null;
  p.currentStage = stages[Math.min(stages.indexOf(stage) + 1, stages.length - 1)].id; p.started = true;
  return saveProgress(p);
}
