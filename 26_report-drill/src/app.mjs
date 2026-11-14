import { problem, scenario } from './data/content.mjs';
import { createEngine, clock, minutes, duration } from './engine.mjs';
import { findTimeSavings, playTimeSavings } from './cost-effects.mjs';
import { buildChatFeed } from './chat-feed.mjs';
import { playClueAcquisition } from './clue-effects.mjs';

const engine = createEngine(problem, scenario);
const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const storageKey = 'report-drill.pdf-incident.v1';
const names = Object.fromEntries(scenario.characters.map(item => [item.id, item.name]));
const initials = { player: '私', sales: '佐', lead: '真', client: '客', ai: 'AI' };
const portraitFiles = { 主人公: '01_player', あなた: '01_player', 折原: '02_orihara', 真壁: '03_makabe', 佐伯: '04_saeki', 三田: '05_mita' };
const kindNames = { confirmed: '確認済み', reference: '参考情報', proposal: '提案・未検証' };
const icons = {
  robot: '<rect x="4" y="7" width="16" height="14" rx="3"/><path d="M12 3v4M2 12v5M22 12v5M8 17h8"/><circle cx="12" cy="3" r="1"/><circle cx="8" cy="12" r="1"/><circle cx="16" cy="12" r="1"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  chat: '<path d="M4 4h16v12H9l-5 4z"/><path d="M8 8h8M8 12h5"/>',
  coffee: '<path d="M4 9h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 10h2a3 3 0 0 1 0 6h-2M7 3v3M12 3v3"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  book: '<path d="M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3zM12 6v15"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  business: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12a20 20 0 0 0 18 0M12 12v4"/>',
  system: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  intuition: '<path d="M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4M12 1v2M3 5l2 2M19 7l2-2"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.file}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
let state = null, saved = null, saveError = '', page = 'title', tab = 'investigate';
let modalAction = null, lastFocus = null, typeTimer, typed = true, lastChatCount = 0, unread = 0;
let chatScroll = 0, chatBottom = true;
let mobilePanel = 'desk';
let deckOpen=false;
let visualState = null, pendingEffects = [];
let seenFeedKeys = null;
let pendingClues = new Set(), stopClueEffects = null;
const awaitingClues = new Set();
const visibleClueCount = () => state.evidence.filter(id=>!awaitingClues.has(id)).length;
function storeClue(id) {
  awaitingClues.delete(id);
  document.querySelectorAll('[data-clue-id]').forEach(card=>{
    if(card.dataset.clueId===id){card.classList.remove('clue-awaiting');card.removeAttribute('aria-hidden');}
  });
  document.querySelectorAll('.deck-handle>span').forEach(count=>count.textContent=visibleClueCount());
}
let pendingSavings = new Map(), deferredSavings = new Map(), stopCostEffects = null;

function reportOptions() {
  const cost=Math.min(5,Math.max(0,engine.deadline-state.time));
  const time=cost>0?`<span>${duration(cost)}</span>`:'';
  return `<div class="status-report-options">${button('progress-report',`<strong>途中経過を報告</strong>${time}`,'status-report-card')}${button('cannot-report',`<strong>終わりません報告</strong>${time}`,'status-report-card cannot')}</div>`;
}
function statusEffects() {
  if(page!=='game'||!state)pendingClues.clear();
  if (page !== 'game' || !state) { visualState=null; pendingEffects=[]; pendingSavings.clear();deferredSavings.clear();return; }
  if (visualState && visualState.loop === state.loop) {
    for(const saving of findTimeSavings(engine,problem,visualState,state)) {
      const effect={...saving,sourceId:state.conversation?.actionId};
      const previous=pendingSavings.get(saving.id);
      if(previous) { effect.from=previous.from;effect.saved=effect.from-effect.to; }
      pendingSavings.set(saving.id,effect);
    }
    for (const key of ['business','system']) {
      const gain=state.knowledge[key]-visualState.knowledge[key];
      if(gain>0) pendingEffects.push({selector:'.knowledge'});
    }
    const clues=state.evidence.filter(id=>!visualState.evidence.includes(id));
    for(const id of clues)pendingClues.add(id);
    if(clues.length) pendingEffects.push({selector:'.deck-handle'});
    const unlocked=problem.investigations.filter(action=>!engine.matches(action.unlock,visualState)&&engine.matches(action.unlock,state)).length;
    if(unlocked)pendingEffects.push({selector:'.kanban'});
    if(state.intuition>visualState.intuition) pendingEffects.push({selector:'.knowledge'});
    if(state.time>visualState.time) pendingEffects.push({selector:'.time-status'});
    for (const action of problem.investigations) {
      const before=engine.cardStatus(visualState,action.id),after=engine.cardStatus(state,action.id);
      if(before!==after) pendingEffects.push({selector:`[data-card-id="${action.id}"]`});
    }
  } else {pendingEffects=[];pendingSavings.clear();deferredSavings.clear();pendingClues.clear();}
  visualState=structuredClone(state);
  for(const id of awaitingClues)pendingClues.add(id);
  if(state.phase==='scene')return;
  if(pendingClues.size){
    const cards=problem.evidence.filter(card=>pendingClues.has(card.id));
    pendingClues.clear();
    stopClueEffects=playClueAcquisition(cards,{renderCard:card=>evidenceCard(card),onStored:storeClue,reduced:Boolean(state.settings.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches)});
  }
  for(const [id,saving] of deferredSavings) {
    const action=problem.investigations.find(item=>item.id===id);
    if(action && engine.matches(action.unlock,state) && document.querySelector(`[data-card-id="${id}"]`)) {
      pendingSavings.set(id,{...saving,revealed:true});deferredSavings.delete(id);
    }
  }
  const savings=[...pendingSavings.values()];pendingSavings.clear();
  for(const saving of savings) {
    if(!saving.revealed)deferredSavings.set(saving.id,saving);
    pendingEffects.push({selector:saving.revealed?`[data-card-id="${saving.id}"]`:'.knowledge'});
  }
  if(!pendingEffects.length)return;
  const effects=pendingEffects;pendingEffects=[];
  for(const effect of effects)document.querySelectorAll(effect.selector).forEach(item=>item.classList.add('status-changed'));
  if(savings.some(saving=>saving.revealed))stopCostEffects=playTimeSavings(savings.filter(saving=>saving.revealed),{format:duration,reduced:Boolean(state.settings.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches)});
}

try { const raw = localStorage.getItem(storageKey); if (raw) saved = engine.restore(raw); }
catch (error) { saveError = `保存記録を読み込めません。${error.message} 再開始する場合は「はじめから」を選んでください。`; }

function save() {
  if (!state) return;
  try { localStorage.setItem(storageKey, JSON.stringify(state)); saved = structuredClone(state); saveError = ''; }
  catch { saveError = 'このブラウザには保存できません。閉じると今回の続きが失われます。'; }
}
function notify(text) { document.querySelector('#notice').textContent = text; }
function button(action, text, className = '', extra = '') { return `<button type="button" data-action="${action}" class="${className}" ${extra}>${text}</button>`; }
function avatar(speaker, large = false) { return `<span class="avatar ${speaker} ${large ? 'large' : ''}" aria-hidden="true">${initials[speaker] || '人'}</span>`; }
function resetChat() { lastChatCount = 0; unread = 0; chatScroll = 0; chatBottom = true; mobilePanel='desk'; seenFeedKeys=null; }
function showMobilePanel(panel) {
  mobilePanel=panel;
  document.querySelector('.desktop')?.classList.toggle('show-chat',panel==='chat');
  for(const button of document.querySelectorAll('.mobile-tabs [data-action^="panel:"]')) {
    const active=button.dataset.action===`panel:${panel}`;
    button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  }
  if(panel==='chat'){const chat=document.querySelector('.chat-scroll');if(chat)chat.scrollTop=chatBottom?chat.scrollHeight:chatScroll;}
}
function start(nextLoop = false) {
  deckOpen=false;
  visualState=null;pendingEffects=[];
  pendingSavings.clear();deferredSavings.clear();
  state = engine.start(state || saved || {}, nextLoop);
  page = 'game'; tab = 'investigate'; resetChat(); save(); render();
}
function header() {
  return `<header class="topbar"><button class="brand" data-action="title"><span class="brand-mark">${icon('file')}</span><span>確認して、回答します。<small>INVESTIGATION & REPORT</small></span></button><div class="top-right"><span class="prototype"><i></i> PROTOTYPE · 第1面</span>${button('settings', icon('settings'), 'icon-button', 'aria-label="設定"')}</div></header>`;
}
function titlePage() {
  return `${header()}<main class="title-page"><div class="title-copy"><p class="eyebrow">A SMALL ADVENTURE AT WORK</p><p class="title-pre">調べて、考えて、相手の問いに答える。</p><h1>確認して、<br>回答します<span>。</span></h1><p class="title-desc">依頼は曖昧。資料は長い。先輩は忙しい。<br>ここは、少々おかしなSES会社。<br>今日も「確認します」から、一日が始まる。</p><div class="title-actions">${button('start', `はじめる ${icon('arrow')}`, 'primary')}${button('continue', 'つづきから', 'secondary', !saved ? 'disabled' : '')}</div><p class="muted tiny">読む時間では時計は進みません。自分のペースでどうぞ。</p>${saveError ? `<p class="warning">${esc(saveError)}</p>` : ''}</div><aside class="title-case"><div class="case-paper"><span class="paper-label">本日の依頼 / CASE 01</span><div class="paper-symbol">${icon('file')}</div><h2>ウォーターマークの<br>誤表示</h2><p>「三田が印刷したのに、<br>透かしは田中太郎？」</p><div class="paper-line"></div><div class="paper-bottom"><span>依頼者：発注担当 佐伯</span><span>回答期限 <strong>今日 17:00</strong></span></div></div><div class="sticky-note">まず、何を知れば<br>答えられるんだろう。</div><span class="desk-caption">YOUR DESK, SOMEWHERE IN AN SES COMPANY.</span></aside></main><footer class="title-footer"><span>調査・報告ドリル</span><span>01 / 04 CASES <span class="muted">— 続きの案件は準備中</span></span></footer>`;
}
function stats() {
  return `<section class="panel memo"><p class="eyebrow">REQUEST MEMO</p><h2>今日、頼まれたこと</h2><p>${esc(problem.requestMemo)}</p></section><section class="panel knowledge"><div class="section-label">STATUS</div>${[['business','業務知識'],['system','システム知識'],['intuition','直感']].map(([key,label])=>{ const value = key === 'intuition' ? state.intuition : state.knowledge[key]; const max = key === 'intuition' ? problem.intuition.max : problem.knowledge[key].max; return `<div class="stat" data-stat="${key}"><div><span class="stat-label">${icon(key)}${label}</span><small>${value} / ${max}</small></div><div class="pips">${Array.from({length:max},(_,i)=>`<i class="${i<value?'filled':''}"></i>`).join('')}</div></div>`; }).join('')}<p class="tiny muted">${state.loop > 1 ? '昨日の調査が、今日の出発点。' : '調べるほど、見えるものが増えていく。'}</p></section>${state.memories.length ? `<section class="panel memories"><p class="eyebrow">DÉJÀ VU</p><h3>前日の調査メモ</h3>${state.memories.map(id=>`<p>${esc(problem.evidence.find(card=>card.id===id).title)}</p>`).join('')}<small>調べた手がかりは引き継いでいます。</small></section>` : ''}`;
}
function actionPlan(action) {
  const question = action.questionOptions?.filter(item=>engine.matches(item.unlock,state)).at(-1)?.id;
  return engine.preview(state,action.id,question);
}
function actionIcon(id) { return id.includes('makabe') || id.includes('check') ? 'chat' : id.includes('ai') || id.includes('logs') || id.includes('source') ? 'search' : 'file'; }
function investigations() {
  const actions = problem.investigations.filter(action=>engine.matches(action.unlock,state));
  const status = action => engine.cardStatus(state,action.id);
  const card = action => {
    const plan=actionPlan(action); const done=state.done.some(key=>key.startsWith(`${action.id}:`));
    const hint=action.id==='wm.source-backend' && state.flags.includes('wm.source-hint');
    const remembered = plan.result.id==='remembered';
    const note = remembered?'前にも調べた気がする':hint?'真壁が言っていた出力経路':!plan.allowed?'期限までに終わらない':action.repeatable?'条件を絞って何度でも調査':done&&!plan.replay?'再調査できる':'';
    return `<button type="button" draggable="true" class="action-card ${hint?'hint':''}" data-card-id="${esc(action.id)}" data-action="investigate:${esc(action.id)}"><div class="action-top"><span class="card-icon">${icon(actionIcon(action.id))}</span><h3>${esc(action.title)}</h3></div><p>${esc(action.description)}</p>${note?`<div class="action-bottom"><span>${note}</span></div>`:''}${plan.minutes>0?`<span class="action-time ${!plan.allowed?'too-late':''}">${duration(plan.minutes)}</span>`:''}</button>`;
  };
  return `<div class="kanban" aria-label="調査の進捗">${[['todo','未着手'],['working','作業中'],['done','完了']].map(([id,label])=>{
    const items = actions.filter(action=>status(action)===id);
    return `<section class="kanban-column ${id}" data-status="${id}" aria-labelledby="column-${id}"><h2 id="column-${id}"><i></i>${label}<span class="column-count">${items.length}</span></h2><div class="kanban-cards">${items.map(card).join('') || '<p class="column-empty">まだありません</p>'}</div></section>`;
  }).join('')}</div><p class="tiny muted">※ 作業中へ移すとイベント開始。完了・未着手への移動は時間を使いません。</p>`;
}
function evidenceCard(card, selectable = false) {
  const selected = state.selected.includes(card.id);
  return `<${selectable?'button':'article'} data-clue-id="${esc(card.id)}" ${awaitingClues.has(card.id)?'aria-hidden="true"':''} class="evidence-card ${awaitingClues.has(card.id)?'clue-awaiting':''} ${card.kind} ${selected?'selected':''}" ${selectable?`type="button" draggable="true" data-evidence-id="${esc(card.id)}" data-action="select:${esc(card.id)}" aria-pressed="${selected}"`:''}><div class="evidence-top"><span class="tag">${esc(kindNames[card.kind])}</span><span>${selectable?(selected?'選択中 ✓':''):clock(state.acquired[card.id] || state.time)}</span></div><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></${selectable?'button':'article'}>`;
}
function notebook(selectable = false) {
  const cards = problem.evidence.filter(card=>state.evidence.includes(card.id));
  return `<div class="evidence-grid ${selectable?'clue-carousel':''}" ${selectable?'tabindex="0" aria-label="報告する手がかりを横スクロールで選択"':''}>${cards.map(card=>evidenceCard(card,selectable)).join('') || `<div class="empty">${icon('book')}<h3>まだ、メモは白紙。</h3><p>調査で分かったことが、手がかりとしてここに残ります。</p></div>`}</div>`;
}
function reportPage() {
  const q=problem.questions[state.question];
  const canSubmit=state.selected.length===q.slots && state.time+q.minutes<=engine.deadline;
  return `<section class="report-stage"><div class="report-board"><div class="report-selection"><p class="eyebrow">手がかりをドラッグして配置</p><div class="report-slots">${Array.from({length:q.slots},(_,i)=>{
      const card=problem.evidence.find(item=>item.id===(state.reportSlots||state.selected)[i]);
      return `<div class="report-slot ${card?'occupied':''}" data-report-slot="${i}">${card?evidenceCard(card,true):`<span class="slot-number">0${i+1}</span><span>ここに手がかりを置く</span>`}</div>`;
    }).join('')}</div></div><aside class="report-buttons"><span>${state.selected.length} / ${q.slots}枚</span>${button('submit',`この内容で報告 <small>${duration(q.minutes)}</small>`,'primary',canSubmit?'':'disabled')}${button('progress-report','途中経過を報告','secondary')}${button('cannot-report','できません報告','secondary cannot')}${state.time+q.minutes>engine.deadline?'<p class="warning">報告をまとめる時間が足りません。</p>':''}</aside></div><div class="report-conversation"><img class="report-portrait" src="./assets/04_saeki-transparent.png" alt="佐伯" width="1024" height="1536"><div class="conversation-window"><div class="conversation-person"><div><p class="eyebrow">REPORT REQUEST</p><h2>佐伯</h2></div></div><p class="report-request">${esc(q.prompt)}</p><p class="report-hint">手がかりを3枚組み合わせ、相手に伝わる説明を組み立てる。</p></div></div></section>`;
}

function historyEntry(item,index) {
  return `<details class="history-entry" data-history-index="${index}"><summary class="history-item"><div class="history-copy"><h3>${esc(item.label.replace(/ · [0-9hm]+経過$/u,''))}</h3><small>${item.ids.length}件の会話 ${item.selected?.length?`· 手がかり ${item.selected.length}枚`:''}</small></div>${historyChanges(item)}${item.changes?.minutes>0?`<span class="history-duration" aria-label="消費時間 ${duration(item.changes.minutes)}">${duration(item.changes.minutes)}</span>`:''}</summary><div class="history-inline">${item.ids.map(id=>scenario.scenes[id].lines.map(line=>`<p><strong>${esc(names[line.speaker])}</strong> ${esc(line.text)}</p>`).join('')).join('')}</div></details>`;
}
function historyPage() {
  return `<div class="workspace-heading"><div><p class="eyebrow">WORK LOG</p><h1>調査と報告の記録。</h1></div></div><div class="history-list">${state.history.map((item,index)=>item.ids.length?historyEntry(item,index):'').join('') || '<p class="empty">まだ記録はありません。</p>'}</div>`;
}
function historyChanges(item) {
  const change=item.changes||{},gains=[];
  for(const [key,value] of Object.entries(change.knowledge||{}))if(value)gains.push([key,`${{business:'業務知識',system:'システム知識',intuition:'直感'}[key]||key} +${value}`,`+${value}`]);
  if(change.evidence?.length)gains.push(['book',`手がかり +${change.evidence.length}`,`+${change.evidence.length}`]);
  if(change.unlocked?.length)gains.push(['layers',`調査先 +${change.unlocked.length}`,`+${change.unlocked.length}`]);
  if(change.questions>0)gains.push(['check',`報告 ${change.questions}問成立`,`+${change.questions}`]);
  if(change.progressReported)gains.push(['chat','途中報告済み','✓']);
  if(change.intuition>0)gains.push(['intuition',`直感 +${change.intuition}`,`+${change.intuition}`]);
  return `<span class="history-deltas">${gains.map(([name,label,value])=>`<span title="${esc(label)}" aria-label="${esc(label)}">${icon(name)}<b>${esc(value)}</b></span>`).join('')}</span><span class="history-savings">${(change.savings||[]).map(saving=>{
    const action=problem.investigations.find(action=>action.id===saving.id);
    const title=action && engine.matches(action.unlock,state)?action.title:'対応するソース（解放後に反映）';
    return `<span class="history-saving" title="${esc(title)} ${duration(saving.from)} → ${duration(saving.to)}"><span>${esc(title)}</span><b>${icon('clock')} ${duration(saving.from)} → ${duration(saving.to)} <em>−${duration(saving.saved)}</em></b></span>`;
  }).join('')}</span>`;
}
function chatPanel() {
  const feed=buildChatFeed(scenario,state);
  if(feed.length>lastChatCount && !chatBottom)unread+=feed.length-lastChatCount;
  lastChatCount=feed.length;
  let arrivals=0;
  const content=feed.map(item=>{

    const arriving=seenFeedKeys!==null && !seenFeedKeys.has(item.key);
    const delay=arriving?Math.min(arrivals++,4)*65:0;
    const msg=item.message;
    const html=item.kind==='history'?`<article class="message bot-message"><span class="avatar bot-avatar" aria-label="chatbot">${icon('robot')}</span><div class="message-content"><div class="bot-byline"><strong>chatbot</strong><time>${clock(item.time)}</time><span>APP</span></div>${historyEntry(item.item,item.index)}</div></article>`:`<article class="message">${avatar(msg.speaker)}<div class="message-content"><div><strong>${esc(names[msg.speaker])}</strong><time>${esc(msg.at)}</time></div><p>${esc(msg.text)}</p></div></article>`;
    return `<div class="feed-entry ${arriving?'feed-arriving':''}" style="--feed-delay:${delay}ms" data-feed-key="${esc(item.key)}" data-day="${item.day}" data-time="${item.time}">${html}</div>`;
  }).join('');
  seenFeedKeys=new Set(feed.map(item=>item.key));
  return `<aside class="chat-panel"><div class="chat-heading"><span>#pj-marunage</span><small><i></i> ONLINE</small></div><div class="chat-scroll" tabindex="0" aria-label="チャットと作業の履歴">${content}</div>${unread?button('chat-latest',`新着 ${unread}件 ↓`,'unread'):''}</aside>`;
}
function workspace() {
  const reporting=state.phase==='report'||(state.phase==='scene'&&state.conversation?.after==='report');
  const progress = (state.time-minutes(problem.clock.start))/(engine.deadline-minutes(problem.clock.start))*100;
  const content=reporting?reportPage():investigations();
  return `${header()}<div class="casebar"><div><span class="case-index">CASE 01</span><strong>${esc(problem.title)}</strong><span class="loop-label">${state.loop}日目</span></div><div class="case-actions"><nav class="report-actions" aria-label="報告">${button(reporting?'investigate':'report',reporting?'調査に戻る':'報告する','primary')}</nav><div class="time-status">${icon('clock')}<strong>${clock(state.time)}</strong><span>回答期限 17:00</span><div class="time-track"><i style="width:${progress}%"></i></div></div></div></div><nav class="mobile-tabs" aria-label="表示パネル">${button('panel:desk','デスク','active')}${button('panel:chat','#pj-marunage')}${button('notebook','手がかり')}</nav><main class="desktop"><aside class="left-rail">${stats()}<div class="sidebar-coffee">${button('coffee',`${icon('coffee')} コーヒーを飲む <small>${state.helpUsed.includes('wm.coffee')?'使用済み':'残り1回 · 5m'}</small>`,'coffee-button',state.helpUsed.includes('wm.coffee')?'disabled':'')}</div><div class="left-bottom">${button('restart','はじめからやり直す','text-button')}</div></aside><section class="work-area ${reporting?'reporting':''}"><div class="work-content">${content}</div><section class="clue-drawer ${deckOpen||reporting?'open':''}" aria-label="手元の手がかり">${reporting?`<div class="deck-handle fixed-deck-label">${icon('book')} 手がかり <span>${visibleClueCount()}</span></div>`:button('toggle-deck',`${icon('book')} 手がかり <span>${visibleClueCount()}</span> ${deckOpen?'▾':'▴'}`,'deck-handle',`aria-expanded="${deckOpen}" aria-controls="shared-clue-deck"`)}<div id="shared-clue-deck" data-report-deck>${notebook(reporting)}</div></section></section>${chatPanel()}</main><footer class="statusbar"><span>${saveError?esc(saveError):'● このブラウザに自動保存しています'}</span><span>時間は、行動を確定したときだけ進みます。</span></footer>`;
}
function ending() {
  const complete=state.phase==='complete';
  const extended=state.phase==='loop';
  const closingNote=extended?'手がかり・知識・調査状況を引き継ぎ、翌日9:00から再開します。延長はこの一日です。':complete?'確認できた原因と根拠、影響範囲と対応案を報告しました。本番の是正作業は次の相談です。':state.progressReported?'調査の記録は履歴から確認できます。':'途中で状況を共有できれば、期限の相談につなげられたかもしれません。';
  return `${header()}<main class="ending ${complete?'case-solved':''}"><p class="eyebrow">${complete?'CASE CLOSED':extended?'ONE MORE DAY':'GAME OVER'}</p><div class="ending-icon">${icon(complete?'check':'clock')}</div><h1>${complete?'説明が、伝わった。':extended?'もう一日、時間をもらえました。':'今回は、ここまで。'}</h1><p>${complete?'「ありがとうございます！ これなら先方にも説明できます！」——佐伯':extended?'途中で状況を共有していたので、真壁さんが期限を調整してくれました。':'期限までに回答できず、担当を交代することになりました。'}</p>${extended?`<p class="ending-note">${closingNote}</p>`:''}<div class="title-actions">${button(extended?'next-loop':'retry-case',extended?'翌日の調査へ':'はじめからやり直す','primary')}${button('title','タイトルへ','secondary')}</div></main>`;
}
function render() {
  stopCostEffects?.();stopCostEffects=null;
  stopClueEffects?.();stopClueEffects=null;
  if(page==='game'&&state&&visualState?.loop===state.loop){
    for(const id of state.evidence)if(!visualState.evidence.includes(id))awaitingClues.add(id);
  }else awaitingClues.clear();
  if(page==='game'&&state?.phase==='scene'&&!visualState&&!state.conversation.replay){
    for(const id of state.history[state.conversation.historyIndex]?.changes?.evidence||[])awaitingClues.add(id);
  }
  clearInterval(typeTimer);
  const scroll = document.querySelector('.work-content')?.scrollTop || 0;
  const clueScroll=document.querySelector('#shared-clue-deck .evidence-grid')?.scrollLeft||0;
  const columnScrolls=[...document.querySelectorAll('.kanban-column')].map(column=>[column.dataset.status,column.querySelector('.kanban-cards').scrollTop]);
  const boardScroll=document.querySelector('.kanban')?.scrollLeft||0;
  const openedHistory=[...document.querySelectorAll('.chat-scroll .history-entry[open]')].map(item=>item.dataset.historyIndex);
  const chat = document.querySelector('.chat-scroll');
  if (chat?.clientHeight) { chatScroll=chat.scrollTop; chatBottom=chat.scrollHeight-chat.scrollTop-chat.clientHeight<40; }
  document.body.classList.toggle('reduce-motion', Boolean((state||saved)?.settings.reduced));
  document.body.classList.toggle('report-mode',page==='game'&&(state?.phase==='report'||state?.conversation?.after==='report'));
  app.innerHTML=page==='title'?titlePage():['loop','complete','gameover'].includes(state.phase)?ending():workspace();
  showMobilePanel(mobilePanel);
  const content=document.querySelector('.work-content'); if(content) {
    content.classList.toggle('board-view',Boolean(content.querySelector('.kanban')));
    content.classList.toggle('report-view',Boolean(content.querySelector('.report-stage')));
    content.scrollTop=scroll;
  }
  const carousel=document.querySelector('#shared-clue-deck .evidence-grid');if(carousel)carousel.scrollLeft=clueScroll;
  for(const [status,offset] of columnScrolls){const list=document.querySelector(`[data-status="${status}"] .kanban-cards`);if(list)list.scrollTop=offset;}
  const board=document.querySelector('.kanban');if(board)board.scrollLeft=boardScroll;
  const nextChat=document.querySelector('.chat-scroll');
  if(nextChat) {
    for(const index of openedHistory){const item=nextChat.querySelector(`[data-history-index="${index}"]`);if(item)item.open=true;}
    nextChat.scrollTop=chatBottom?nextChat.scrollHeight:chatScroll;
    nextChat.addEventListener('scroll',()=>{
      if(!nextChat.isConnected || !nextChat.clientHeight)return;
      chatScroll=nextChat.scrollTop;chatBottom=nextChat.scrollHeight-nextChat.scrollTop-nextChat.clientHeight<40;
      if(chatBottom){unread=0;document.querySelector('.unread')?.remove();}
    });
    nextChat.addEventListener('toggle',()=>{if(nextChat.isConnected && chatBottom)nextChat.scrollTop=nextChat.scrollHeight;},true);
  }
  if(page==='game'&&state.phase==='scene') showConversation();
  statusEffects();
}
function openModal(html, handler, className='') {
  lastFocus=document.activeElement;
  modalAction=handler;
  modal.className=className;
  modal.innerHTML=html;
  if(!modal.open) modal.showModal();
}
function closeModal() {
  clearInterval(typeTimer); modal.close(); modalAction=null;
  if(lastFocus?.isConnected) lastFocus.focus();
}
function showConversation() {
  const c=state.conversation, id=c.ids[c.scene], scene=scenario.scenes[id], line=scene.lines[c.line];
  const accepted=id==='01.clear'||(id==='01.report-3'&&c.line>=scene.lines.findIndex(item=>item.speaker==='sales'));
  const speakers = [...new Set(scene.lines.slice(0,c.line+1).map(item=>item.speaker))].filter(speaker=>portraitFiles[names[speaker]]);
  const portraits = speakers.length ? `<div class="portrait-stage" aria-label="会話中の人物">${speakers.map(speaker=>`<figure class="portrait ${speaker===line.speaker?'speaking':''}"><img src="./assets/${portraitFiles[names[speaker]]}-transparent.png" alt="${esc(names[speaker])}" width="1024" height="1536"><figcaption>${esc(names[speaker])}</figcaption></figure>`).join('')}</div>` : '';
  openModal(`<div class="conversation-head"><span>${esc(c.label)}</span><small>${c.line+1} / ${scene.lines.length}</small></div><div class="conversation-person">${avatar(line.speaker,true)}<div><p class="eyebrow">${line.kind==='thought'?'INNER VOICE':'CONVERSATION'}</p><h2 id="modal-title">${esc(names[line.speaker])}${line.kind==='thought'?'（心の声）':''}</h2></div></div><p id="dialogue-text" class="dialogue-text ${line.kind==='thought'?'thought':''}"></p><div class="conversation-actions"><span class="muted tiny">${state.seen.includes(`${id}:${scene.version}`)?'既読':'未読'} · 決定で次へ</span><div>${button('scene-skip','会話をスキップ','text-button')}${button('scene-next',`次へ ${icon('arrow')}`,'primary')}</div></div>`,action=>{
    if(action==='scene-next'&&!typed) { clearInterval(typeTimer); document.querySelector('#dialogue-text').textContent=line.text; typed=true; return; }
    if(['scene-next','scene-skip'].includes(action)) { closeModal(); engine.advance(state,action==='scene-skip'); save(); render(); }
  },'conversation');
  const window = document.createElement('div');
  window.className = 'conversation-window';
  if(accepted){
    window.classList.add('report-received');
    window.innerHTML=`<div class="report-accepted" role="status">${icon('check')} 回答が伝わった <span>REPORT RECEIVED</span></div>`;
  }
  while (modal.firstChild) window.append(modal.firstChild);
  modal.append(window);
  if (portraits) {
    modal.classList.add('with-portraits');
    window.insertAdjacentHTML('beforebegin',portraits);
  }
  const target=document.querySelector('#dialogue-text');
  typed=Boolean(state.settings.instant || state.settings.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches);
  if(typed) target.textContent=line.text;
  else { let n=0; typeTimer=setInterval(()=>{ target.textContent=line.text.slice(0,++n); if(n>=line.text.length){clearInterval(typeTimer);typed=true;} },20); }
}
function confirmAction(title, description, execute, label='実行する') {
  openModal(`<p class="eyebrow">CONFIRM</p><h2 id="modal-title">${esc(title)}</h2><p class="confirm-description">${esc(description)}</p><div class="modal-buttons">${button('cancel','戻る','secondary')}${button('confirm',esc(label),'primary')}</div>`,action=>{if(action==='cancel')closeModal();if(action==='confirm'){closeModal();execute();}});
}
function beginInvestigation(id) {
  const action=problem.investigations.find(item=>item.id===id)||problem.help.cards.find(item=>item.id===id);
  if(!action || state.phase!=='desk')return;
  const question=action.questionOptions?.filter(item=>engine.matches(item.unlock,state)).at(-1)?.id;
  const plan=engine.preview(state,id,question);
  if(!plan?.allowed){notify('残り時間または使用回数が足りません。');return;}
  if(plan.replay){notify('調査済みです。手がかり・履歴で確認できます。');return;}
  if(engine.investigate(state,id,question)){save();render();}
}
function settings() {
  const settings=(state||saved)?.settings||{instant:false,reduced:false};
  openModal(`<p class="eyebrow">PREFERENCES</p><h2 id="modal-title">設定</h2><label class="setting-row"><span>会話をすぐに全文表示する</span><input type="checkbox" id="instant" ${settings.instant?'checked':''}></label><label class="setting-row"><span>動きを減らす</span><input type="checkbox" id="reduced" ${settings.reduced?'checked':''}></label><p class="tiny muted">記録はこのブラウザに保存されます。社内チャット・AIはゲーム内の固定原稿です。</p><div class="modal-buttons">${button('erase','すべての記録を消す','text-button danger')}${button('settings-save','閉じる','primary')}</div>`,action=>{
    if(action==='settings-save'){
      const next={instant:modal.querySelector('#instant').checked,reduced:modal.querySelector('#reduced').checked};
      if(state){state.settings=next;save();}else{saved=saved||engine.fresh();saved.settings=next;try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{notify('設定を保存できません。');}}
      closeModal();render();
    }
    if(action==='erase')confirmAction('すべての記録を消しますか？','進行、記憶、直感、完了記録を削除します。',()=>{try{localStorage.removeItem(storageKey);}catch{notify('記録を削除できませんでした。');return;}state=null;saved=null;saveError='';page='title';render();},'記録を削除する');
  });
}
function moveCard(id,status) {
  if(engine.moveCard(state,id,status)){save();render();}
  else notify('期限までに終わらないため、開始できません。');
}
let draggedCard = null;
let draggedClue = null;
function placeClue(id, index) {
  if(state?.phase!=='report'||!state.evidence.includes(id))return;
  const slots=state.reportSlots||Array.from({length:3},(_,i)=>state.selected[i]||null);
  const from=slots.indexOf(id);
  if(index===null){if(from>=0)slots[from]=null;}
  else if(from>=0)[slots[from],slots[index]]=[slots[index],slots[from]];
  else slots[index]=id;
  state.reportSlots=slots;state.selected=slots.filter(Boolean);
  save();render();
}
app.addEventListener('dragstart',event=>{
  const clue=event.target.closest('[data-evidence-id]');
  if(clue&&state?.phase==='report'){
    draggedClue=clue.dataset.evidenceId;
    event.dataTransfer.setData('text/plain',draggedClue);event.dataTransfer.effectAllowed='move';
    clue.classList.add('dragging');return;
  }
  const card=event.target.closest('[data-card-id]');
  if(!card || state?.phase!=='desk'){event.preventDefault();return;}
  draggedCard=card.dataset.cardId;
  event.dataTransfer.setData('text/plain',draggedCard);
  event.dataTransfer.effectAllowed='move';
  card.classList.add('dragging');
});
app.addEventListener('dragover',event=>{
  if(draggedClue){
    const target=event.target.closest('[data-report-slot],[data-report-deck]');
    if(target){event.preventDefault();event.dataTransfer.dropEffect='move';app.querySelectorAll('.drop-target').forEach(item=>item.classList.remove('drop-target'));target.classList.add('drop-target');}return;
  }
  const column=event.target.closest('[data-status]');
  if(!column || !draggedCard)return;
  event.preventDefault();event.dataTransfer.dropEffect='move';
  app.querySelectorAll('.drop-target').forEach(item=>item.classList.remove('drop-target'));
  column.classList.add('drop-target');
});
app.addEventListener('drop',event=>{
  if(draggedClue){
    const target=event.target.closest('[data-report-slot],[data-report-deck]');
    if(target){event.preventDefault();const id=draggedClue;draggedClue=null;placeClue(id,target.hasAttribute('data-report-slot')?Number(target.dataset.reportSlot):null);}return;
  }
  const column=event.target.closest('[data-status]');
  if(!column || !draggedCard)return;
  event.preventDefault();
  const id=draggedCard;draggedCard=null;
  moveCard(id,column.dataset.status);
});
app.addEventListener('dragend',()=>{
  draggedClue=null;
  draggedCard=null;
  app.querySelectorAll('.dragging,.drop-target').forEach(item=>item.classList.remove('dragging','drop-target'));
});
app.addEventListener('click',event=>{
  const target=event.target.closest('[data-action]'); if(!target)return;
  const action=target.dataset.action;
  if(action==='settings'){settings();return;}
  if(action==='title'){page='title';render();return;}
  if(action==='start') {if(saved||saveError)confirmAction('はじめから進めますか？','今回の進行をやり直します。記憶・直感・完了記録は保持します。',()=>start(),'はじめから');else start();return;}
  if(action==='continue'&&saved){state=structuredClone(saved);page='game';resetChat();render();return;}
  if(!state)return;
  if(action==='next-loop'){start(true);return;}
  if(action==='retry-case'){start();return;}
  if(['scene','complete','loop','gameover'].includes(state.phase))return;
  if(action.startsWith('investigate:')){beginInvestigation(action.slice(12));return;}
  if(action.startsWith('select:')){
    const id=action.slice(7); if(state.phase!=='report'||!state.evidence.includes(id))return;
    if(state.selected.includes(id))placeClue(id,null);
    else if(state.selected.length<3){const slots=state.reportSlots||Array.from({length:3},(_,i)=>state.selected[i]||null);placeClue(id,slots.findIndex(item=>!item));}
    else notify('手がかりは3枚までです。選択を外して入れ替えてください。');
    return;
  }
  if(action==='coffee'){beginInvestigation('wm.coffee');return;}
  if(action==='progress-report'||action==='cannot-report'){
    if(engine.statusReport(state,action==='cannot-report'?'cannot':'progress')){save();render();}return;
  }
  if(action==='toggle-deck'){deckOpen=!deckOpen;render();return;}
  if(action==='report'){deckOpen=true;state.reportSlots=Array.from({length:3},(_,i)=>state.selected[i]||null);state.phase='report';save();render();return;}
  if(action==='submit'){if(engine.report(state)){save();render();}return;}
  if(action==='restart'){confirmAction('はじめからやり直しますか？','調査の進行と時刻を戻し、1日目から新しい試行を始めます。',()=>{start();},'やり直す');return;}
  if(action==='chat-latest'){
    unread=0;chatBottom=true;const chat=document.querySelector('.chat-scroll');
    if(chat){chat.scrollTop=chat.scrollHeight;chatScroll=chat.scrollTop;}
    document.querySelector('.unread')?.remove();return;
  }
  if(action==='panel:chat'){showMobilePanel('chat');return;}
  if(action==='panel:desk'){showMobilePanel('desk');return;}
  if(action==='notebook'){deckOpen=!deckOpen;showMobilePanel('desk');render();return;}
  if(['investigate','desk'].includes(action)){
    mobilePanel='desk';tab=action==='desk'?'investigate':action;state.phase='desk';save();render();
  }
});
modal.addEventListener('click',event=>{const target=event.target.closest('[data-action]');if(target&&!target.disabled)modalAction?.(target.dataset.action);});
modal.addEventListener('cancel',event=>{
  if(page==='game'&&state?.phase==='scene'){event.preventDefault();return;}
  clearInterval(typeTimer); modalAction=null;
});
document.addEventListener('keydown',event=>{
  const card=event.target.closest('[data-card-id]');
  if(card && state?.phase==='desk' && event.altKey && ['ArrowLeft','ArrowRight'].includes(event.key)){
    event.preventDefault();const statuses=['todo','working','done'];const index=statuses.indexOf(engine.cardStatus(state,card.dataset.cardId));
    moveCard(card.dataset.cardId,statuses[Math.max(0,Math.min(2,index+(event.key==='ArrowRight'?1:-1)))]);return;
  }
  if(modal.open&&modal.classList.contains('conversation')&&['Enter',' '].includes(event.key)&&!event.target.closest('button')) {event.preventDefault();modalAction?.('scene-next');}
});
render();
