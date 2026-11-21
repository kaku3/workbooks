const finished=animation=>animation.finished.catch(()=>{});

export async function playBlackout({onDark,reduced=false}){
  if(reduced){onDark();return;}
  const layer=document.createElement('dialog');
  layer.className='scene-blackout';
  layer.setAttribute('aria-label','場面転換');
  layer.addEventListener('cancel',event=>event.preventDefault());
  document.body.append(layer);
  try{
    layer.showModal();
    layer.dataset.phase='darkening';
    await finished(layer.animate([{opacity:0},{opacity:1}],{duration:350,fill:'forwards'}));
    layer.dataset.phase='dark';
    onDark();
    // Keep the blackout above any conversation dialog opened by the next line.
    layer.close();layer.showModal();
    await new Promise(resolve=>setTimeout(resolve,200));
    layer.dataset.phase='revealing';
    await finished(layer.animate([{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}));
  }finally{
    layer.close();layer.remove();
  }
}
