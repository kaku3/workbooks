// Presentation only: acquiring a clue never advances the game clock.
export function playClueAcquisition(cards, { renderCard, onStored = () => {}, reduced = false } = {}) {
  const layer = document.createElement('div');
  layer.className = 'clue-acquisition-layer';
  layer.setAttribute('role', 'status');
  layer.setAttribute('aria-label', `手がかりを${cards.length}件入手しました`);
  document.body.append(layer);
  const stage = document.createElement('div');
  stage.className = 'clue-drawer clue-acquisition-stage';
  layer.append(stage);
  const animations = [], timers = [];
  const duration = reduced ? 1300 : 2400;
  const interval = duration + 100;
  const later = (fn, delay) => timers.push(setTimeout(fn, delay));
  for (const [index, card] of cards.entries()) {
    later(() => {
      const template = document.createElement('template');
      template.innerHTML = renderCard(card);
      const paper = template.content.firstElementChild;
      paper.classList.add('clue-acquisition-card');
      paper.classList.remove('clue-awaiting');paper.removeAttribute('aria-hidden');
      const deckCard = document.querySelector('#shared-clue-deck .evidence-card');
      const size = deckCard?.getBoundingClientRect();
      paper.style.width = `${size?.width || 190}px`;
      paper.style.height = `${size?.height || 302}px`;
      stage.append(paper);
      const caption = document.createElement('div');
      caption.className = 'clue-acquisition-caption';
      caption.setAttribute('aria-hidden', 'true');
      caption.style.top = `calc(50% + ${(size?.height || 302)/2 + 20}px)`;
      stage.append(caption);
      paper.dataset.acquisitionPhase='arrival';
      const letters=Array.from('手がかりを入手');
      if(reduced){
        later(()=>{caption.textContent=letters.join('');paper.dataset.acquisitionPhase='caption';},150);
        later(()=>{caption.textContent='';paper.dataset.acquisitionPhase='storing';},1050);
      }else{
        later(()=>{paper.dataset.acquisitionPhase='caption';},450);
        letters.forEach((_,i)=>later(()=>{caption.textContent=letters.slice(0,i+1).join('');},450+i*70));
        later(()=>{
          paper.dataset.acquisitionPhase='erase';
          animations.push(caption.animate([{opacity:1},{opacity:0}],{duration:320,easing:'ease-out',fill:'forwards'}));
        },1600);
        later(()=>{caption.textContent='';},1920);
        later(()=>{paper.dataset.acquisitionPhase='storing';},2100);
      }
      const target = document.querySelector('.deck-handle');
      const bounds = target?.getBoundingClientRect();
      const y = bounds && bounds.height && bounds.top < innerHeight ? bounds.top + bounds.height / 2 : innerHeight - 32;
      const slide = Math.max(160, y - innerHeight / 2);
      const animation = paper.animate(reduced ? [
        { opacity: 0 }, { offset: .15, opacity: 1 }, { offset: .8, opacity: 1 }, { opacity: 0 },
      ] : [
        { opacity: 0, filter: 'blur(18px)', transform: 'translate(-50%,-50%) scale(1.6)', easing: 'cubic-bezier(.16,1,.3,1)' },
        { offset: 400/2400, opacity: 1, filter: 'blur(0px)', transform: 'translate(-50%,-50%) scale(1)' },
        { offset: 2100/2400, opacity: 1, filter: 'blur(0px)', transform: 'translate(-50%,-50%) scale(1)', easing: 'cubic-bezier(.55,0,1,.45)' },
        { opacity: 0, filter: 'blur(0px)', transform: `translate(-50%,calc(-50% + ${slide}px)) scale(1)` },
      ], { duration, easing: 'linear', fill: 'forwards' });
      animations.push(animation);
      animation.finished.then(() => {
        paper.remove();
        caption.remove();
        onStored(card.id);
        if (target?.isConnected) animations.push(target.animate([
          { filter: 'brightness(1)' }, { filter: 'brightness(1.8)' }, { filter: 'brightness(1)' },
        ], { duration: 550 }));
      }).catch(() => {});
    }, index * interval);
  }
  const cleanup = () => { timers.forEach(clearTimeout);animations.forEach(animation => animation.cancel());layer.remove();cards.forEach(card=>onStored(card.id)); };
  later(cleanup, (cards.length - 1) * interval + duration + 200);
  return cleanup;
}
