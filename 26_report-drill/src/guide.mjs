export const guideStorageKey='report-drill.guides.v1';

export function createGuideHistory(storage){
  let seen=new Set(),pending=new Set();
  try{
    const data=JSON.parse(storage?.getItem(guideStorageKey)||'{}');
    seen=new Set(Array.isArray(data.seen)?data.seen.filter(id=>typeof id==='string'):[]);
    pending=new Set(Array.isArray(data.pending)?data.pending.filter(id=>seen.has(id)):[]);
  }catch{}
  const save=()=>{try{storage?.setItem(guideStorageKey,JSON.stringify({seen:[...seen],pending:[...pending]}));}catch{}};
  return {
    eligible:id=>!seen.has(id)||pending.has(id),
    show(id){seen.add(id);pending.add(id);save();},
    complete(id){if(!seen.has(id))return;pending.delete(id);save();},
    reset(){seen.clear();pending.clear();try{storage?.removeItem(guideStorageKey);}catch{}},
  };
}

export const guideDefinitions=[
  {id:'overview',title:'調べて、手がかりを集めて、報告しよう',text:'カンバンのタスクから、依頼への回答に必要そうなものを選んで調査しましょう。\n\n説明に必要な手がかりが揃ったと思ったら、報告タブへ。\nWeb会議で手がかりを3枚選び、依頼主に報告します。\n\nすべてのタスクをこなすと期限に間に合わないかもしれません。',
    ready:c=>c.desk,targets:()=>[],overview:true,ack:'了解した'},
  {id:'task-start',title:'タスクを開始する',text:'調べたいタスクを選び、「作業中」へドラッグしてください。',hint:'キーボード：タスクにフォーカスして Alt＋→',
    ready:c=>c.desk&&c.startCards.length>0,targets:c=>[...c.startCards,...document.querySelectorAll('[data-status="working"]')],
    actions:[],drop:'working'},
  {id:'clue',title:'手がかりを入手しました',text:'タスクによって、報告に使える手がかりが手に入ります。伝わる説明に必要な3枚が揃ったと思ったら、報告タブへ進みましょう。',
    ready:c=>c.desk&&c.clueCount>0,targets:()=>[document.querySelector('.deck-toolbar')],ack:true},
  {id:'task-done',title:'終わったタスクを整理する',text:'実行したタスクを「完了」へドラッグしてください。あとで「未着手」や「作業中」に戻すこともできます。',hint:'キーボード：タスクにフォーカスして Alt＋→',
    ready:c=>c.desk&&c.doneCards.length>0,targets:c=>[...c.doneCards,...document.querySelectorAll('[data-status="done"]')],
    actions:[],drop:'done'},
  {id:'history',title:'チャットで履歴を確認する',text:c=>c.chatShown?'調査や報告の記録は、チャット欄のchatbotが投稿します。投稿をクリックすると、そのときの会話を読み返せます。':'「#pj-marunage」を押してチャット欄を開いてください。chatbotの投稿をクリックすると、調査や報告の会話を読み返せます。',
    ready:c=>c.historyReady&&Boolean(c.historyEntry),targets:c=>c.chatShown?[c.historyEntry.querySelector('summary')]:[document.querySelector('[data-action="panel:chat"]')],
    actions:['panel:chat'],history:true,reveal:true},
  {id:'report-tab',title:'報告タブを開く',text:'手がかりが3枚以上集まりました。報告タブを開いてみましょう。3枚あるだけで説明が伝わるとは限りません。内容を見て、自分で組み合わせを考えます。',
    ready:c=>c.desk&&c.clueCount>=3,targets:()=>[document.querySelector('[data-action="report"]')],actions:['report']},
  {id:'back-to-investigate',title:'調査カンバンに戻る',text:'まだ依頼への回答が伝わっていません。「調査カンバン - Backlog」に戻り、相手の反応を手がかりに調査や説明を見直しましょう。\n手がかりを組み替えて、何度でも報告できます。',
    ready:c=>c.report&&c.reportRejected,targets:()=>[document.querySelector('[data-action="investigate"]')],actions:['investigate']},
  {id:'join',title:'会議に参加する',text:'「会議に参加する」を押してください。',
    ready:c=>c.report&&c.meeting?.phase==='lobby',targets:()=>[document.querySelector('[data-action="join-meeting"]')],actions:['join-meeting']},
  {id:'share',title:'報告用の画面を共有する',text:'画面共有ボタンを押してください。共有した画面に、報告する手がかりを配置できます。',
    ready:c=>c.report&&c.meeting?.phase==='speaking'&&c.meeting.requestReady&&!c.meeting.share,targets:()=>[document.querySelector('[data-action="meeting-share"]')],actions:['meeting-share']},
  {id:'select',title:'報告する手がかりを3枚選ぶ',text:'報告したい手がかりを3枚、枠へドラッグしてください。カードをクリックして選ぶこともできます。組み合わせは自由に考えてください。',
    ready:c=>c.report&&c.meeting?.share&&c.clueCount>=3&&c.selected<3,targets:()=>[document.querySelector('[data-report-deck]'),document.querySelector('.report-slots')],select:true},
  {id:'submit',title:'選んだ手がかりで報告する',text:'「報告する」を押してください。依頼主に伝われば回答完了です。うまく伝わらなかった時は、調査に戻って報告をやり直せます。',
    ready:c=>c.report&&c.meeting?.share&&c.selected===3,targets:()=>[document.querySelector('[data-action="submit"]')],actions:['submit']},
];

// Clip spotlight holes to the viewport and every scrolling ancestor.
function visibleRect(element){
  if(!element?.isConnected||!element.getClientRects().length)return null;
  const style=getComputedStyle(element);
  if(style.visibility==='hidden'||style.display==='none')return null;
  const rect=element.getBoundingClientRect();
  let left=Math.max(0,rect.left),top=Math.max(0,rect.top),right=Math.min(innerWidth,rect.right),bottom=Math.min(innerHeight,rect.bottom);
  for(let parent=element.parentElement;parent;parent=parent.parentElement){
    const css=getComputedStyle(parent),bounds=parent.getBoundingClientRect();
    if(/auto|scroll|hidden|clip/.test(css.overflowX)){left=Math.max(left,bounds.left);right=Math.min(right,bounds.right);}
    if(/auto|scroll|hidden|clip/.test(css.overflowY)){top=Math.max(top,bounds.top);bottom=Math.min(bottom,bounds.bottom);}
  }
  // The mobile clue drawer floats over the bottom of the board.
  if(element.closest('.kanban')){
    const deck=document.querySelector('.clue-drawer')?.getBoundingClientRect();
    if(deck&&deck.left<right&&deck.right>left&&deck.top>top)bottom=Math.min(bottom,deck.top);
  }
  return right>left&&bottom>top?{left,top,right,bottom,width:right-left,height:bottom-top}:null;
}

export function createOperationGuide({storage,context,onChange=()=>{},onMove=()=>{}}){
  const history=createGuideHistory(storage);
  let active=null,targets=[],layer=null,card=null,mask=null,lastLayout='',previousFocus=null,revealedTarget=null;
  let touchDrag=null;
  function cancelTouch(){touchDrag?.ghost?.remove();touchDrag=null;}
  function clear(){
    cancelTouch();
    const had=Boolean(layer);
    layer?.remove();layer=null;card=null;mask=null;targets=[];lastLayout='';revealedTarget=null;
    document.body.classList.remove('guide-open');
    document.querySelectorAll('[data-guide-target]').forEach(el=>el.removeAttribute('data-guide-target'));
    if(had){if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});onChange();}
  }
  function complete(id){
    if(active?.id!==id)return;
    history.complete(id);active=null;clear();
  }
  function focusables(){
    const selector='button:not(:disabled),a[href],summary,[tabindex="0"]';
    const sources=active?.drop?targets.filter(el=>el.hasAttribute('data-card-id')):targets;
    return [...new Set([...sources.flatMap(el=>[...(el.matches(selector)?[el]:[]),...el.querySelectorAll(selector)]),...(card?[...card.querySelectorAll('button')]:[])])].filter(el=>visibleRect(el));
  }
  function focusFirst(){(focusables()[0]||card)?.focus({preventScroll:true});}
  function update(){
    const c=context();
    if(c.blocked){clear();return;}
    if(active&&!active.ready(c)){active=null;clear();}
    if(!active)active=guideDefinitions.find(def=>history.eligible(def.id)&&def.ready(c));
    if(!active){clear();return;}
    const candidates=active.targets(c);
    if(active.reveal&&candidates[0]?.isConnected&&revealedTarget!==candidates[0]){
      revealedTarget=candidates[0];revealedTarget.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
    }
    const nextTargets=candidates.filter(el=>visibleRect(el));
    if(!nextTargets.length&&!active.overview){clear();return;}
    targets=nextTargets;
    document.querySelectorAll('[data-guide-target]').forEach(el=>el.removeAttribute('data-guide-target'));
    targets.forEach(el=>el.setAttribute('data-guide-target',''));
    if(!layer){
      history.show(active.id);
      previousFocus=document.activeElement;
      layer=document.createElement('div');layer.className='operation-guide';layer.dataset.guide=active.id;
      layer.classList.toggle('guide-overview',Boolean(active.overview));
      layer.innerHTML='<svg class="guide-shade" aria-hidden="true"><defs><mask id="operation-guide-mask"><rect width="100%" height="100%" fill="white"/><g></g></mask></defs><rect width="100%" height="100%" fill="black" fill-opacity=".78" mask="url(#operation-guide-mask)"/><g class="guide-outlines"></g></svg><div class="guide-focus-effects" aria-hidden="true"></div><section class="guide-card" role="region" aria-labelledby="guide-title" aria-describedby="guide-description" tabindex="-1"><p class="guide-label">操作ガイド</p><div class="guide-card-body"><h2 id="guide-title"></h2><p id="guide-description"></p></div></section>';
      document.body.append(layer);card=layer.querySelector('.guide-card');mask=layer.querySelector('mask g');
      card.querySelector('h2').textContent=active.title;card.querySelector('#guide-description').textContent=typeof active.text==='function'?active.text(c):active.text;
      const body=card.querySelector('.guide-card-body');
      if(active.hint){const hint=document.createElement('small');hint.textContent=active.hint;body.append(hint);}
      if(active.ack){const id=active.id;const button=document.createElement('button');button.type='button';button.className='primary';button.textContent=typeof active.ack==='string'?active.ack:'確認した';button.onclick=()=>{complete(id);update();};body.append(button);}
      document.body.classList.add('guide-open');
      // Announce the instructions before the player operates the highlighted controls.
      card.focus({preventScroll:true});onChange();
    }
    const description=typeof active.text==='function'?active.text(c):active.text;
    if(card.querySelector('#guide-description').textContent!==description){card.querySelector('#guide-description').textContent=description;lastLayout='';}
    const rects=targets.map(visibleRect).filter(Boolean);
    const layout=JSON.stringify([innerWidth,innerHeight,rects]);
    if(layout===lastLayout)return;
    lastLayout=layout;
    const holes=rects.map(r=>`<rect x="${r.left}" y="${r.top}" width="${r.width}" height="${r.height}" rx="6" fill="black"/>`).join('');
    mask.innerHTML=holes;
    layer.querySelector('.guide-outlines').innerHTML=holes.replaceAll('fill="black"','fill="none" stroke="#a8edcf" stroke-width="2"');
    layer.querySelector('.guide-focus-effects').innerHTML=rects.map(r=>`<div class="guide-focus-target" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px"><span></span><span></span><span></span></div>`).join('');
    // Pick the position with least overlap with the actual operating areas.
    const width=Math.min(active.overview?480:360,innerWidth-24),height=card.offsetHeight;
    if(active.overview){Object.assign(card.style,{left:`${(innerWidth-width)/2}px`,top:`${Math.max(24,(innerHeight-height)/2)}px`});return;}
    const positions=[{left:12,top:24},{left:innerWidth-width-12,top:24},{left:12,top:innerHeight-height-24},{left:innerWidth-width-12,top:innerHeight-height-24},{left:(innerWidth-width)/2,top:24},{left:(innerWidth-width)/2,top:innerHeight-height-24}];
    const overlap=p=>rects.reduce((sum,r)=>sum+Math.max(0,Math.min(p.left+width,r.right)-Math.max(p.left,r.left))*Math.max(0,Math.min(p.top+height,r.bottom)-Math.max(p.top,r.top)),0);
    positions.sort((a,b)=>overlap(a)-overlap(b));
    Object.assign(card.style,{left:`${positions[0].left}px`,top:`${Math.max(24,positions[0].top)}px`});
  }
  function allowed(event){
    if(!layer)return true;
    const element=event.target instanceof Element?event.target:null;
    if(!element)return false;
    if(card.contains(element))return true;
    if(!targets.some(target=>target.contains(element)))return false;
    if(event.type==='click'){
      if(active.history&&element.closest('summary.history-item'))return true;
      const action=element.closest('[data-action]')?.dataset.action;
      return active.select?Boolean(action?.startsWith('select:')):Boolean(active.actions?.includes(action));
    }
    if(['drop','dragover'].includes(event.type))return active.select||element.closest('[data-status]')?.dataset.status===active.drop;
    if(event.type==='dragstart')return active.select||targets.includes(element.closest('[data-card-id]'));
    return true;
  }
  function guard(event){
    if(!layer)return;
    if(event.type==='pointerdown'&&event.pointerType==='touch'&&active.drop){
      const source=event.target.closest('[data-card-id]');
      if(targets.includes(source)){
        event.preventDefault();source.setPointerCapture(event.pointerId);
        touchDrag={source,id:source.dataset.cardId,x:event.clientX,y:event.clientY,pointer:event.pointerId};return;
      }
    }
    if(event.type==='keydown'){
      if(event.key==='Tab'){
        event.preventDefault();const items=focusables();const index=items.indexOf(document.activeElement);
        (items[(index+(event.shiftKey?-1:1)+items.length)%items.length]||card).focus({preventScroll:true});return;
      }
      if(active.drop&&event.altKey&&['ArrowLeft','ArrowRight'].includes(event.key)){
        const el=event.target.closest('[data-card-id]');
        const from=el?.closest('[data-status]')?.dataset.status;
        const statuses=['todo','working','done'];
        if(!el||!targets.includes(el)||statuses[statuses.indexOf(from)+(event.key==='ArrowRight'?1:-1)]!==active.drop){event.preventDefault();event.stopImmediatePropagation();return;}
      }
      if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();return;}
    }
    if(event.type==='focusin'){
      if(!allowed(event))focusFirst();return;
    }
    if(!allowed(event)){event.preventDefault();event.stopImmediatePropagation();}
  }
  function touchMove(event){
    if(!touchDrag||event.pointerId!==touchDrag.pointer)return;
    event.preventDefault();
    if(!touchDrag.ghost&&Math.hypot(event.clientX-touchDrag.x,event.clientY-touchDrag.y)>8){
      const ghost=touchDrag.source.cloneNode(true);ghost.classList.add('guide-drag-ghost');ghost.removeAttribute('data-guide-target');ghost.setAttribute('aria-hidden','true');
      document.body.append(ghost);touchDrag.ghost=ghost;
    }
    if(touchDrag.ghost){
      Object.assign(touchDrag.ghost.style,{left:`${event.clientX-60}px`,top:`${event.clientY-30}px`});
      const board=document.querySelector('.kanban'),bounds=board?.getBoundingClientRect();
      if(board&&bounds){if(event.clientX>Math.min(innerWidth,bounds.right)-50)board.scrollLeft+=25;else if(event.clientX<Math.max(0,bounds.left)+50)board.scrollLeft-=25;}
      update();
    }
  }
  function touchEnd(event){
    if(!touchDrag||event.pointerId!==touchDrag.pointer)return;
    const {id,ghost}=touchDrag;
    const destination=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-status]')?.dataset.status;
    cancelTouch();
    if(event.type==='pointerup'&&ghost&&destination===active?.drop)onMove(id,destination);
  }
  for(const name of ['click','dblclick','pointerdown','touchstart','dragstart','dragover','drop','keydown','focusin'])document.addEventListener(name,guard,{capture:true,passive:false});
  document.addEventListener('pointermove',touchMove,{capture:true,passive:false});
  document.addEventListener('pointerup',touchEnd,true);document.addEventListener('pointercancel',touchEnd,true);
  window.addEventListener('resize',update);
  document.addEventListener('scroll',update,true);
  // Also catches the end of asynchronous clue / ticket / meeting animations.
  const timer=setInterval(update,150);
  return {update,complete,get active(){return Boolean(layer);},reset(){active=null;clear();history.reset();},destroy(){clear();clearInterval(timer);window.removeEventListener('resize',update);document.removeEventListener('scroll',update,true);document.removeEventListener('pointermove',touchMove,true);document.removeEventListener('pointerup',touchEnd,true);document.removeEventListener('pointercancel',touchEnd,true);for(const name of ['click','dblclick','pointerdown','touchstart','dragstart','dragover','drop','keydown','focusin'])document.removeEventListener(name,guard,true);}};
}
