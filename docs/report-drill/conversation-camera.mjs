// Seats stay fixed even when the speaking order changes.
export function conversationSeats(lines, speaker) {
  const rows = [['player', 'lead', 'sales'], ['accountant', 'client']]
    .map(row => row.filter(id => lines.some(line => line.speaker === id)));
  const cameraRow = rows.findIndex(row => row.includes(speaker));
  const row = rows[cameraRow] || [], index = row.indexOf(speaker);
  const direction = cameraRow === 1 ? -1 : 1;
  return {
    side: cameraRow === 1 ? 'client' : 'supplier',
    span: Math.max(1, ...row.map((_, seat) => Math.abs(seat - index))),
    seats: rows.flatMap((seats, rowIndex) => seats.map((id, seat) => ({
      id, across: rowIndex !== cameraRow, offset: (seat - index) * direction,
    }))),
  };
}

export function captureConversationView(stage) {
  if (!stage) return null;
  const bounds = stage.getBoundingClientRect();
  return {
    side: stage.dataset.cameraSide,
    portraits: [...stage.querySelectorAll('.portrait:not(.across-table)')].map(portrait => {
      const image = portrait.querySelector('img');
      return {
        id: portrait.dataset.speaker, rect: portrait.getBoundingClientRect(),
        source: image.currentSrc || image.src, filter: getComputedStyle(portrait).filter,
      };
    }),
    bounds,
  };
}

export function animateConversationCamera(stage, previous, reduced) {
  if (reduced) return;
  const turning = previous && previous.side !== stage.dataset.cameraSide;
  const direction = stage.dataset.cameraSide === 'client' ? 1 : -1;
  const travel = Math.max(240, stage.clientWidth * .85);
  if (turning) {
    const trail = document.createElement('div');
    trail.className = 'conversation-camera-trail';
    trail.setAttribute('aria-hidden', 'true');
    const bounds = stage.getBoundingClientRect();
    for (const portrait of previous.portraits) {
      const ghost = document.createElement('div'), rect = portrait.rect;
      Object.assign(ghost.style, {
        left: `${rect.left - previous.bounds.left}px`,
        top: `${rect.top - bounds.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
        backgroundImage: `url("${portrait.source}")`, filter: portrait.filter,
      });
      trail.append(ghost);
    }
    stage.append(trail);
    trail.animate([
      { transform: 'translateX(0)', filter: 'blur(0px)', opacity: 1 },
      { transform: `translateX(${-direction * travel}px)`, filter: 'blur(22px)', opacity: 0 },
    ], { duration: 180, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' }).finished
      .then(() => trail.remove()).catch(() => {});
  }
  for (const portrait of stage.querySelectorAll('.portrait:not(.across-table)')) {
    const before = previous?.portraits.find(item => item.id === portrait.dataset.speaker)?.rect;
    const after = portrait.getBoundingClientRect();
    if (turning) {
      const tone = getComputedStyle(portrait).filter;
      portrait.animate([
        { transform: `translateX(calc(-50% + ${direction * travel}px))`, filter: `blur(22px) ${tone}`, opacity: 0 },
        { transform: `translateX(calc(-50% + ${direction * travel * .18}px))`, filter: `blur(10px) ${tone}`, opacity: 1, offset: .45 },
        { transform: 'translateX(-50%)', filter: `blur(0px) ${tone}`, opacity: 1 },
      ], { duration: 300, delay: 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    } else if (!before) {
      portrait.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out' });
    } else if (after.width) {
      portrait.animate([
        { transform: `translateX(calc(-50% + ${before.left + before.width / 2 - after.left - after.width / 2}px)) scale(${before.width / after.width})` },
        { transform: 'translateX(-50%) scale(1)' },
      ], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  }
}

export function clearConversationCamera(stage) {
  if (!stage) return;
  stage.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
  stage.querySelector('.conversation-camera-trail')?.remove();
}
