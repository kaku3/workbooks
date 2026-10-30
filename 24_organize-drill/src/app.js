const DATA_URL = 'data/problems.json';
const CAREER_URL = 'data/career.json';
const HISTORY_KEY = 'organize-drill-history-v1';
const CAREER_KEY = 'organize-drill-career-v1';
const DAILY_QUESTION_KEY = 'organize-drill-daily-question-v1';
const $ = selector => document.querySelector(selector);
const NS = 'http://www.w3.org/2000/svg';
const shuffle = list => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
const difficultyName = { easy: '初級', normal: '中級', hard: '上級' };
function selectSessionQuestions(count) {
  const pattern = count === 3 ? ['easy', 'normal', 'hard'] : ['easy', 'normal', 'easy', 'normal', 'hard'];
  const pools = Object.fromEntries(['easy', 'normal', 'hard'].map(level => [level, shuffle(problems.filter(problem => problem.difficulty === level))]));
  return pattern.map(level => {
    const question = pools[level].pop();
    if (!question) throw new Error(`${difficultyName[level]}の問題が不足しています`);
    return question;
  });
}

let problems = [];
let session = [];
let sessionResults = [];
let questionIndex = 0;
let score = 0;
let current = null;
let placed = new Map();
let positions = new Map();
let trashed = new Set();
let trashedPositions = new Map();
let trashedConnections = new Map();
let connections = [];
let linkStart = null;
let selectedConnection = null;
let pointerDrag = null;
let defaultPositionIndex = 0;
let positionSlots = [];
let locked = false;
let dragJustEnded = false;
let reviewZoom = 1;
let syncingReviewScroll = false;
let reviewCanvasSize = { width: 1400, height: 620 };
let reviewExpectedEdges = new Set();
let careerConfig, sessionType = 'practice', lastSession = [], startedAt = 0;
let calendarYear = new Date().getFullYear(), calendarMonth = new Date().getMonth();
let selectedCalendarDate = '';
let userEdited = false, initializingNodes = false, staticDiagramSeq = 0;

const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
function readStore(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function writeStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function getCareer() { const c = readStore(CAREER_KEY, {}); return { points: Number(c.points) || 0, correctCount: Number(c.correctCount) || 0, milestones: Array.isArray(c.milestones) ? c.milestones : [], dailyDates: Array.isArray(c.dailyDates) ? c.dailyDates : [], hasPlayed: Boolean(c.hasPlayed) }; }
function renderContinuity() {
  const c = getCareer(), history = readStore(HISTORY_KEY, []), stages = careerConfig.stages;
  const si = stages.reduce((found, item, i) => c.points >= item.points ? i : found, 0), stage = stages[si], next = stages[si + 1];
  $('#pointsTotal').textContent = `${c.points} pt`; $('#careerStage').textContent = stage.title;
  $('#careerBar').style.width = next ? `${Math.min(100, (c.points - stage.points) / (next.points - stage.points) * 100)}%` : '100%';
  const milestone = careerConfig.rewards.milestones.find(item => item.points > c.points);
  $('#recordSummary').textContent = `累計挑戦 ${history.length}回`;
  $('#milestoneText').textContent = next ? `次の昇進まであと ${next.points - c.points} pt` : '最高ステージ到達';
  const bonusHint = milestone ? `次のボーナスまで ${milestone.points - c.points} pt` : 'ボーナス節目達成';
  $('#milestoneText').title = bonusHint;
  const completed = c.dailyDates.includes(todayKey()); $('#dailyStart').hidden = !c.hasPlayed;
  $('#dailyStart').disabled = completed; $('#dailyStart').textContent = completed ? '今日の1問は完了しました' : '今日の1問に挑戦 →';
  $('#dailyStatus').textContent = completed
    ? '今日の挑戦は記録済みです。明日また挑戦できます。基礎点と芸術点は別に採点し、どちらもキャリアポイントに反映します。'
    : `正解で基礎点を獲得（通常${careerConfig.rewards.practiceCorrect}pt、今日の1問${careerConfig.rewards.dailyCorrect}pt）。芸術点も別に採点し、キャリアポイントに加算します。`;
}
function dateFromRecord(record) { if (record.day) return record.day; const d = new Date(record.date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function renderRecords() {
  const records = readStore(HISTORY_KEY, []), sessionsByDay = new Map();
  records.forEach(record => { const day = dateFromRecord(record); sessionsByDay.set(day, [...(sessionsByDay.get(day) || []), record]); });
  $('#recordTotal').textContent = `挑戦 ${records.length}回`;
  $('#calendarMonth').textContent = new Date(calendarYear, calendarMonth, 1).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
  const grid = $('#calendarGrid'); grid.replaceChildren();
  ['日','月','火','水','木','金','土'].forEach((day, i) => { const e = document.createElement('span'); e.className = `weekday${i === 0 ? ' sunday' : i === 6 ? ' saturday' : ''}`; e.textContent = day; grid.append(e); });
  const first = new Date(calendarYear, calendarMonth, 1).getDay(), days = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  for (let i = 0; i < first; i++) { const e = document.createElement('span'); e.className = 'calendar-blank'; grid.append(e); }
  const attended = new Set(sessionsByDay.keys()), monthPrefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2,'0')}`;
  for (let day = 1; day <= days; day++) {
    const key = `${monthPrefix}-${String(day).padStart(2,'0')}`, sessions = sessionsByDay.get(key) || [], button = document.createElement('button');
    button.type = 'button'; button.className = `calendar-day${sessions.length ? ' attended' : ''}${key === todayKey() ? ' today' : ''}${key === selectedCalendarDate ? ' selected' : ''}`;
    button.textContent = day; button.disabled = sessions.length === 0; button.setAttribute('aria-label', `${key}${sessions.length ? `、${sessions.length}回挑戦` : ''}`);
    if (sessions.length) button.addEventListener('click', () => { selectedCalendarDate = key; renderRecords(); });
    grid.append(button);
  }
  const monthSessions = records.filter(record => dateFromRecord(record).startsWith(monthPrefix));
  const attendedDays = new Set(monthSessions.map(dateFromRecord)).size;
  if (selectedCalendarDate.startsWith(monthPrefix)) {
    const selected = sessionsByDay.get(selectedCalendarDate) || [], correct = selected.reduce((sum, record) => sum + record.correct, 0), total = selected.reduce((sum, record) => sum + record.count, 0);
    $('#calendarSummary').textContent = `${selectedCalendarDate}：${selected.length}回・${correct}/${total}問正解`;
    const detail = $('#calendarDetail'); detail.replaceChildren();
    selected.forEach(record => { const row = document.createElement('p'); row.textContent = `${record.type === 'daily' ? '今日の1問' : `${record.count}問ドリル`}　正解 ${record.correct}/${record.count}　基礎点 ${record.basePoints ?? '—'}pt ＋ 芸術点 ${record.compositionPoints ?? '—'}pt${record.bonusPoints ? ` ＋ 節目 ${record.bonusPoints}pt` : ''} ＝ 合計 ${record.pointsEarned ?? '—'}pt`; detail.append(row); });
  } else { $('#calendarSummary').textContent = `${calendarYear}年${calendarMonth + 1}月：${attendedDays}日・${monthSessions.length}回挑戦`; $('#calendarDetail').textContent = '日付を選ぶと、その日の記録を確認できます。'; }
  renderAccuracyChart(records);
}
function renderAccuracyChart(records) {
  const recent = records.slice(0, 10).reverse(), svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 360 180'); svg.setAttribute('role', 'presentation');
  $('#chartSummary').textContent = recent.length ? `直近${recent.length}回の平均正答率 ${Math.round(recent.reduce((sum, r) => sum + r.accuracy, 0) / recent.length)}%` : '挑戦すると正答率の推移が表示されます。';
  [0, 50, 100].forEach(value => { const y = 145 - value * 1.2, line = document.createElementNS(NS, 'line'); line.setAttribute('x1', '34'); line.setAttribute('x2', '350'); line.setAttribute('y1', y); line.setAttribute('y2', y); line.setAttribute('class', 'chart-gridline'); svg.append(line); const label = document.createElementNS(NS, 'text'); label.setAttribute('x', '26'); label.setAttribute('y', y + 4); label.setAttribute('text-anchor', 'end'); label.setAttribute('class', 'chart-axis-label'); label.textContent = `${value}%`; svg.append(label); });
  if (recent.length) {
    const points = recent.map((record, i) => ({ x: recent.length === 1 ? 192 : 42 + i * (292 / (recent.length - 1)), y: 145 - record.accuracy * 1.2, record }));
    if (points.length > 1) { const line = document.createElementNS(NS, 'polyline'); line.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' ')); line.setAttribute('class', 'chart-line'); svg.append(line); }
    points.forEach(point => { const dot = document.createElementNS(NS, 'circle'); dot.setAttribute('cx', point.x); dot.setAttribute('cy', point.y); dot.setAttribute('r', '4'); dot.setAttribute('class', 'chart-point'); const title = document.createElementNS(NS, 'title'); title.textContent = `${dateFromRecord(point.record)}　正答率 ${point.record.accuracy}%`; dot.append(title); svg.append(dot); });
  }
  $('#accuracyChart').replaceChildren(svg);
}
function awardAndRecord() {
  const c = getCareer(), correct = sessionResults.filter(r => r.correct).length, date = todayKey();
  const basePoints = sessionType === 'daily' ? (correct ? careerConfig.rewards.dailyCorrect : 0) : correct * careerConfig.rewards.practiceCorrect;
  const artPoints = sessionResults.reduce((sum, result) => sum + result.compositionPoints, 0);
  const compositionPoints = artPoints * (careerConfig.rewards.compositionPoint ?? 1);
  let bonusPoints = 0;
  if (sessionType === 'daily') {
    if (!c.dailyDates.includes(date)) { c.dailyDates.push(date); if (correct) c.correctCount++; }
  } else { c.correctCount += correct; c.hasPlayed = true; }
  careerConfig.rewards.milestones.forEach(m => { if (c.points + basePoints + compositionPoints >= m.points && !c.milestones.includes(m.points)) { c.milestones.push(m.points); bonusPoints += m.bonus; } });
  const points = basePoints + compositionPoints + bonusPoints;
  c.points += points; writeStore(CAREER_KEY, c);
  const duration = Math.max(0, Math.round((Date.now() - startedAt) / 1000)), accuracy = Math.round(correct / session.length * 100);
  const history = readStore(HISTORY_KEY, []); history.unshift({ date: new Date().toISOString(), day: date, type: sessionType, count: session.length, correct, accuracy, duration, basePoints, compositionPoints: artPoints, bonusPoints, pointsEarned: points }); writeStore(HISTORY_KEY, history.slice(0,100));
  $('#resultAccuracy').textContent = `${accuracy}%`; $('#resultTime').textContent = `${Math.floor(duration/60)}:${String(duration%60).padStart(2,'0')}`; $('#resultPoints').textContent = `+${points} pt`;
  $('#resultPointBreakdown').textContent = `基礎点 ${basePoints}pt ＋ 芸術点 ${artPoints}pt${bonusPoints ? ` ＋ 節目ボーナス ${bonusPoints}pt` : ''}`;
  renderContinuity(); renderRecords();
}

function setNodePosition(node, x, y) {
  const point = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  positions.set(node.dataset.itemId, point);
  node.style.left = `${point.x * 100}%`;
  node.style.top = `${point.y * 100}%`;
}

function defaultPosition() {
  const point = positionSlots[defaultPositionIndex] || { x: .15 + Math.random() * .55, y: .2 + Math.random() * .6 };
  defaultPositionIndex++;
  return point;
}

function renderPrompt(prompt) {
  const root = $('#promptText');
  root.replaceChildren();
  const instruction = $('#promptInstruction');
  if (typeof prompt === 'string') {
    instruction.textContent = prompt;
    root.classList.add('is-legacy-prompt');
    return;
  }
  root.classList.remove('is-legacy-prompt');
  instruction.textContent = [prompt.intro, prompt.task].filter(Boolean).join(' ')
    || '図に必要な付箋を選び、処理の流れを矢印でつないでください。';
  const sections = [
    ['requirements', '要求仕様'],
    ['conditions', '要件'],
    ['externalDesign', '外部設計'],
    ['detailedDesign', '詳細設計']
  ];
  const board = document.createElement('div');
  board.className = 'prompt-sticky-board';
  sections.forEach(([key, label]) => {
    const notes = prompt[key] || [];
    if (!notes.length) return;
    const section = document.createElement('section');
    section.className = `prompt-layer prompt-layer-${key}`;
    const heading = document.createElement('h3');
    heading.textContent = label;
    const cards = document.createElement('div');
    cards.className = 'prompt-sticky-notes';
    notes.forEach((text, index) => {
      const note = document.createElement('div');
      note.className = `prompt-sticky-note note-tilt-${index % 3}`;
      note.textContent = text;
      cards.append(note);
    });
    section.append(heading, cards);
    board.append(section);
  });
  root.append(board);
}

function renderQuestion() {
  current = session[questionIndex];
  reviewZoom = 1;
  placed = new Map(); positions = new Map(); trashed = new Set(); trashedPositions = new Map(); trashedConnections = new Map(); connections = []; linkStart = null; selectedConnection = null;
  reviewExpectedEdges = new Set();
  defaultPositionIndex = 0; locked = false; userEdited = false;
  positionSlots = shuffle([
    { x: .20, y: .24 }, { x: .50, y: .24 }, { x: .80, y: .24 },
    { x: .20, y: .53 }, { x: .50, y: .53 }, { x: .80, y: .53 },
    { x: .20, y: .81 }, { x: .50, y: .81 }
  ]).map(point => ({
    x: Math.max(.14, Math.min(.86, point.x + (Math.random() - .5) * .05)),
    y: Math.max(.18, Math.min(.84, point.y + (Math.random() - .5) * .08))
  }));
  $('#diagramCanvas').classList.remove('is-locked');
  $('#diagramCanvas').style.zoom = '';
  $('#diagramCanvas').style.width = '';
  $('#diagramCanvas').style.height = '';
  $('#editViewport').append($('#diagramCanvas'));
  $('#diagramPanel').hidden = false;
  $('#promptBoardPanel').hidden = false;
  $('.prompt-hint-row').append($('#hintPanel'));
  $('#feedback').hidden = true;
  $('#quizView').querySelector('.quiz-panel');
  $('#quizView').append($('#feedback'));
  $('#reviewExplanation').hidden = true;
  $('#reviewArea').hidden = true;
  $('#workbench').classList.remove('is-reviewing');
  $('#questionTitle').textContent = current.title;
  $('#questionType').textContent = `${sessionType === 'daily' ? '今日の1問' : '問題'} ・ ${difficultyName[current.difficulty] || '難易度未設定'}`;
  renderPrompt(current.prompt);
  $('#progressText').textContent = `${questionIndex + 1} / ${session.length}`;
  $('#scoreText').textContent = `正解 ${score}`;
  $('#progressBar').style.width = `${questionIndex / session.length * 100}%`;
  $('#bankCount').textContent = `${current.items.length}枚`;
  $('#itemBank').replaceChildren();
  shuffle(current.items).forEach(item => {
    const card = document.createElement('button');
    card.type = 'button'; card.className = `item-card${item.kind === 'extra' ? ' is-extra' : ''}`;
    card.draggable = true; card.dataset.itemId = item.id; card.textContent = item.label;
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', () => {
      if (locked || dragJustEnded) return;
      if (placed.has(item.id)) removeNode(item.id); else addNode(item.id);
    });
    card.addEventListener('dragstart', event => {
      if (locked) { event.preventDefault(); return; }
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.effectAllowed = 'copy';
    });
    card.addEventListener('dragend', () => { dragJustEnded = true; window.setTimeout(() => { dragJustEnded = false; }, 80); });
    $('#itemBank').append(card);
  });

  $('#diagramCanvas').querySelectorAll('.diagram-node').forEach(node => node.remove());
  $('#connectionLayer').replaceChildren();
  $('#alignmentGuides').replaceChildren();
  $('#edgeTools').replaceChildren();
  $('#trashPanel').replaceChildren(); $('#trashPanel').hidden = true;
  $('#trashToggle').disabled = false; $('#trashToggle').setAttribute('aria-expanded', 'false');
  $('#canvasEmpty').hidden = false;
  const connectStatus = $('#connectStatus');
  if (connectStatus) connectStatus.textContent = 'まずカードを整理し、通る順にクリックして線をつなぎます。';
  $('#clearLinks').disabled = false;
  $('#feedback').hidden = true;
  $('#solutionSlot').replaceChildren();
  $('#submitButton').hidden = false;
  $('#nextButton').hidden = true;
  $('#nextButton').textContent = questionIndex === session.length - 1 ? '結果を見る →' : '次の問題へ →';
  $('#hintText').hidden = false;
  $('#hintText').textContent = current?.hint || '';
  $('#hintBadge').textContent = 'ヒント';
  $('#hintBadge').hidden = false;
  $('#hintPanel').classList.remove('is-review-hint');
  initializingNodes = true;
  shuffle(current.items).forEach(item => addNode(item.id, defaultPosition()));
  initializingNodes = false;
  renderTrashList();
}

function addNode(itemId, point = null) {
  if (locked || placed.has(itemId)) return;
  const item = current.items.find(entry => entry.id === itemId);
  if (!item) return;
  if (!initializingNodes) userEdited = true;
  point ||= trashedPositions.get(itemId) || defaultPosition();
  const node = document.createElement('div');
  node.className = 'diagram-node'; node.dataset.itemId = item.id;
  node.tabIndex = 0; node.setAttribute('role', 'group');
  node.setAttribute('aria-label', `${item.label}。Enterで線の始点または終点に選択。矢印キーで移動、Deleteでゴミ箱へ移動`);
  const label = document.createElement('span'); label.className = 'node-label'; label.textContent = item.label;
  const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'node-remove'; remove.textContent = '×';
  remove.setAttribute('aria-label', `${item.label}をゴミ箱へ移動`); remove.title = 'ゴミ箱へ移動';
  remove.addEventListener('pointerdown', event => event.stopPropagation());
  remove.addEventListener('click', event => { event.stopPropagation(); removeNode(item.id); });
  node.append(label, remove);
  node.addEventListener('pointerdown', startNodeDrag);
  node.addEventListener('pointermove', moveNodeDrag);
  node.addEventListener('pointerup', endNodeDrag);
  node.addEventListener('pointercancel', endNodeDrag);
  node.addEventListener('keydown', event => {
    if (event.target !== node) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectConnectionNode(item.id); }
    if (event.key === 'Escape' && linkStart) { linkStart = null; updateConnectionStatus(); updateNodeStates(); }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) && !locked) {
      event.preventDefault();
      const canvasRect = $('#diagramCanvas').getBoundingClientRect(), rect = node.getBoundingClientRect();
      let x = rect.left - canvasRect.left + rect.width / 2, y = rect.top - canvasRect.top + rect.height / 2;
      const step = event.shiftKey ? 2 : 20;
      if (event.key === 'ArrowLeft') x -= step;
      if (event.key === 'ArrowRight') x += step;
      if (event.key === 'ArrowUp') y -= step;
      if (event.key === 'ArrowDown') y += step;
      userEdited = true; moveNodeTo(node, x, y, false, event.shiftKey); drawCurrentConnections();
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && !locked) { event.preventDefault(); removeNode(item.id); }
  });
  $('#diagramCanvas').append(node);
  placed.set(itemId, node); setNodePosition(node, point.x, point.y);
  trashed.delete(itemId);
  trashedPositions.delete(itemId);
  [...trashedConnections.entries()].forEach(([key, edge]) => {
    if (placed.has(edge.from) && placed.has(edge.to)) {
      if (!connections.some(existing => existing.from === edge.from && existing.to === edge.to)) connections.push(edge);
      trashedConnections.delete(key);
    }
  });
  $('#canvasEmpty').hidden = true;
  updateBankState(); normalizeNodeHeights(); updateNodeStates(); drawCurrentConnections(); renderTrashList();
}

function removeNode(itemId) {
  if (locked) return;
  const node = placed.get(itemId);
  if (!node) return;
  userEdited = true;
  trashedPositions.set(itemId, { ...positions.get(itemId) });
  connections.filter(edge => edge.from === itemId || edge.to === itemId).forEach(edge => trashedConnections.set(`${edge.from}->${edge.to}`, { ...edge }));
  node.remove(); placed.delete(itemId); positions.delete(itemId);
  trashed.add(itemId);
  connections = connections.filter(edge => edge.from !== itemId && edge.to !== itemId);
  if (selectedConnection && (selectedConnection.from === itemId || selectedConnection.to === itemId)) selectedConnection = null;
  if (linkStart === itemId) linkStart = null;
  $('#canvasEmpty').hidden = placed.size > 0;
  updateBankState(); normalizeNodeHeights(); updateConnectionStatus(); drawCurrentConnections(); renderTrashList();
}

function normalizeNodeHeights(nodes = [...placed.values()]) {
  if (!nodes.length) return;
  const maxTextHeight = Math.max(...nodes.map(node => node.querySelector('.node-label').scrollHeight));
  const height = Math.max(42, maxTextHeight + 24);
  nodes.forEach(node => { node.style.height = `${height}px`; node.style.minHeight = `${height}px`; node.style.maxHeight = `${height}px`; });
}

function renderTrashList() {
  const panel = $('#trashPanel'), toggle = $('#trashToggle');
  $('#trashCount').textContent = String(trashed.size); $('#trashCount').hidden = trashed.size === 0;
  toggle.setAttribute('aria-label', `ゴミ箱を${panel.hidden ? '開く' : '閉じる'}。${trashed.size}枚`);
  panel.replaceChildren();
  const heading = document.createElement('div'); heading.className = 'trash-heading';
  const title = document.createElement('strong'); title.textContent = 'ゴミ箱';
  const count = document.createElement('span'); count.textContent = `${trashed.size}枚`;
  heading.append(title, count); panel.append(heading);
  if (!trashed.size) {
    const empty = document.createElement('p'); empty.className = 'trash-empty'; empty.textContent = '捨てたカードはありません。'; panel.append(empty); return;
  }
  const list = document.createElement('ul'); list.className = 'trash-list';
  current.items.filter(item => trashed.has(item.id)).forEach(item => {
    const row = document.createElement('li');
    const label = document.createElement('span'); label.textContent = item.label;
    const restore = document.createElement('button'); restore.type = 'button'; restore.className = 'trash-restore'; restore.textContent = '戻す';
    restore.addEventListener('click', event => { event.stopPropagation(); addNode(item.id); });
    row.append(label, restore); list.append(row);
  });
  panel.append(list);
}

function updateBankState() {
  $('#itemBank').querySelectorAll('.item-card').forEach(card => {
    const isPlaced = placed.has(card.dataset.itemId);
    card.classList.toggle('is-placed', isPlaced);
    card.setAttribute('aria-pressed', String(isPlaced));
    card.title = isPlaced ? 'キャンバスに配置済み' : 'クリックしてキャンバスに戻す';
  });
}

function startNodeDrag(event) {
  if (locked || event.button !== 0) return;
  const node = event.currentTarget;
  pointerDrag = { id: node.dataset.itemId, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
  node.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function moveNodeDrag(event) {
  if (!pointerDrag || pointerDrag.id !== event.currentTarget.dataset.itemId || pointerDrag.pointerId !== event.pointerId) return;
  const canvas = $('#diagramCanvas'), rect = canvas.getBoundingClientRect(), node = event.currentTarget;
  if (!pointerDrag.moved && Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY) > 4) {
    pointerDrag.moved = true; userEdited = true; node.classList.add('is-dragging');
  }
  if (!pointerDrag.moved) return;
  moveNodeTo(node, event.clientX - rect.left, event.clientY - rect.top, true);
  drawCurrentConnections();
}

function moveNodeTo(node, rawX, rawY, showGuides, ignoreSnap = false) {
  const canvas = $('#diagramCanvas'), rect = canvas.getBoundingClientRect();
  const halfW = node.offsetWidth / 2, halfH = node.offsetHeight / 2;
  let x = Math.max(halfW + 4, Math.min(rect.width - halfW - 4, rawX));
  let y = Math.max(halfH + 4, Math.min(rect.height - halfH - 4, rawY));
  let snapX = null, snapY = null;
  if (!ignoreSnap) {
    x = Math.round(x / 20) * 20; y = Math.round(y / 20) * 20;
    for (const [id, other] of placed) {
      if (id === node.dataset.itemId) continue;
      const otherRect = other.getBoundingClientRect();
      const otherX = otherRect.left - rect.left + otherRect.width / 2;
      const otherY = otherRect.top - rect.top + otherRect.height / 2;
      if (Math.abs(x - otherX) <= 12) { x = otherX; snapX = otherX; }
      if (Math.abs(y - otherY) <= 12) { y = otherY; snapY = otherY; }
    }
    if (snapX == null) {
      const evenX = findEqualSpacingSnap('x', x, y, node.dataset.itemId, rect);
      if (evenX) { x = evenX.value; snapX = x; if (snapY == null && Math.abs(y - evenX.cross) <= 14) { y = evenX.cross; snapY = y; } }
    }
    if (snapY == null) {
      const evenY = findEqualSpacingSnap('y', y, x, node.dataset.itemId, rect);
      if (evenY) { y = evenY.value; snapY = y; if (snapX == null && Math.abs(x - evenY.cross) <= 14) { x = evenY.cross; snapX = x; } }
    }
    if (snapX == null) { const gapX = findGapSnap('x', x, y, node, rect); if (gapX != null) x = gapX; }
    if (snapY == null) { const gapY = findGapSnap('y', y, x, node, rect); if (gapY != null) y = gapY; }
  }
  x = Math.max(halfW + 4, Math.min(rect.width - halfW - 4, x));
  y = Math.max(halfH + 4, Math.min(rect.height - halfH - 4, y));
  setNodePosition(node, x / rect.width, y / rect.height);
  if (showGuides) renderAlignmentGuides(snapX, snapY);
}

const GAP_V = 28, GAP_H = 48, GAP_SNAP_RANGE = 16;
// 近くのカードと辺どうしの間隔が GAP になる位置へ吸着する。縦に動かすときは縦間隔、横に動かすときは横間隔。
// 動かす向きと直交する向きで重なっているカードだけを対象にする（斜め上のカードには反応しない）。
function findGapSnap(axis, value, cross, node, canvasRect) {
  const horizontal = axis === 'x', gap = horizontal ? GAP_H : GAP_V;
  const mainHalf = (horizontal ? node.offsetWidth : node.offsetHeight) / 2, crossHalf = (horizontal ? node.offsetHeight : node.offsetWidth) / 2;
  let best = null;
  for (const [id, other] of placed) {
    if (id === node.dataset.itemId) continue;
    const box = other.getBoundingClientRect();
    const otherMain = horizontal ? box.left - canvasRect.left + box.width / 2 : box.top - canvasRect.top + box.height / 2;
    const otherCross = horizontal ? box.top - canvasRect.top + box.height / 2 : box.left - canvasRect.left + box.width / 2;
    const otherMainHalf = (horizontal ? box.width : box.height) / 2, otherCrossHalf = (horizontal ? box.height : box.width) / 2;
    if (Math.abs(cross - otherCross) >= crossHalf + otherCrossHalf) continue;
    for (const dir of [-1, 1]) {
      const target = otherMain + dir * (otherMainHalf + gap + mainHalf), distance = Math.abs(value - target);
      if (distance <= GAP_SNAP_RANGE && (!best || distance < best.distance)) best = { value: target, distance };
    }
  }
  return best ? best.value : null;
}

function findEqualSpacingSnap(axis, value, crossValue, movingId, canvasRect) {
  const anchors = [...placed.entries()].filter(([id]) => id !== movingId).map(([id, node]) => {
    const box = node.getBoundingClientRect();
    return {
      id,
      main: axis === 'x' ? box.left - canvasRect.left + box.width / 2 : box.top - canvasRect.top + box.height / 2,
      cross: axis === 'x' ? box.top - canvasRect.top + box.height / 2 : box.left - canvasRect.left + box.width / 2
    };
  }).filter(point => Math.abs(point.cross - crossValue) <= 18);
  if (!anchors.length) return null;
  if (anchors.length === 1) {
    const anchor = anchors[0];
    const spacing = (axis === 'x' ? placed.get(anchor.id)?.offsetWidth : placed.get(anchor.id)?.offsetHeight) + 28;
    const candidates = [anchor.main - spacing, anchor.main + spacing];
    const closest = candidates.map(candidate => ({ candidate, distance: Math.abs(value - candidate) })).sort((a, b) => a.distance - b.distance)[0];
    return closest.distance <= 14 ? { value: closest.candidate, cross: anchor.cross, distance: closest.distance } : null;
  }
  let best = null;
  for (let i = 0; i < anchors.length; i++) for (let j = i + 1; j < anchors.length; j++) {
    const low = Math.min(anchors[i].main, anchors[j].main), high = Math.max(anchors[i].main, anchors[j].main);
    const gap = high - low;
    if (gap < 36) continue;
    const candidates = [low - gap, (low + high) / 2, high + gap];
    for (const candidate of candidates) {
      const distance = Math.abs(value - candidate);
      if (distance <= 14 && (!best || distance < best.distance)) best = { value: candidate, cross: (anchors[i].cross + anchors[j].cross) / 2, distance };
    }
  }
  return best;
}

function renderAlignmentGuides(snapX, snapY) {
  const svg = $('#connectionSvg'), layer = $('#alignmentGuides'), rect = $('#diagramCanvas').getBoundingClientRect();
  layer.replaceChildren();
  [[snapX, 'vertical'], [snapY, 'horizontal']].forEach(([value, axis]) => {
    if (value == null) return;
    const line = document.createElementNS(NS, 'line'); line.setAttribute('class', 'alignment-guide');
    if (axis === 'vertical') { line.setAttribute('x1', value); line.setAttribute('x2', value); line.setAttribute('y1', '0'); line.setAttribute('y2', rect.height); }
    else { line.setAttribute('x1', '0'); line.setAttribute('x2', rect.width); line.setAttribute('y1', value); line.setAttribute('y2', value); }
    layer.append(line);
  });
  svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
}

function alignPlacedNodes(axis) {
  if (locked || placed.size < 2) return;
  const rect = $('#diagramCanvas').getBoundingClientRect();
  const values = [...placed.values()].map(node => {
    const box = node.getBoundingClientRect();
    return axis === 'y' ? box.top - rect.top + box.height / 2 : box.left - rect.left + box.width / 2;
  });
  const target = values.reduce((sum, value) => sum + value, 0) / values.length;
  placed.forEach(node => {
    const box = node.getBoundingClientRect();
    const x = box.left - rect.left + box.width / 2, y = box.top - rect.top + box.height / 2;
    moveNodeTo(node, axis === 'x' ? target : x, axis === 'y' ? target : y, false);
  });
  $('#alignmentGuides').replaceChildren(); drawCurrentConnections();
}

function endNodeDrag(event) {
  if (!pointerDrag || pointerDrag.id !== event.currentTarget.dataset.itemId || pointerDrag.pointerId !== event.pointerId) return;
  const drag = pointerDrag; pointerDrag = null;
  event.currentTarget.classList.remove('is-dragging');
  if (!drag.moved) selectConnectionNode(drag.id);
  else $('#alignmentGuides').replaceChildren();
}

function selectConnectionNode(itemId) {
  if (locked) return;
  selectedConnection = null;
  if (!linkStart) linkStart = itemId;
  else if (linkStart === itemId) linkStart = null;
  else {
    const exists = connections.some(edge => edge.from === linkStart && edge.to === itemId);
    if (!exists) { connections.push({ from: linkStart, to: itemId }); userEdited = true; }
    // 接続先を次の始点にして、通る順にクリックするだけで連続した線を作れるようにする。
    linkStart = itemId;
  }
  updateNodeStates(); updateConnectionStatus(); drawCurrentConnections();
}

function updateNodeStates() {
  placed.forEach((node, id) => node.classList.toggle('is-link-start', linkStart === id));
}

function updateConnectionStatus() {
  const connectStatus = $('#connectStatus');
  if (!connectStatus) return;
  connectStatus.textContent = linkStart
    ? `「${current.items.find(item => item.id === linkStart)?.label}」を選択中。次の箱をクリックして線を続けます。同じ箱か空白をクリックすると終了します。`
    : selectedConnection
      ? '線を選択中です。表示された×で個別に削除できます。'
      : 'カードを並べ終えたら、通る順に箱をクリック。線をクリックすると×で個別に削除できます。';
}

function drawSvgConnections(svg, layer, nodeMap, edges, allowRemove = false, classify = null) {
  const canvas = svg.parentElement, canvasRect = canvas.getBoundingClientRect();
  if (!canvasRect.width || !canvasRect.height) return;
  const zoom = Number.parseFloat(canvas.style.zoom) || 1;
  svg.setAttribute('viewBox', `0 0 ${canvasRect.width / zoom} ${canvasRect.height / zoom}`);
  layer.replaceChildren();
  edges.forEach(edge => {
    const from = nodeMap.get(edge.from), to = nodeMap.get(edge.to);
    if (!from || !to) return;
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const aw = a.width / zoom, ah = a.height / zoom, bw = b.width / zoom, bh = b.height / zoom;
    const ax = (a.left - canvasRect.left + a.width / 2) / zoom, ay = (a.top - canvasRect.top + a.height / 2) / zoom;
    const bx = (b.left - canvasRect.left + b.width / 2) / zoom, by = (b.top - canvasRect.top + b.height / 2) / zoom;
    const dx = bx - ax, dy = by - ay;
    if (!dx && !dy) return;
    const scaleA = 1 / Math.max(Math.abs(dx) / (aw / 2), Math.abs(dy) / (ah / 2));
    const scaleB = 1 / Math.max(Math.abs(dx) / (bw / 2), Math.abs(dy) / (bh / 2));
    const len = Math.hypot(dx, dy), pull = Math.min(2, len / 4) / len; // 矢じりの先端を矩形の縁に合わせる
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', ax + dx * scaleA); line.setAttribute('y1', ay + dy * scaleA);
    const staticArrow = Boolean(svg.dataset.markerPrefix);
    if (staticArrow) {
      const tipX = bx - dx * scaleB, tipY = by - dy * scaleB, ux = dx / len, uy = dy / len, head = Math.min(10, len / 3);
      const baseX = tipX - ux * head, baseY = tipY - uy * head;
      line.setAttribute('x2', baseX + ux); line.setAttribute('y2', baseY + uy);
      var arrowHead = document.createElementNS(NS, 'polygon');
      arrowHead.setAttribute('points', `${tipX},${tipY} ${baseX - uy * 4.5},${baseY + ux * 4.5} ${baseX + uy * 4.5},${baseY - ux * 4.5}`);
    } else {
      line.setAttribute('x2', bx - dx * (scaleB + pull)); line.setAttribute('y2', by - dy * (scaleB + pull));
    }
    line.setAttribute('class', 'connection-line');
    let markerId = svg.dataset.markerId || 'arrowHead';
    const kind = classify ? classify(edge) : null;
    if (kind) {
      line.classList.add(kind === 'ok' ? 'is-answer-correct' : 'is-answer-incorrect');
      markerId = svg.dataset.markerPrefix ? `${svg.dataset.markerPrefix}-${kind}` : (kind === 'ok' ? 'arrowCorrect' : 'arrowWrong');
    } else if (locked && allowRemove) {
      const isExpected = reviewExpectedEdges.has(`${edge.from}->${edge.to}`);
      line.classList.add(isExpected ? 'is-answer-correct' : 'is-answer-incorrect');
      markerId = isExpected ? 'arrowCorrect' : 'arrowWrong';
    }
    if (arrowHead) {
      arrowHead.setAttribute('fill', kind === 'ok' ? '#3976b8' : kind === 'ng' ? '#b75c4f' : '#668a7a');
      arrowHead.setAttribute('class', 'connection-arrowhead');
      line.setAttribute('marker-end', 'none');
    } else line.setAttribute('marker-end', `url(#${markerId})`);
    if (allowRemove) line.addEventListener('click', event => {
      event.stopPropagation();
      if (locked) return;
      selectedConnection = selectedConnection?.from === edge.from && selectedConnection?.to === edge.to ? null : { from: edge.from, to: edge.to };
      drawCurrentConnections(); updateConnectionStatus();
    });
    if (allowRemove && selectedConnection?.from === edge.from && selectedConnection?.to === edge.to) line.classList.add('is-selected');
    layer.append(line);
    if (arrowHead) layer.append(arrowHead);
  });
}

function drawCurrentConnections() {
  drawSvgConnections($('#connectionSvg'), $('#connectionLayer'), placed, connections, true);
  renderEdgeTools();
}

function renderEdgeTools() {
  const tools = $('#edgeTools'); tools.replaceChildren();
  if (!selectedConnection || locked) return;
  const from = placed.get(selectedConnection.from), to = placed.get(selectedConnection.to);
  if (!from || !to) return;
  const canvasRect = $('#diagramCanvas').getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const x = ((a.left + a.width / 2) + (b.left + b.width / 2)) / 2 - canvasRect.left;
  const y = ((a.top + a.height / 2) + (b.top + b.height / 2)) / 2 - canvasRect.top;
  const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'edge-remove'; remove.textContent = '×';
  const edgeToRemove = { ...selectedConnection };
  remove.setAttribute('aria-label', `${labelFor(edgeToRemove.from)}から${labelFor(edgeToRemove.to)}への線を削除`);
  remove.title = 'この線を削除'; remove.style.left = `${x}px`; remove.style.top = `${y}px`;
  remove.addEventListener('click', event => {
    event.stopPropagation();
    connections = connections.filter(edge => edge.from !== edgeToRemove.from || edge.to !== edgeToRemove.to);
    selectedConnection = null; drawCurrentConnections(); updateConnectionStatus();
  });
  tools.append(remove);
}

function compareAnswer() {
  const required = current.items.filter(item => item.kind === 'required').map(item => item.id);
  const extras = current.items.filter(item => item.kind === 'extra').map(item => item.id);
  const missingItems = required.filter(id => !placed.has(id));
  const extraItems = extras.filter(id => placed.has(id));
  const key = edge => `${edge.from}->${edge.to}`;
  const actual = connections.map(key);
  const expectedSets = [current.connections, ...(current.connectionAlternatives || [])].map(set => set.map(([from, to]) => `${from}->${to}`));
  const comparisons = expectedSets.map(expected => ({
    expectedEdges: expected,
    missingEdges: expected.filter(edge => !actual.includes(edge)),
    extraEdges: actual.filter(edge => !expected.includes(edge))
  }));
  comparisons.sort((a, b) => (a.missingEdges.length + a.extraEdges.length) - (b.missingEdges.length + b.extraEdges.length));
  const { expectedEdges, missingEdges, extraEdges } = comparisons[0];
  const correct = !missingItems.length && !extraItems.length && !missingEdges.length && !extraEdges.length;
  return { correct, missingItems, extraItems, expectedEdges, missingEdges, extraEdges };
}

function labelFor(itemId) { return current.items.find(item => item.id === itemId)?.label || itemId; }
function labelForEdge(edgeKey) { const [from, to] = edgeKey.split('->'); return `${labelFor(from)} → ${labelFor(to)}`; }

function assessComposition() {
  // 初期配置のままでは整っているように見えるため、何も操作していない解答には芸術点を与えない。
  if (!userEdited) return { points: 0, maxPoints: 3, overlaps: 0, aligned: false, hasEqualSpacing: false, untouched: true, details: ['操作なし'] };
  const canvas = $('#diagramCanvas').getBoundingClientRect();
  const nodes = [...placed.entries()].map(([id, node]) => {
    const box = node.getBoundingClientRect();
    return { id, x: box.left - canvas.left + box.width / 2, y: box.top - canvas.top + box.height / 2, left: box.left - canvas.left, right: box.right - canvas.left, top: box.top - canvas.top, bottom: box.bottom - canvas.top };
  });
  let points = 0;
  const details = [];
  let overlaps = 0;
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    if (nodes[i].left < nodes[j].right - 6 && nodes[i].right > nodes[j].left + 6 && nodes[i].top < nodes[j].bottom - 6 && nodes[i].bottom > nodes[j].top + 6) overlaps++;
  }
  if (!overlaps && nodes.length > 1) points++;
  details.push(overlaps ? `カードの重なり ${overlaps}組` : nodes.length > 1 ? '重なりなし' : '配置カードが少なく重なりを判定できない');

  const aligned = nodes.some((a, i) => nodes.slice(i + 1).some(b => Math.abs(a.x - b.x) <= 12 || Math.abs(a.y - b.y) <= 12));
  if (aligned) points++;
  details.push(aligned ? '中心整列あり' : '中心整列なし');

  const hasEqualSpacing = ['x', 'y'].some(axis => {
    const cross = axis === 'x' ? 'y' : 'x';
    const sorted = [...nodes].sort((a, b) => a[cross] - b[cross]);
    const rows = [];
    sorted.forEach(node => {
      let row = rows.find(group => Math.abs(group[0][cross] - node[cross]) <= 14);
      if (!row) { row = []; rows.push(row); }
      row.push(node);
    });
    return rows.some(row => {
      if (row.length < 2) return false;
      const positions = row.map(node => node[axis]).sort((a, b) => a - b);
      const gaps = positions.slice(1).map((position, index) => position - positions[index]);
      if (row.length === 2) {
        const node = placed.get(row[0].id);
        const standardGap = (axis === 'x' ? node?.offsetWidth : node?.offsetHeight) + 28;
        return Math.abs(gaps[0] - standardGap) <= 14;
      }
      const mean = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
      return mean > 0 && Math.max(...gaps.map(gap => Math.abs(gap - mean))) / mean <= .12;
    });
  });
  if (hasEqualSpacing) points++;
  details.push(hasEqualSpacing ? '等間隔あり' : '等間隔なし');

  // 芸術点は、配置だけで客観的に判定しやすい3項目に限定する。
  // 意味のまとまりは問題ごとの構造や配置意図に左右され、正解例でも不当に低得点になるため採点対象から外す。
  points = (!overlaps && nodes.length > 1 ? 1 : 0) + (aligned ? 1 : 0) + (hasEqualSpacing ? 1 : 0);
  return { points, maxPoints: 3, overlaps, aligned, hasEqualSpacing, details };

}

function renderFeedback(comparison, composition) {
  const feedback = $('#feedback'); feedback.replaceChildren(); feedback.hidden = false;
  feedback.className = `feedback ${comparison.correct ? 'is-correct' : 'is-incorrect'}`;
  const heading = document.createElement('div'); heading.className = 'scoring-heading-row';
  const headingText = document.createElement('h3');
  headingText.textContent = comparison.correct ? '必要な要素と関係が整理できています。' : '完成例と見比べて、関係を確認しましょう。';
  const helpButton = document.createElement('button'); helpButton.type = 'button'; helpButton.className = 'scoring-help-button';
  helpButton.textContent = '?'; helpButton.setAttribute('aria-expanded', 'false'); helpButton.setAttribute('aria-label', '採点項目の説明を表示');
  const helpPanel = document.createElement('div'); helpPanel.className = 'scoring-help-panel'; helpPanel.hidden = true;
  const helpTable = document.createElement('table'); helpTable.className = 'scoring-help-table';
  const helpRows = [
    ['要素の選択', '必要なカードがすべてあり、不要なカードが入っていない', '正誤判定'],
    ['矢印・関係', '接続先と矢印の向きが完成例と一致している', '正誤判定'],
    ['重なり', 'カード同士が重なっていない', '芸術点 1点'],
    ['中心整列', 'カードの中心が横または縦にそろっている', '芸術点 1点'],
    ['等間隔', '同じ列・行のカードが一定の間隔で並んでいる', '芸術点 1点'],
  ];
  helpRows.forEach(([name, description, pointsLabel]) => { const tr = document.createElement('tr'); [name, description, pointsLabel].forEach((value, i) => { const cell = document.createElement(i === 0 ? 'th' : 'td'); cell.textContent = value; if (i === 0) cell.scope = 'row'; tr.append(cell); }); helpTable.append(tr); });
  helpPanel.append(helpTable);
  helpButton.addEventListener('click', () => { helpPanel.hidden = !helpPanel.hidden; helpButton.setAttribute('aria-expanded', String(!helpPanel.hidden)); });
  heading.append(headingText, helpButton);
  const table = document.createElement('table'); table.className = 'scoring-table';
  const rows = [
    ['要素の選択', comparison.missingItems.length || comparison.extraItems.length ? '要見直し' : 'OK', !(comparison.missingItems.length || comparison.extraItems.length), '一致していればOK'],
    ['矢印・関係', comparison.missingEdges.length || comparison.extraEdges.length ? '要見直し' : 'OK', !(comparison.missingEdges.length || comparison.extraEdges.length), '接続先と向きが完成例と一致していればOK'],
    ['重なり', composition.untouched ? '操作なし' : composition.overlaps ? `${composition.overlaps}か所` : 'なし', !composition.untouched && !composition.overlaps, 'カード同士が重なっていなければ1点'],
    ['中心整列', !composition.untouched && composition.aligned ? '加点あり' : composition.untouched ? '操作なし' : '加点なし', !composition.untouched && composition.aligned, 'カードの中心がそろっていれば1点'],
    ['等間隔', composition.untouched ? '操作なし' : composition.hasEqualSpacing ? '加点あり' : '加点なし', !composition.untouched && composition.hasEqualSpacing, 'カード間隔がそろっていれば1点'],
    ['図の整いポイント', `${composition.points} / ${composition.maxPoints}点`, null, composition.untouched ? 'カードやつなぎを操作していないため0点' : '重なり・中心整列・等間隔の3項目で最大3点']
  ];
  const tbody = document.createElement('tbody');
  rows.forEach(([label, value, good, description], index) => {
    const row = document.createElement('tr');
    const th = document.createElement('th'); th.scope = 'row'; th.textContent = label; th.title = description;
    const td = document.createElement('td');
    const status = document.createElement('span'); status.className = 'scoring-status';
    if (good === null) { status.classList.add('is-score'); status.textContent = value; }
    else if (good) { status.classList.add('is-good'); status.textContent = `○ ${value}`; }
    else if (index < 3) { status.classList.add('is-bad'); status.textContent = `× ${value}`; }
    else { status.classList.add('is-neutral'); status.textContent = `− ${value}`; }
    td.append(status);
    if (index === rows.length - 1) { row.classList.add('scoring-total-row'); th.classList.add('scoring-total'); td.classList.add('scoring-total'); }
    row.append(th, td); tbody.append(row);
  });
  table.append(tbody);
  feedback.append(heading, helpPanel, table);
  const hintText = $('#hintText'); hintText.replaceChildren();
  const intro = document.createElement('p'); intro.className = 'hint-review-intro'; intro.textContent = current.explanation;
  hintText.append(intro);

  // 不要情報は「図に入れなかった＝○」「図に入れた＝×」を候補ごとに表示する。
  const excludedItems = current.items.filter(item => item.kind === 'extra');
  const extraSection = document.createElement('div'); extraSection.className = 'reflection-item';
  const extraTitle = document.createElement('h4'); extraTitle.textContent = '図に含めない情報'; extraSection.append(extraTitle);
  if (excludedItems.length) {
    const list = document.createElement('ul'); list.className = 'reflection-status-list';
    excludedItems.forEach(itemData => {
      const included = placed.has(itemData.id);
      const li = document.createElement('li');
      const mark = document.createElement('span'); mark.className = `reflection-mark ${included ? 'is-wrong' : 'is-right'}`; mark.textContent = included ? '×' : '○';
      const label = document.createElement('span'); label.textContent = itemData.label;
      li.append(mark, label); list.append(li);
    });
    extraSection.append(list);
  } else {
    const body = document.createElement('p'); body.textContent = '対象なし'; extraSection.append(body);
  }
  const edgeSection = document.createElement('div'); edgeSection.className = 'reflection-item reflection-edges';
  const edgeTitle = document.createElement('h4'); edgeTitle.textContent = '不足している接続'; edgeSection.append(edgeTitle);
  if (comparison.missingEdges.length) {
    const edgeList = document.createElement('ul'); edgeList.className = 'reflection-edge-list';
    comparison.missingEdges.forEach(edgeKey => {
      const li = document.createElement('li'); li.textContent = labelForEdge(edgeKey); edgeList.append(li);
    });
    edgeSection.append(edgeList);
  } else {
    const edgeBody = document.createElement('p'); edgeBody.textContent = 'なし'; edgeSection.append(edgeBody);
  }
  hintText.append(edgeSection, extraSection);

  if (comparison.missingItems.length) {
    const item = document.createElement('div'); item.className = 'reflection-item';
    const title = document.createElement('h4'); title.textContent = '不足している要素';
    const body = document.createElement('p'); body.textContent = comparison.missingItems.map(labelFor).join('、');
    item.append(title, body); hintText.append(item);
  }
  if (comparison.extraEdges.length) {
    const item = document.createElement('div'); item.className = 'reflection-item';
    const title = document.createElement('h4'); title.textContent = '見直したい接続';
    const body = document.createElement('p'); body.textContent = comparison.extraEdges.map(labelForEdge).join('／');
    item.append(title, body); hintText.append(item);
  }
  $('#hintBadge').hidden = true;
  $('#hintPanel').classList.add('is-review-hint', 'attention-pulse');
  window.setTimeout(() => $('#hintPanel')?.classList.remove('attention-pulse'), 1100);
  $('#hintPanel').classList.add('is-review-hint');
  $('#workbench').append($('#hintPanel'));
}

// 正解例を詰めて配置する。かたまり内は上から下へ、かたまり同士は左から右へ。
// 入る余地がないときは、問題データの layout をそのまま使う。
function applyCompactSolutionLayout(nodeMap, canvasW, canvasH, problem = current) {
  const ids = [...nodeMap.keys()], index = new Map(ids.map((id, i) => [id, i]));
  const edges = problem.connections.filter(([a, b]) => nodeMap.has(a) && nodeMap.has(b));
  const groupOf = new Map();
  (problem.groups || []).forEach((group, gi) => group.itemIds.forEach(id => { if (nodeMap.has(id) && !groupOf.has(id)) groupOf.set(id, gi); }));
  let nextGroup = (problem.groups || []).length;
  for (let pass = 0; pass < ids.length; pass++) ids.forEach(id => {
    if (groupOf.has(id)) return;
    const from = edges.find(([a, b]) => b === id && groupOf.has(a));
    if (from) groupOf.set(id, groupOf.get(from[0]));
  });
  ids.forEach(id => { if (!groupOf.has(id)) groupOf.set(id, nextGroup++); });
  const groups = [...new Set(ids.map(id => groupOf.get(id)))].sort((a, b) => a - b);
  // かたまりの列: 宣言順で前向きの接続だけを数えて最長経路を取る（戻る矢印は無視）
  const column = new Map(groups.map(g => [g, 0]));
  for (let pass = 0; pass < groups.length; pass++) edges.forEach(([a, b]) => {
    const ga = groupOf.get(a), gb = groupOf.get(b);
    if (ga < gb && column.get(gb) < column.get(ga) + 1) column.set(gb, column.get(ga) + 1);
  });
  const row = new Map(), columnBottom = new Map();
  groups.slice().sort((a, b) => column.get(a) - column.get(b) || a - b).forEach(g => {
    const members = ids.filter(id => groupOf.get(id) === g);
    const depth = new Map(members.map(id => [id, 0]));
    for (let pass = 0; pass < members.length; pass++) edges.forEach(([a, b]) => {
      if (depth.has(a) && depth.has(b) && index.get(a) < index.get(b) && depth.get(b) < depth.get(a) + 1) depth.set(b, depth.get(a) + 1);
    });
    members.sort((a, b) => depth.get(a) - depth.get(b) || index.get(a) - index.get(b));
    // 手前のかたまりから入ってくるカードの行に、このかたまりの入口を合わせて横矢印にする
    let offset = 0;
    const entry = members.findIndex(id => edges.some(([a, b]) => b === id && groupOf.get(a) < g && row.has(a)));
    if (entry >= 0) { const pred = edges.find(([a, b]) => b === members[entry] && groupOf.get(a) < g && row.has(a)); offset = Math.max(0, row.get(pred[0]) - entry); }
    offset = Math.max(offset, columnBottom.get(column.get(g)) ?? 0);
    members.forEach((id, i) => row.set(id, offset + i));
    columnBottom.set(column.get(g), offset + members.length + 1);
  });
  const nodes = [...nodeMap.values()];
  const w = Math.max(...nodes.map(n => n.offsetWidth)), h = Math.max(...nodes.map(n => n.offsetHeight));
  const colCount = Math.max(...column.values()) + 1, rowCount = Math.max(...row.values()) + 1;
  const totalW = colCount * w + (colCount - 1) * GAP_H, totalH = rowCount * h + (rowCount - 1) * GAP_V;
  if (totalW + 24 > canvasW || totalH + 24 > canvasH) return;
  // 正解例は左上を起点に配置し、読み始める位置を直感的にする。
  const left = 44 + w / 2, top = 44 + h / 2;
  nodeMap.forEach((node, id) => {
    node.style.left = `${left + column.get(groupOf.get(id)) * (w + GAP_H)}px`;
    node.style.top = `${top + row.get(id) * (h + GAP_V)}px`;
  });
}

function renderSolution() {
  const container = document.createElement('div'); container.id = 'solutionCanvas'; container.className = 'diagram-canvas solution-canvas';
  container.style.width = `${reviewCanvasSize.width}px`; container.style.height = `${reviewCanvasSize.height}px`;
  container.setAttribute('aria-label', 'この問題の正解例');
  $('#solutionSlot').replaceChildren(container);
  const svg = document.createElementNS(NS, 'svg'); svg.classList.add('connection-svg');
  const markerId = `solutionArrow-${questionIndex}`; svg.dataset.markerId = markerId;
  const defs = document.createElementNS(NS, 'defs'), marker = document.createElementNS(NS, 'marker');
  marker.id = markerId; marker.setAttribute('markerWidth', '7'); marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '6'); marker.setAttribute('refY', '3.5'); marker.setAttribute('orient', 'auto'); marker.setAttribute('markerUnits', 'strokeWidth');
  const arrow = document.createElementNS(NS, 'path'); arrow.setAttribute('d', 'M0,0 L7,3.5 L0,7 z'); arrow.setAttribute('fill', '#668a7a'); marker.append(arrow); defs.append(marker);
  const layer = document.createElementNS(NS, 'g'); svg.append(defs, layer); container.append(svg);
  const nodeMap = new Map();
  current.items.filter(item => item.kind === 'required').forEach(item => {
    const node = document.createElement('div'); node.className = 'diagram-node solution-node'; node.dataset.itemId = item.id;
    const label = document.createElement('span'); label.className = 'node-label'; label.textContent = item.label; node.append(label);
    const point = current.layout[item.id] || { x: .5, y: .5 }; node.style.left = `${point.x * 100}%`; node.style.top = `${point.y * 100}%`;
    container.append(node); nodeMap.set(item.id, node);
  });
  normalizeNodeHeights([...nodeMap.values()]);
  applyCompactSolutionLayout(nodeMap, reviewCanvasSize.width, reviewCanvasSize.height);
  window.requestAnimationFrame(() => drawSvgConnections(svg, layer, nodeMap, current.connections.map(([from, to]) => ({ from, to }))));
  $('#explanationText').textContent = ''; 
}

function alignReviewFirstCard() {
  const answerCanvas = $('#answerCanvasSlot').querySelector('.diagram-canvas');
  const solutionCanvas = $('#solutionCanvas');
  const answerViewport = $('#answerViewport');
  const solutionViewport = $('#solutionViewport');
  if (!answerCanvas || !solutionCanvas) return;

  const answerNodes = [...answerCanvas.querySelectorAll('.diagram-node')];
  const solutionNodes = [...solutionCanvas.querySelectorAll('.diagram-node')];
  if (!answerNodes.length || !solutionNodes.length) return;

  // 各図の外接矩形を求め、先頭カードではなく図全体の中心を合わせる。
  const getBounds = nodes => {
    const rects = nodes.map(node => ({
      left: node.offsetLeft - node.offsetWidth / 2,
      top: node.offsetTop - node.offsetHeight / 2,
      right: node.offsetLeft + node.offsetWidth / 2,
      bottom: node.offsetTop + node.offsetHeight / 2
    }));
    return {
      minX: Math.min(...rects.map(r => r.left)), minY: Math.min(...rects.map(r => r.top)),
      maxX: Math.max(...rects.map(r => r.right)), maxY: Math.max(...rects.map(r => r.bottom))
    };
  };
  const center = box => ({ x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 });
  const answerCenter = center(getBounds(answerNodes));
  const solutionCenter = center(getBounds(solutionNodes));
  const dx = solutionCenter.x - answerCenter.x;
  const dy = solutionCenter.y - answerCenter.y;
  // 全カードを同じ量だけ動かすため、解答内の相対配置・接続関係は変わらない。
  answerNodes.forEach(node => {
    node.style.left = `${node.offsetLeft + dx}px`;
    node.style.top = `${node.offsetTop + dy}px`;
  });

  // 移動後の両図の外接矩形から、共通キャンバス寸法を決める。
  const allNodes = [...answerNodes, ...solutionNodes];
  const padding = 44;
  let box = getBounds(allNodes);
  const shiftX = padding - box.minX;
  const shiftY = padding - box.minY;
  if (shiftX || shiftY) {
    allNodes.forEach(node => {
      node.style.left = `${node.offsetLeft + shiftX}px`;
      node.style.top = `${node.offsetTop + shiftY}px`;
    });
    box = getBounds(allNodes);
  }
  const width = Math.ceil(box.maxX + padding);
  const height = Math.ceil(box.maxY + padding);
  [answerCanvas, solutionCanvas].forEach(canvas => {
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  });
  reviewCanvasSize = { width, height };

  // 図全体がなるべく同じ表示範囲に収まる倍率を自動設定。手動ズームは引き続き利用可能。
  const viewports = [answerViewport, solutionViewport].filter(Boolean);
  const availableW = Math.min(...viewports.map(v => v.clientWidth || 1)) - 28;
  const availableH = Math.min(...viewports.map(v => v.clientHeight || 1)) - 28;
  const fitZoom = Math.min(1, availableW / width, availableH / height);
  reviewZoom = Math.max(.35, Math.floor(fitZoom * 10) / 10);
  applyReviewZoom(reviewZoom);
  viewports.forEach(viewport => { viewport.scrollLeft = 0; viewport.scrollTop = 0; });
  window.requestAnimationFrame(() => {
    drawCurrentConnections();
    drawSolutionConnections();
    viewports.forEach(viewport => { viewport.scrollLeft = 0; viewport.scrollTop = 0; });
  });
}

function showAnswerCelebration(comparison, composition) {
  const elementsCorrect = !comparison.missingItems.length && !comparison.extraItems.length;
  const connectionsCorrect = !comparison.missingEdges.length && !comparison.extraEdges.length;
  let tier = 'bad';
  let label = 'Bad';
  let subtitle = '要素とつながりを見直してみよう';
  if (elementsCorrect && connectionsCorrect) {
    tier = composition.points >= 3 ? 'excellent' : composition.points === 2 ? 'great' : composition.points === 1 ? 'cool' : 'good';
    label = ({ good: 'Good', cool: 'Cool', great: 'Great', excellent: 'Excellent' })[tier];
    subtitle = composition.points ? `正解！ ＋芸術点 ${composition.points}` : '必要な要素とつながりが正解';
  } else if (elementsCorrect || connectionsCorrect) {
    tier = 'not-good'; label = 'Not Good';
    subtitle = elementsCorrect ? '要素はOK。矢印のつながりを見直そう' : '矢印はOK。必要な要素と不要な要素を見直そう';
  } else {
    subtitle = '必要な要素の選択と矢印の両方を見直そう';
  }

  document.querySelector('.answer-celebration')?.remove();
  const overlay = document.createElement('div');
  overlay.className = `answer-celebration tier-${tier}`;
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  const content = document.createElement('div'); content.className = 'celebration-content';
  const mark = document.createElement('div'); mark.className = 'celebration-mark';
  mark.textContent = ({ bad: '×', 'not-good': '!', good: '✓', cool: '★', great: '★★', excellent: '✦' })[tier];
  const title = document.createElement('strong'); title.className = 'celebration-title'; title.textContent = label;
  const text = document.createElement('span'); text.className = 'celebration-subtitle'; text.textContent = subtitle;
  content.append(mark, title, text); overlay.append(content);

  const confettiCount = tier === 'excellent' ? 100 : tier === 'great' ? 64 : tier === 'cool' ? 36 : 0;
  for (let i = 0; i < confettiCount; i++) {
    const piece = document.createElement('i'); piece.className = 'celebration-confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--fall-duration', `${1.15 + Math.random() * 1.1}s`);
    piece.style.setProperty('--fall-delay', `${Math.random() * .35}s`);
    piece.style.setProperty('--spin', `${Math.round(Math.random() * 720 - 360)}deg`);
    overlay.append(piece);
  }
  if (tier === 'excellent' || tier === 'great') {
    for (let burstIndex = 0; burstIndex < (tier === 'excellent' ? 4 : 2); burstIndex++) {
      const burst = document.createElement('div'); burst.className = 'celebration-burst';
      burst.style.left = `${22 + burstIndex * (tier === 'excellent' ? 18 : 42)}%`;
      burst.style.top = `${24 + (burstIndex % 2) * 20}%`;
      for (let i = 0; i < 18; i++) {
        const spark = document.createElement('i'); spark.style.setProperty('--angle', `${i * 20}deg`); burst.append(spark);
      }
      overlay.append(burst);
    }
  }
  document.body.append(overlay);
  window.setTimeout(() => overlay.classList.add('is-leaving'), 1650);
  window.setTimeout(() => overlay.remove(), 2050);
}

function submitAnswer() {
  if (locked) return;
  const activeCanvas = $('#diagramCanvas');
  reviewCanvasSize = { width: activeCanvas.offsetWidth, height: activeCanvas.offsetHeight };
  locked = true;
  const comparison = compareAnswer();
  const composition = assessComposition();
  reviewExpectedEdges = new Set(comparison.expectedEdges);
  if (comparison.correct) score++;
  const snapshot = {
    width: reviewCanvasSize.width, height: reviewCanvasSize.height,
    nodes: [...placed.keys()].map(id => ({ id, label: labelFor(id), x: positions.get(id).x, y: positions.get(id).y, extra: current.items.find(item => item.id === id)?.kind === 'extra' })),
    edges: connections.map(edge => ({ from: edge.from, to: edge.to, ok: comparison.expectedEdges.includes(`${edge.from}->${edge.to}`) }))
  };
  sessionResults.push({ id: current.id, title: current.title, correct: comparison.correct, explanation: current.explanation, compositionPoints: composition.points, untouched: Boolean(composition.untouched), snapshot, problem: current });
  $('#scoreText').textContent = `正解 ${score}`;
  $('#progressBar').style.width = `${(questionIndex + 1) / session.length * 100}%`;
  $('#diagramCanvas').classList.add('is-locked');
  $('#workbench').classList.add('is-reviewing');
  $('#feedback').hidden = true;
  $('#workbench').append($('#feedback'));
  $('#reviewExplanation').hidden = true;
  $('#diagramPanel').hidden = true;
  $('#reviewArea').hidden = false;
  $('#reviewArea').classList.remove('review-enter');
  void $('#reviewArea').offsetWidth;
  $('#reviewArea').classList.add('review-enter');
  activeCanvas.style.width = `${reviewCanvasSize.width}px`;
  activeCanvas.style.height = `${reviewCanvasSize.height}px`;
  $('#answerCanvasSlot').append(activeCanvas);
  applyReviewZoom(reviewZoom);
  linkStart = null; selectedConnection = null; pointerDrag = null;
  updateNodeStates();
  placed.forEach(node => node.classList.remove('is-dragging'));
  $('#alignmentGuides').replaceChildren(); $('#edgeTools').replaceChildren();
  $('#trashPanel').hidden = true; $('#trashToggle').setAttribute('aria-expanded', 'false');
  $('#itemBank').querySelectorAll('button').forEach(card => { card.disabled = true; });
  $('#clearLinks').disabled = true;
  $('#submitButton').hidden = true; $('#nextButton').hidden = false;
  $('#trashToggle').disabled = true;
  $('#trashPanel').querySelectorAll('button').forEach(button => { button.disabled = true; });
  renderFeedback(comparison, composition); renderSolution(); $('#explanationText').textContent = current.explanation || ''; alignReviewFirstCard();
  $('#feedback').classList.add('feedback-enter');
  showAnswerCelebration(comparison, composition);
  window.requestAnimationFrame(() => drawCurrentConnections());
}

function applyReviewZoom(value) {
  reviewZoom = Math.max(.35, Math.min(1.4, Math.round(value * 10) / 10));
  $('#diagramCanvas').style.zoom = String(reviewZoom);
  const solution = $('#solutionCanvas');
  if (solution) solution.style.zoom = String(reviewZoom);
  $('#zoomLabel').textContent = `${Math.round(reviewZoom * 100)}%`;
  window.requestAnimationFrame(() => { drawCurrentConnections(); if (solution) drawSolutionConnections(); });
}

function drawSolutionConnections() {
  const canvas = $('#solutionCanvas');
  if (!canvas) return;
  const svg = canvas.querySelector('svg'), layer = svg?.querySelector('g');
  if (!svg || !layer) return;
  const nodes = new Map([...canvas.querySelectorAll('.solution-node')].map(node => [node.dataset.itemId, node]));
  drawSvgConnections(svg, layer, nodes, current.connections.map(([from, to]) => ({ from, to })));
}

function showResults() {
  $('#quizView').hidden = true; $('#resultView').hidden = false;
  $('#resultView').classList.remove('result-enter');
  void $('#resultView').offsetWidth;
  $('#resultView').classList.add('result-enter');
  $('#finalScore').textContent = `${score} / ${session.length}`;
  awardAndRecord();
  $('#resultMessage').textContent = score === session.length
    ? '必要な情報を選び、関係をつなぐ視点が身についてきました。'
    : '完成例と自分の図を見比べて、情報と関係の違いを振り返ってみましょう。';
  const compositionTotal = sessionResults.reduce((sum, result) => sum + result.compositionPoints, 0);
  $('#finalCompositionScore').textContent = `${compositionTotal} / ${session.length * 3}点`;
  $('#progressBar').style.width = '100%';
  updateResultActions();
  $('#reviewList').hidden = true; $('#reviewList').replaceChildren(); updateReviewToggle();
  $('#resultView').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function h(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function startDailyChallenge() {
  const c = getCareer(), date = todayKey(); if (c.dailyDates.includes(date)) return;
  let selected = readStore(DAILY_QUESTION_KEY, {});
  if (selected.date !== date || !problems.some(problem => problem.id === selected.id)) {
    selected = { date, id: shuffle(problems)[0].id }; writeStore(DAILY_QUESTION_KEY, selected);
  }
  startSession(1, 'daily', [problems.find(problem => problem.id === selected.id)]);
}

function updateResultActions() {
  const c = getCareer();
  $('#retryButton').hidden = sessionType === 'daily';
  // 今日の1問は、挑戦可能なとき（練習済みで、今日まだ未挑戦）だけ表示する。
  $('#resultDailyButton').hidden = !(c.hasPlayed && !c.dailyDates.includes(todayKey()));
}

function updateReviewToggle() {
  const list = $('#reviewList');
  $('#reviewButton').setAttribute('aria-expanded', String(!list.hidden));
  $('#reviewChevron').textContent = list.hidden ? '›' : '⌄';
}

// 解答時点の図（snapshot）と正解例を、操作できない図として描画する。
function enablePanScroll(viewport) {
  let pan = null;
  viewport.addEventListener('pointerdown', event => {
    if (event.button > 0 || !viewport.classList.contains('is-pannable')) return;
    pan = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId); viewport.classList.add('is-panning'); event.preventDefault();
  });
  viewport.addEventListener('pointermove', event => {
    if (!pan) return;
    viewport.scrollLeft = pan.left - (event.clientX - pan.x);
    viewport.scrollTop = pan.top - (event.clientY - pan.y);
  });
  const end = () => { pan = null; viewport.classList.remove('is-panning'); };
  viewport.addEventListener('pointerup', end); viewport.addEventListener('pointercancel', end);
}

function renderStaticDiagram(slot, { nodes, edges, width, height, compact = false, classify = null, problem = null }) {
  slot.replaceChildren();
  if (!nodes.length) { slot.append(h('p', 'review-empty', 'カードが配置されていません。')); return; }
  const tag = `static-${++staticDiagramSeq}`;
  const canvas = h('div', 'diagram-canvas static-canvas');
  canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'connection-svg');
  svg.dataset.markerPrefix = tag; svg.dataset.markerId = `${tag}-n`;
  const defs = document.createElementNS(NS, 'defs');
  [['n', '#668a7a'], ['ok', '#4d8064'], ['ng', '#b75c4f']].forEach(([key, color]) => {
    const marker = document.createElementNS(NS, 'marker'); marker.id = `${tag}-${key}`;
    marker.setAttribute('markerWidth', '7'); marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '6'); marker.setAttribute('refY', '3.5'); marker.setAttribute('orient', 'auto'); marker.setAttribute('markerUnits', 'strokeWidth');
    const arrow = document.createElementNS(NS, 'path'); arrow.setAttribute('d', 'M0,0 L7,3.5 L0,7 z'); arrow.setAttribute('fill', color);
    marker.append(arrow); defs.append(marker);
  });
  const layer = document.createElementNS(NS, 'g'); svg.append(defs, layer); canvas.append(svg);
  const nodeMap = new Map();
  nodes.forEach(item => {
    const node = h('div', `diagram-node static-node${item.extra ? ' is-extra-placed' : ''}`); node.dataset.itemId = item.id;
    node.append(h('span', 'node-label', item.label));
    node.style.left = `${item.x * 100}%`; node.style.top = `${item.y * 100}%`;
    canvas.append(node); nodeMap.set(item.id, node);
  });
  slot.append(canvas);
  normalizeNodeHeights([...nodeMap.values()]);
  if (compact) applyCompactSolutionLayout(nodeMap, width, height, problem);
  // 図の外接矩形に切り詰めて、狭い欄でも読める大きさで表示する。
  const pad = 24;
  const boxes = [...nodeMap.values()].map(node => ({ node, left: node.offsetLeft - node.offsetWidth / 2, top: node.offsetTop - node.offsetHeight / 2, right: node.offsetLeft + node.offsetWidth / 2, bottom: node.offsetTop + node.offsetHeight / 2, cx: node.offsetLeft, cy: node.offsetTop }));
  const minX = Math.min(...boxes.map(b => b.left)), minY = Math.min(...boxes.map(b => b.top));
  const maxX = Math.max(...boxes.map(b => b.right)), maxY = Math.max(...boxes.map(b => b.bottom));
  boxes.forEach(b => { b.node.style.left = `${b.cx - minX + pad}px`; b.node.style.top = `${b.cy - minY + pad}px`; });
  const canvasW = maxX - minX + pad * 2, canvasH = maxY - minY + pad * 2;
  canvas.style.width = `${canvasW}px`; canvas.style.height = `${canvasH}px`;
  const zoom = Math.max(.55, Math.min(1, (slot.clientWidth - 2) / canvasW));
  canvas.style.zoom = String(Math.round(zoom * 100) / 100);
  window.requestAnimationFrame(() => {
    drawSvgConnections(svg, layer, nodeMap, edges, false, classify);
    slot.classList.toggle('is-pannable', slot.scrollWidth > slot.clientWidth + 1 || slot.scrollHeight > slot.clientHeight + 1);
  });
}

function buildReviewItem(result, index) {
  const item = h('article', `review-item ${result.correct ? 'review-correct' : 'review-incorrect'}`);
  const heading = h('div', 'review-item-heading');
  heading.append(
    h('span', 'review-status', result.correct ? '○ 正解' : '× 不正解'),
    h('strong', '', `${index + 1}. ${result.title}`),
    h('span', 'review-craft', result.untouched ? '芸術点 0 / 3点（操作なし）' : `芸術点 ${result.compositionPoints} / 3点`)
  );
  const compare = h('div', 'review-compare');
  [['あなたの図', '実際に書いた図'], ['正解例', '正しい関係']].forEach(([title, note]) => {
    const pane = h('section', 'review-pane');
    const paneHeading = h('h5', '', title); paneHeading.append(h('span', '', note));
    pane.append(paneHeading, h('div', 'review-viewport'));
    compare.append(pane);
  });
  item.append(heading, compare);
  if (result.explanation) item.append(h('p', 'review-explanation-text', result.explanation));
  return item;
}

function fillReviewDiagrams(item, result) {
  const [mine, answer] = item.querySelectorAll('.review-viewport');
  [mine, answer].forEach(enablePanScroll);
  const s = result.snapshot, p = result.problem;
  renderStaticDiagram(mine, { nodes: s.nodes, edges: s.edges, width: s.width, height: s.height, classify: edge => edge.ok ? 'ok' : 'ng' });
  renderStaticDiagram(answer, {
    nodes: p.items.filter(i => i.kind === 'required').map(i => ({ id: i.id, label: i.label, x: (p.layout[i.id] || { x: .5 }).x, y: (p.layout[i.id] || { y: .5 }).y })),
    edges: p.connections.map(([from, to]) => ({ from, to })), width: 2400, height: 1800, compact: true, problem: p
  });
}

function showReview() {
  const list = $('#reviewList'); list.hidden = !list.hidden;
  updateReviewToggle();
  if (list.hidden) return;
  list.replaceChildren();
  window.setTimeout(() => list.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  const header = h('div', 'review-header'); header.append(h('h4', '', '解答一覧と解説'));
  const legend = h('div', 'relation-legend');
  legend.innerHTML = '<span><i class="legend-line is-correct"></i>正しい関係</span><span><i class="legend-line is-wrong"></i>見直す関係</span>';
  const itemsBox = h('div', 'review-items');
  list.append(header, legend, itemsBox);
  const hasIncorrect = sessionResults.some(result => !result.correct);
  let currentFilter = hasIncorrect ? 'incorrect' : 'all';
  const renderItems = filter => {
    itemsBox.replaceChildren();
    const filtered = sessionResults.filter(result => filter === 'all' || (filter === 'correct' ? result.correct : !result.correct));
    if (!filtered.length) { itemsBox.append(h('p', 'review-empty', filter === 'correct' ? '正解した問題はありません。' : '不正解の問題はありません。')); return; }
    filtered.forEach(result => {
      const item = buildReviewItem(result, sessionResults.indexOf(result));
      itemsBox.append(item); fillReviewDiagrams(item, result);
    });
  };
  // 不正解が1問でもあるときだけフィルターを出し、全問正解なら出さない。
  if (hasIncorrect) {
    const filterBar = h('div', 'review-filter-bar');
    [['all', 'すべて'], ['correct', '正解'], ['incorrect', '不正解']].forEach(([value, label]) => {
      const button = h('button', 'review-filter-button' + (value === currentFilter ? ' is-active' : ''), label); button.type = 'button';
      button.addEventListener('click', () => {
        currentFilter = value;
        filterBar.querySelectorAll('.review-filter-button').forEach(b => b.classList.toggle('is-active', b === button));
        renderItems(currentFilter);
      });
      filterBar.append(button);
    });
    header.append(filterBar);
  }
  renderItems(currentFilter);
}

function startSession(count = 5, type = 'practice', selected = null) {
  session = selected || selectSessionQuestions(count); lastSession = [...session]; sessionType = type; startedAt = Date.now();
  questionIndex = 0; score = 0; sessionResults = [];
  $('#startView').hidden = true; $('#resultView').hidden = true; $('#reviewList').hidden = true; $('#quizView').hidden = false;
  renderQuestion(); $('#quizView').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function init() {
  const [response, careerResponse] = await Promise.all([fetch(DATA_URL), fetch(CAREER_URL)]);
  if (!response.ok || !careerResponse.ok) throw new Error('問題または継続設定データを読み込めませんでした');
  const [data, careerData] = await Promise.all([response.json(), careerResponse.json()]);
  if (data.version !== 1 || !Array.isArray(data.problems) || data.problems.length !== 50) throw new Error('問題データは50問必要です');
  if (data.problems.some(problem => !['easy', 'normal', 'hard'].includes(problem.difficulty))) throw new Error('各問題に難易度を設定してください');
  if (data.problems.filter(problem => problem.difficulty === 'hard').some(problem => {
    const outgoing = new Map(); problem.connections.forEach(([from]) => outgoing.set(from, (outgoing.get(from) || 0) + 1));
    return [...outgoing.values()].filter(count => count > 1).length < 2;
  })) throw new Error('難しい問題には複数の条件分岐が必要です');
  if (careerData.version !== 1 || !careerData.rewards || !Array.isArray(careerData.rewards.milestones) || !Array.isArray(careerData.stages)) throw new Error('継続設定データの形式が正しくありません');
  problems = data.problems;
  careerConfig = careerData;
  $('#start3').addEventListener('click', () => startSession(3));
  $('#start5').addEventListener('click', () => startSession(5));
  $('#dailyStart').addEventListener('click', startDailyChallenge);
  $('#submitButton').addEventListener('click', submitAnswer);
  $('#nextButton').addEventListener('click', () => {
    if (!locked) return;
    if (questionIndex >= session.length - 1) showResults();
    else { questionIndex++; $('#diagramCanvas').classList.remove('is-locked'); renderQuestion(); $('#quizView').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  $('#retryButton').addEventListener('click', () => startSession(lastSession.length, 'practice', lastSession));
  $('#resultDailyButton').addEventListener('click', startDailyChallenge);
  $('#resultStart3').addEventListener('click', () => startSession(3));
  $('#resultStart5').addEventListener('click', () => startSession(5));
  $('#reviewButton').addEventListener('click', showReview);
  $('#clearLinks').addEventListener('click', () => { if (!locked) { connections = []; trashedConnections.clear(); linkStart = null; selectedConnection = null; updateConnectionStatus(); updateNodeStates(); drawCurrentConnections(); } });
  $('#trashToggle').addEventListener('click', event => {
    event.stopPropagation();
    const panel = $('#trashPanel'), open = panel.hidden;
    panel.hidden = !open; $('#trashToggle').setAttribute('aria-expanded', String(open));
    $('#trashToggle').setAttribute('aria-label', `${open ? 'ゴミ箱を閉じる' : 'ゴミ箱を開く'}。${trashed.size}枚`);
  });
  $('#zoomOut').addEventListener('click', () => applyReviewZoom(reviewZoom - .1));
  $('#zoomIn').addEventListener('click', () => applyReviewZoom(reviewZoom + .1));
  $('#monthPrev').addEventListener('click', () => { calendarMonth--; if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; } selectedCalendarDate = ''; renderRecords(); });
  $('#monthNext').addEventListener('click', () => { calendarMonth++; if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; } selectedCalendarDate = ''; renderRecords(); });
  const shareUrl = encodeURIComponent(location.href.split('#')[0]), shareText = encodeURIComponent(document.title);
  $('#share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  $('#share-x').href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  $('#share-line').href = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;
  const answerViewport = $('#answerViewport'), solutionViewport = $('#solutionViewport');
  answerViewport.addEventListener('scroll', () => {
    if (syncingReviewScroll) return;
    syncingReviewScroll = true; solutionViewport.scrollTop = answerViewport.scrollTop; solutionViewport.scrollLeft = answerViewport.scrollLeft;
    syncingReviewScroll = false;
  });
  solutionViewport.addEventListener('scroll', () => {
    if (syncingReviewScroll) return;
    syncingReviewScroll = true; answerViewport.scrollTop = solutionViewport.scrollTop; answerViewport.scrollLeft = solutionViewport.scrollLeft;
    syncingReviewScroll = false;
  });
  [answerViewport, solutionViewport].forEach(viewport => {
    let pan = null;
    viewport.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      pan = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
      viewport.classList.add('is-panning');
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', event => {
      if (!pan || pan.pointerId !== event.pointerId) return;
      viewport.scrollLeft = pan.left - (event.clientX - pan.x);
      viewport.scrollTop = pan.top - (event.clientY - pan.y);
    });
    const endPan = event => {
      if (!pan || pan.pointerId !== event.pointerId) return;
      pan = null; viewport.classList.remove('is-panning');
    };
    viewport.addEventListener('pointerup', endPan);
    viewport.addEventListener('pointercancel', endPan);
  });
  const canvas = $('#diagramCanvas');
  canvas.addEventListener('click', event => {
    if (locked || (event.target !== canvas && event.target !== $('#canvasEmpty'))) return;
    if (linkStart || selectedConnection) { linkStart = null; selectedConnection = null; updateConnectionStatus(); updateNodeStates(); drawCurrentConnections(); }
  });
  canvas.addEventListener('dragover', event => { if (locked) return; event.preventDefault(); canvas.classList.add('is-drop-target'); });
  canvas.addEventListener('dragleave', event => { if (!canvas.contains(event.relatedTarget)) canvas.classList.remove('is-drop-target'); });
  canvas.addEventListener('drop', event => {
    event.preventDefault(); canvas.classList.remove('is-drop-target'); if (locked) return;
    const itemId = event.dataTransfer.getData('text/plain'), item = current.items.find(entry => entry.id === itemId);
    if (!item) return;
    const rect = canvas.getBoundingClientRect(), nodeW = innerWidth <= 1100 ? 160 : 202;
    const x = Math.max(nodeW / 2 + 4, Math.min(rect.width - nodeW / 2 - 4, event.clientX - rect.left));
    const y = Math.max(40, Math.min(rect.height - 40, event.clientY - rect.top));
    addNode(itemId, { x: x / rect.width, y: y / rect.height });
    dragJustEnded = true; window.setTimeout(() => { dragJustEnded = false; }, 80);
  });
  window.addEventListener('resize', () => { drawCurrentConnections(); drawSolutionConnections(); });
  renderContinuity(); renderRecords();
}

init().catch(error => {
  $('#startView').innerHTML = `<p class="load-error">${error.message}。Live ServerなどのローカルWebサーバーで開いてください。</p>`;
});
