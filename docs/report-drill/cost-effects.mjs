// Compare reading costs without treating completion (a free reread) as a discount.
export function findTimeSavings(engine, problem, before, after) {
  if (!before || before.loop !== after.loop) return [];
  const previous = { ...before, time: after.time };
  function cost(state, action) {
    const questionId = action.questionOptions?.filter(item => engine.matches(item.unlock, state)).at(-1)?.id;
    const outcome = action.outcomes.find(item => engine.matches(item.when, state, { questionId }));
    if (!outcome) return null;
    const finished = state.done.includes(`${action.id}:${outcome.id}`);
    if (finished && !action.repeatable && outcome.complete !== false) return null;
    return outcome.minutes;
  }
  return problem.investigations.flatMap(action => {
    const from = cost(previous, action), to = cost(after, action);
    if (from === null || to === null || from <= to) return [];
    return [{ id: action.id, title: action.title, from, to, saved: from - to,
      revealed: engine.matches(action.unlock, after) }];
  });
}

// All geometry is read after the conversation closes. This never changes game time.
export function playTimeSavings(savings, { format, reduced = false } = {}) {
  const layer = document.createElement('div');
  layer.className = 'cost-effect-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const animations = [], timers = [], decorations = [], restoredTimes = [];
  let stopped = false;
  const later = (fn, ms) => timers.push(setTimeout(() => { if (!stopped) fn(); }, ms));
  const animate = (element, frames, options) => {
    const animation = element.animate(frames, options);
    animations.push(animation);
    return animation;
  };
  const cardFor = id => [...document.querySelectorAll('[data-card-id]')].find(card => card.dataset.cardId === id);
  function clippedRect(element) {
    if (!element) return null;
    let rect = element.getBoundingClientRect();
    let left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
    let top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
    for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
      const style = getComputedStyle(parent), bounds = parent.getBoundingClientRect();
      if (style.overflowX !== 'visible') { left = Math.max(left, bounds.left); right = Math.min(right, bounds.right); }
      if (style.overflowY !== 'visible') { top = Math.max(top, bounds.top); bottom = Math.min(bottom, bounds.bottom); }
    }
    return right > left && bottom > top ? { left, right, top, bottom } : null;
  }
  function showCard(card) {
    const list = card.closest('.kanban-cards');
    if (!list || !clippedRect(list)) return;
    const bounds = list.getBoundingClientRect(), rect = card.getBoundingClientRect();
    if (rect.top < bounds.top || rect.bottom > bounds.bottom) {
      list.scrollTop += rect.top - bounds.top - Math.max(0, (list.clientHeight - rect.height) / 2);
    }
  }
  function decorate(card, saving) {
    const badge = document.createElement('span');
    badge.className = 'time-saving-badge';
    badge.dataset.saving = String(saving.saved);
    badge.textContent = `−${format(saving.saved)}`;
    card.append(badge);decorations.push(badge);
    card.classList.add('time-discount-hit');
    later(() => { badge.remove(); card.classList.remove('time-discount-hit'); }, 4000);
  }
  function impact(card, time, saving, end) {
    if (!card.isConnected) return;
    decorate(card, saving);
    if (reduced) return;
    const ring = document.createElement('span');
    ring.className = 'cost-impact-ring';
    ring.style.left = `${end.x}px`;ring.style.top = `${end.y}px`;layer.append(ring);
    animate(ring, [{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 },
      { transform: 'translate(-50%,-50%) scale(3)', opacity: 0 }], { duration: 650, fill: 'forwards' });
    const label = document.createElement('span');
    label.className = 'cost-saving-float';label.textContent = `−${format(saving.saved)}`;
    label.style.left = `${end.x}px`;label.style.top = `${end.y - 20}px`;layer.append(label);
    animate(label, [{ transform: 'translate(-50%,0)', opacity: 0 },
      { offset: .15, transform: 'translate(-50%,-14px)', opacity: 1 },
      { offset: .7, transform: 'translate(-50%,-34px)', opacity: 1 },
      { transform: 'translate(-50%,-48px)', opacity: 0 }], { duration: 1900, fill: 'forwards' });
    if (time) {
      time.classList.add('cost-counting');
      for (let step = 1; step <= 10; step++) later(() => {
        if (time.isConnected) time.textContent = format(Math.round(saving.from - saving.saved * step / 10));
        if (step === 10) time.classList.remove('cost-counting');
      }, step * 35);
    }
  }
  for (const [index, saving] of savings.entries()) {
    later(() => {
      const card = cardFor(saving.id);
      if (!card) return;
      showCard(card);
      const bounds = clippedRect(card);
      if (!bounds) { decorate(card, saving); return; }
      const time = card.querySelector('.action-time');
      const end = { x: Math.max(bounds.left + 12, bounds.right - 35), y: bounds.bottom - 20 };
      if (reduced) { impact(card, time, saving, end); return; }
      const source = cardFor(saving.sourceId);
      if (source) showCard(source);
      const origin = clippedRect(source) || clippedRect(source?.closest('.kanban-column')?.querySelector('h2')) || clippedRect(document.querySelector('.knowledge'));
      if (!origin) { impact(card, time, saving, end); return; }
      const start = { x: (origin.left + origin.right) / 2, y: (origin.top + origin.bottom) / 2 };
      const control = { x: (start.x + end.x) / 2, y: Math.max(14, Math.min(start.y, end.y) - 80) };
      if (time) { restoredTimes.push({ time, value: format(saving.to) }); time.textContent = format(saving.from); }
      const trail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      trail.classList.add('cost-flight-trail');trail.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
      const path = document.createElementNS(trail.namespaceURI, 'path');
      path.setAttribute('d', `M${start.x},${start.y} Q${control.x},${control.y} ${end.x},${end.y}`);
      trail.append(path);layer.append(trail);
      const length = path.getTotalLength();path.style.strokeDasharray = String(length);path.style.strokeDashoffset = String(length);
      animate(path, [{ strokeDashoffset: length, opacity: 0 }, { offset: .2, opacity: .7 },
        { strokeDashoffset: 0, opacity: .3 }], { duration: 650, fill: 'forwards' });
      const projectile = document.createElement('span');projectile.className = 'cost-projectile';layer.append(projectile);
      const frames = Array.from({ length: 21 }, (_, frame) => {
        const t = frame / 20, u = 1 - t;
        const x = u * u * start.x + 2 * u * t * control.x + t * t * end.x;
        const y = u * u * start.y + 2 * u * t * control.y + t * t * end.y;
        return { transform: `translate(${x - 6}px,${y - 6}px) scale(${.7 + Math.sin(t * Math.PI) * .6})`, opacity: Math.min(1, t * 8) };
      });
      animate(projectile, frames, { duration: 650, easing: 'ease-in-out', fill: 'forwards' });
      later(() => { projectile.remove(); trail.remove(); impact(card, time, saving, end); }, 650);
    }, index * 850);
  }
  const cleanup = () => {
    stopped = true;timers.forEach(clearTimeout);animations.forEach(animation => animation.cancel());
    for (const { time, value } of restoredTimes) if (time.isConnected) { time.textContent = value;time.classList.remove('cost-counting'); }
    decorations.forEach(badge => { badge.closest('.action-card')?.classList.remove('time-discount-hit');badge.remove(); });
    layer.remove();
  };
  later(cleanup, savings.length * 850 + 4700);
  return cleanup;
}
