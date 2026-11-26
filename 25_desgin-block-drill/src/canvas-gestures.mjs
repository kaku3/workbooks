// Navigate the canvas without changing block coordinates.
export function installCanvasGestures(viewport, canvas, { canDragNode = () => false, onBlankTap = () => {} } = {}) {
  const pointers = new Map();
  let base = 1, zoom = 1, x = 0, y = 0, mode = '', start, blockTarget, blockPointer, suppressUntil = 0, cancellingBlock = false;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const scale = () => base * zoom;
  const origin = () => {
    const rect = viewport.getBoundingClientRect();
    return { x: rect.left + viewport.clientLeft, y: rect.top + viewport.clientTop + canvas.offsetTop };
  };
  const draw = () => {
    x = clamp(x, Math.min(0, viewport.clientWidth - canvas.offsetWidth * scale()), 0);
    y = clamp(y, Math.min(0, viewport.clientHeight - canvas.offsetTop - canvas.offsetHeight * scale()), 0);
    canvas.style.transform = `translate(${x}px,${y}px) scale(${scale()})`;
    viewport.dataset.canvasZoom = String(zoom);
  };
  const zoomAt = (value, point) => {
    const next = clamp(value, 1, 4), ratio = next / zoom, offset = origin();
    x = point.x - offset.x - (point.x - offset.x - x) * ratio;
    y = point.y - offset.y - (point.y - offset.y - y) * ratio;
    zoom = next; draw();
  };
  const controls = document.createElement('div');
  controls.className = 'canvas-navigation'; controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', 'キャンバス表示');
  for (const [label, name, action] of [
    ['−', 'キャンバスを縮小', () => zoomAt(zoom / 1.4, center())],
    ['＋', 'キャンバスを拡大', () => zoomAt(zoom * 1.4, center())],
    ['全体', 'キャンバスを全体表示', () => { zoom = 1; x = 0; y = 0; draw(); }]
  ]) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.setAttribute('aria-label', name); button.title = name; button.onclick = action; controls.append(button);
  }
  const center = () => { const r = viewport.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  viewport.append(controls);
  viewport.addEventListener('wheel', event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault(); zoomAt(zoom * Math.exp(-event.deltaY * .005), { x: event.clientX, y: event.clientY });
  }, { passive: false });
  const snapshot = () => {
    const points = [...pointers.values()];
    const a = points[0], b = points[1] || a;
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) };
  };
  const begin = () => { start = { ...snapshot(), panX: x, panY: y, zoom, origin: origin() }; };
  const capture = id => { try { viewport.setPointerCapture(id); } catch {} };
  const cancelBlock = () => {
    if (!blockTarget) return;
    cancellingBlock = true;
    try { blockTarget.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: blockPointer, pointerType: 'touch' })); }
    finally { cancellingBlock = false; }
    try { blockTarget.releasePointerCapture(blockPointer); } catch {}
    blockTarget = null;
  };
  viewport.addEventListener('pointerdown', event => {
    if (event.target.closest('.canvas-navigation')) return;
    const mousePan = event.pointerType === 'mouse' && (event.button === 1 || event.button === 0 && !event.shiftKey && !event.target.closest('.node,.token,button'));
    if (event.pointerType !== 'touch' && !mousePan) return;
    if (pointers.size === 0) suppressUntil = 0;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (event.pointerType === 'touch' && pointers.size === 1 && canDragNode() && event.target.closest('.node')) {
      mode = 'block'; blockTarget = event.target.closest('.node'); blockPointer = event.pointerId;
      return;
    }
    event.preventDefault(); event.stopImmediatePropagation();
    if (pointers.size >= 2) cancelBlock();
    mode = pointers.size >= 2 ? 'pinch' : 'pan';
    for (const id of pointers.keys()) capture(id);
    begin();
  }, { capture: true, passive: false });
  window.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    const previous = snapshot();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (mode === 'block') return;
    event.preventDefault(); event.stopImmediatePropagation();
    const current = snapshot();
    if (mode === 'pinch') {
      zoom = clamp(start.zoom * current.distance / start.distance, 1, 4);
      const ratio = zoom / start.zoom;
      x = current.x - start.origin.x - (start.x - start.origin.x - start.panX) * ratio;
      y = current.y - start.origin.y - (start.y - start.origin.y - start.panY) * ratio;
    } else {
      const oldY = y, dy = current.y - previous.y;
      x += current.x - previous.x;
      y += dy;
      draw();
      if (event.pointerType === 'touch') {
        const remainder = dy - (y - oldY);
        if (Math.abs(remainder) > .1) window.scrollBy({ top: -remainder, behavior: 'instant' });
      }
    }
    if (mode === 'pinch' || Math.hypot(current.x - start.x, current.y - start.y) > 5) suppressUntil = performance.now() + 500;
    draw();
  }, { capture: true, passive: false });
  const finish = event => {
    if (cancellingBlock) return;
    if (!pointers.has(event.pointerId)) return;
    const wasBlock = mode === 'block';
    pointers.delete(event.pointerId);
    if (!wasBlock) {
      event.preventDefault(); event.stopImmediatePropagation();
      try { viewport.releasePointerCapture(event.pointerId); } catch {}
      if (mode === 'pinch') suppressUntil = performance.now() + 500;
      // Preserve taps on fixed blocks; a pan or pinch never opens an editor.
      if (event.pointerType === 'touch' && event.type === 'pointerup' && pointers.size === 0 && performance.now() >= suppressUntil) {
        const button = document.elementFromPoint(event.clientX, event.clientY)?.closest('.node-action,.token');
        if (button && viewport.contains(button)) button.click();
        else onBlankTap();
      }
      if (event.pointerType === 'mouse' && event.button === 0 && event.type === 'pointerup' && performance.now() >= suppressUntil) onBlankTap();
    }
    if (pointers.size) { mode = 'pan'; begin(); }
    else { mode = ''; blockTarget = null; }
  };
  window.addEventListener('pointerup', finish, { capture: true, passive: false });
  window.addEventListener('pointercancel', finish, { capture: true, passive: false });
  viewport.addEventListener('click', event => {
    if (event.target.closest('.canvas-navigation')) return;
    if (performance.now() < suppressUntil) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  return {
    fit(value) {
      const ratio = value / base;
      if (zoom > 1) { x *= ratio; y *= ratio; }
      base = value; draw();
    }
  };
}
