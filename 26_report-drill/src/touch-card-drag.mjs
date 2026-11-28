export function installTouchCardDrag(root,{enabled,describe,drop}){
  let drag=null,frame=0,suppressUntil=0,suppressId='';
  function clear(){
    cancelAnimationFrame(frame);frame=0;
    drag?.ghost?.remove();drag?.source.classList.remove('dragging');
    root.querySelectorAll('.drop-target').forEach(el=>el.classList.remove('drop-target'));
    drag=null;
  }
  function targetAt(x,y){
    const element=document.elementFromPoint(x,y);
    if(drag.kind==='task')return element?.closest('[data-status]');
    if(drag.kind==='reorder')return element?.closest('#shared-clue-deck [data-evidence-id]');
    return element?.closest('[data-report-slot],[data-report-deck]');
  }
  function tick(){
    if(!drag?.ghost)return;
    if(!enabled()||!drag.source.isConnected){clear();return;}
    const titleList=drag.kind==='clue'&&drag.source.closest('.report-slots');
    const panel=titleList||(drag.kind==='task'?root.querySelector('.kanban'):root.querySelector('#shared-clue-deck .evidence-grid'));
    if(panel){
      const r=panel.getBoundingClientRect();
      if(titleList){
        if(drag.y>Math.min(innerHeight,r.bottom)-24)panel.scrollTop+=6;
        else if(drag.y<Math.max(0,r.top)+24)panel.scrollTop-=6;
      }
      else if(drag.x>Math.min(innerWidth,r.right)-28)panel.scrollLeft+=8;
      else if(drag.x<Math.max(0,r.left)+28)panel.scrollLeft-=8;
    }
    root.querySelectorAll('.drop-target').forEach(el=>el.classList.remove('drop-target'));
    targetAt(drag.x,drag.y)?.classList.add('drop-target');
    frame=requestAnimationFrame(tick);
  }
  root.addEventListener('pointerdown',event=>{
    if(!['touch','pen'].includes(event.pointerType)||event.defaultPrevented||!enabled())return;
    const source=event.target.closest('[draggable="true"]');
    const item=source&&describe(source);
    if(!item)return;
    if(item.kind==='task'&&matchMedia('(max-width:699px)').matches&&!event.target.closest('.task-drag-handle'))return;
    clear();
    drag={...item,source,pointer:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY};
    source.setPointerCapture(event.pointerId);
  });
  document.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.pointer)return;
    drag.x=event.clientX;drag.y=event.clientY;
    if(!drag.ghost&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)<8)return;
    event.preventDefault();
    if(!drag.ghost){
      drag.ghost=drag.source.cloneNode(true);
      drag.ghost.classList.add('touch-card-ghost');
      drag.ghost.setAttribute('aria-hidden','true');drag.ghost.removeAttribute('id');
      drag.ghost.style.width=`${Math.min(220,drag.source.getBoundingClientRect().width)}px`;
      document.body.append(drag.ghost);drag.source.classList.add('dragging');
      frame=requestAnimationFrame(tick);
    }
    Object.assign(drag.ghost.style,{left:`${drag.x-48}px`,top:`${drag.y-24}px`});
  },{capture:true,passive:false});
  function end(event){
    if(!drag||event.pointerId!==drag.pointer)return;
    const item=drag,target=drag.ghost&&targetAt(event.clientX,event.clientY),moved=Boolean(drag.ghost);
    if(moved){suppressUntil=performance.now()+500;suppressId=item.id;}
    clear();
    if(event.type==='pointerup'&&moved&&target&&enabled())drop(item,target);
  }
  document.addEventListener('pointerup',end,true);
  document.addEventListener('pointercancel',end,true);
  root.addEventListener('click',event=>{
    const card=event.target.closest('[data-card-id],[data-evidence-id]');
    if(event.isTrusted&&performance.now()<suppressUntil&&(card?.dataset.cardId||card?.dataset.evidenceId)===suppressId){event.preventDefault();event.stopImmediatePropagation();}
  },true);
}
