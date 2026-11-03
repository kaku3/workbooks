import { operations, clone, createRun, step, finish, judge } from './engine.mjs';
import { drills } from './drills.mjs';
import { snapPosition } from './snap.mjs';
import { groupDelta } from './group-move.mjs';
import { operationChanges, effectLines, inputLabel, resultPhase } from './operation-ui.mjs';
import { connectionPath } from './connections.mjs';
import { resolveStoryDrill, stages } from './story.mjs';
import { installStoryUI } from './story-ui.mjs';
const requestedDrill = new URLSearchParams(location.search).get('drill');
const storyMode = new URLSearchParams(location.search).get('mode') === 'story';
const titleMode = !requestedDrill && !storyMode;
const drill = drills.find(d => d.id === (storyMode ? resolveStoryDrill(requestedDrill) : requestedDrill)) || drills[0];
const { initialGraph, tests } = drill;
const $ = s => document.querySelector(s);
const el = (tag, text, className) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (className) e.className = className; return e; };
const KEY = `design-block-drill.v2.${drill.id}`;
let graph = clone(initialGraph), selected = initialGraph.nodes[0].id, test = tests[0] || null, run, timer, selectedToken = 0;
let results = {};
let caseFilter = 'all';
let selectedNodes = new Set();
let logSource = null;
const effectFlights = new Set();
let batchRun = null;
let resultDismissTimer;
let drawerOpen = false;
let drawerMinimized = false;
let drawerSize = 'fit';
let assertionFilter = 'all';
let panningLogs = false;
let stampedRun = null;
let routePreview = null;
let pendingRoutes = {};
function previewRoute(target, kind) {
  routePreview = target ? { target, kind } : null;
  drawEdges();
}
const catalog = [...initialGraph.nodes, ...(drill.availableBlocks || [])];
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved?.nodes && initialGraph.nodes.every(n => saved.nodes.some(s => s.id === n.id)) && new Set(saved.nodes.map(n => n.id)).size === saved.nodes.length && saved.nodes.every(n => catalog.some(i => i.id === n.id) && Array.isArray(n.operations) && n.operations.every(o => drill.allowedOperations.includes(o)) && Number.isFinite(n.x) && Number.isFinite(n.y)) && JSON.stringify(saved.entries) === JSON.stringify(initialGraph.entries)) graph = saved;
} catch {}
if (!drill.allowMove) graph.nodes.forEach(n => { const position = initialGraph.nodes.find(x => x.id === n.id); n.x = position.x; n.y = position.y; });
function pause() { clearInterval(timer); timer = null; }
function openBlock(mode = 'block') {
  $('#editor').hidden = mode !== 'block';
  $('#blockSelection').hidden = mode !== 'block';
  $('.state-panel').hidden = mode !== 'state';
  $('#editorHelp').hidden = mode !== 'block';
  $('.block-heading h2').firstChild.textContent = mode === 'block' ? '\u30d6\u30ed\u30c3\u30af\u306e\u7de8\u96c6' : drill.chapter === 2 ? '\u7533\u8acb\u306e\u8a73\u7d30' : '\u8377\u7269\u30fb\u5728\u5eab\u306e\u8a73\u7d30';
  $('.canvas-stage').classList.add('block-panel-open');
  $('#blockDrawer').classList.add('open');
  $('#blockDrawer').inert = false;
  $('#blockDrawer').setAttribute('aria-hidden', 'false');
  fitCanvas();
}
// 旧レイアウトの保存データも、接続・カードを保ったまま画面内へ収める。
if (graph.nodes.some(n => n.y > 500)) graph.nodes.forEach(n => { const layout = catalog.find(x => x.id === n.id); n.x = layout.x; n.y = layout.y; });
function setDrawer(open, focus = true) {
  drawerOpen = open;
  $('#testDrawer').classList.toggle('open', open);
  $('#testDrawer').inert = !open;
  $('#testDrawer').setAttribute('aria-hidden', String(!open));
  document.querySelector('main').classList.toggle('test-panel-open', open);
  if (open && focus) $('#closeTestDrawer').focus({ preventScroll: true });
  renderCases();
  positionTestDrawer();
}
function positionTestDrawer() {
  const top = Math.max(12, $('.tests.panel').getBoundingClientRect().bottom + 8);
  const bottom = drawerSize === 'max' ? innerHeight - 12 : Math.min(innerHeight - 12, $('.log-panel').getBoundingClientRect().top);
  $('#testDrawer').style.setProperty('--test-drawer-top', `${top}px`);
  $('#testDrawer').style.setProperty('--test-drawer-height', `${Math.max(36, bottom - top)}px`);
}
function minimizeTestDrawer(minimized) { setTestDrawerSize(minimized ? 'min' : 'fit'); }
function setTestDrawerSize(size) {
  drawerSize = size; drawerMinimized = size === 'min';
  $('#testDrawer').classList.toggle('minimized', drawerMinimized);
  $('#testDrawer .drawer-body').hidden = drawerMinimized;
  $('#drawerSizes').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.size === size)));
  positionTestDrawer(); renderCases();
}
function canvasWidth() { return parseFloat($('#canvas').style.width) || 910; }
function fitCanvas() {
  const width = Math.max(910, $('.canvas-viewport').clientWidth, ...graph.nodes.map(n => n.x + 200));
  $('#canvas').style.width = `${width}px`;
  const scale = Math.min(1, $('.canvas-viewport').clientWidth / width);
  $('#canvas').style.transform = `scale(${scale})`;
  $('.canvas-viewport').style.height = `${Math.max(420, 560 * scale + 40)}px`;
  fitEditorHeight();
  drawEdges();
}
function fitEditorHeight() {
  const viewport = $('.canvas-viewport'), palette = $('#blockPalette');
  const bottom = palette.hidden ? viewport.getBoundingClientRect().bottom : palette.getBoundingClientRect().bottom;
  $('.canvas-stage').style.setProperty('--canvas-editor-height', `${bottom - viewport.getBoundingClientRect().top}px`);
  positionTestDrawer();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(graph)); } catch {} }
function placeBlock(id, position) {
  if (!drill.allowPlace) return;
  const template = drill.availableBlocks?.find(b => b.id === id);
  if (!template || graph.nodes.some(n => n.id === id)) return;
  const node = clone(template);
  if (!position) position = [70, 220, 400].flatMap(y => [40, 330, 620].map(x => ({ x, y }))).find(p => !graph.nodes.some(n => Math.abs(n.x - p.x) < 230 && Math.abs(n.y - p.y) < 65)) || { x: 40, y: 480 };
  Object.assign(node, snapPosition(position.x, position.y, graph.nodes, id, 1, false, { width: canvasWidth() }));
  // New blocks have no hidden connections. The player connects them explicitly.
  node.success = 'END'; node.failure = 'END';
  graph.nodes.push(node); selected = id; changed(); openBlock();
}
function renderPalette() {
  const area = $('#blockPalette'); area.hidden = !drill.allowPlace;
  if (!drill.allowPlace) return;
  area.replaceChildren(el('strong', '未配置ブロック'));
  drill.availableBlocks.filter(b => !graph.nodes.some(n => n.id === b.id)).forEach(b => {
    const card = el('button', b.label, 'palette-block'); card.draggable = true; card.dataset.block = b.id;
    card.onclick = () => placeBlock(b.id);
    card.ondragstart = e => { e.dataTransfer.setData('text/plain', b.id); e.dataTransfer.effectAllowed = 'copy'; }; area.append(card);
  });
  if (area.children.length === 1) area.append(el('span', 'すべて配置済み', 'rule'));
}
function reset() { pause(); clearProcessingEffects(); batchRun = null; run = test ? createRun(graph, test) : { tokens: [], logs: [], step: 0, status: 'ready' }; selectedToken = 0; render(); }
function changed() { save(); reset(); renderEditor(); renderPalette(); }
function renderCases() {
  $('#caseFilters').hidden = !Object.keys(results).length && !batchRun;
  const counts = { all: tests.length, pass: Object.values(results).filter(value => value === true).length, fail: Object.values(results).filter(value => value === false).length };
  const filterLabels = { all: 'すべて', pass: 'Pass', fail: 'Fail' };
  $('#caseFilters').querySelectorAll('button').forEach(button => { button.textContent = `${filterLabels[button.dataset.filter]}(${counts[button.dataset.filter]})`; });
  $('#cases').replaceChildren(...tests.map(t => {
    const b = el('button', undefined, `case${t.id === test?.id ? ' active' : ''}`);
    b.dataset.result = results[t.id] === undefined ? 'pending' : results[t.id] ? 'pass' : 'fail';
    b.hidden = caseFilter !== 'all' && b.dataset.result !== caseFilter;
    const caption = el('small', t.id);
    caption.append(el('span', results[t.id] === undefined ? '—' : results[t.id] ? 'Pass' : 'Fail', `case-result ${results[t.id] === undefined ? 'muted' : results[t.id] ? 'pass' : 'fail'}`));
    b.append(caption, el('strong', t.title));

    const info = el('span', undefined, 'case-info');
    info.append(el('span', '概要', 'case-info-label'), el('span', t.description), el('span', '観点', 'case-info-label'), el('span', t.perspective)); b.append(info);
    b.setAttribute('aria-pressed', String(t.id === test?.id)); b.title = t.description;
    b.setAttribute('aria-controls', 'testDrawer'); b.setAttribute('aria-expanded', String(t.id === test?.id && drawerOpen && !drawerMinimized));
    b.onclick = () => { if (batchRun || test?.id !== t.id) { test = t; reset(); } minimizeTestDrawer(false); setDrawer(true); }; return b;
  }));
  if (![...$('#cases').children].some(card => !card.hidden)) $('#cases').append(el('span', '該当するケースはありません', 'case-filter-empty'));
}
function renderNodes() {
  $('#nodes').replaceChildren(...graph.nodes.map(n => {
    const box = el('div', undefined, `node${selected === n.id ? ' selected' : ''}${selectedNodes.has(n.id) ? ' group-selected' : ''}${run.tokens.some(t => t.node === n.id && !['completed', 'queued'].includes(t.status)) ? ' active-node' : ''}`);
    box.style.left = `${n.x}px`; box.style.top = `${n.y}px`; box.dataset.node = n.id;
    const heading = el('h3'); const edit = el('button', n.label, 'node-action'); edit.setAttribute('aria-label', `${n.label}を編集`);
    edit.onclick = () => { selectedNodes.clear(); selected = n.id; openBlock(); renderNodes(); drawEdges(); renderEditor(); scrollToBlockLog(n.id); }; heading.append(edit); box.append(heading);
    box.title = n.operations.map(o => operations[o][0]).join(' → ') || '処理未設定';
    let drag;
    box.ondragstart = e => e.preventDefault();
    box.onpointerdown = e => {
      if (e.button !== 0 || !drill.allowMove) return;
      e.preventDefault(); pause();
      if (!selectedNodes.has(n.id)) selectedNodes.clear();
      const positions = graph.nodes.filter(item => selectedNodes.has(item.id)).map(item => ({ id: item.id, x: item.x, y: item.y }));
      drag = { x: e.clientX, y: e.clientY, left: n.x, top: n.y, pointerId: e.pointerId, positions, moved: false };
      box.setPointerCapture(e.pointerId); window.addEventListener('pointermove', moveDrag); window.addEventListener('pointerup', stopDrag); window.addEventListener('pointercancel', cancelDrag);
    };
    const moveDrag = e => {
      if (!drag || e.pointerId !== drag.pointerId || Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 3) return;
      const scale = $('#canvas').getBoundingClientRect().width / canvasWidth();
      drag.moved = true;
      if (drag.positions.length > 1) {
        let dx = (e.clientX - drag.x) / scale, dy = (e.clientY - drag.y) / scale;
        if (!e.shiftKey) { dx = Math.round(dx / 20) * 20; dy = Math.round(dy / 20) * 20; }
        const delta = groupDelta(drag.positions, dx, dy, canvasWidth());
        for (const origin of drag.positions) {
          const item = graph.nodes.find(item => item.id === origin.id);
          item.x = origin.x + delta.x; item.y = origin.y + delta.y;
          const card = document.querySelector(`[data-node="${item.id}"]`);
          card.style.left = `${item.x}px`; card.style.top = `${item.y}px`;
        }
        drawEdges(); renderTokens(); return;
      }
      const point = snapPosition(drag.left + (e.clientX - drag.x) / scale, drag.top + (e.clientY - drag.y) / scale, graph.nodes, n.id, scale, e.shiftKey, { width: canvasWidth() });
      n.x = point.x; n.y = point.y;
      box.style.left = `${n.x}px`; box.style.top = `${n.y}px`; drawEdges(); renderTokens();
      for (const [axis, value] of [['x', point.guideX], ['y', point.guideY]]) {
        if (value === null) continue;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.classList.add('snap-guide');
        line.setAttribute('x1', axis === 'x' ? value : 0); line.setAttribute('x2', axis === 'x' ? value : canvasWidth());
        line.setAttribute('y1', axis === 'y' ? value : 0); line.setAttribute('y2', axis === 'y' ? value : 560);
        line.setAttribute('stroke', '#8d60ba'); line.setAttribute('stroke-width', '1'); line.setAttribute('stroke-dasharray', '5 4'); $('#lines').append(line);
      }
    };
    const releaseDrag = () => { window.removeEventListener('pointermove', moveDrag); window.removeEventListener('pointerup', stopDrag); window.removeEventListener('pointercancel', cancelDrag); drag = null; };
    const stopDrag = e => {
      if (!drag || e.pointerId !== drag.pointerId) return;
      const groupMoved = drag.moved && drag.positions.length > 1;
      releaseDrag();
      if (!groupMoved) { selectedNodes.clear(); selected = n.id; openBlock(); scrollToBlockLog(n.id); }
      save(); renderNodes(); drawEdges(); renderEditor();
    };
    const cancelDrag = e => { if (!drag || e.pointerId !== drag.pointerId) return; releaseDrag(); save(); drawEdges(); };
    return box;
  }));
}
function name(id) { return id === 'END' ? '(完了)' : graph.nodes.find(n => n.id === id)?.label || '(未設定)'; }
// Drag empty canvas space to select intersecting blocks in canvas coordinates.
$('.canvas-viewport').addEventListener('pointerdown', event => {
  if (titleMode || event.button !== 0 || event.target.closest('.node,.token,button')) return;
  event.preventDefault(); pause();
  const canvas = $('#canvas'), previous = new Set(selectedNodes);
  const point = e => { const r = canvas.getBoundingClientRect(), scale = r.width / canvasWidth(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; };
  const start = point(event), marquee = el('div', undefined, 'selection-marquee');
  let dragged = false;
  canvas.append(marquee); canvas.setPointerCapture(event.pointerId);
  const move = e => {
    if (e.pointerId !== event.pointerId) return;
    if (Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY) >= 4) dragged = true;
    if (!drill.allowMove) return;
    const end = point(e), left = Math.min(start.x, end.x), top = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x), height = Math.abs(end.y - start.y);
    Object.assign(marquee.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
    selectedNodes = new Set(graph.nodes.filter(n => {
      const card = document.querySelector(`[data-node="${n.id}"]`);
      return width > 3 && height > 3 && n.x < left + width && n.x + card.offsetWidth > left && n.y < top + height && n.y + card.offsetHeight > top;
    }).map(n => n.id));
    $('#nodes').querySelectorAll('.node').forEach(card => card.classList.toggle('group-selected', selectedNodes.has(card.dataset.node)));
  };
  const finish = e => {
    if (e.pointerId !== event.pointerId) return;
    if (e.type === 'pointercancel') selectedNodes = previous;
    else move(e);
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    marquee.remove();
    if (e.type !== 'pointercancel' && !dragged) {
      selected = null; selectedNodes.clear(); pendingRoutes = {}; routePreview = null;
      $('.canvas-stage').classList.remove('block-panel-open');
      $('#blockDrawer').classList.remove('open'); $('#blockDrawer').inert = true;
      $('#blockDrawer').setAttribute('aria-hidden', 'true');
      if ($('#operationFloatingHelp')) $('#operationFloatingHelp').hidden = true;
      $('#logs').querySelectorAll('.selected-block-log').forEach(card => card.classList.remove('selected-block-log'));
      fitCanvas();
    }
    renderNodes(); drawEdges();
  };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
});
function drawEdges() {
  const ns = 'http://www.w3.org/2000/svg', lines = $('#lines'); lines.replaceChildren();
  graph.nodes.forEach(n => ['success', 'failure'].forEach((kind, i) => {
    const target = graph.nodes.find(t => t.id === n[kind]); if (!target) return;
    const a = document.querySelector(`[data-node="${n.id}"]`), b = document.querySelector(`[data-node="${target.id}"]`);
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', connectionPath({ ...n, width: a.offsetWidth, height: a.offsetHeight }, { ...target, width: b.offsetWidth, height: b.offsetHeight }, !!i));
    p.setAttribute('fill', 'none'); p.setAttribute('stroke', i ? '#ca7951' : '#267a6b'); p.setAttribute('stroke-width', '2'); if (i) p.setAttribute('stroke-dasharray', '6 5'); p.setAttribute('marker-end', `url(#arrow-${i ? 'fail' : 'ok'})`); lines.append(p);
    if (n.id === selected && Object.hasOwn(pendingRoutes, kind)) p.setAttribute('opacity', '.25');
  }));
  for (const [kind, target] of Object.entries(pendingRoutes)) {
    const from = graph.nodes.find(n => n.id === selected), to = graph.nodes.find(n => n.id === target);
    if (!from) continue;
    const x = from.x + 200, y = from.y + (kind === 'failure' ? 29 : 11);
    const endX = to ? to.x : x + 45, endY = to ? to.y + 20 : y;
    const p = document.createElementNS(ns, 'path'); p.classList.add('route-pending'); p.dataset.kind = kind; p.dataset.target = target;
    p.setAttribute('d', `M${x},${y} C${x + 45},${y} ${endX - 45},${endY} ${endX},${endY}`);
    p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#8560bf'); p.setAttribute('stroke-width', '3'); p.setAttribute('stroke-dasharray', '7 5'); lines.append(p);
    const label = document.createElementNS(ns, 'text'); label.setAttribute('x', String(x)); label.setAttribute('y', String(y - 8)); label.classList.add('pending-route-label');
    label.textContent = `${kind === 'success' ? '成功' : '失敗'}：${to ? '変更予定' : target === 'END' ? '終了予定' : '未接続予定'}`; lines.append(label);
  }
  if (routePreview) {
    const from = graph.nodes.find(n => n.id === selected), to = graph.nodes.find(n => n.id === routePreview.target);
    if (from && to) {
      const p = document.createElementNS(ns, 'path'); p.classList.add('route-preview');
      p.setAttribute('d', connectionPath(from, to, routePreview.kind === 'failure'));
      p.setAttribute('fill', 'none'); p.setAttribute('stroke', routePreview.kind === 'failure' ? '#ca7951' : '#267a6b'); p.setAttribute('stroke-width', '5'); p.setAttribute('stroke-dasharray', '8 4');
      p.setAttribute('marker-end', `url(#arrow-${routePreview.kind === 'failure' ? 'fail' : 'ok'})`); lines.append(p);
    }
  }
}
function renderTokens() {
  const container = $('#tokens');
  if (container.childElementCount !== run.tokens.length) container.replaceChildren(...run.tokens.map((t, i) => {
    const b = el('button', undefined, 'token');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('width', '15'); icon.setAttribute('height', '15'); icon.setAttribute('aria-hidden', 'true'); icon.classList.add('parcel-icon');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    icon.classList.toggle('document-icon', !!run.state.requests);
    path.setAttribute('d', run.state.requests ? 'M6 2h8l4 4v16H6V2Zm8 0v5h4M9 11h6M9 15h6M9 18h4' : 'M3 7l9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10M7.5 5l9 4v5'); path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.6'); path.setAttribute('stroke-linejoin', 'round'); icon.append(path);
    b.append(icon, el('span', `${t.id} · ${t.orderId}`)); b.onclick = () => selectToken(i); return b;
  }));
  run.tokens.forEach((t, i) => {
    const n = graph.nodes.find(n => n.id === t.node), b = container.children[i];
    const group = run.tokens.filter(other => other.node === t.node), position = group.indexOf(t);
    const gap = Math.max(28, ...[...container.children].map(button => button.offsetHeight + 6));
    const above = (n?.y || 0) - group.length * gap;
    b.className = `token ${t.status}`; b.dataset.nodeId = t.node;
    b.style.left = `${(n?.x || 0) + 12}px`;
    b.style.top = `${above >= 4 ? above + position * gap : (n?.y || 0) + 46 + position * gap}px`;
    b.title = `${t.status} ${t.reason || t.last?.reason || ''}`;
  });
  run.tokens.forEach((t, i) => { const b = container.children[i]; b.classList.toggle('selected-token', i === selectedToken); b.setAttribute('aria-pressed', String(i === selectedToken)); b.setAttribute('aria-label', `${t.id} ${t.orderId}の状態を表示`); b.title = `${t.id} ${t.orderId}：クリックで下の状態欄に表示`; });
  run.tokens.forEach((t, i) => {
    if (run.state.requests) {
      const b = container.children[i], r = run.state.requests[t.orderId];
      b.querySelectorAll('.quantity-badge,.reservation-badge').forEach(b => b.remove());
      let badge = b.querySelector('.request-badge'); if (!badge) { badge = el('span', undefined, 'request-badge'); b.append(badge); }
      badge.textContent = `版${r.revision} ${r.paymentStatus === 'paid' ? '振込済' : '未振込'}`; return;
    }
    const order = run.state.orders[t.orderId];
    const quantity = order.reservedQuantity;
    const remaining = Math.max(0, order.quantity - quantity);
    const b = container.children[i];
    let remainingBadge = b.querySelector('.quantity-badge');
    if (!remainingBadge) { remainingBadge = el('span', undefined, 'quantity-badge'); b.append(remainingBadge); }
    remainingBadge.textContent = `数量 ${remaining}`;
    remainingBadge.title = `未引当の数量（注文総数 ${order.quantity}個）`;
    let badge = b.querySelector('.reservation-badge');
    if (!badge) { badge = el('span', undefined, 'reservation-badge'); b.append(badge); }
    badge.textContent = `引当 ${quantity}`;
    b.setAttribute('aria-label', `${t.id} ${t.orderId} 未引当の数量${remaining}個、引当${quantity}個。クリックで状態を表示`);
  });

}
function selectToken(index) {
  selectedToken = index; renderTokens(); renderState();
  openBlock('state');
}

function selectControl(label, value, values, onChange) {
  const wrap = el('label', label); const input = el('select');
  values.forEach(([id, text]) => { const option = el('option', text); option.value = id; input.append(option); }); input.value = value;
  input.onchange = () => onChange(input.value); wrap.append(input); return wrap;
}
function attachOperationHelp(target, id) {
  target.setAttribute('aria-describedby', 'operationFloatingHelp');
  const hide = () => { const popup = $('#operationFloatingHelp'); if (popup) popup.hidden = true; };
  const show = () => {
    let popup = $('#operationFloatingHelp');
    if (!popup) {
      popup = el('aside', undefined, 'operation-floating-help'); popup.id = 'operationFloatingHelp'; popup.setAttribute('role', 'tooltip'); document.body.append(popup);
    }
    popup.replaceChildren(el('strong', operations[id][0]), el('p', operations[id][1]), el('span', '成功時の変化', 'operation-help-label'), el('p', operationChanges[id] || '処理結果を実行ログで確認できます。'));
    popup.hidden = false;
    const rect = target.getBoundingClientRect(), width = popup.offsetWidth;
    let left = rect.right + 10;
    if (left + width > innerWidth - 12) left = rect.left - width - 10;
    popup.style.left = `${Math.max(12, Math.min(left, innerWidth - width - 12))}px`;
    popup.style.top = `${Math.max(12, Math.min(rect.top, innerHeight - popup.offsetHeight - 12))}px`;
  };
  target.addEventListener('pointerenter', show); target.addEventListener('pointerleave', hide);
  target.addEventListener('focus', () => { if (target.matches(':focus-visible')) show(); }); target.addEventListener('blur', hide);
  target.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
}
function clearProcessingEffects() {
  for (const flight of effectFlights) flight.cancel();
  effectFlights.clear();
}
function processingCard(log) {
  const card = el('article', undefined, 'processing-card'); card.tabIndex = 0; card.setAttribute('role', 'button');
  card.dataset.nodeId = log.node; card.dataset.step = log.step; card.dataset.status = log.status;
  if (log.inputEvent) card.append(el('small', `入力 ${log.inputIndex}/${log.inputCount} · ${inputLabel(log.inputEvent, run.graph)}`, 'processing-input'));
  card.append(el('small', `#${log.step} · ${name(log.node)}`, 'processing-origin'), el('strong', log.operation));
  if (log.reason) card.append(el('span', log.reason));
  const changes = effectLines(log);
  (changes.length ? changes : [log.status === 'failure' ? '変更なし（失敗）' : log.status === 'wait' ? '待機中・変更なし' : '変更なし']).forEach(line => card.append(el('span', line)));
  return card;
}
function scrollToBlockLog(id) {
  const logs = $('#logs');
  const cards = [...logs.children];
  cards.forEach(card => card.classList.toggle('selected-block-log', card.dataset.nodeId === id));
  const first = cards.find(card => card.dataset.nodeId === id);
  if (first) logs.scrollTo({ left: logs.scrollLeft + first.getBoundingClientRect().left - logs.getBoundingClientRect().left - 8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
function showProcessingEffect(log) {
  if (!log) return;
  const node = document.querySelector(`[data-node="${log.node}"]`), target = $('#logs').querySelector(`[data-step="${log.step}"]`);
  if (!node || !target || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const effect = processingCard(log); effect.classList.add('processing-effect'); effect.setAttribute('aria-hidden', 'true'); effect.tabIndex = -1;
  const origin = node.getBoundingClientRect();
  effect.style.left = `${Math.max(8, Math.min(origin.left, innerWidth - 268))}px`;
  effect.style.top = `${Math.max(8, Math.min(origin.bottom + 6, innerHeight - 180))}px`;
  document.body.append(effect); target.classList.add('incoming-log');
  let timer, animation;
  const flight = { cancel() { clearTimeout(timer); animation?.cancel(); effect.remove(); target.classList.remove('incoming-log'); effectFlights.delete(flight); } };
  effectFlights.add(flight);
  timer = setTimeout(() => {
    if (!target.isConnected) { flight.cancel(); return; }
    const from = effect.getBoundingClientRect(), to = target.getBoundingClientRect(), bounds = $('#logs').getBoundingClientRect();
    const x = Math.max(bounds.left, Math.min(to.left, bounds.right - Math.min(to.width, bounds.width)));
    animation = effect.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${x - from.left}px,${to.top - from.top}px) scale(.85)`, opacity: .45 },
    ], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
    animation.onfinish = () => flight.cancel();
  }, 700);
}
function renderEditor(adding = false) {
  if ($('#operationFloatingHelp')) $('#operationFloatingHelp').hidden = true;
  routePreview = null; pendingRoutes = {}; drawEdges();
  const n = graph.nodes.find(n => n.id === selected), editor = $('#editor');
  if (!n) { editor.replaceChildren(); return; }
  editor.replaceChildren(el('h3', n.label));
  const blockPreview = el('div', undefined, 'node selected block-preview');
  blockPreview.append(el('h3', undefined));
  blockPreview.firstChild.append(el('strong', n.label, 'node-action'));
  $('#blockSelection').replaceChildren(blockPreview);
  if (drill.availableBlocks?.some(b => b.id === n.id)) {
    const remove = el('button', 'パレットに戻す', 'return-block');
    remove.onclick = () => { graph.nodes = graph.nodes.filter(b => b.id !== n.id); graph.nodes.forEach(b => { for (const key of ['success', 'failure']) if (b[key] === n.id) b[key] = ''; }); selected = graph.nodes[0].id; changed(); };
    editor.append(remove, el('p', '戻すと、このブロックへの接続は(未設定)になります。', 'rule'));
  }
  editor.append(el('h4', '処理', 'registered-heading'));
  if (!n.operations.length) editor.append(el('p', 'まだ処理が登録されていません。', 'rule'));
  n.operations.forEach((o, i) => {
    const row = el('div', undefined, 'op-row'); const text = el('span', operations[o][0]); text.tabIndex = 0; attachOperationHelp(text, o); row.append(text);
    for (const [label, action, disabled] of [['↑', () => { [n.operations[i - 1], n.operations[i]] = [n.operations[i], n.operations[i - 1]]; }, i === 0], ['↓', () => { [n.operations[i + 1], n.operations[i]] = [n.operations[i], n.operations[i + 1]]; }, i === n.operations.length - 1], ['×', () => n.operations.splice(i, 1), false]]) {
      const b = el('button', label); b.disabled = disabled; b.setAttribute('aria-label', `${operations[o][0]} ${label === '×' ? '削除' : label === '↑' ? '上へ' : '下へ'}`); b.onclick = () => { action(); changed(); }; row.append(b);
    } editor.append(row);
    const [up, down, remove] = row.querySelectorAll('button');
    remove.className = 'delete-operation'; remove.replaceChildren();
    const icon = document.createElementNS(NS_FOR_ICON(), 'svg'); icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('width', '13'); icon.setAttribute('height', '13'); icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(NS_FOR_ICON(), 'path'); path.setAttribute('d', 'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7'); path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor'); path.setAttribute('stroke-width', '1.7'); icon.append(path); remove.append(icon);
    row.append(remove, up, down);
    up.className = 'move-up'; down.className = 'move-down';
  });
  if (!adding) {
    const open = el('button', '追加', 'primary open-add-operation'); open.id = 'openAddOperation';
    open.onclick = event => { renderEditor(true); if (event.detail === 0) $('#editor .operation-choice:not(:disabled)')?.focus(); };
    editor.append(open); renderRoutes(n, editor); return;
  }
  const form = el('div', undefined, 'add-operation mode-add'); editor.append(form);
  const modeHeading = el('div', undefined, 'operation-mode-heading');
  modeHeading.append(el('div', '追加モード', 'operation-mode')); form.append(modeHeading);
  form.append(el('div', '処理', 'operation-label'));
  const choices = el('div', undefined, 'operation-choices'); choices.setAttribute('role', 'group'); choices.setAttribute('aria-label', '処理を選択');
  Object.entries(operations).filter(([id]) => drill.allowedOperations.includes(id)).forEach(([id, [label, rule]]) => {
    const button = el('button', label, 'operation-choice'); button.type = 'button'; button.dataset.operation = id; attachOperationHelp(button, id);
    button.disabled = n.operations.includes(id);
    button.onclick = () => { if (n.operations.includes(id)) return; n.operations.push(id); previewRoute(null); changed(); $('#openAddOperation')?.focus(); };
    choices.append(button);
  }); form.append(choices);
  const cancel = el('button', '取消', 'cancel-edit'); cancel.onclick = () => { renderEditor(); $('#openAddOperation')?.focus(); }; modeHeading.append(cancel);
  renderRoutes(n, editor);
}
function renderRoutes(n, editor) {
  const form = el('div', undefined, 'block-routes'); editor.append(form);
  form.append(el('h4', '遷移先', 'routes-heading'));
  const draft = { success: n.success, failure: n.failure };
  const targets = [['', '(未設定)'], ['END', '(完了)'], ...graph.nodes.map(x => [x.id, x.label])];
  for (const [key, label] of [['success', '成功時'], ['failure', '失敗時']]) {
    const field = el('div', undefined, 'route-field'); field.dataset.route = key;
    const caption = el('div', label, 'route-label'), row = el('div', undefined, 'route-current'), value = el('span', name(draft[key]));
    const toggle = el('button', '編集'); toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false');
    const options = el('div', undefined, 'route-options'); options.hidden = true;
    options.id = `route-${key}`; toggle.setAttribute('aria-controls', options.id);
    for (const [id, title] of targets) {
      const option = el('button', title); option.type = 'button'; option.dataset.target = id;
      option.onmouseenter = option.onfocus = () => previewRoute(id, key);
      option.onmouseleave = option.onblur = () => previewRoute(null);
      option.onclick = () => { n[key] = id; previewRoute(null); changed(); };

      options.append(option);
    }
    toggle.onclick = () => { const open = options.hidden; form.querySelectorAll('.route-options').forEach(list => { list.hidden = true; }); form.querySelectorAll('.route-current button').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.textContent = '編集'; }); options.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? '取消' : '編集'; previewRoute(null); };
    options.onkeydown = e => { if (e.key === 'Escape') { e.stopPropagation(); options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = '編集'; toggle.focus(); previewRoute(null); } };
    row.append(value, toggle); field.append(caption, row, options); form.append(field);
  }

}
function NS_FOR_ICON() { return 'http://www.w3.org/2000/svg'; }
function stateTable(title, headers, rows, selectedRow = -1) {
  const wrap = el('div', undefined, 'state-table-wrap'), table = el('table');
  table.append(el('caption', title));
  const head = el('thead'), heading = el('tr');
  headers.forEach(label => { const cell = el('th', label); cell.scope = 'col'; heading.append(cell); }); head.append(heading); table.append(head);
  const body = el('tbody');
  rows.forEach((values, i) => { const row = el('tr'); row.classList.toggle('selected-state-row', i === selectedRow); values.forEach(value => row.append(el('td', String(value)))); body.append(row); });
  table.append(body); wrap.append(table); return wrap;
}
function parcelTable(title, fields, values) {
  const wrap = el('div', undefined, 'state-table-wrap'), table = el('table', undefined, 'parcel-state-table');
  table.append(el('caption', title));
  const head = el('thead'), row = el('tr');
  row.append(el('th', '項目'));
  run.tokens.forEach((token, i) => { const cell = el('th', token.id); cell.scope = 'col'; cell.classList.toggle('selected-state-column', i === selectedToken); row.append(cell); });
  head.append(row); table.append(head);
  const body = el('tbody');
  fields.forEach((label, index) => {
    const row = el('tr'), heading = el('th', label); heading.scope = 'row'; row.append(heading);
    values.forEach((column, i) => { const cell = el('td', String(column[index])); cell.classList.toggle('selected-state-column', i === selectedToken); row.append(cell); }); body.append(row);
  });
  table.append(body); wrap.append(table); return wrap;
}
function appendParcelSection(wrap, title, fields, values) {
  const body = wrap.querySelector('tbody'), row = el('tr', undefined, 'state-section-row');
  const header = el('th', title); header.colSpan = run.tokens.length + 1; header.scope = 'rowgroup'; row.append(header); body.append(row);
  fields.forEach((label, index) => {
    const row = el('tr'), heading = el('th', label); heading.scope = 'row'; row.append(heading);
    values.forEach((column, i) => { const cell = el('td', String(column[index])); cell.classList.toggle('selected-state-column', i === selectedToken); row.append(cell); }); body.append(row);
  });
}
function renderState() {
  const area = $('#state'); area.replaceChildren();
  if (!test) { area.append(el('p', '\u30c6\u30b9\u30c8\u30b1\u30fc\u30b9\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002', 'rule')); return; }
  if (run.state.requests) {
    const records = run.tokens.map(t => [t.orderId, run.state.requests[t.orderId]]);
    const details = parcelTable('申請の状態', ['申請', '金額', '版', '承認', '承認版', '経理確認', '確認版', '振込', '振込版'], records.map(([id, r]) => [id, `${r.amount}円`, r.revision, r.approvalStatus, r.approvedRevision ?? '—', r.accountingStatus, r.verifiedRevision ?? '—', r.paymentStatus, r.paidRevision ?? '—']));
    area.append(details);
    appendParcelSection(details, '実行位置・結果', ['実行者', '位置', '状態', '理由'], run.tokens.map(t => [t.event.actorId, name(t.node), t.status, t.reason || t.last?.reason || '—']));
    appendParcelSection(details, '振込・通知の実行回数（申請単位）', ['振込回数', '通知数', '不正な振込'], run.tokens.map(t => ['transfer', 'paidEmail', 'invalid'].map(type => run.state.effects.filter(e => e.orderId === t.orderId && (type === 'invalid' ? e.type === 'transfer' && !e.valid : e.type === type)).length)));
    return;
  }
  area.append(el('p', '\u5728\u5eab\u306f\u3059\u3079\u3066\u306e\u6ce8\u6587\u3067\u5171\u901a\u3057\u3066\u4f7f\u3046\u30c7\u30fc\u30bf\u3067\u3059\u3002', 'rule'));
  area.append(stateTable('\u5546\u54c1\u5225\u306e\u5728\u5eab', ['\u5546\u54c1', '\u5728\u5eab', '\u5f15\u5f53\u6570'], Object.entries(run.state.inventory).map(([id, stock]) => [id, stock, Object.values(run.state.orders).filter(o => o.itemId === id).reduce((sum, o) => sum + o.reservedQuantity, 0)])));
  const orders = run.tokens.map(t => [t.orderId, run.state.orders[t.orderId]]);
  const parcelDetails = parcelTable('\u6ce8\u6587\u30fb\u8377\u7269\u306e\u72b6\u614b', ['\u6ce8\u6587', '\u5546\u54c1', '\u6ce8\u6587\u6570', '\u5f15\u5f53', '\u5f15\u5f53\u72b6\u614b', '\u6c7a\u6e08', '\u51fa\u8377', '\u53d6\u6d88', '\u6ce8\u6587\u72b6\u614b'], orders.map(([id, o]) => [id, o.itemId, o.quantity, o.reservedQuantity, o.reservationStatus, o.paymentStatus, o.shippingStatus, o.cancellationStatus, o.orderStatus]));
  area.append(parcelDetails);
  appendParcelSection(parcelDetails, '\u5b9f\u884c\u4f4d\u7f6e\u30fb\u7d50\u679c', ['\u4f4d\u7f6e', '\u72b6\u614b', '\u76f4\u8fd1\u306e\u64cd\u4f5c', '\u7406\u7531'], run.tokens.map(t => [name(t.node), t.status, t.last?.operation || '-', t.reason || t.last?.reason || '-']));
  const types = [['shipping', '\u51fa\u8377\u6307\u793a'], ['refund', '\u8fd4\u91d1'], ['cancelCompletedEmail', '\u5b8c\u4e86\u30e1\u30fc\u30eb']];
  appendParcelSection(parcelDetails, '処理・通知の実行回数', types.map(([, label]) => label), run.tokens.map(t => [...types.map(([type]) => run.state.effects.filter(e => e.orderId === t.orderId && e.type === type).length)]));
  if (new Set(run.tokens.map(t => t.orderId)).size < run.tokens.length) area.append(el('p', '処理・通知の実行回数\u306f\u6ce8\u6587\u5358\u4f4d\u306e\u7d2f\u8a08\u3067\u3059\u3002\u540c\u3058\u6ce8\u6587\u306e\u8377\u7269\u306b\u306f\u540c\u3058\u4ef6\u6570\u3092\u8868\u793a\u3057\u307e\u3059\u3002', 'rule'));

}
function stampTestResult(passed) {
  $('#testDrawer .test-result-stamp')?.remove();
  const stamp = el('div', passed ? 'Pass' : 'Fail', 'test-result-stamp');
  stamp.dataset.result = passed ? 'pass' : 'fail';
  stamp.setAttribute('aria-hidden', 'true');
  $('#testDrawer').append(stamp);
  setTimeout(() => stamp.remove(), 1900);
}
function renderResults() {
  const drawer = $('#testDrawer'), area = $('#assertions');
  drawer.dataset.result = 'pending'; area.replaceChildren();
  if (!test) return;
  const phase = resultPhase(run), final = phase === 'final' || phase === 'waiting', result = judge(run);
  if (!final) { stampedRun = null; drawer.querySelector('.test-result-stamp')?.remove(); }
  else if (stampedRun !== run) { stampedRun = run; stampTestResult(result.pass); }
  if (final) { drawer.dataset.result = result.pass ? 'pass' : 'fail'; results[test.id] = result.pass; }
  $('#drawerTitle').textContent = `${test.id} ${test.title}`;
  $('#testOverview').textContent = test.description;
  $('#testPerspective').textContent = test.perspective;
  $('#testInputs').textContent = `入力順：${test.events.map((event, i) => `${i + 1}. ${inputLabel(event, run.graph)}`).join(' → ')}`;
  const status = $('#resultTitle');
  status.textContent = final ? result.pass ? 'Pass' : 'Fail' : { ready: '未実行', running: '実行中', waiting: '待機中' }[phase];
  status.className = final ? `result-badge ${result.pass ? 'pass' : 'fail'}` : '';
  status.title = phase === 'waiting' ? '待機状態で検証が停止しています' : '';
  $('#assertionFilters').querySelectorAll('button').forEach(button => {
    button.disabled = !final && button.dataset.filter !== 'all';
    button.setAttribute('aria-pressed', String(button.dataset.filter === (final ? assertionFilter : 'all')));
  });
  for (const c of result.checks) {
    const row = el('div', undefined, 'check');
    row.dataset.pass = final ? String(c.pass) : 'pending';
    row.hidden = final && assertionFilter !== 'all' && row.dataset.pass !== (assertionFilter === 'pass' ? 'true' : 'false');
    row.append(el('span', final ? c.pass ? 'Pass' : 'Fail' : '—', final ? `result-badge ${c.pass ? 'pass' : 'fail'}` : 'muted'));
    const fields = { amount: '金額', revision: '版', approvalStatus: '承認状態', approvedRevision: '承認版', accountingStatus: '経理確認', verifiedRevision: '確認版', paymentStatus: run.state.requests ? '振込状態' : '決済状態', paidRevision: '振込版', reservationStatus: '引当状態', reservedQuantity: '引当数量', orderStatus: '注文状態', cancellationStatus: 'キャンセル状態', shippingStatus: '出荷状態' };
    const parts = c.label.split('.');
    const label = fields[parts.at(-1)] ? `${parts[1]} · ${fields[parts.at(-1)]}` : c.label;
    row.append(el('span', label, 'check-condition'));
    const actual = el('span', String(c.actual), 'check-value check-actual');
    actual.dataset.match = final ? String(c.pass) : 'pending';
    row.append(el('span', String(c.expected), 'check-value'), actual); area.append(row);
  }
  if (![...area.children].some(row => !row.hidden)) area.append(el('p', '該当する項目はありません。', 'rule'));
}
function renderLogs() {
  const logs = $('#logs');
  if (logSource !== run.logs || logs.children.length > run.logs.length) {
    clearProcessingEffects(); logs.replaceChildren(); logSource = run.logs;
  }
  const count = logs.children.length;
  for (const log of run.logs.slice(count)) logs.append(processingCard(log));
  if (logs.children.length > count && !panningLogs) logs.scrollLeft = logs.scrollWidth;
  logs.querySelectorAll('.processing-card').forEach(card => card.classList.toggle('selected-block-log', card.dataset.nodeId === selected));
}
function render() {
  $('.toolbar').hidden = !test;
  renderResults(); renderCases(); renderNodes(); drawEdges(); renderTokens(); renderState(); renderLogs();
  const status = { ready: '準備完了', running: timer ? '実行中' : '一時停止', waiting: '待機中', stopped: '停止', completed: '完了' };
  $('#status').textContent = test ? `${test.id} · ${status[run.status]} · ${run.step} step` : 'テストケースを選択してください';
  for (const id of ['play', 'pause', 'step', 'reset']) $(`#${id}`).disabled = !test;
  $('#batch').disabled = !!batchRun;
}
function showBatchResult() {
  const passed = Object.values(results).filter(Boolean).length, ratio = passed / tests.length;
  const grade = passed === tests.length ? 'Excellent' : ratio >= .8 ? 'Almost!' : 'Try Again';
  const dialog = $('#batchResult'); dialog.dataset.grade = grade === 'Excellent' ? 'excellent' : 'retry';
  $('#batchGrade').textContent = grade;
  $('#batchScore').textContent = `${passed} / ${tests.length} ケース成功`;
  $('#batchMessage').textContent = passed === tests.length ? 'すべてのテストをクリアしました！' : '失敗したケースの状態とログを確認し、設計を修正しましょう。';
  dialog.showModal();
  if (passed === tests.length) storyUI.onClear();
  clearTimeout(resultDismissTimer);
  resultDismissTimer = setTimeout(() => { if (dialog.open) dialog.close(); }, 3000);
}
function advance() {
  if (!test) return;
  if (batchRun?.nextAt) {
    if (Date.now() < batchRun.nextAt) return;
    batchRun.index++; batchRun.nextAt = 0;
    test = tests[batchRun.index]; clearProcessingEffects(); run = createRun(graph, test); selectedToken = 0;
    render(); document.querySelector('.case.active')?.scrollIntoView({ block: 'nearest' }); return;
  }
  const log = step(run);
  const done = ['completed', 'stopped', 'waiting'].includes(run.status);
  render();
  showProcessingEffect(log);
  if (done && batchRun) {
    if (batchRun.index + 1 < tests.length) batchRun.nextAt = Date.now() + 650;
    else { pause(); batchRun = null; render(); showBatchResult(); }
  } else if (done) pause();
}
$('#play').onclick = () => { if (!test) return; setTestDrawerSize('fit'); setDrawer(true); if (timer || (!batchRun && ['completed', 'stopped'].includes(run.status))) return; timer = setInterval(advance, Number($('#speed').value)); advance(); };
$('#pause').onclick = () => { pause(); render(); };
$('#step').onclick = () => { pause(); setTestDrawerSize('fit'); setDrawer(true, false); advance(); };
$('#speed').onchange = () => { if (timer) { pause(); timer = setInterval(advance, Number($('#speed').value)); } };
$('#reset').onclick = reset;
$('#restore').onclick = () => {
  results = {}; caseFilter = 'all'; assertionFilter = 'all'; selectedNodes.clear();
  $('#caseFilters').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === 'all')));
  graph = clone(initialGraph); selected = graph.nodes[0].id; changed();
};
$('#batch').onclick = () => {
  pause(); results = {}; test = tests[0]; reset();
  
  setTestDrawerSize('fit'); setDrawer(true); batchRun = { index: 0, nextAt: 0 };
  timer = setInterval(advance, Number($('#speed').value)); render();
};
$('#closeBlockDrawer').onclick = () => {
  pendingRoutes = {}; previewRoute(null);
  $('.canvas-stage').classList.remove('block-panel-open');
  $('#blockDrawer').classList.remove('open'); $('#blockDrawer').inert = true;
  $('#blockDrawer').setAttribute('aria-hidden', 'true');
  fitCanvas();
  document.querySelector(`[data-node="${selected}"] button`)?.focus({ preventScroll: true });
};
$('#drawerSizes').addEventListener('click', event => { const button = event.target.closest('button[data-size]'); if (button) setTestDrawerSize(button.dataset.size); });
$('#assertionFilters').addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]'); if (!button) return;
  assertionFilter = button.dataset.filter;
  $('#assertionFilters').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderResults();
});
function selectLogBlock(card) {
  const id = card?.dataset.nodeId; if (!graph.nodes.some(node => node.id === id)) return;
  selectedNodes.clear(); selected = id; openBlock(); renderNodes(); drawEdges(); renderEditor();
  $('#logs').querySelectorAll('.processing-card').forEach(item => item.classList.toggle('selected-block-log', item.dataset.nodeId === id));
}
$('#logs').addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  const logs = $('#logs'), card = event.target.closest('.processing-card');
  const start = { x: event.clientX, y: event.clientY, left: logs.scrollLeft, top: logs.scrollTop };
  let moved = false;
  panningLogs = true;
  const move = e => {
    if (e.pointerId !== event.pointerId) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (!moved && Math.hypot(dx, dy) < 5) return;
    moved = true; e.preventDefault(); logs.classList.add('panning');
    logs.scrollLeft = start.left - dx; logs.scrollTop = start.top - dy;
  };
  const finish = e => {
    if (e.pointerId !== event.pointerId) return;
    window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', finish); window.removeEventListener('pointercancel', finish);
    panningLogs = false; logs.classList.remove('panning');
    if (!moved && e.type !== 'pointercancel' && card) selectLogBlock(card);
  };
  window.addEventListener('pointermove', move, { passive: false }); window.addEventListener('pointerup', finish); window.addEventListener('pointercancel', finish);
});
$('#logs').addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { const card = event.target.closest('.processing-card'); if (card) { event.preventDefault(); selectLogBlock(card); } }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawerOpen) { minimizeTestDrawer(true); $('#closeTestDrawer').focus({ preventScroll: true }); } });
const helpButton = el('button', '?', 'editor-help-button');
helpButton.id = 'editorHelp'; helpButton.setAttribute('aria-label', '処理カードと処理結果の説明');
helpButton.setAttribute('popovertarget', 'editorHelpPopup');
$('.block-heading h2').append(helpButton);
const help = el('section', undefined, 'editor-help-popup'); help.id = 'editorHelpPopup'; help.setAttribute('popover', 'auto');
const helpHeading = el('div', undefined, 'section-title'); helpHeading.append(el('h2', '処理カードと処理結果'));
const helpClose = el('button', '×'); helpClose.setAttribute('aria-label', '説明を閉じる'); helpClose.onclick = () => help.hidePopover(); helpHeading.append(helpClose); help.append(helpHeading);
help.append(el('p', '処理が失敗すると、そのブロックの残りのカードを飛ばし、失敗時の遷移先へ進みます。すでに実行した処理は元に戻しません。'));
help.append(el('p', '「変更なし（no_op）」は、状態の変更が不要だったという処理結果です。例：返金済みの注文へ再度返金しても、もう一度は返金しません。通常は残りのカードを続け、最後に成功時の遷移先へ進みます。'));
help.append(el('p', '例外：キャンセル受付で「キャンセル済み」と判定した場合は、その荷物の処理を終了します。'));
help.append(el('h3', '処理カードの前提条件'));
Object.entries(operations).filter(([id]) => drill.allowedOperations.includes(id)).forEach(([, [title, rule]]) => help.append(el('p', `${title}：${rule.replaceAll('no_op', '変更なし')}`)));
document.body.append(help);
$('#caseFilters').addEventListener('click', event => {
  const button = event.target.closest('button[data-filter]');
  if (!button) return;
  caseFilter = button.dataset.filter;
  $('#caseFilters').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderCases();
});
new ResizeObserver(fitCanvas).observe($('.canvas-viewport'));
new ResizeObserver(fitEditorHeight).observe($('#blockPalette'));
new ResizeObserver(positionTestDrawer).observe($('.tests.panel'));
window.addEventListener('resize', positionTestDrawer);
window.addEventListener('scroll', positionTestDrawer, { passive: true });
$('#drillSummary').textContent = drill.summary;
$('#assignmentIntro').textContent = drill.chapter === 2 ? '上長承認後に経理確認を行い、振り込むシステムです。' : '在庫引当後に決済、決済後に出荷するシステムです。';
const ruleItems = drill.chapter === 2 ? [
  '本人承認は禁止', '上長権限・現版の承認・現版の経理確認が必要',
  '差戻し・却下・旧版承認では振込禁止', '振込完了時だけ通知', '再実行しても振込・通知は各1回',
] : [
  '取消は出荷確定前のみ', '引当解除・返金後に取消を確定', '成功時だけ通知', '二重要求の在庫戻し・返金・通知は各1回',
];
$('#assignmentRules').replaceChildren(...ruleItems.map(rule => el('li', rule)));
$('#assignmentTask').textContent = 'ブロックを修正してすべてのテストが正しく動くようにしてください。';
$('.canvas-heading>p').textContent = drill.allowMove ? 'ブロックを配置・移動し、接続と処理を編集' : '配置は固定です。ブロックをクリックして接続と処理を編集';
document.body.classList.toggle('fixed-blocks', !drill.allowMove);
if (drill.chapter === 2) $('.legend span:last-child').textContent = '● 申請をクリックして状態を確認';
$('.badge').textContent = `${drill.chapter === 2 ? '経費精算・承認' : '注文システム'} / ${drill.difficulty}`;
$('.canvas-viewport').ondragover = e => { if (drill.allowPlace) e.preventDefault(); };
$('.canvas-viewport').ondrop = e => { if (!drill.allowPlace) return; e.preventDefault(); const rect = $('#canvas').getBoundingClientRect(), scale = rect.width / canvasWidth(); placeBlock(e.dataTransfer.getData('text/plain'), { x: (e.clientX - rect.left) / scale - 100, y: (e.clientY - rect.top) / scale - 20 }); };
$('#drillNotice').textContent = requestedDrill && !drills.some(d => d.id === requestedDrill) ? '\u6307\u5b9a\u3055\u308c\u305fID\u304c\u898b\u3064\u304b\u3089\u306a\u3044\u305f\u3081\u3001\u7dcf\u5408\u554f\u984c\u3092\u8868\u793a\u3057\u3066\u3044\u307e\u3059\u3002' : '';
if (storyMode && requestedDrill && requestedDrill !== drill.id) $('#drillNotice').textContent = '未解放のステージのため、解放済みのステージを表示しています。';
reset(); renderEditor();
renderPalette();
setDrawer(!titleMode && !!test, false); fitCanvas();
const storyUI = installStoryUI(drills, drill, storyMode, titleMode);

// Title demos use fresh graphs only; they never save designs or story progress.
if (titleMode) {
  $('main').inert = true;
  $('main').setAttribute('aria-hidden', 'true');
  const scenes = drills.filter(d => d.tests.length && d.initialGraph.nodes.length);
  let sceneIndex = 0, ticks = 0, hold = 0;
  function nextDemo() {
    const scene = scenes[sceneIndex % scenes.length];
    const sample = scene.tests[Math.floor(sceneIndex / scenes.length) % scene.tests.length];
    sceneIndex++;
    graph = clone(scene.initialGraph);
    selected = null;
    run = createRun(graph, sample);
    ticks = 0; hold = 0;
    $('#tokens').replaceChildren();
    renderNodes(); fitCanvas(); renderTokens();
  }
  nextDemo();
  const demoTimer = setInterval(() => {
    if (document.hidden) return;
    if (['completed', 'stopped'].includes(run.status) || ticks >= 24) {
      if (++hold >= 3) nextDemo();
      return;
    }
    step(run); ticks++;
    renderNodes(); drawEdges(); renderTokens();
  }, 700);
  window.addEventListener('pagehide', () => clearInterval(demoTimer), { once: true });
}

const assignmentDialog = $('#assignmentDialog');
function focusCanvas() { if (!titleMode) $('.canvas-heading').scrollIntoView({ block: 'start', behavior: 'instant' }); }
assignmentDialog.addEventListener('close', focusCanvas);
if (!titleMode) requestAnimationFrame(focusCanvas);
const assignmentSeenKey = `design-block-drill.assignment-seen.v1.${drill.id}`;
function assignmentSeen() {
  try { if (localStorage.getItem(assignmentSeenKey) === '1') return true; } catch {}
  try { return sessionStorage.getItem(assignmentSeenKey) === '1'; } catch { return false; }
}
function showAssignment() {
  if (!assignmentDialog.open) assignmentDialog.showModal();
  if (!storyMode && !titleMode) {
    try { localStorage.setItem(assignmentSeenKey, '1'); }
    catch { try { sessionStorage.setItem(assignmentSeenKey, '1'); } catch {} }
  }
}
$('#showAssignment').onclick = showAssignment;
$('#closeAssignment').onclick = () => assignmentDialog.close();
if (!titleMode) {
  if (!storyMode) { if (!assignmentSeen()) showAssignment(); }
  else if (stages.find(stage => stage.chapter === drill.chapter)?.drillId === drill.id) {
    const showAfterStory = () => setTimeout(() => {
      if ($('#storyDialog').open) return;
      $('#storyDialog').removeEventListener('close', showAfterStory);
      showAssignment();
    }, 0);
    $('#storyDialog').addEventListener('close', showAfterStory);
  }
}
