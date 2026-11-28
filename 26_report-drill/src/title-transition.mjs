const finished=animation=>animation.finished.catch(()=>{});

export async function playTitleTransition({app,modal,chapter,reduced,onEnter}){
  const note=app.querySelector('.title-page .case-paper');
  if(!note||reduced){onEnter();return;}
  for(const animation of note.getAnimations())animation.finish();
  const bounds=note.getBoundingClientRect(),style=getComputedStyle(note);
  const layer=document.createElement('dialog');
  layer.className='chapter-transition';
  layer.setAttribute('aria-label',`第${chapter}章`);
  layer.innerHTML='<div class="chapter-transition-dark"></div><div class="chapter-transition-note"></div><p class="chapter-transition-heading"></p>';
  const paper=layer.querySelector('.chapter-transition-note'),heading=layer.querySelector('.chapter-transition-heading');
  paper.classList.add('case-paper');
  paper.innerHTML=note.innerHTML;
  Object.assign(paper.style,{width:`${note.offsetWidth}px`,height:`${note.offsetHeight}px`,padding:style.padding,font:style.font,color:style.color,background:style.backgroundColor,boxShadow:style.boxShadow});
  heading.textContent=`第${['一','二','三'][chapter-1]||chapter}章`;
  const originX=bounds.left+bounds.width/2-note.offsetWidth/2;
  const originY=bounds.top+bounds.height/2-note.offsetHeight/2;
  const centerX=(document.documentElement.clientWidth-note.offsetWidth)/2,centerY=(document.documentElement.clientHeight-note.offsetHeight)/2;
  const origin=`translate(${originX}px,${originY}px) rotate(2deg)`;
  const center=`translate(${centerX}px,${centerY}px) rotate(0deg)`;
  paper.style.transform=origin;
  heading.style.top=`${centerY-72}px`;
  const appInert=app.inert,modalInert=modal.inert;
  let fade;
  document.body.append(layer);
  layer.addEventListener('cancel',event=>event.preventDefault());
  try{
    layer.showModal();app.inert=true;modal.inert=true;
    note.style.visibility='hidden';
    layer.dataset.phase='clearing';
    fade=app.animate([{opacity:1},{opacity:0}],{duration:450,fill:'forwards'});
    await Promise.all([finished(fade),finished(layer.querySelector('.chapter-transition-dark').animate([{opacity:0},{opacity:1}],{duration:450,fill:'forwards'}))]);
    layer.dataset.phase='centering';
    await finished(paper.animate([{transform:origin},{transform:center}],{duration:850,easing:'cubic-bezier(.22,.68,.25,1)',fill:'forwards'}));
    paper.classList.add('tape-attaching');
    layer.dataset.phase='chapter';
    await finished(heading.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'},{opacity:1,transform:'translateY(0)'}],{duration:1000,easing:'ease-out',fill:'forwards'}));
    layer.dataset.phase='leaving';
    await Promise.all([paper,heading].map(element=>finished(element.animate([{opacity:1},{opacity:0}],{duration:450,fill:'forwards'}))));
    app.style.opacity='0';modal.style.opacity='0';
    fade.cancel();
    onEnter();
    layer.close();layer.remove();
    await Promise.all([app,modal].map(element=>finished(element.animate([{opacity:0},{opacity:1}],{duration:600,easing:'ease-out'}))));
  }finally{
    fade?.cancel();layer.remove();
    note.style.visibility='';app.style.opacity='';modal.style.opacity='';
    app.inert=appInert;modal.inert=modalInert;
  }
}
