const drillData = window.SHITEN_DRILL_DATA || { DATA: [], CATEGORIES: [], CLASSIFY_DATA: [] };
const DRILL_ITEMS = drillData.DATA || [];
const DRILL_CATEGORIES = drillData.CATEGORIES || [];
const DRILL_CLASSIFY = drillData.CLASSIFY_DATA || [];

let current = 0;
let clCurrent = 0;
let activeListTab = 'classify';

const legacyAnswered = new Set(JSON.parse(localStorage.getItem('shiten_answered') || '[]'));
const answeredSys2Usr = new Set(JSON.parse(localStorage.getItem('shiten_answered_sys2usr') || '[]'));
const answeredUsr2Sys = new Set(JSON.parse(localStorage.getItem('shiten_answered_usr2sys') || '[]'));
legacyAnswered.forEach(i => (i % 2 === 0 ? answeredSys2Usr : answeredUsr2Sys).add(i));
const clAnswered = new Set(JSON.parse(localStorage.getItem('shiten_classified') || '[]'));
const clResults = JSON.parse(localStorage.getItem('shiten_classified_results') || '{}');

function statusText(done,total){ return done===0?'未着手':done===total?'完了':'進行中'; }
function levelLabel(level){ return ['','入門','入門','標準','応用','挑戦'][level] || '標準'; }
function levelClass(level){ return `lv${level||3}`; }
function classifyRole(meta,i){ return i===meta.wrong ? 'システム目線' : 'ユーザー目線'; }
function classifyRoleShort(meta,i){ return i===meta.wrong ? 'SYSTEM' : 'USER'; }
function escapeHtml(value){ return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }
function writeAnsweredSet(){ return activeListTab==='sys2usr' ? answeredSys2Usr : answeredUsr2Sys; }
function writeDirection(){ return activeListTab==='sys2usr' ? 'sys2usr' : 'usr2sys'; }
function writeAnsweredCount(tab=activeListTab){ return (tab==='sys2usr'?answeredSys2Usr:answeredUsr2Sys).size; }

function setListTab(tab){
  activeListTab=tab;
  const tabs={
    classify:document.getElementById('listClassifyTab'),
    sys2usr:document.getElementById('listSys2UsrTab'),
    usr2sys:document.getElementById('listUsr2SysTab')
  };
  Object.entries(tabs).forEach(([key,el])=>{
    el.classList.toggle('active',tab===key);
    el.setAttribute('aria-selected',String(tab===key));
  });
  document.getElementById('writeChallenge').classList.toggle('hidden',!['sys2usr','usr2sys'].includes(tab));
  document.getElementById('classifyChallenge').classList.toggle('hidden',tab!=='classify');
  const intros={
    classify:'<strong>まずは「向き」を見抜く。</strong> 概要の中で、1つだけ向きの違う文章を探します。直した前後を見比べて、「あ、こっちのほうが読みやすい」を体験してみてください。',
    sys2usr:'<strong>システム視点から、ユーザー視点へ。</strong> 同じ出来事を、ユーザーが見たり感じたりすることとして書き換えてみます。',
    usr2sys:'<strong>ユーザー視点から、システム視点へ。</strong> 同じ出来事を、システムが行う処理として書き換えてみます。'
  };
  document.getElementById('challengeIntro').innerHTML=intros[tab];
  if(tab==='classify') renderClassifyQuestion(); else renderWriteQuestion();
  renderQuestionList(); updateProgress();
}

const QUESTION_TITLES = [
  'ログイン認証', '必須項目入力', 'セッションタイムアウト', '商品検索', '売上レポート',
  'ファイルアップロード', '在庫更新', '権限による機能表示', '読み込みタイムアウト', 'パスワード保護',
  '注文の二重登録防止', '情報のキャッシュ表示', '同時更新の競合', 'CSV文字化け防止', '権限チェック',
  '在庫の自動同期', '決済完了の反映', '返金処理', 'あいまい検索', '障害時の問い合わせ'
];

function renderQuestionList(){
  const list=document.getElementById('allList'); if(!list)return; list.innerHTML='';
  DRILL_ITEMS.forEach((item,i)=>{
    let state='unanswered';
    if(activeListTab==='classify'){
      const result=clResults[i];
      state=result==='correct'?'ok':result==='wrong'?'review':'unanswered';
    }else{
      state=writeAnsweredSet().has(i)?'ok':'unanswered';
    }
    const activeIndex=activeListTab==='classify'?clCurrent:current;
    const stateLabel=state==='ok'?'✓':state==='review'?'!':'—';
    const stateText=state==='ok'?'正解':state==='review'?'要復習':'未回答';
    const direction=activeListTab==='classify'?'向きの違いを見分ける':writeDirection()==='sys2usr'?'システム → ユーザー':'ユーザー → システム';
    const card=document.createElement('button'); card.type='button';
    card.className=`review-card ${state==='ok'?'status-ok':state==='review'?'status-review':'status-unanswered'} ${i===activeIndex?'current':''}`;
    card.innerHTML=`
      <div class="review-card-header">
        <span class="review-badge">Q${String(i+1).padStart(2,'0')}</span>
        <span class="level-badge ${levelClass(item.level)}">${levelLabel(item.level)}</span>
      </div>
      <div class="review-title">${escapeHtml(QUESTION_TITLES[i] || `問題 ${i+1}`)}</div>
      <div class="review-card-footer">
        <span class="review-type">${escapeHtml(direction)}</span>
        <span class="review-state ${state}" aria-label="${stateText}" title="${stateText}"><b>${stateLabel}</b><span>${stateText}</span></span>
      </div>`;
    card.setAttribute('aria-current',String(i===activeIndex));
    card.addEventListener('click',()=>selectQuestionFromMap(i));
    list.appendChild(card);
  });
}

function selectQuestionFromMap(index){
  window.__shitenDirection=index >= (activeListTab==='classify'?clCurrent:current) ? 'next' : 'prev';
  if(activeListTab==='classify'){ clCurrent=index; renderClassifyQuestion(); }
  else { current=index; renderWriteQuestion(); }
  renderQuestionList();
  requestAnimationFrame(()=>scrollToQuestionCard(activeListTab==='classify'?'clCard':'writeCard'));
}

function renderWriteQuestion(){
  if(!DRILL_ITEMS.length)return;
  const item=DRILL_ITEMS[current], dir=writeDirection();
  const qtag=document.getElementById('qtag'), given=document.getElementById('given');
  const input=document.getElementById('answerInput'), box=document.getElementById('answerBox');
  qtag.textContent=dir==='sys2usr'?'システム視点 → ユーザー視点':'ユーザー視点 → システム視点';
  qtag.className=`qtag ${dir==='sys2usr'?'sys':'usr'}`;
  given.textContent=dir==='sys2usr'?item.sys:item.usr;
  input.value='';
  const set=writeAnsweredSet();
  if(set.has(current)){
    document.getElementById('modelAnswer').textContent=dir==='sys2usr'?item.usr:item.sys;
    document.getElementById('tip').textContent=item.tip;
    box.classList.add('open');
  }else box.classList.remove('open');
  document.getElementById('writeLevel').textContent=levelLabel(item.level);
  document.getElementById('writeLevel').className=`level-badge ${levelClass(item.level)}`;
  document.getElementById('writeTitle').textContent=dir==='sys2usr'?'システム視点の文章を、ユーザー視点の文章に書き換えよう':'ユーザー視点の文章を、システム視点の文章に書き換えよう';
  updateWritePreviews(); updateCompleteNavs(); animateCard('writeCard');
}

function scrollToQuestionCard(id='clCard'){
  const card=document.getElementById(id); if(!card)return;
  const y=card.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({top:y,behavior:'auto'});
}

function updateWritePreviews(){
  const prev=document.getElementById('wrPrevPreview'), next=document.getElementById('wrNextPreview');
  const prevNum=document.getElementById('wrPrevPreviewNum'), nextNum=document.getElementById('wrNextPreviewNum');
  if(!prev||!next)return;
  const hasPrev=current>0, hasNext=current<DRILL_ITEMS.length-1;
  prev.hidden=!hasPrev; next.hidden=!hasNext;
  prev.classList.toggle('is-empty',!hasPrev); next.classList.toggle('is-empty',!hasNext);
  prevNum.textContent=hasPrev?`Q${current}`:''; nextNum.textContent=hasNext?`Q${current+2}`:'';
  const dots=document.getElementById('wrProgressDots');
  if(dots) dots.innerHTML=`<span class="progress-current">${String(current+1).padStart(2,'0')}</span><span class="progress-slash">/</span><span>${String(DRILL_ITEMS.length).padStart(2,'0')}</span>`;
}

function updateClassifyPreviews(){
  const prev=document.getElementById('clPrevPreview'), next=document.getElementById('clNextPreview');
  const prevNum=document.getElementById('clPrevPreviewNum'), nextNum=document.getElementById('clNextPreviewNum');
  if(!prev||!next)return;
  const hasPrev=clCurrent>0, hasNext=clCurrent<DRILL_CLASSIFY.length-1;
  prev.hidden=!hasPrev; next.hidden=!hasNext;
  prev.classList.toggle('is-empty',!hasPrev); next.classList.toggle('is-empty',!hasNext);
  prevNum.textContent=hasPrev?`Q${clCurrent}`:''; nextNum.textContent=hasNext?`Q${clCurrent+2}`:'';
  const dots=document.getElementById('clProgressDots');
  if(dots) dots.innerHTML=`<span class="progress-current">${String(clCurrent+1).padStart(2,'0')}</span><span class="progress-slash">/</span><span>${String(DRILL_CLASSIFY.length).padStart(2,'0')}</span>`;
}

function renderClassifyQuestion(){
  if(!DRILL_CLASSIFY.length)return;
  const meta=DRILL_CLASSIFY[clCurrent];
  const list=document.getElementById('clSentences'); list.innerHTML='';
  meta.bad.forEach((text,i)=>{
    const b=document.createElement('button'); b.type='button'; b.className='cl-sentence'; b.dataset.index=i;
    b.innerHTML=`<span class="sentence-num">0${i+1}</span><span>${escapeHtml(text)}</span><span class="sentence-mark">?</span>`;
    b.addEventListener('click',()=>answerClassify(i)); list.appendChild(b);
  });
  document.getElementById('clLevel').textContent=levelLabel(meta.level);
  document.getElementById('clLevel').className=`level-badge ${levelClass(meta.level)}`;
  document.getElementById('clExplain').classList.remove('open');
  document.getElementById('clBefore').textContent=meta.bad[meta.wrong];
  document.getElementById('clAfter').textContent=meta.fixed;
  document.getElementById('clExplainText').textContent=meta.explain;
  document.getElementById('clBeforeAfter').classList.remove('open');
  const status=document.getElementById('clAnswerStatus');
  if(status){ status.hidden=!clAnswered.has(clCurrent); status.className='cl-answer-status'; }
  if(clAnswered.has(clCurrent)) applyClassifyAnswerState(clResults[clCurrent],meta.wrong);
  updateClassifyPreviews(); updateCompleteNavs(); animateCard('clCard');
}

function answerClassify(chosen){
  const meta=DRILL_CLASSIFY[clCurrent];
  document.querySelectorAll('.cl-sentence').forEach(b=>{
    const idx=Number(b.dataset.index); b.classList.remove('correct','wrong','dim');
    if(idx===meta.wrong)b.classList.add('correct'); else if(idx===chosen)b.classList.add('wrong'); else b.classList.add('dim');
  });
  const isCorrect=chosen===meta.wrong;
  clResults[clCurrent]=isCorrect?'correct':'wrong';
  window.__lastClassifyChoice=chosen;
  localStorage.setItem('shiten_classified_results',JSON.stringify(clResults));
  clAnswered.add(clCurrent); localStorage.setItem('shiten_classified',JSON.stringify([...clAnswered]));
  showClassifyResult(chosen); updateProgress(); renderQuestionList(); updateCompleteNavs();
}

function applyClassifyAnswerState(result,correctIndex){
  const meta=DRILL_CLASSIFY[clCurrent];
  document.querySelectorAll('.cl-sentence').forEach(b=>{
    const idx=Number(b.dataset.index), mark=b.querySelector('.sentence-mark');
    b.classList.remove('correct','wrong','dim');
    if(idx===correctIndex)b.classList.add('correct');
    else if(result==='wrong' && idx===window.__lastClassifyChoice)b.classList.add('wrong');
    else b.classList.add('dim');
    if(mark) mark.textContent=classifyRoleShort(meta,idx);
    b.setAttribute('aria-label',`${classifyRole(meta,idx)}: ${meta.bad[idx]}`);
  });
  const status=document.getElementById('clAnswerStatus');
  if(status){
    status.hidden=false; status.className=`cl-answer-status ${result}`;
    status.innerHTML=result==='correct'?'<strong>✓ 正解です。</strong><span>システム視点の文章を見つけました。</span>':'<strong>× もう一度。</strong><span>システム視点は、別の文章です。</span>';
  }
}

function showClassifyResult(chosen){
  const meta=DRILL_CLASSIFY[clCurrent], chosenIsCorrect=chosen===meta.wrong;
  window.__lastClassifyChoice=chosen;
  applyClassifyAnswerState(chosenIsCorrect?'correct':'wrong',meta.wrong);
  document.getElementById('clExplain').classList.add('open');
  document.getElementById('clBefore').textContent=meta.bad[meta.wrong];
  document.getElementById('clAfter').textContent=meta.fixed;
  document.getElementById('clExplainText').textContent=chosenIsCorrect?meta.explain:`選んだ「${meta.bad[chosen]}」は、ほかの文章と同じ${classifyRole(meta,chosen)}です。だから仲間外れではありません。正解は「${meta.bad[meta.wrong]}」で、${meta.explain}`;
  document.getElementById('clBeforeAfter').classList.add('open');
}

function updateCompleteNavs(){
  const classifyDone=clAnswered.size>=DRILL_CLASSIFY.length;
  const writeDone=writeAnsweredCount(activeListTab)>=DRILL_ITEMS.length;
  const classifyNav=document.getElementById('classifyCompleteNav');
  const writeNav=document.getElementById('writeCompleteNav');
  const toUser=document.getElementById('toUsr2SysFromSys2Usr');
  const toClassify=document.getElementById('toClassifyFromUsr2Sys');
  if(classifyNav) classifyNav.hidden=!(activeListTab==='classify' && classifyDone);
  if(writeNav) writeNav.hidden=!(activeListTab!=='classify' && writeDone);
  if(toUser) toUser.hidden=activeListTab!=='sys2usr';
  if(toClassify) toClassify.hidden=activeListTab!=='usr2sys';
}

function updateProgress(){
  const classifyDone=Object.values(clResults).filter(v=>v==='correct').length;
  const sysDone=answeredSys2Usr.size, usrDone=answeredUsr2Sys.size;
  const total=DRILL_ITEMS.length*3, done=classifyDone+sysDone+usrDone;
  document.getElementById('sidebarSolved').textContent=done;
  document.getElementById('sidebarTotal').textContent=total;
  document.getElementById('sidebarStatus').textContent=statusText(done,total);
  document.getElementById('overallFill').style.width=`${done/Math.max(total,1)*100}%`;
}

function markWriteAnswered(){
  const set=writeAnsweredSet(); set.add(current);
  localStorage.setItem(activeListTab==='sys2usr'?'shiten_answered_sys2usr':'shiten_answered_usr2sys',JSON.stringify([...set]));
  document.getElementById('modelAnswer').textContent=writeDirection()==='sys2usr'?DRILL_ITEMS[current].usr:DRILL_ITEMS[current].sys;
  document.getElementById('tip').textContent=DRILL_ITEMS[current].tip;
  document.getElementById('answerBox').classList.add('open');
  updateProgress(); renderQuestionList(); updateCompleteNavs();
}

document.getElementById('checkBtn').addEventListener('click',markWriteAnswered);
function goWriteQuestion(nextIndex){
  if(nextIndex<0||nextIndex>=DRILL_ITEMS.length||nextIndex===current)return;
  window.__shitenDirection=nextIndex>current?'next':'prev'; current=nextIndex; renderWriteQuestion(); renderQuestionList();
  requestAnimationFrame(()=>scrollToQuestionCard('writeCard'));
}
function goClassifyQuestion(nextIndex){
  if(nextIndex<0||nextIndex>=DRILL_CLASSIFY.length||nextIndex===clCurrent)return;
  window.__shitenDirection=nextIndex>clCurrent?'next':'prev'; clCurrent=nextIndex; renderClassifyQuestion(); renderQuestionList();
  requestAnimationFrame(()=>scrollToQuestionCard('clCard'));
}
function switchTabAndScroll(tab,id){
  setListTab(tab);
  requestAnimationFrame(()=>requestAnimationFrame(()=>scrollToQuestionCard(id)));
}
function animateCard(id){
  const card=document.getElementById(id); if(!card)return;
  card.classList.remove('question-enter','question-enter-prev'); void card.offsetWidth;
  card.classList.add(window.__shitenDirection==='prev'?'question-enter-prev':'question-enter');
}

document.getElementById('wrPrevPreview').addEventListener('click',()=>goWriteQuestion(current-1));
document.getElementById('wrNextPreview').addEventListener('click',()=>goWriteQuestion(current+1));
document.getElementById('clPrevPreview').addEventListener('click',()=>goClassifyQuestion(clCurrent-1));
document.getElementById('clNextPreview').addEventListener('click',()=>goClassifyQuestion(clCurrent+1));
document.getElementById('listSys2UsrTab').addEventListener('click',()=>switchTabAndScroll('sys2usr','writeCard'));
document.getElementById('listUsr2SysTab').addEventListener('click',()=>switchTabAndScroll('usr2sys','writeCard'));
document.getElementById('listClassifyTab').addEventListener('click',()=>switchTabAndScroll('classify','clCard'));
document.getElementById('toSys2UsrFromClassify').addEventListener('click',()=>switchTabAndScroll('sys2usr','writeCard'));
document.getElementById('toUsr2SysFromSys2Usr').addEventListener('click',()=>switchTabAndScroll('usr2sys','writeCard'));
document.getElementById('toClassifyFromUsr2Sys').addEventListener('click',()=>switchTabAndScroll('classify','clCard'));

const firstUnansweredClassify=DRILL_CLASSIFY.findIndex((_,i)=>!clAnswered.has(i));
if(firstUnansweredClassify>=0) clCurrent=firstUnansweredClassify;
setListTab('classify'); updateProgress(); updateClassifyPreviews();
