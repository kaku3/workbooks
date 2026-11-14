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
  const duration = reduced ? 1300 : 2800;
  const interval = duration + 100;
  const later = (fn, delay) => timers.push(setTimeout(fn, delay));
  for (const [index, card] of cards.entries()) {
    later(() => {
      const template = document.createElement('template');
      template.innerHTML = renderCard(card);
      const paper = template.content.firstElementChild;
      paper.classList.add('clue-acquisition-card');
      paper.classList.remove('clue-awaiting');paper.removeAttribute('aria-hidden');
      const deckCard = [...document.querySelectorAll('#shared-clue-deck .evidence-card')].find(item=>item.dataset.clueId===card.id);
      // Measure the pending card without leaving a gap in the live deck.
      if(deckCard)deckCard.style.display='flex';
      const size = deckCard?.getBoundingClientRect();
      if(deckCard)deckCard.style.removeProperty('display');
      paper.style.width = `${size?.width || 190}px`;
      paper.style.height = `${size?.height || 302}px`;
      stage.append(paper);
      const caption = document.createElement('div');
      caption.className = 'clue-acquisition-caption';
      caption.setAttribute('aria-hidden', 'true');
      caption.style.top = `calc(50% + ${(size?.height || 302)/2 + 20}px)`;
      stage.append(caption);
      paper.dataset.acquisitionPhase='arrival';
      const openSlot=()=>{
        if(!deckCard?.isConnected)return;
        const grid=deckCard.parentElement;
        grid.scrollLeft=0;
        const existing=[...grid.querySelectorAll('.evidence-card:not(.clue-awaiting)')];
        const before=new Map(existing.map(item=>[item,item.getBoundingClientRect()]));
        deckCard.classList.add('clue-slot-opening');
        if(!reduced)for(const item of existing){
          const from=before.get(item),to=item.getBoundingClientRect();
          if(from.left===to.left&&from.top===to.top)continue;
          animations.push(item.animate([
            {transform:`translate(${from.left-to.left}px,${from.top-to.top}px)`},
            {transform:'translate(0,0)'},
          ],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'}));
        }
      };
      const letters=Array.from('手がかりを入手');
      if(reduced){
        later(()=>{caption.textContent=letters.join('');paper.dataset.acquisitionPhase='caption';},150);
        later(()=>{caption.textContent='';openSlot();paper.dataset.acquisitionPhase='storing';},1050);
      }else{
        later(()=>{paper.dataset.acquisitionPhase='caption';},450);
        letters.forEach((_,i)=>later(()=>{caption.textContent=letters.slice(0,i+1).join('');},450+i*70));
        later(()=>{
          paper.dataset.acquisitionPhase='erase';
          animations.push(caption.animate([{opacity:1},{opacity:0}],{duration:320,easing:'ease-out',fill:'forwards'}));
        },1600);
        later(()=>{caption.textContent='';paper.dataset.acquisitionPhase='spacing';openSlot();},1920);
      }
      const target = document.querySelector('.deck-handle');
      const animation = paper.animate(reduced ? [
        { opacity: 0 }, { offset: .15, opacity: 1 }, { offset: .8, opacity: 1 }, { opacity: 0 },
      ] : [
        { opacity: 0, filter: 'blur(18px)', transform: 'translate(-50%,-50%) scale(1.6)', easing: 'cubic-bezier(.16,1,.3,1)' },
        { offset: 400/2280, opacity: 1, filter: 'blur(0px)', transform: 'translate(-50%,-50%) scale(1)' },
        { opacity: 1, filter: 'blur(0px)', transform: 'translate(-50%,-50%) scale(1)' },
      ], { duration:reduced?duration:2280, easing: 'linear', fill: 'forwards' });
      animations.push(animation);
      const stored=()=>{
        paper.remove();
        caption.remove();
        onStored(card.id);
        if (target?.isConnected) animations.push(target.animate([
          { filter: 'brightness(1)' }, { filter: 'brightness(1.8)' }, { filter: 'brightness(1)' },
        ], { duration: 550 }));
      };
      if(reduced)animation.finished.then(stored).catch(()=>{});
      else later(()=>{
        paper.dataset.acquisitionPhase='storing';
        const bounds=deckCard?.getBoundingClientRect();
        const x=bounds?bounds.left+bounds.width/2-innerWidth/2:0;
        const y=bounds?bounds.top+bounds.height/2-innerHeight/2:innerHeight/2;
        const slide=paper.animate([
          {opacity:1,transform:'translate(-50%,-50%) scale(1)'},
          {opacity:1,transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(1)`},
        ],{duration:520,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
        animations.push(slide);
        slide.finished.then(stored).catch(()=>{});
      },2280);
    }, index * interval);
  }
  const cleanup = () => { timers.forEach(clearTimeout);animations.forEach(animation => animation.cancel());layer.remove();cards.forEach(card=>onStored(card.id)); };
  later(cleanup, (cards.length - 1) * interval + duration + 200);
  return cleanup;
}
