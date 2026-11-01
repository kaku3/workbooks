import { scenes, sceneVersions } from './story-data.mjs';
import { typeDialogue } from './typewriter.mjs';
import { stages, chapterNames, readProgress, saveProgress, startStory, chapterUnlocked, completeStage } from './story.mjs';
const element = (tag, text, className) => { const e = document.createElement(tag); if (text) e.textContent = text; if (className) e.className = className; return e; };
const names = { player: 'あなた', sales: '営業・折原', lead: '先輩・真壁', client: '担当・佐伯', accountant: '経理・三田' };
export function stageURL(id, story = false, replay = false) {
  const url = new URL(location.href); url.search = ''; url.searchParams.set('drill', id);
  if (story) url.searchParams.set('mode', 'story'); if (replay) url.searchParams.set('replay', '1'); return url.href;
}
export function installStoryUI(drills, drill, storyMode, titleMode) {
  const title = document.querySelector('#titleScreen'), main = document.querySelector('main'), header = document.querySelector('body>header');
  title.hidden = !titleMode; main.hidden = titleMode; header.hidden = titleMode; document.querySelector('footer').hidden = titleMode;
  function link(text, id, story = false) { const a = element('a', text, 'mode-link'); a.href = stageURL(id, story); return a; }
  const p = readProgress();
  const continueButton = document.querySelector('#continueStory'); continueButton.hidden = !p.started;
  continueButton.onclick = () => { const saved = startStory(); const target = stages.find(s => s.id === (saved.pendingClear || saved.currentStage)) || stages[0]; location.assign(stageURL(target.drillId, true)); };
  document.querySelector('#newStory').onclick = () => { startStory(true); location.assign(stageURL(stages[0].drillId, true, true)); };
  const chapters = document.querySelector('#chapterList');
  for (const chapter of [...new Set(stages.map(s => s.chapter))]) {
    const card = element('section', undefined, 'chapter-card'), list = stages.filter(s => s.chapter === chapter), unlocked = chapterUnlocked(chapter, p);
    card.append(element('h3', `第${chapter}章 ${unlocked ? chapterNames[chapter] : '?????'}`));
    if (unlocked) list.forEach(stage => card.append(link(`${p.completedStages.includes(stage.id) ? '✓ ' : ''}${stage.id} ${drills.find(d => d.id === stage.drillId).title}`, stage.drillId)));
    else card.append(element('p', `${list.length}ステージ 🔒 この章の総合をストーリーでクリアすると解放`));
    chapters.append(card);
  }
  const home = document.querySelector('#backToTitle'); home.onclick = () => { const url = new URL(location.href); url.search = ''; location.assign(url.href); };
  const stage = stages.find(s => s.drillId === drill.id), panel = document.querySelector('#storyNavigation'); panel.hidden = !storyMode;
  const next = document.querySelector('#nextStage');
  const finalStage = stage === stages.at(-1);
  const proceed = () => { const following = stages[stages.indexOf(stage) + 1]; if (following) location.assign(stageURL(following.drillId, true)); else home.click(); };
  function showNext() {
    if (!storyMode) return;
    const saved = readProgress(); next.hidden = !saved.completedStages.includes(stage.id);
    const following = stages[stages.indexOf(stage) + 1]; next.textContent = following ? '次のステージへ →' : 'ここまでクリア！ タイトルへ';
    next.onclick = () => following ? location.assign(stageURL(following.drillId, true)) : home.click();
  }
  let active = false;
  function dialogue(key, force = false, done = showNext, extraLines) {
    if (active) return;
    const eventId = `${key}.v${sceneVersions[key] || 1}`, lines = extraLines || scenes[key];
    if (!lines?.length || (!force && readProgress().seenEvents.includes(eventId))) { done(); return; }
    const dialog = document.querySelector('#storyDialog'); let index = 0, writer; active = true;
    const finish = () => {
      writer?.destroy();
      const saved = readProgress(); if (!saved.seenEvents.includes(eventId)) saved.seenEvents.push(eventId);
      if (key === `${stage.id}.clear`) saved.pendingClear = null;
      if (key === 'palette') saved.seenEvents.push('palette.v1'); saveProgress(saved);
      active = false; dialog.close(); done();
    };
    const render = () => {
      writer?.destroy(); const line = lines[index], button = document.querySelector('#storyAdvance');
      document.querySelector('#storySpeaker').textContent = names[line.speaker] || line.speaker;
      document.querySelector('#storyPage').textContent = `${index + 1} / ${lines.length}`;
      button.textContent = '全文表示';
      writer = typeDialogue(document.querySelector('#storyText'), line.text, { onComplete: () => { button.textContent = index + 1 === lines.length ? '閉じる' : '次へ'; } });
    };
    document.querySelector('#storyAdvance').onclick = () => { if (writer?.typing) { writer.finish(); return; } if (index + 1 < lines.length) { index++; render(); } else finish(); };
    document.querySelector('#storySkip').onclick = finish; dialog.oncancel = e => { e.preventDefault(); finish(); }; render(); dialog.showModal();
  }
  function tutorial() {
    if (drill.chapter === 2 && !readProgress().seenEvents.includes('palette.v1')) dialogue('palette', false, showNext, [{ speaker: 'lead', text: 'パレットの部品を盤面へドラッグして配置できます。「配置」ボタンでも追加できます。配置後はブロックを選び、接続を設定してください。' }]);
    else showNext();
  }
  if (storyMode) {
    const saved = readProgress(); saved.started = true; saved.currentStage = stage.id; saveProgress(saved);
    document.querySelector('#storyStageLabel').textContent = `${stage.id} / 第${stage.chapter}章 ${chapterNames[stage.chapter]}`;
    document.querySelector('#readStory').onclick = () => { document.querySelector('#pause').click(); dialogue(`${stage.id}.intro`, true); };
    if (finalStage && saved.pendingClear === stage.id) dialogue(`${stage.id}.clear`, true, proceed);
    else dialogue(`${stage.id}.intro`, true, tutorial);
    if (new URLSearchParams(location.search).has('replay')) { const url = new URL(location.href); url.searchParams.delete('replay'); history.replaceState(null, '', url.href); }
    showNext();
  }
  let clearPending = false;
  document.querySelector('#batchResult').addEventListener('close', () => { if (clearPending) { clearPending = false; if (finalStage) dialogue(`${stage.id}.clear`, true, proceed); else proceed(); } });
  return { onClear() { if (!storyMode) return; completeStage(drill.id); clearPending = true; }, showNext };
}
