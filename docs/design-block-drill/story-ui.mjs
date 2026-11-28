import { scenes, sceneVersions } from './story-data.mjs';
import { typeDialogue, dialogueParts } from './typewriter.mjs';
import { stages, chapterNames, readProgress, saveProgress, startStory, chapterUnlocked, completeStage } from './story.mjs';
const element = (tag, text, className) => { const e = document.createElement(tag); if (text) e.textContent = text; if (className) e.className = className; return e; };
const names = { player: 'あなた', sales: '営業・折原', lead: '先輩・真壁', client: '担当・佐伯', accountant: '経理・三田' };
const portraits = { player: { width: 1024, file: '01_player-transparent.png' }, sales: { width: 1024, file: '02_orihara-transparent.png' }, lead: { width: 1024, file: '03_makabe-transparent.png' }, client: { width: 1024, file: '04_saeki-transparent.png' }, accountant: { width: 1024, file: '05_mita-transparent.png' } };
const portraitCache = new Map();
function preparePortrait(id) {
  if (!portraitCache.has(id)) {
    const image = new Image();
    image.src = new URL(`assets/${portraits[id].file}`, import.meta.url).href;
    // Reuse the decoded image itself when its speaker first appears.
    const ready = image.decode().catch(() => {});
    portraitCache.set(id, { image, ready });
  }
  return portraitCache.get(id);
}
export function stageURL(id, story = false, replay = false) {
  const url = new URL(location.href); url.search = ''; url.searchParams.set('drill', id);
  if (story) url.searchParams.set('mode', 'story'); else url.searchParams.set('fresh', '1');
  if (replay) url.searchParams.set('replay', '1'); return url.href;
}
export function installStoryUI(drills, drill, storyMode, titleMode) {
  const title = document.querySelector('#titleScreen'), main = document.querySelector('main');
  title.hidden = !titleMode; main.hidden = false; document.querySelector('footer').hidden = false;
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
  const stage = stages.find(s => s.drillId === drill.id), panel = document.querySelector('#storyNavigation'); panel.hidden = titleMode;
  const menuToggle = document.querySelector('#headerMenuToggle'), menu = document.querySelector('#headerMenu');
  const mobileHeader = matchMedia('(max-width:800px)');
  const canvasHeading = document.querySelector('.canvas-heading');
  const navigationAnchor = document.createComment('Game navigation');
  panel.before(navigationAnchor);
  const canvasMenuDetails = element('div', undefined, 'canvas-menu-details');
  canvasMenuDetails.id = 'canvasMenuDetails';
  const canvasDetails = [...canvasHeading.children].filter(child => child.tagName !== 'H2');
  const desktopMenuItems = [...menu.children];
  const menuSummary = element('div', undefined, 'menu-summary');
  const menuMeta = element('div', undefined, 'menu-meta');
  const menuActions = element('div', undefined, 'menu-actions');
  const stageLabel = document.querySelector('#storyStageLabel'), intro = document.querySelector('#readStory');
  const reset = document.querySelector('#restore'), overview = document.querySelector('#showAssignment');
  const canvasActions = document.querySelector('.canvas-actions');
  stageLabel.textContent = `${stage.id} / 第${stage.chapter}章 ${chapterNames[stage.chapter]}`;
  menuSummary.append(menuMeta);
  menu.append(menuSummary, menuActions, canvasMenuDetails);
  function placeCanvasDetails() {
    if (mobileHeader.matches) canvasHeading.append(panel);
    else navigationAnchor.after(panel);
    canvasMenuDetails.hidden = !mobileHeader.matches;
    (mobileHeader.matches ? canvasMenuDetails : canvasHeading).append(...canvasDetails);
    menuSummary.hidden = menuActions.hidden = !mobileHeader.matches;
    canvasActions.hidden = mobileHeader.matches;
    stageLabel.hidden = !storyMode && !mobileHeader.matches;
    intro.hidden = false;
    intro.textContent = '導入';
    overview.textContent = '概要';
    reset.textContent = 'リセット';
    if (mobileHeader.matches) {
      menuSummary.prepend(home);
      menuMeta.append(document.querySelector('.badge'), stageLabel);
      menuActions.append(intro, overview, reset);
    } else {
      menu.prepend(...desktopMenuItems);
      intro.after(overview);
      canvasActions.append(reset);
    }
  }
  placeCanvasDetails();
  function setMenu(open, restoreFocus = false) {
    panel.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.onclick = () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  menu.addEventListener('click', event => {
    if (mobileHeader.matches && event.target.closest('button,a')) setMenu(false);
  });
  document.addEventListener('pointerdown', event => {
    if (panel.classList.contains('menu-open') && !panel.contains(event.target)) setMenu(false, menu.contains(document.activeElement));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('menu-open')) {
      event.preventDefault(); setMenu(false, true);
    }
  });
  mobileHeader.addEventListener('change', () => { setMenu(false); placeCanvasDetails(); });
  const hasClearScene = !!scenes[`${stage.id}.clear`]?.length;
  const proceed = () => { const following = stages[stages.indexOf(stage) + 1]; if (following) location.assign(stageURL(following.drillId, true)); else home.click(); };
  let active = false;
  async function dialogue(key, force = false, done = () => {}, extraLines) {
    if (active) return;
    const eventId = `${key}.v${sceneVersions[key] || 1}`, lines = extraLines || scenes[key];
    if (!lines?.length || (!force && readProgress().seenEvents.includes(eventId))) { done(); return; }
    const dialog = document.querySelector('#storyDialog'); let index = 0, writer; active = true;
    const text = document.querySelector('#storyText');
    const advance = document.querySelector('#storyAdvance');
    const positionNext = () => {
      if (advance.hidden || !dialog.open) return;
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      let last, node;
      while (node = walker.nextNode()) if (node.textContent.trim()) last = node;
      const range = document.createRange();
      if (last) range.selectNodeContents(last); else range.selectNodeContents(text);
      const line = [...range.getClientRects()].at(-1), bounds = text.getBoundingClientRect();
      const frame = advance.offsetParent.getBoundingClientRect(), half = advance.offsetHeight / 2;
      const center = line ? (line.top + line.bottom) / 2 : bounds.top + half;
      advance.style.top = `${Math.max(bounds.top + half, Math.min(center, bounds.bottom - half)) - frame.top - 1 - half}px`;
    };
    const sizeText = () => {
      const shown = [...text.childNodes];
      text.replaceChildren(...dialogueParts(lines[index].text).map(part => {
        if (!part.strong) return document.createTextNode(part.text);
        return element('strong', part.text);
      }));
      text.style.height = 'auto';
      text.style.height = `${Math.ceil(Math.max(text.getBoundingClientRect().height, text.scrollHeight)) + 1}px`;
      const css = getComputedStyle(text), frame = getComputedStyle(text.closest('.story-window'));
      const baseline = Math.ceil(parseFloat(css.lineHeight)) + 1 + ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((sum, key) => sum + parseFloat(frame[key]), 0);
      dialog.style.setProperty('--story-baseline', `${baseline}px`);
      text.replaceChildren(...shown);
      positionNext();
    };
    window.addEventListener('resize', sizeText);
    document.fonts?.addEventListener('loadingdone', sizeText);
    text.addEventListener('scroll', positionNext);
    const imagesReady = Promise.all([...new Set(lines.map(line => line.speaker))].filter(id => portraits[id]).map(id => preparePortrait(id).ready));
    // A missing or stalled asset must not prevent the conversation from opening.
    let loadingTimeout;
    await Promise.race([imagesReady, new Promise(resolve => { loadingTimeout = setTimeout(resolve, 5000); })]);
    clearTimeout(loadingTimeout);
    const cast = document.querySelector('#storyCast');
    // Fixed seats around the table, independent of the order of dialogue.
    const seatRows = [['player', 'lead', 'sales'], ['accountant', 'client']]
      .map(row => row.filter(id => lines.some(line => line.speaker === id)));
    const participants = seatRows.flat();
    let lastCameraRow = null, cameraTrail;
    const clearCameraTrail = () => {
      cameraTrail?.getAnimations().forEach(animation => animation.cancel());
      cameraTrail?.remove(); cameraTrail = null;
    };
    cast.replaceChildren();
    cast.style.setProperty('--cast-count', String(participants.length));
    for (const id of participants) {
      const portrait = preparePortrait(id).image; portrait.className = 'story-portrait'; portrait.dataset.speaker = id;
      const { width } = portraits[id];
      portrait.alt = names[id]; portrait.width = width; portrait.height = 1536;
      portrait.style.aspectRatio = `${width} / 1536`;
      portrait.dataset.side = seatRows[0].includes(id) ? 'supplier' : 'client';
      cast.append(portrait);
    }
    const finish = () => {
      writer?.destroy();
      clearCameraTrail();
      cast.querySelectorAll('.story-portrait').forEach(portrait => portrait.getAnimations().forEach(animation => animation.cancel()));
      window.removeEventListener('resize', sizeText);
      document.fonts?.removeEventListener('loadingdone', sizeText);
      text.removeEventListener('scroll', positionNext);
      const saved = readProgress(); if (!saved.seenEvents.includes(eventId)) saved.seenEvents.push(eventId);
      if (key === `${stage.id}.clear`) saved.pendingClear = null;
      if (key === 'palette') saved.seenEvents.push('palette.v1'); saveProgress(saved);
      active = false; dialog.close(); done();
    };
    const render = () => {
      clearCameraTrail();
      const cameraRow = seatRows.findIndex(row => row.includes(lines[index].speaker));
      const turning = lastCameraRow !== null && cameraRow !== lastCameraRow;
      const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
      const turnDirection = cameraRow === 1 ? 1 : -1;
      const travel = Math.max(240, cast.clientWidth * .85);
      if (turning && motion) {
        const bounds = cast.getBoundingClientRect();
        cameraTrail = element('div', undefined, 'story-camera-trail');
        cameraTrail.setAttribute('aria-hidden', 'true');
        // Freeze the outgoing view so the new side can slide in independently.
        cast.querySelectorAll('.story-portrait:not(.across-table)').forEach(portrait => {
          const rect = portrait.getBoundingClientRect(), ghost = element('div');
          Object.assign(ghost.style, {
            left: `${rect.left - bounds.left}px`, top: `${rect.top - bounds.top}px`,
            width: `${rect.width}px`, height: `${rect.height}px`,
            backgroundImage: `url("${portrait.currentSrc || portrait.src}")`,
            filter: getComputedStyle(portrait).filter,
          });
          cameraTrail.append(ghost);
        });
        cast.append(cameraTrail);
        const outgoing = cameraTrail;
        outgoing.animate([
          { transform: 'translateX(0)', filter: 'blur(0px)', opacity: 1 },
          { transform: `translateX(${-turnDirection * travel}px)`, filter: 'blur(22px)', opacity: 0 },
        ], { duration: 180, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' }).finished
          .then(() => { outgoing.remove(); if (cameraTrail === outgoing) cameraTrail = null; }).catch(() => {});
      }
      const previousCast=new Map([...cast.querySelectorAll('.story-portrait:not(.across-table)')].map(portrait=>[portrait.dataset.speaker,portrait.getBoundingClientRect()]));
      cast.querySelectorAll('.story-portrait').forEach(portrait=>portrait.getAnimations().forEach(animation=>animation.cancel()));
      writer?.destroy(); const line = lines[index], button = document.querySelector('#storyAdvance');
      document.querySelector('#storySpeaker').textContent = names[line.speaker] || line.speaker;
      const speakerRow = seatRows[cameraRow] || [];
      const speakerSeat = speakerRow.indexOf(line.speaker) - (speakerRow.length - 1) / 2;
      cast.style.setProperty('--seat-span', String(Math.max(1, ...speakerRow.map((_, seat) => Math.abs(seat - speakerRow.indexOf(line.speaker))))));
      const direction = cameraRow === 1 ? -1 : 1;
      cast.dataset.cameraSide = cameraRow === 1 ? 'client' : 'supplier';
      cast.querySelectorAll('.story-portrait').forEach(portrait => {
        const rowIndex = seatRows.findIndex(row => row.includes(portrait.dataset.speaker));
        const row = seatRows[rowIndex];
        const seat = row.indexOf(portrait.dataset.speaker) - (row.length - 1) / 2;
        const across = rowIndex !== cameraRow;
        // A camera at the table's center sees only the row it is facing.
        portrait.style.setProperty('--seat-offset', String((seat - speakerSeat) * direction));
        portrait.classList.toggle('across-table', across);
        const speaking = portrait.dataset.speaker === line.speaker;
        portrait.classList.toggle('speaking', speaking);
        if (speaking) portrait.id = 'storyPortrait'; else portrait.removeAttribute('id');
      });
      if(motion){
        cast.querySelectorAll('.story-portrait:not(.across-table)').forEach(portrait=>{
          const before=previousCast.get(portrait.dataset.speaker),after=portrait.getBoundingClientRect();
          if(turning){
            const tone = getComputedStyle(portrait).filter;
            portrait.animate([
              { transform: `translateX(calc(-50% + ${turnDirection * travel}px))`, filter: `blur(22px) ${tone}`, opacity: 0 },
              { transform: `translateX(calc(-50% + ${turnDirection * travel * .18}px))`, filter: `blur(10px) ${tone}`, opacity: 1, offset: .45 },
              { transform: 'translateX(-50%)', filter: `blur(0px) ${tone}`, opacity: 1 },
            ], { duration: 300, delay: 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
          }
          else if(!before)portrait.animate([{opacity:0},{opacity:1}],{duration:360,easing:'ease-out'});
          else if(after.width)portrait.animate([
            {transform:`translateX(calc(-50% + ${before.left+before.width/2-after.left-after.width/2}px)) scale(${before.width/after.width})`},
            {transform:'translateX(-50%) scale(1)'}
          ],{duration:480,easing:'cubic-bezier(0.16,1,0.3,1)'});
        });
      }
      lastCameraRow = cameraRow;
      document.querySelector('#storyPage').textContent = `${index + 1} / ${lines.length}`;
      button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg>';
      button.setAttribute('aria-label', index + 1 === lines.length ? '会話を閉じる' : '次へ');
      button.hidden = true;
      sizeText();
      writer = typeDialogue(text, line.text, { onComplete: () => { button.hidden = false; positionNext(); } });
    };
    document.querySelector('#storyAdvance').onclick = () => { if (writer?.typing) { writer.finish(); return; } if (index + 1 < lines.length) { index++; render(); } else finish(); };
    dialog.onclick = event => {
      if (event.target.closest('button')) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom || event.target !== dialog) document.querySelector('#storyAdvance').click();
    };
    document.querySelector('#storySkip').onclick = finish; dialog.oncancel = e => { e.preventDefault(); finish(); }; dialog.showModal(); render();
  }
  function tutorial() {
    if (drill.chapter === 2 && !readProgress().seenEvents.includes('palette.v1')) dialogue('palette', false, undefined, [{ speaker: 'lead', text: 'パレットの部品を盤面へドラッグして配置できます。「配置」ボタンでも追加できます。配置後はブロックを選び、接続を設定してください。' }]);
  }
  intro.onclick = () => { document.querySelector('#pause').click(); dialogue(`${stage.id}.intro`, true); };
  if (storyMode) {
    const saved = readProgress(); saved.started = true; saved.currentStage = stage.id; saveProgress(saved);
    document.querySelector('#storyStageLabel').textContent = `${stage.id} / 第${stage.chapter}章 ${chapterNames[stage.chapter]}`;
    if (hasClearScene && saved.pendingClear === stage.id) dialogue(`${stage.id}.clear`, true, proceed);
    else dialogue(`${stage.id}.intro`, true, tutorial);
    if (new URLSearchParams(location.search).has('replay')) { const url = new URL(location.href); url.searchParams.delete('replay'); history.replaceState(null, '', url.href); }
  }
  let clearPending = false;
  document.querySelector('#batchResult').addEventListener('close', () => { if (clearPending) { clearPending = false; if (hasClearScene) dialogue(`${stage.id}.clear`, true, proceed); else proceed(); } });
  document.documentElement.classList.remove('booting');
  return { onClear() { if (!storyMode) return; completeStage(drill.id); clearPending = true; } };
}
