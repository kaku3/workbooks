import { scenes, sceneVersions } from './story-data.mjs';
import { typeDialogue } from './typewriter.mjs';
import { stages, chapterNames, readProgress, saveProgress, startStory, chapterUnlocked, completeStage } from './story.mjs';
const element = (tag, text, className) => { const e = document.createElement(tag); if (text) e.textContent = text; if (className) e.className = className; return e; };
const names = { player: 'あなた', sales: '営業・折原', lead: '先輩・真壁', client: '担当・佐伯', accountant: '経理・三田' };
const portraits = { player: { width: 1024, file: '01_player-transparent.png' }, sales: { width: 1024, file: '02_orihara-transparent.png' }, lead: { width: 1024, file: '03_makabe-transparent.png' }, client: { width: 1024, file: '04_saeki-transparent.png' }, accountant: { width: 1024, file: '05_mita-transparent.png' } };
export function stageURL(id, story = false, replay = false) {
  const url = new URL(location.href); url.search = ''; url.searchParams.set('drill', id);
  if (story) url.searchParams.set('mode', 'story'); if (replay) url.searchParams.set('replay', '1'); return url.href;
}
export function installStoryUI(drills, drill, storyMode, titleMode) {
  const title = document.querySelector('#titleScreen'), main = document.querySelector('main'), header = document.querySelector('body>header');
  title.hidden = !titleMode; main.hidden = false; header.hidden = false; document.querySelector('footer').hidden = false;
  document.documentElement.classList.toggle('title-overlay-active', titleMode);
  function link(text, id, story = false) { const a = element('a', text, 'mode-link'); a.href = stageURL(id, story); return a; }
  const p = readProgress();
  const continueButton = document.querySelector('#continueStory'); continueButton.hidden = !p.started;
  continueButton.onclick = () => { const saved = startStory(); const target = stages.find(s => s.id === (saved.pendingClear || saved.currentStage)) || stages[0]; location.assign(stageURL(target.drillId, true)); };
  document.querySelector('#newStory').onclick = () => { startStory(true); location.assign(stageURL(stages[0].drillId, true, true)); };
  const chapters = document.querySelector('#chapterList');
  for (const chapter of [...new Set(stages.map(s => s.chapter))]) {
    const card = element('section', undefined, 'chapter-card'), list = stages.filter(s => s.chapter === chapter), unlocked = chapterUnlocked(chapter, p);
    card.append(element('h3', `第${chapter}章 ${unlocked ? chapterNames[chapter] : '?????'}`));
    if (unlocked) list.forEach(stage => card.append(link(`${stage.id} ${drills.find(d => d.id === stage.drillId).title}`, stage.drillId)));
    else {
      const condition = element('p', 'ストーリークリアで解放', 'chapter-locked');
      const lock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lock.setAttribute('viewBox', '0 0 24 24');
      lock.setAttribute('aria-hidden', 'true');
      lock.setAttribute('focusable', 'false');
      const shape = document.createElementNS(lock.namespaceURI, 'path');
      shape.setAttribute('d', 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zM12 14v3');
      lock.append(shape); condition.prepend(lock); card.append(condition);
    }
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
    const cast = document.querySelector('#storyCast'), speakerIds = ['player', 'sales', 'lead', 'client', 'accountant'];
    const participants = [];
    cast.replaceChildren();
    function revealSpeaker(id) {
      if (!speakerIds.includes(id) || participants.includes(id)) return;
      participants.push(id);
      cast.style.setProperty('--cast-count', String(participants.length));
      const totalWidth = participants.reduce((sum, id) => sum + portraits[id].width, 0);
      cast.style.gridTemplateColumns = participants.map(id => `minmax(0,${portraits[id].width}fr)`).join(' ');
      const castHeight = participants.length > 1 ? 480 : 640;
      cast.style.width = `min(80%, ${totalWidth * castHeight / 1536}px, ${totalWidth * 64 / 1536}vh)`;
      const portrait = element('img', undefined, 'story-portrait'); portrait.dataset.speaker = id;
      const { width, file } = portraits[id];
      portrait.src = new URL(`assets/${file}`, import.meta.url).href;
      portrait.alt = names[id]; portrait.width = width; portrait.height = 1536;
      portrait.style.aspectRatio = `${width} / 1536`;
      cast.append(portrait);
    }
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
      revealSpeaker(line.speaker);
      cast.querySelectorAll('.story-portrait').forEach(portrait => {
        const speaking = portrait.dataset.speaker === line.speaker;
        portrait.classList.toggle('speaking', speaking);
        if (speaking) portrait.id = 'storyPortrait'; else portrait.removeAttribute('id');
      });
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
  document.documentElement.classList.remove('booting');
  return { onClear() { if (!storyMode) return; completeStage(drill.id); clearPending = true; }, showNext };
}
