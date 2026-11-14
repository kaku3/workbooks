export function captureMeetingWindows(){
  return new Map([...document.querySelectorAll('[data-meeting-window]')].flatMap(element=>{
    const rect=element.getBoundingClientRect(),style=getComputedStyle(element);
    return rect.width&&rect.height&&style.visibility!=='hidden'&&style.display!=='none' ? [[element.dataset.meetingWindow,{rect,clone:element.cloneNode(true)}]]:[];
  }));
}
export function animateMeetingWindows(previous,reduced){
  if(reduced)return;
  for(const element of document.querySelectorAll('[data-meeting-window]')){
    const rect=element.getBoundingClientRect(),style=getComputedStyle(element);
    if(!rect.width||!rect.height||style.visibility==='hidden'||style.display==='none')continue;
    const old=previous.get(element.dataset.meetingWindow);previous.delete(element.dataset.meetingWindow);
    const from=old?`translate(${old.rect.left-rect.left}px,${old.rect.top-rect.top}px) scale(${old.rect.width/rect.width},${old.rect.height/rect.height})`:'scale(.9)';
    element.animate([{transform:from,opacity:old?1:0},{transform:'none',opacity:1}],{duration:480,easing:'cubic-bezier(.22,1,.36,1)',composite:'replace'});
  }
  for(const {rect,clone} of previous.values()){
    clone.removeAttribute('data-meeting-window');
    const ghost=document.createElement('div');ghost.className='reporting meeting-window-ghost';ghost.setAttribute('aria-hidden','true');
    Object.assign(ghost.style,{position:'fixed',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,zIndex:70,pointerEvents:'none',background:'transparent'});
    Object.assign(clone.style,{position:'relative',inset:'auto',margin:'0',width:'100%',height:'100%'});ghost.append(clone);document.body.append(ghost);
    ghost.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.82)',opacity:0}],{duration:280,easing:'ease-out'}).finished.then(()=>ghost.remove()).catch(()=>ghost.remove());
  }
}
