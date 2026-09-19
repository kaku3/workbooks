const drillData = window.SHITEN_DRILL_DATA || { DATA: [], CATEGORIES: [], CLASSIFY_DATA: [] };
const DRILL_ITEMS = drillData.DATA || [];
const DRILL_CATEGORIES = drillData.CATEGORIES || [];
const DRILL_CLASSIFY = drillData.CLASSIFY_DATA || [];

let current = 0;
let clCurrent = 0;
let activeListTab = 'classify';

const answered = new Set(JSON.parse(localStorage.getItem('shiten_answered') || '[]'));
const clAnswered = new Set(JSON.parse(localStorage.getItem('shiten_classified') || '[]'));
const clResults = JSON.parse(localStorage.getItem('shiten_classified_results') || '{}');

function directionFor(i){ return i % 2 === 0 ? 'sys2usr' : 'usr2sys'; }
function statusText(done,total){ return done===0?'未着手':done===total?'完了':'進行中'; }
function levelLabel(level){ return ['','入門','入門','標準','応用','挑戦'][level] || '標準'; }
function levelClass(level){ return `lv${level||3}`; }
function classifyRole(meta,i){ return i===meta.wrong ? 'システム目線' : 'ユーザー目線'; }
function classifyRoleShort(meta,i){ return i===meta.wrong ? 'SYSTEM' : 'USER'; }
function escapeHtml(value){ return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }

function setListTab(tab){
  activeListTab=tab;
  const wt=document.getElementById('listWriteTab'), ct=document.getElementById('listClassifyTab');
  wt.classList.toggle('active',tab==='write'); ct.classList.toggle('active',tab==='classify');
  wt.setAttribute('aria-selected',String(tab==='write')); ct.setAttribute('aria-selected',String(tab==='classify'));
  document.getElementById('writeChallenge').classList.toggle('hidden',tab!=='write');
  document.getElementById('classifyChallenge').classList.toggle('hidden',tab!=='classify');
  document.getElementById('challengeIntro').innerHTML=tab==='classify'
    ? '<strong>まずは「向き」を見抜く。</strong> 概要の中で、1つだけ向きの違う文章を探します。直した前後を見比べて、「あ、こっちのほうが読みやすい」を体験してみてください。'
    : '<strong>次は自分で書く。</strong> 同じ仕様を別の読み手に伝えるなら、どんな文章になるか考えてみます。';
  if(tab==='classify') renderClassifyQuestion(); else renderWriteQuestion();
  renderQuestionList(); updateProgress();
}

function renderQuestionList(){
  const list=document.getElementById('allList'); if(!list)return; list.innerHTML='';
  DRILL_ITEMS.forEach((item,i)=>{
    const done=activeListTab==='write'?answered.has(i):clAnswered.has(i);
    const classifyStatus = activeListTab==='classify' ? (clResults[i] === 'correct' ? 'o' : clResults[i] === 'wrong' ? 'x' : '?') : (done ? 'o' : '?');
    const card=document.createElement('button'); card.type='button'; card.className=`review-card ${done?'done':''} ${classifyStatus==='o'?'status-ok':classifyStatus==='x'?'status-ng':'status-unanswered'} ${i===(activeListTab==='write'?current:clCurrent)?'current':''}`;
    const preview = activeListTab==='write' ? item.sys : DRILL_CLASSIFY[i].bad[0];
    card.innerHTML=`<div class="review-card-header"><span class="review-badge">Q${i+1}</span><span class="level-badge ${levelClass(item.level)}">${levelLabel(item.level)}</span></div><span class="review-type">${activeListTab==='write'?(directionFor(i)==='sys2usr'?'システム→ユーザー':'ユーザー→システム'):'向きのズレを見抜く'}</span><p title="${escapeHtml(preview)}">${escapeHtml(preview)}</p><span class="review-state" aria-label="${activeListTab==='classify'?(classifyStatus==='o'?'正解':classifyStatus==='x'?'不正解':'未回答'):(done?'解答済み':'未回答')}">${classifyStatus}</span>`;
    card.setAttribute('aria-current', String(i===(activeListTab==='write'?current:clCurrent)));
    card.addEventListener('click',()=>selectQuestionFromMap(i)); list.appendChild(card);
  });
}

function selectQuestionFromMap(index){
  if(activeListTab==='write'){
    current=index;
    renderWriteQuestion();
  }else{
    clCurrent=index;
    renderClassifyQuestion();
  }
  renderQuestionList();
  const target=document.getElementById('challenge');
  if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
}

function renderWriteQuestion(){
  if(!DRILL_ITEMS.length)return; const item=DRILL_ITEMS[current], dir=directionFor(current);
  const qtag=document.getElementById('qtag'), given=document.getElementById('given'), task=document.getElementById('task');
  const input=document.getElementById('answerInput'), box=document.getElementById('answerBox');
  qtag.textContent=dir==='sys2usr'?'システム目線 → ユーザー目線':'ユーザー目線 → システム目線';
  qtag.className=`qtag ${dir==='sys2usr'?'sys':'usr'}`;
  given.textContent=dir==='sys2usr'?item.sys:item.usr;
  task.textContent=dir==='sys2usr'?'この一文を、ユーザー目線の表現に書き換えてください。':'この体験の裏側にある仕様を、システム目線で書いてください。';
  input.value=''; box.classList.remove('open');
  document.getElementById('qCounter').textContent=`Q${current+1}.`; document.querySelector('#writeChallenge .counter-total').textContent=` / ${DRILL_ITEMS.length}`;
  document.getElementById('writeLevel').textContent=levelLabel(item.level);
  document.getElementById('writeLevel').className=`level-badge ${levelClass(item.level)}`;
  document.getElementById('prevBtn').disabled=current===0; document.getElementById('nextBtn').disabled=current===DRILL_ITEMS.length-1;
}

function renderClassifyQuestion(){
  if(!DRILL_CLASSIFY.length)return; const meta=DRILL_CLASSIFY[clCurrent];
  const list=document.getElementById('clSentences'); list.innerHTML='';
  meta.bad.forEach((text,i)=>{
    const b=document.createElement('button'); b.type='button'; b.className='cl-sentence'; b.dataset.index=i;
    b.innerHTML=`<span class="sentence-num">0${i+1}</span><span>${escapeHtml(text)}</span><span class="sentence-mark">?</span>`;
    b.addEventListener('click',()=>answerClassify(i)); list.appendChild(b);
  });
  document.getElementById('clCounter').textContent=`Q${clCurrent+1}.`; document.querySelector('#classifyChallenge .counter-total').textContent=` / ${DRILL_CLASSIFY.length}`;
  document.getElementById('clLevel').textContent=levelLabel(meta.level); document.getElementById('clLevel').className=`level-badge ${levelClass(meta.level)}`;
  document.getElementById('clExplain').classList.remove('open');
  document.getElementById('clBefore').textContent=meta.bad[meta.wrong];
  document.getElementById('clAfter').textContent=meta.fixed;
  document.getElementById('clExplainText').textContent=meta.explain;
  document.getElementById('clBeforeAfter').classList.remove('open');
  document.getElementById('clPrevBtn').disabled=clCurrent===0; document.getElementById('clNextBtn').disabled=clCurrent===DRILL_CLASSIFY.length-1;
  if(clAnswered.has(clCurrent)) showClassifyResult(meta.wrong);
}

function answerClassify(chosen){
  const meta=DRILL_CLASSIFY[clCurrent];
  document.querySelectorAll('.cl-sentence').forEach(b=>{
    const idx=Number(b.dataset.index); b.classList.remove('correct','wrong','dim');
    if(idx===meta.wrong)b.classList.add('correct'); else if(idx===chosen)b.classList.add('wrong'); else b.classList.add('dim');
  });
  const isCorrect = chosen===meta.wrong;
  clResults[clCurrent] = isCorrect ? 'correct' : 'wrong';
  localStorage.setItem('shiten_classified_results',JSON.stringify(clResults));
  if(!clAnswered.has(clCurrent)){clAnswered.add(clCurrent);localStorage.setItem('shiten_classified',JSON.stringify([...clAnswered]));}
  // まず解答結果を画面に反映し、その直後に問題マップも更新する。
  // マップ再描画があっても、解説表示を消さない順序にしておく。
  showClassifyResult(chosen);
  updateProgress();
  renderQuestionList();
}
function showClassifyResult(chosen){
  const meta=DRILL_CLASSIFY[clCurrent];
  document.querySelectorAll('.cl-sentence').forEach(b=>{
    const idx=Number(b.dataset.index);
    const mark=b.querySelector('.sentence-mark');
    if(mark) mark.textContent=classifyRoleShort(meta,idx);
    b.setAttribute('aria-label', `${classifyRole(meta,idx)}: ${meta.bad[idx]}`);
  });
  const chosenRole=classifyRole(meta,chosen);
  const correctRole=classifyRole(meta,meta.wrong);
  const chosenIsCorrect=chosen===meta.wrong;
  document.getElementById('clExplain').classList.add('open');
  document.getElementById('clResult').textContent=chosenIsCorrect
    ? 'そう、それです。「システム目線」の文章が1つだけ混ざっています。'
    : `選んだ文章は「${chosenRole}」。向きは揃っています。仲間外れは「${correctRole}」です。`;
  document.getElementById('clBefore').textContent=meta.bad[meta.wrong];
  document.getElementById('clAfter').textContent=meta.fixed;
  document.getElementById('clExplainText').textContent=chosenIsCorrect
    ? meta.explain
    : `選んだ「${meta.bad[chosen]}」は、ほかの文章と同じ${chosenRole}です。だから仲間外れではありません。正解の文章は「${meta.bad[meta.wrong]}」で、${meta.explain}`;
  document.getElementById('clBeforeAfter').classList.add('open');
}

function updateProgress(){
  const total=DRILL_ITEMS.length*2, done=answered.size + Object.values(clResults).filter(v=>v==='correct').length;
  document.getElementById('sidebarSolved').textContent=done; document.getElementById('sidebarTotal').textContent=total;
  document.getElementById('sidebarStatus').textContent=statusText(done,total);
  document.getElementById('overallFill').style.width=`${done/Math.max(total,1)*100}%`;
  document.getElementById('classifySolved').textContent=Object.values(clResults).filter(v=>v==='correct').length; document.getElementById('writeSolved').textContent=answered.size;
}

document.getElementById('checkBtn').addEventListener('click',()=>{const item=DRILL_ITEMS[current],dir=directionFor(current);document.getElementById('modelAnswer').textContent=dir==='sys2usr'?item.usr:item.sys;document.getElementById('tip').textContent=item.tip;document.getElementById('answerBox').classList.add('open');answered.add(current);localStorage.setItem('shiten_answered',JSON.stringify([...answered]));updateProgress();renderQuestionList();});
document.getElementById('prevBtn').addEventListener('click',()=>{if(current>0){current--;renderWriteQuestion();renderQuestionList()}});
document.getElementById('nextBtn').addEventListener('click',()=>{if(current<DRILL_ITEMS.length-1){current++;renderWriteQuestion();renderQuestionList()}});
document.getElementById('clPrevBtn').addEventListener('click',()=>{if(clCurrent>0){clCurrent--;renderClassifyQuestion();renderQuestionList()}});
document.getElementById('clNextBtn').addEventListener('click',()=>{if(clCurrent<DRILL_CLASSIFY.length-1){clCurrent++;renderClassifyQuestion();renderQuestionList()}});
document.getElementById('listWriteTab').addEventListener('click',()=>setListTab('write'));
document.getElementById('listClassifyTab').addEventListener('click',()=>setListTab('classify'));

// 再訪問時は、分類問題の未回答を先頭から開く。全問回答済みなら先頭を開く。
const firstUnansweredClassify = DRILL_CLASSIFY.findIndex((_,i)=>!clAnswered.has(i));
if(firstUnansweredClassify >= 0) clCurrent = firstUnansweredClassify;
setListTab('classify');updateProgress();
