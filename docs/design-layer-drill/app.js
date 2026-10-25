const DATA = 'data/problems.json';
const CAREER_DATA = 'data/career.json';
const HISTORY_KEY = 'design-layer-drill-history-v1';
const CAREER_KEY = 'design-layer-drill-career-v1';
const $ = selector => document.querySelector(selector);
const shuffle = values => { const result = [...values]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
const today = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
let data, careerConfig, questions = [], idx = 0, score = 0, current, done = false, drag = null;
let answers = [], startedAt = 0, sessionType = 'practice', lastQuestions = [], earnedPoints = 0, isFinishing = false;
let calendarYear = new Date().getFullYear(), calendarMonth = new Date().getMonth(), selectedCalendarDate = '';

function readJSON(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
function writeJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The drill remains playable if browser storage is unavailable. */ } }
function career() { const saved = readJSON(CAREER_KEY, {}); return { points: Number(saved.points) || 0, correctCount: Number(saved.correctCount) || 0, milestones: Array.isArray(saved.milestones) ? saved.milestones : [], dailyDates: Array.isArray(saved.dailyDates) ? saved.dailyDates : [], hasPlayed: Boolean(saved.hasPlayed) }; }
function renderContinuity() {
  const c = career(), history = readJSON(HISTORY_KEY, []), stages = careerConfig.stages, milestones = careerConfig.rewards.milestones, stageIndex = stages.reduce((found, stage, i) => c.points >= stage.points ? i : found, 0), stage = stages[stageIndex], next = stages[stageIndex + 1];
  $('#pointsTotal').textContent = `${c.points} pt`; $('#careerStage').textContent = stage.title;
  $('#recordSummary').textContent = `これまでの挑戦 ${history.length}回`;
  const milestone = milestones.find(item => item.correct > c.correctCount);
  $('#milestoneText').textContent = milestone ? `次の節目まで正解 ${milestone.correct - c.correctCount}問` : 'すべての正解数の節目に到達';
  $('#careerBar').style.width = next ? `${Math.max(0, Math.min(100, (c.points - stage.points) / (next.points - stage.points) * 100))}%` : '100%';
  $('#dailyStart').hidden = !c.hasPlayed;
  const completed = c.dailyDates.includes(today());
  $('#dailyStart').disabled = completed;
  $('#dailyStart').textContent = completed ? '今日の1問は完了しました' : '今日の1問に挑戦 →';
  $('#dailyStatus').textContent = completed ? '今日の挑戦は記録済みです。明日また挑戦できます。' : `正解1問につき${careerConfig.rewards.practiceCorrect}pt。今日の1問は正解で${careerConfig.rewards.dailyCorrect}pt。`;
}
function recordDay(record) {
  const date = new Date(record.date);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function renderRecords() {
  const records = readJSON(HISTORY_KEY, []), sessionsByDay = new Map();
  records.forEach(record => { const day = recordDay(record); sessionsByDay.set(day, [...(sessionsByDay.get(day) || []), record]); });
  $('#recordTotal').textContent = `挑戦 ${records.length}回`;
  $('#calendarMonth').textContent = new Date(calendarYear, calendarMonth, 1).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
  const grid = $('#calendarGrid'); grid.replaceChildren();
  ['日', '月', '火', '水', '木', '金', '土'].forEach((name, index) => { const label = document.createElement('span'); label.className = `weekday${index === 0 ? ' sunday' : index === 6 ? ' saturday' : ''}`; label.textContent = name; grid.append(label); });
  const firstWeekday = new Date(calendarYear, calendarMonth, 1).getDay(), days = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  for (let blank = 0; blank < firstWeekday; blank++) { const cell = document.createElement('span'); cell.className = 'calendar-blank'; grid.append(cell); }
  const todayKey = today();
  for (let day = 1; day <= days; day++) {
    const key = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`, sessions = sessionsByDay.get(key) || [];
    const button = document.createElement('button'); button.type = 'button'; button.className = `calendar-day${sessions.length ? ' attended' : ''}${key === todayKey ? ' today' : ''}${key === selectedCalendarDate ? ' selected' : ''}`;
    button.textContent = day; button.disabled = sessions.length === 0; button.setAttribute('aria-label', `${key}${sessions.length ? `、${sessions.length}回挑戦` : ''}`);
    if (sessions.length) button.addEventListener('click', () => { selectedCalendarDate = key; renderRecords(); });
    grid.append(button);
  }
  const monthSessions = records.filter(record => recordDay(record).startsWith(`${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-`));
  const attendedDays = new Set(monthSessions.map(recordDay)).size;
  if (selectedCalendarDate && selectedCalendarDate.startsWith(`${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-`)) {
    const selected = sessionsByDay.get(selectedCalendarDate) || [], correct = selected.reduce((sum, record) => sum + record.correct, 0), total = selected.reduce((sum, record) => sum + record.count, 0);
    $('#calendarSummary').textContent = `${selectedCalendarDate}：${selected.length}回挑戦・${correct}/${total}問正解`;
  } else $('#calendarSummary').textContent = `${calendarYear}年${calendarMonth + 1}月：${attendedDays}日・${monthSessions.length}回挑戦`;
  renderAccuracyChart(records);
}
function renderAccuracyChart(records) {
  const container = $('#accuracyChart'); container.replaceChildren();
  const recent = records.slice(0, 10).reverse(), ns = 'http://www.w3.org/2000/svg';
  $('#chartSummary').textContent = recent.length ? `直近${recent.length}回の平均正答率 ${Math.round(recent.reduce((sum, item) => sum + item.accuracy, 0) / recent.length)}%` : '挑戦すると正答率の推移が表示されます。';
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 360 180'); svg.setAttribute('role', 'presentation');
  [0, 50, 100].forEach(value => { const y = 145 - value * 1.2, line = document.createElementNS(ns, 'line'); line.setAttribute('x1', '34'); line.setAttribute('x2', '350'); line.setAttribute('y1', y); line.setAttribute('y2', y); line.setAttribute('class', 'chart-gridline'); svg.append(line); const label = document.createElementNS(ns, 'text'); label.setAttribute('x', '26'); label.setAttribute('y', y + 4); label.setAttribute('text-anchor', 'end'); label.setAttribute('class', 'chart-axis-label'); label.textContent = `${value}%`; svg.append(label); });
  if (recent.length) {
    const points = recent.map((record, index) => ({ x: recent.length === 1 ? 192 : 42 + index * (292 / (recent.length - 1)), y: 145 - record.accuracy * 1.2, record }));
    const path = document.createElementNS(ns, 'polyline'); path.setAttribute('points', points.map(point => `${point.x},${point.y}`).join(' ')); path.setAttribute('class', 'chart-line'); svg.append(path);
    points.forEach(point => { const circle = document.createElementNS(ns, 'circle'); circle.setAttribute('cx', point.x); circle.setAttribute('cy', point.y); circle.setAttribute('r', '4'); circle.setAttribute('class', 'chart-point'); const title = document.createElementNS(ns, 'title'); title.textContent = `${recordDay(point.record)}　正答率 ${point.record.accuracy}%`; circle.append(title); svg.append(circle); });
  }
  container.append(svg);
}
function drawZones() {
  $('#zones').replaceChildren();
  data.levels.forEach(level => {
    const zone = document.createElement('button'); zone.type = 'button'; zone.className = 'zone'; zone.dataset.level = level.id;
    const title = document.createElement('h3'); title.textContent = level.id;
    const description = document.createElement('p'); description.textContent = level.description;
    const mark = document.createElement('span'); mark.className = 'mark'; mark.textContent = 'ここに置く';
    zone.append(title, description, mark); zone.addEventListener('click', () => place(level.id));
    zone.addEventListener('dragover', event => { event.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', event => { event.preventDefault(); zone.classList.remove('over'); place(level.id); });
    zone.addEventListener('pointerup', () => { if (drag?.moved) place(level.id); });
    $('#zones').append(zone);
  });
}
function startSession(selected, type = 'practice') {
  questions = selected; lastQuestions = [...selected]; idx = 0; score = 0; answers = []; earnedPoints = 0; isFinishing = false; sessionType = type; startedAt = Date.now();
  $('#startView').hidden = true; $('#resultView').hidden = true; $('#quizView').hidden = false; drawZones(); loadQuestion();
  $('.game').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function loadQuestion() {
  if (idx >= questions.length) { finish(); return; }
  current = questions[idx]; done = false; $('#qnum').textContent = `QUESTION ${String(idx + 1).padStart(2, '0')}`;
  $('#progressText').textContent = `${idx + 1} / ${questions.length} 問`; $('#scoreText').textContent = `正解 ${score}`;
  $('#bar').style.width = `${idx / questions.length * 100}%`;
  const card = document.createElement('div'); card.className = 'card'; card.draggable = true; card.tabIndex = 0; card.textContent = current.text;
  card.setAttribute('aria-label', `分類する文章：${current.text}。下の分類ボタンから回答してください。`);
  card.addEventListener('dragstart', event => { event.dataTransfer.setData('text/plain', current.id); });
  card.addEventListener('pointerdown', startDrag);
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); $('#zones .zone').item(0).focus(); } });
  $('#tray').replaceChildren(card);
  $('#zones').querySelectorAll('.zone').forEach(zone => { zone.classList.remove('correct', 'wrong', 'over'); zone.querySelector('.mark').textContent = 'ここに置く'; });
  $('#feedback').className = 'feedback'; $('#feedback').innerHTML = '<span class="hint-badge">✦ ヒント</span><p>「何が書かれているか」だけでなく、「この文章で何を決めようとしているか」に注目しましょう。</p>';
  $('#skip').disabled = false;
}
function startDrag(event) {
  if (event.button !== 0 || done) return;
  const card = event.currentTarget, rect = card.getBoundingClientRect();
  drag = { el: card, x: event.clientX, y: event.clientY, ox: event.clientX - rect.left, oy: event.clientY - rect.top, moved: false };
  card.setPointerCapture(event.pointerId); card.addEventListener('pointermove', moveDrag); card.addEventListener('pointerup', endDrag, { once: true });
}
function moveDrag(event) {
  if (!drag) return; const d = drag;
  if (!d.moved && Math.hypot(event.clientX - d.x, event.clientY - d.y) > 7) { d.moved = true; d.el.classList.add('dragging'); d.el.style.position = 'fixed'; d.el.style.zIndex = '99'; d.el.style.width = `${Math.min(d.el.offsetWidth, innerWidth - 26)}px`; d.el.style.pointerEvents = 'none'; }
  if (d.moved) { d.el.style.left = `${event.clientX - d.ox}px`; d.el.style.top = `${event.clientY - d.oy}px`; $('#zones').querySelectorAll('.zone').forEach(zone => { const r = zone.getBoundingClientRect(); zone.classList.toggle('over', event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom); }); }
}
function endDrag(event) {
  const d = drag; if (!d) return; d.el.removeEventListener('pointermove', moveDrag);
  if (d.moved) { const zone = document.elementFromPoint(event.clientX, event.clientY)?.closest('.zone'); d.el.remove(); $('#zones').querySelectorAll('.zone').forEach(item => item.classList.remove('over')); if (zone) place(zone.dataset.level); else loadQuestion(); }
  drag = null;
}
function place(level) {
  if (done || isFinishing) return; done = true;
  const correct = level === current.answer; if (correct) score++;
  answers.push({ id: current.id, selected: level, correct, skipped: false });
  showFeedback(correct, level); showAnswerFlash(correct, () => { if (idx + 1 < questions.length) { idx++; loadQuestion(); } else finish(); });
}
function skipQuestion() {
  if (done || isFinishing) return; done = true; answers.push({ id: current.id, selected: '', correct: false, skipped: true });
  $('#feedback').className = 'feedback bad'; $('#feedback').innerHTML = '<b>この問題はスキップしました</b><p>結果の振り返りで正解と理由を確認できます。</p>';
  showAnswerFlash(false, () => { if (idx + 1 < questions.length) { idx++; loadQuestion(); } else finish(); }, 'スキップ');
}
function showFeedback(correct, selected) {
  $('#zones').querySelectorAll('.zone').forEach(zone => {
    if (zone.dataset.level === current.answer) zone.classList.add('correct');
    if (selected && zone.dataset.level === selected && !correct) zone.classList.add('wrong');
    zone.querySelector('.mark').textContent = zone.dataset.level === current.answer ? '✓ 正解の置き場所' : zone.dataset.level === selected ? 'あなたの回答' : '';
  });
  $('#feedback').className = `feedback ${correct ? 'good' : 'bad'}`;
  const heading = document.createElement('b'); heading.textContent = correct ? '正解！' : '今回は違いました';
  const reason = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = current.answer; reason.append(strong, document.createTextNode(`：${current.reason}`));
  $('#feedback').replaceChildren(heading, reason); $('#scoreText').textContent = `正解 ${score}`;
}
function showAnswerFlash(correct, callback, label = '') {
  const flash = $('#answerFlash'); flash.className = `answer-flash ${correct ? 'is-correct' : 'is-incorrect'}`;
  flash.querySelector('.flash-mark').textContent = correct ? '○' : '×'; flash.querySelector('.flash-label').textContent = label || (correct ? '正解' : '不正解'); flash.hidden = false;
  window.setTimeout(() => { flash.hidden = true; if (!isFinishing) callback(); }, 850);
}
function rewardSession() {
  const c = career(), eventDate = today(); let points = 0;
  if (sessionType === 'daily') {
    if (!c.dailyDates.includes(eventDate)) {
      c.dailyDates.push(eventDate); c.dailyDates = c.dailyDates.slice(-1000);
      if (score > 0) {
        points += careerConfig.rewards.dailyCorrect; c.correctCount++;
        careerConfig.rewards.milestones.forEach(milestone => { if (c.correctCount >= milestone.correct && !c.milestones.includes(milestone.correct)) { c.milestones.push(milestone.correct); points += milestone.bonus; } });
      }
    }
  } else {
    points += score * careerConfig.rewards.practiceCorrect;
    for (let i = 0; i < score; i++) {
      c.correctCount++;
      careerConfig.rewards.milestones.forEach(milestone => { if (c.correctCount >= milestone.correct && !c.milestones.includes(milestone.correct)) { c.milestones.push(milestone.correct); points += milestone.bonus; } });
    }
    c.hasPlayed = true;
  }
  c.points += points; writeJSON(CAREER_KEY, c); return points;
}
function finish() {
  if (isFinishing) return; isFinishing = true;
  $('#quizView').hidden = true; $('#resultView').hidden = false;
  earnedPoints = rewardSession(); const duration = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  const accuracy = questions.length ? Math.round(score / questions.length * 100) : 0;
  const record = { date: new Date().toISOString(), type: sessionType, count: questions.length, correct: score, accuracy, duration, answers: answers.map(answer => ({ id: answer.id, correct: answer.correct, selected: answer.selected, skipped: answer.skipped })) };
  if (answers.length) { const history = readJSON(HISTORY_KEY, []); history.unshift(record); writeJSON(HISTORY_KEY, history.slice(0, 100)); }
  $('#resultScore').textContent = `${score} / ${questions.length}`; $('#resultAccuracy').textContent = `${accuracy}%`; $('#resultTime').textContent = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`; $('#resultPoints').textContent = `${earnedPoints > 0 ? '+' : ''}${earnedPoints} pt`;
  $('#resultMessage').textContent = accuracy === 100 ? '全問正解！情報の置き場所が見えてきましたね。' : accuracy >= 70 ? 'いい調子です。迷った問題の理由を振り返ってみましょう。' : '繰り返すうちに、少しずつ見えてきます。';
  $('#reviewList').replaceChildren();
  answers.forEach((answer, i) => {
    const problem = questions[i], item = document.createElement('li'); item.className = answer.correct ? 'review-correct' : 'review-wrong';
    const head = document.createElement('strong'); head.textContent = `問${i + 1}　${answer.correct ? '○ 正解' : answer.skipped ? '－ スキップ' : '× 不正解'}`;
    const question = document.createElement('p'); question.textContent = problem.text;
    const explanation = document.createElement('p'); explanation.className = 'review-explanation'; explanation.textContent = `正解：${problem.answer}。${problem.reason}`;
    item.append(head, question, explanation); if (answer.selected) { const selected = document.createElement('small'); selected.textContent = `あなたの回答：${answer.selected}`; item.append(selected); }
    $('#reviewList').append(item);
  });
  $('#again').hidden = sessionType === 'daily'; $('#home').textContent = sessionType === 'daily' ? '今日のドリルへ戻る' : '問題数を選び直す';
  $('#bar').style.width = '100%'; renderContinuity(); renderRecords(); $('.game').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function resetHome() { $('#resultView').hidden = true; $('#quizView').hidden = true; $('#startView').hidden = false; sessionType = 'practice'; renderContinuity(); $('.game').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
async function init() {
  const [problemsResponse, careerResponse] = await Promise.all([fetch(DATA), fetch(CAREER_DATA)]);
  if (!problemsResponse.ok) throw new Error('問題データを読み込めません');
  if (!careerResponse.ok) throw new Error('継続機能の設定を読み込めません');
  [data, careerConfig] = await Promise.all([problemsResponse.json(), careerResponse.json()]);
  if (!Array.isArray(data.problems) || data.problems.length < 10) throw new Error('問題データの形式が正しくありません');
  if (careerConfig.version !== 1 || !careerConfig.rewards || !Number.isFinite(careerConfig.rewards.practiceCorrect) || !Number.isFinite(careerConfig.rewards.dailyCorrect) || !Array.isArray(careerConfig.rewards.milestones) || !careerConfig.rewards.milestones.length || !Array.isArray(careerConfig.stages) || !careerConfig.stages.length || careerConfig.stages.some(stage => !Number.isFinite(stage.points) || !stage.title)) throw new Error('継続機能の設定形式が正しくありません');
  $('#start5').addEventListener('click', () => startSession(shuffle(data.problems).slice(0, 5)));
  $('#start10').addEventListener('click', () => startSession(shuffle(data.problems).slice(0, 10)));
  $('#dailyStart').addEventListener('click', () => { const c = career(); if (c.dailyDates.includes(today())) return; const number = Number(today().replaceAll('-', '')); const question = data.problems[number % data.problems.length]; startSession([question], 'daily'); });
  $('#skip').addEventListener('click', skipQuestion);
  $('#again').addEventListener('click', () => startSession(lastQuestions, 'practice'));
  $('#home').addEventListener('click', resetHome);
  const url = new URL(location.href); url.hash = ''; const shareUrl = encodeURIComponent(url.href), shareText = encodeURIComponent(document.title);
  $('#share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  $('#share-x').href = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  $('#share-line').href = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;
  $('#monthPrev').addEventListener('click', () => { calendarMonth--; if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; } selectedCalendarDate = ''; renderRecords(); });
  $('#monthNext').addEventListener('click', () => { calendarMonth++; if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; } selectedCalendarDate = ''; renderRecords(); });
  renderContinuity(); renderRecords();
}
init().catch(error => { $('#startView').innerHTML = `<p class="load-error">${error.message}。ローカルサーバーで起動してください。</p>`; });
