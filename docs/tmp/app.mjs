import { operations, clone, createRun, step, finish, judge } from './engine.mjs';
import { drills } from './drills.mjs';
import { snapPosition } from './snap.mjs';
import { connectionPath } from './connections.mjs';
import { resolveStoryDrill, chapterUnlocked } from './story.mjs';
import { installStoryUI } from './story-ui.mjs';
const requestedDrill = new URLSearchParams(location.search).get('drill');
const storyMode = new URLSearchParams(location.search).get('mode') === 'story';
const titleMode = !requestedDrill && !storyMode;
const drill = drills.find(d => d.id === (storyMode ? resolveStoryDrill(requestedDrill) : requestedDrill)) || drills[0];
const { initialGraph, tests } = drill;
const $ = s => document.querySelector(s);
const el = (tag, text, className) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (className) e.className = className; return e; };
const KEY = `design-block-drill.v2.${drill.id}`;
let graph = clone(initialGraph), selected = initialGraph.nodes[0].id, test = null, run, timer, selectedToken = 0;
let results = {};
let batchRun = null;
let resultDismissTimer;
let drawerOpen = false;
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
function setDrawer(open) {
  drawerOpen = open;
  $('#testDrawer').classList.toggle('open', open);
  $('#testDrawer').inert = !open;
  $('#testDrawer').setAttribute('aria-hidden', String(!open));
  document.querySelector('main').classList.toggle('test-panel-open', open);
  if (open) $('#closeTestDrawer').focus({ preventScroll: true });
  renderCases();
}
function fitCanvas() {
  const scale = Math.min(1, $('.canvas-viewport').clientWidth / 910);
  $('#canvas').style.transform = `scale(${scale})`;
  $('.canvas-viewport').style.height = `${Math.max(450, 560 * scale + 68)}px`;
  drawEdges();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(graph)); } catch {} }
function placeBlock(id, position) {
  if (!drill.allowPlace) return;
  const template = drill.availableBlocks?.find(b => b.id === id);
  if (!template || graph.nodes.some(n => n.id === id)) return;
  const node = clone(template);
  if (!position) position = [70, 220, 400].flatMap(y => [40, 330, 620].map(x => ({ x, y }))).find(p => !graph.nodes.some(n => Math.abs(n.x - p.x) < 230 && Math.abs(n.y - p.y) < 65)) || { x: 40, y: 480 };
  Object.assign(node, snapPosition(position.x, position.y, graph.nodes, id));
  // New blocks have no hidden connections. The player connects them explicitly.
  node.success = 'END'; node.failure = 'END';
  graph.nodes.push(node); selected = id; changed(); openBlock();
}
function renderPalette() {
  const area = $('#blockPalette'); area.hidden = !drill.allowPlace;
  if (!drill.allowPlace) return;
  area.replaceChildren(el('strong', '未配置ブロック'));
  drill.availableBlocks.filter(b => !graph.nodes.some(n => n.id === b.id)).forEach(b => {
    const card = el('button', `${b.label} ＋配置`, 'palette-block'); card.draggable = true; card.dataset.block = b.id;
    card.onclick = () => placeBlock(b.id);
    card.ondragstart = e => { e.dataTransfer.setData('text/plain', b.id); e.dataTransfer.effectAllowed = 'copy'; }; area.append(card);
  });
  if (area.children.length === 1) area.append(el('span', 'すべて配置済み', 'rule'));
}
function reset() { pause(); batchRun = null; run = test ? createRun(graph, test) : { tokens: [], logs: [], step: 0, status: 'ready' }; selectedToken = 0; render(); }
function changed() { save(); results = {}; reset(); renderEditor(); renderPalette(); }
function renderCases() {
  $('#cases').replaceChildren(...tests.map(t => {
    const b = el('button', undefined, `case${t.id === test?.id ? ' active' : ''}`);
    b.dataset.result = results[t.id] === undefined ? 'pending' : results[t.id] ? 'pass' : 'fail';
    b.append(el('small', t.id), el('strong', t.title), el('span', results[t.id] === undefined ? '—' : results[t.id] ? '○' : '×', `case-result ${results[t.id] === undefined ? 'muted' : results[t.id] ? 'pass' : 'fail'}`));
    const info = el('span', undefined, 'case-info');
    info.append(el('span', '試験概要', 'case-info-label'), el('span', t.description), el('span', '試験観点', 'case-info-label'), el('span', t.perspective)); b.append(info);
    b.setAttribute('aria-pressed', String(t.id === test?.id)); b.title = t.description;
    b.setAttribute('aria-controls', 'testDrawer'); b.setAttribute('aria-expanded', String(t.id === test?.id && drawerOpen));
    b.onclick = () => { if (batchRun || test?.id !== t.id) { test = t; reset(); } if (document.querySelector('main').classList.contains('cases-expanded')) $('#toggleCaseList').click(); setDrawer(true); }; return b;
  }));
}
function renderNodes() {
  $('#nodes').replaceChildren(...graph.nodes.map(n => {
    const box = el('div', undefined, `node${selected === n.id ? ' selected' : ''}${run.tokens.some(t => t.node === n.id && !['completed', 'queued'].includes(t.status)) ? ' active-node' : ''}`);
    box.style.left = `${n.x}px`; box.style.top = `${n.y}px`; box.dataset.node = n.id;
    const heading = el('h3'); const edit = el('button', n.label, 'node-action'); edit.setAttribute('aria-label', `${n.label}を編集`);
    edit.onclick = () => { selected = n.id; openBlock(); renderNodes(); drawEdges(); renderEditor(); }; heading.append(edit); box.append(heading);
    box.title = n.operations.map(o => operations[o][0]).join(' → ') || '操作未設定';
    let drag;
    box.onpointerdown = e => { if (e.button !== 0 || !drill.allowMove) return; pause(); drag = { x: e.clientX, y: e.clientY, left: n.x, top: n.y }; box.setPointerCapture(e.pointerId); };
    box.onpointermove = e => {
      if (!drag || Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 3) return;
      const scale = $('#canvas').getBoundingClientRect().width / 910;
      const point = snapPosition(drag.left + (e.clientX - drag.x) / scale, drag.top + (e.clientY - drag.y) / scale, graph.nodes, n.id, scale, e.shiftKey);
      n.x = point.x; n.y = point.y;
      box.style.left = `${n.x}px`; box.style.top = `${n.y}px`; drawEdges(); renderTokens();
      for (const [axis, value] of [['x', point.guideX], ['y', point.guideY]]) {
        if (value === null) continue;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.classList.add('snap-guide');
        line.setAttribute('x1', axis === 'x' ? value : 0); line.setAttribute('x2', axis === 'x' ? value : 910);
        line.setAttribute('y1', axis === 'y' ? value : 0); line.setAttribute('y2', axis === 'y' ? value : 560);
        line.setAttribute('stroke', '#8d60ba'); line.setAttribute('stroke-width', '1'); line.setAttribute('stroke-dasharray', '5 4'); $('#lines').append(line);
      }
    };
    box.onpointerup = () => { if (!drag) return; drag = null; selected = n.id; openBlock(); save(); renderNodes(); drawEdges(); renderEditor(); };
    box.onpointercancel = () => { drag = null; save(); drawEdges(); };
    return box;
  }));
}
function name(id) { return id === 'END' ? '(完了)' : graph.nodes.find(n => n.id === id)?.label || '(未設定)'; }
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
    const x = from.x + 220, y = from.y + (kind === 'failure' ? 35 : 13);
    const endX = to ? to.x : x + 45, endY = to ? to.y + 24 : y;
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
    b.style.top = `${above >= 4 ? above + position * gap : (n?.y || 0) + 54 + position * gap}px`;
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
  const warehouse = $('#warehouse');
  warehouse.hidden = !test;
  if (test) {
    $('#warehouseCount').textContent = String(run.state.requests ? Object.keys(run.state.requests).length : run.state.inventory['ITEM-A']);
    warehouse.querySelector('span').textContent = run.state.requests ? '申請の状態' : '商品Aの在庫';
    warehouse.setAttribute('aria-label', run.state.requests ? '申請と振込の状態を表示' : `商品Aの在庫 ${run.state.inventory['ITEM-A']}個`);
  }
}
function selectToken(index) {
  selectedToken = index; renderTokens(); renderState();
  openBlock('state');
}
function syncCaseHeight() {
  const height = $('.canvas-stage').getBoundingClientRect().bottom - $('.tests').getBoundingClientRect().top;
  $('.tests').style.setProperty('--case-menu-height', `${Math.max(240, Math.round(height))}px`);
}
function selectControl(label, value, values, onChange) {
  const wrap = el('label', label); const input = el('select');
  values.forEach(([id, text]) => { const option = el('option', text); option.value = id; input.append(option); }); input.value = value;
  input.onchange = () => onChange(input.value); wrap.append(input); return wrap;
}
function renderEditor(adding = false) {
  routePreview = null; pendingRoutes = {}; drawEdges();
  const n = graph.nodes.find(n => n.id === selected), editor = $('#editor'); editor.replaceChildren(el('h3', n.label));
  const blockPreview = el('div', undefined, 'node selected block-preview');
  blockPreview.append(el('h3', undefined));
  blockPreview.firstChild.append(el('strong', n.label, 'node-action'));
  $('#blockSelection').replaceChildren(blockPreview);
  if (drill.availableBlocks?.some(b => b.id === n.id)) {
    const remove = el('button', 'パレットに戻す', 'return-block');
    remove.onclick = () => { graph.nodes = graph.nodes.filter(b => b.id !== n.id); graph.nodes.forEach(b => { for (const key of ['success', 'failure']) if (b[key] === n.id) b[key] = ''; }); selected = graph.nodes[0].id; changed(); };
    editor.append(remove, el('p', '戻すと、このブロックへの接続は(未設定)になります。', 'rule'));
  }
  editor.append(el('h4', '登録済みの操作', 'registered-heading'));
  if (!n.operations.length) editor.append(el('p', 'まだ操作が登録されていません。', 'rule'));
  n.operations.forEach((o, i) => {
    const row = el('div', undefined, 'op-row'); const text = el('span', operations[o][0]); text.title = operations[o][1]; row.append(text);
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
    open.onclick = () => { renderEditor(true); $('#editor .operation-choice:not(:disabled)')?.focus(); };
    editor.append(open); renderRoutes(n, editor); return;
  }
  const form = el('div', undefined, 'add-operation mode-add'); editor.append(form);
  form.append(el('div', '追加モード', 'operation-mode'));
  form.append(el('div', '操作', 'operation-label'));
  const choices = el('div', undefined, 'operation-choices'); choices.setAttribute('role', 'group'); choices.setAttribute('aria-label', '操作を選択');
  Object.entries(operations).filter(([id]) => drill.allowedOperations.includes(id)).forEach(([id, [label, rule]]) => {
    const button = el('button', label, 'operation-choice'); button.type = 'button'; button.dataset.operation = id; button.title = rule;
    button.disabled = n.operations.includes(id);
    button.onclick = () => { if (n.operations.includes(id)) return; n.operations.push(id); previewRoute(null); changed(); $('#openAddOperation')?.focus(); };
    choices.append(button);
  }); form.append(choices);
  const cancel = el('button', '取消', 'cancel-edit'); cancel.onclick = () => { renderEditor(); $('#openAddOperation')?.focus(); }; form.append(cancel);
  renderRoutes(n, editor);
}
function renderRoutes(n, editor) {
  const form = el('div', undefined, 'block-routes'); editor.append(form);
  const draft = { success: n.success, failure: n.failure };
  const targets = [['', '(未設定)'], ['END', '(完了)'], ...graph.nodes.map(x => [x.id, x.label])];
  for (const [key, label] of [['success', '成功時遷移先'], ['failure', '失敗時遷移先']]) {
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
    toggle.onclick = () => { const open = options.hidden; form.querySelectorAll('.route-options').forEach(list => { list.hidden = true; }); form.querySelectorAll('.route-current button').forEach(b => b.setAttribute('aria-expanded', 'false')); options.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); previewRoute(null); };
    options.onkeydown = e => { if (e.key === 'Escape') { e.stopPropagation(); options.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); previewRoute(null); } };
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
    appendParcelSection(details, '通知・副作用（申請単位）', ['振込回数', '通知数', '不正な振込'], run.tokens.map(t => ['transfer', 'paidEmail', 'invalid'].map(type => run.state.effects.filter(e => e.orderId === t.orderId && (type === 'invalid' ? e.type === 'transfer' && !e.valid : e.type === type)).length)));
    return;
  }
  area.append(el('p', '\u5728\u5eab\u306f\u3059\u3079\u3066\u306e\u6ce8\u6587\u3067\u5171\u901a\u3057\u3066\u4f7f\u3046\u30c7\u30fc\u30bf\u3067\u3059\u3002', 'rule'));
  area.append(stateTable('\u5546\u54c1\u5225\u306e\u5728\u5eab', ['\u5546\u54c1', '\u5728\u5eab', '\u5f15\u5f53\u6570'], Object.entries(run.state.inventory).map(([id, stock]) => [id, stock, Object.values(run.state.orders).filter(o => o.itemId === id).reduce((sum, o) => sum + o.reservedQuantity, 0)])));
  const orders = run.tokens.map(t => [t.orderId, run.state.orders[t.orderId]]);
  const parcelDetails = parcelTable('\u6ce8\u6587\u30fb\u8377\u7269\u306e\u72b6\u614b', ['\u6ce8\u6587', '\u5546\u54c1', '\u6ce8\u6587\u6570', '\u5f15\u5f53', '\u5f15\u5f53\u72b6\u614b', '\u6c7a\u6e08', '\u51fa\u8377', '\u53d6\u6d88', '\u6ce8\u6587\u72b6\u614b'], orders.map(([id, o]) => [id, o.itemId, o.quantity, o.reservedQuantity, o.reservationStatus, o.paymentStatus, o.shippingStatus, o.cancellationStatus, o.orderStatus]));
  area.append(parcelDetails);
  appendParcelSection(parcelDetails, '\u5b9f\u884c\u4f4d\u7f6e\u30fb\u7d50\u679c', ['\u4f4d\u7f6e', '\u72b6\u614b', '\u76f4\u8fd1\u306e\u64cd\u4f5c', '\u7406\u7531'], run.tokens.map(t => [name(t.node), t.status, t.last?.operation || '-', t.reason || t.last?.reason || '-']));
  const types = [['shipping', '\u51fa\u8377\u6307\u793a'], ['refund', '\u8fd4\u91d1'], ['cancelCompletedEmail', '\u5b8c\u4e86\u30e1\u30fc\u30eb']];
  appendParcelSection(parcelDetails, '\u901a\u77e5\u30fb\u526f\u4f5c\u7528', types.map(([, label]) => label), run.tokens.map(t => [...types.map(([type]) => run.state.effects.filter(e => e.orderId === t.orderId && e.type === type).length)]));
  if (new Set(run.tokens.map(t => t.orderId)).size < run.tokens.length) area.append(el('p', '\u901a\u77e5\u30fb\u526f\u4f5c\u7528\u306f\u6ce8\u6587\u5358\u4f4d\u306e\u7d2f\u8a08\u3067\u3059\u3002\u540c\u3058\u6ce8\u6587\u306e\u8377\u7269\u306b\u306f\u540c\u3058\u4ef6\u6570\u3092\u8868\u793a\u3057\u307e\u3059\u3002', 'rule'));

}
function renderResults() {
  $('#testDrawer').dataset.result = 'pending';
  if (!test) { $('#assertions').replaceChildren(); return; }
  const done = ['completed', 'stopped', 'waiting'].includes(run.status), area = $('#assertions'); area.replaceChildren();
  const result = judge(run);
  if (run.step > 0) $('#testDrawer').dataset.result = result.pass ? 'pass' : 'fail';
  if (done) results[test.id] = result.pass;
  $('#drawerTitle').textContent = `${test.id} ${test.title}`;
  $('#testOverview').textContent = test.description;
  $('#testPerspective').textContent = test.perspective;
  $('#resultTitle').textContent = run.step === 0 ? '未実行' : !done ? '実行中 · 現在値で仮判定' : result.pass ? '○ すべての期待を満たしました' : '× 期待値との差があります';
  $('#liveNote').textContent = !done ? '○×は現在値と最終期待値の比較です。途中の×は、後続処理で○に変わることがあります。' : '実行が終了または停止した時点の結果です。';
  for (const c of result.checks) { const row = el('div', undefined, 'check'); row.dataset.pass = run.step === 0 ? 'pending' : String(c.pass); row.append(el('span', run.step === 0 ? '—' : c.pass ? '○' : '×', run.step === 0 ? 'muted' : c.pass ? 'pass' : 'fail')); const fields = { amount: '\u91d1\u984d', revision: '\u7248', approvalStatus: '\u627f\u8a8d\u72b6\u614b', approvedRevision: '\u627f\u8a8d\u7248', accountingStatus: '\u7d4c\u7406\u78ba\u8a8d', verifiedRevision: '\u78ba\u8a8d\u7248', paidRevision: '\u632f\u8fbc\u7248', reservationStatus: '引当状態', reservedQuantity: '引当数量', paymentStatus: '決済状態', orderStatus: '注文状態', cancellationStatus: 'キャンセル状態', shippingStatus: '出荷状態' }; const parts = c.label.split('.'); const label = fields[parts.at(-1)] ? `${parts[1]} · ${fields[parts.at(-1)]}` : c.label; const body = el('div', label); body.append(el('small', `期待：${String(c.expected)} ／ 現在：${String(c.actual)}`)); row.append(body); area.append(row); }
}
function renderLogs() {
  $('#logs').replaceChildren(...run.logs.map(l => { const row = el('div', undefined, 'log-entry'); row.append(el('span', `#${l.step} ${l.orderId || ''} ${l.operation} → ${l.status === 'no_op' ? '変更なし' : l.status}${l.reason ? `（${l.reason}）` : ''}`, l.status === 'failure' ? 'fail' : '')); row.append(el('small', `${l.diff.map(d => `${d.path}: ${JSON.stringify(d.before)} → ${JSON.stringify(d.after)}`).join('\n') || '状態変更なし'} ／ 遷移先：${name(l.to)}`)); return row; })); $('#logs').scrollTop = $('#logs').scrollHeight;
}
function render() {
  renderResults(); renderCases(); renderNodes(); drawEdges(); renderTokens(); renderState(); renderLogs();
  const status = { ready: '準備完了', running: timer ? '実行中' : '一時停止', waiting: '待機中', stopped: '停止', completed: '完了' };
  $('#status').textContent = test ? `${test.id} · ${status[run.status]} · ${run.step} step` : 'テストケースを選択してください';
  for (const id of ['play', 'pause', 'step', 'reset']) $(`#${id}`).disabled = !test;
  $('#batchSummary').textContent = Object.keys(results).length ? `${Object.values(results).filter(Boolean).length} / ${Object.keys(results).length} ケース成功` : '';
  $('#batch').disabled = !!batchRun;
  if (batchRun) $('#batchSummary').textContent = `検証中 ${batchRun.index + 1} / ${tests.length} · ${Object.values(results).filter(Boolean).length} ケース成功`;
}
function showBatchResult() {
  const passed = Object.values(results).filter(Boolean).length, ratio = passed / tests.length;
  const grade = passed === tests.length ? 'Excellent' : ratio >= .8 ? 'Good' : ratio >= .5 ? 'Not Good' : 'Bad';
  const dialog = $('#batchResult'); dialog.dataset.grade = grade === 'Excellent' ? 'excellent' : grade === 'Good' ? 'good' : 'retry';
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
    test = tests[batchRun.index]; run = createRun(graph, test); selectedToken = 0;
    render(); document.querySelector('.case.active')?.scrollIntoView({ block: 'nearest' }); return;
  }
  if ($('.state-panel').hidden || $('#blockDrawer').inert) openBlock('state');
  step(run);
  const done = ['completed', 'stopped', 'waiting'].includes(run.status);
  render();
  if (done && batchRun) {
    if (batchRun.index + 1 < tests.length) batchRun.nextAt = Date.now() + 650;
    else { pause(); batchRun = null; render(); showBatchResult(); }
  } else if (done) pause();
}
$('#play').onclick = () => { if (!test) return; setDrawer(true); if (timer || (!batchRun && ['completed', 'stopped'].includes(run.status))) return; timer = setInterval(advance, Number($('#speed').value)); advance(); };
$('#pause').onclick = () => { pause(); render(); };
$('#step').onclick = () => { pause(); advance(); };
$('#speed').onchange = () => { if (timer) { pause(); timer = setInterval(advance, Number($('#speed').value)); } };
$('#reset').onclick = reset;
$('#restore').onclick = () => { graph = clone(initialGraph); selected = graph.nodes[0].id; changed(); };
$('#batch').onclick = () => {
  pause(); results = {}; test = tests[0]; reset();
  if (document.querySelector('main').classList.contains('cases-expanded')) $('#toggleCaseList').click();
  setDrawer(true); batchRun = { index: 0, nextAt: 0 }; openBlock('state');
  timer = setInterval(advance, Number($('#speed').value)); render();
};
$('#toggleCaseList').onclick = () => {
  const expanded = document.querySelector('main').classList.toggle('cases-expanded');
  const button = $('#toggleCaseList'); button.textContent = expanded ? '⇤' : '☷';
  button.setAttribute('aria-expanded', String(expanded)); button.setAttribute('aria-label', expanded ? 'テストケース一覧を縮める' : 'テストケースの概要と観点を一覧表示'); button.title = expanded ? '一覧を縮める' : '一覧を広げる';
  fitCanvas();
};
$('#closeBlockDrawer').onclick = () => {
  pendingRoutes = {}; previewRoute(null);
  $('.canvas-stage').classList.remove('block-panel-open');
  $('#blockDrawer').classList.remove('open'); $('#blockDrawer').inert = true;
  $('#blockDrawer').setAttribute('aria-hidden', 'true');
  fitCanvas();
  document.querySelector(`[data-node="${selected}"] button`)?.focus({ preventScroll: true });
};
$('#closeTestDrawer').onclick = () => { setDrawer(false); document.querySelector('.case.active')?.focus({ preventScroll: true }); };
document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawerOpen) { setDrawer(false); document.querySelector('.case.active')?.focus({ preventScroll: true }); } });
$('#warehouse').onclick = () => { renderState(); openBlock('state'); };
const helpButton = el('button', '?', 'editor-help-button');
helpButton.id = 'editorHelp'; helpButton.setAttribute('aria-label', '操作カードと処理結果の説明');
helpButton.setAttribute('popovertarget', 'editorHelpPopup');
$('.block-heading h2').append(helpButton);
const help = el('section', undefined, 'editor-help-popup'); help.id = 'editorHelpPopup'; help.setAttribute('popover', 'auto');
const helpHeading = el('div', undefined, 'section-title'); helpHeading.append(el('h2', '操作カードと処理結果'));
const helpClose = el('button', '×'); helpClose.setAttribute('aria-label', '説明を閉じる'); helpClose.onclick = () => help.hidePopover(); helpHeading.append(helpClose); help.append(helpHeading);
help.append(el('p', '操作が失敗すると、そのブロックの残りのカードを飛ばし、失敗時の遷移先へ進みます。すでに実行した操作は元に戻しません。'));
help.append(el('p', '「変更なし（no_op）」は、状態の変更が不要だったという処理結果です。例：返金済みの注文へ再度返金しても、もう一度は返金しません。通常は残りのカードを続け、最後に成功時の遷移先へ進みます。'));
help.append(el('p', '例外：キャンセル受付で「キャンセル済み」と判定した場合は、その荷物の処理を終了します。'));
help.append(el('h3', '操作カードの前提条件'));
Object.entries(operations).filter(([id]) => drill.allowedOperations.includes(id)).forEach(([, [title, rule]]) => help.append(el('p', `${title}：${rule.replaceAll('no_op', '変更なし')}`)));
document.body.append(help);
new ResizeObserver(fitCanvas).observe($('.canvas-viewport'));
new ResizeObserver(() => requestAnimationFrame(syncCaseHeight)).observe($('.workspace'));
const picker = $('#drillSelect');
drills.filter(d => d.id === drill.id || chapterUnlocked(d.chapter)).forEach(d => { const option = el('option', `${d.difficulty} / ${d.title}`); option.value = d.id; picker.append(option); });
picker.value = drill.id;
picker.disabled = storyMode;
picker.onchange = () => { const url = new URL(location.href); url.searchParams.delete('mode'); url.searchParams.delete('replay'); url.searchParams.set('drill', picker.value); location.assign(url.href); };
$('#drillSummary').textContent = drill.summary;
$('#assignmentIntro').textContent = drill.chapter === 2 ? '上長承認後に経理確認を行い、振り込むシステムです。' : '在庫引当後に決済、決済後に出荷するシステムです。';
const ruleItems = drill.chapter === 2 ? [
  '本人承認は禁止', '上長権限・現版の承認・現版の経理確認が必要',
  '差戻し・却下・旧版承認では振込禁止', '振込完了時だけ通知', '再実行しても振込・通知は各1回',
] : [
  '取消は出荷確定前のみ', '引当解除・返金後に取消を確定', '成功時だけ通知', '二重要求の在庫戻し・返金・通知は各1回',
];
$('#assignmentRules').replaceChildren(...ruleItems.map(rule => el('li', rule)));
$('#assignmentTask').textContent = 'すべてのテストが正しく動くように設計してください。';
$('.canvas-heading>p').textContent = drill.allowMove ? 'ブロックを配置・移動し、接続と操作を編集' : '配置は固定です。ブロックをクリックして接続と操作を編集';
document.body.classList.toggle('fixed-blocks', !drill.allowMove);
if (drill.chapter === 2) $('.legend span:last-child').textContent = '● 申請をクリックして状態を確認';
$('.badge').textContent = `${drill.chapter === 2 ? '経費精算・承認' : '注文システム'} / ${drill.difficulty}`;
$('.canvas-viewport').ondragover = e => { if (drill.allowPlace) e.preventDefault(); };
$('.canvas-viewport').ondrop = e => { if (!drill.allowPlace) return; e.preventDefault(); const rect = $('#canvas').getBoundingClientRect(), scale = rect.width / 910; placeBlock(e.dataTransfer.getData('text/plain'), { x: (e.clientX - rect.left) / scale - 110, y: (e.clientY - rect.top) / scale - 24 }); };
$('#drillNotice').textContent = requestedDrill && !drills.some(d => d.id === requestedDrill) ? '\u6307\u5b9a\u3055\u308c\u305fID\u304c\u898b\u3064\u304b\u3089\u306a\u3044\u305f\u3081\u3001\u7dcf\u5408\u554f\u984c\u3092\u8868\u793a\u3057\u3066\u3044\u307e\u3059\u3002' : '';
if (storyMode && requestedDrill && requestedDrill !== drill.id) $('#drillNotice').textContent = '未解放のステージのため、解放済みのステージを表示しています。';
reset(); renderEditor();
renderPalette();
$('#toggleCaseList').click();
setDrawer(false); fitCanvas();
const storyUI = installStoryUI(drills, drill, storyMode, titleMode);
