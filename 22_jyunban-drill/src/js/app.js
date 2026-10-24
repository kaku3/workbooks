(() => {
  'use strict';
  const STORAGE_KEY = 'junban-drill-history-v1';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const state = { problems: [], category: '説明の順番', count: 5, questions: [], index: 0, startedAt: 0, questionStartedAt: 0, timerId: null, order: [], answers: [], dragIndex: null, finished: false };
  const views = { start: $('#start-view'), quiz: $('#quiz-view'), result: $('#result-view') };
  const descriptions = {
    '説明の順番': ['説明の順番を整える', '目的から詳細へ。読み手が迷わない説明の流れを考えます。'],
    '文章の順番': ['文章の流れを整える', '出来事や処理のつながりを読み取り、自然な順番を考えます。']
  };

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
    return result;
  }
  function formatTime(seconds) { const s = Math.max(0, Math.floor(seconds)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
  function elapsed() { return (Date.now() - state.startedAt) / 1000; }
  function getHistory() { try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
  function saveHistory(record) { const history = getHistory(); history.unshift(record); localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100))); }
  function setView(name) { Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; }); }
  function updateSetup() {
    const [title, description] = descriptions[state.category]; $('#start-title').textContent = title; $('#start-description').textContent = description;
    $('#start-button').innerHTML = `${state.count === 5 ? 'さらっと5問に挑戦' : 'じっくり10問に挑戦'} <span aria-hidden="true">→</span>`;
    const practice = $('.practice');
    practice.classList.toggle('category-explanation', state.category === '説明の順番');
    practice.classList.toggle('category-text', state.category === '文章の順番');
    practice.classList.toggle('count-five', state.count === 5);
    practice.classList.toggle('count-ten', state.count === 10);
    $$('.mode-tab').forEach(button => { const active = button.dataset.category === state.category; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); });
    $$('.count-button').forEach(button => button.classList.toggle('active', Number(button.dataset.count) === state.count));
  }
  function setCountControlsDisabled(disabled) {
    $$('.count-button').forEach(button => { button.disabled = disabled; });
  }
  function buildQuestionSet() {
    const pool = state.problems.filter(p => p.category === state.category);
    const levels = [1, 2, 3].map(level => shuffle(pool.filter(p => (p.difficulty || 2) === level)));
    const distribution = state.count === 5 ? [2, 2, 1] : [4, 4, 2];
    const selected = levels.flatMap((items, index) => items.slice(0, distribution[index]));
    if (selected.length < Math.min(state.count, pool.length)) {
      const selectedIds = new Set(selected.map(question => question.id));
      selected.push(...shuffle(pool.filter(question => !selectedIds.has(question.id))).slice(0, state.count - selected.length));
    }
    return shuffle(selected);
  }
  function startSession(existingQuestions) {
    clearInterval(state.timerId); state.questions = existingQuestions || buildQuestionSet();
    if (!state.questions.length) { alert('この種類の問題がありません。'); return; }
    setCountControlsDisabled(true);
    state.index = 0; state.answers = []; state.finished = false; state.startedAt = Date.now(); state.questionStartedAt = Date.now(); state.timerId = setInterval(() => { $('#timer').textContent = formatTime(elapsed()); }, 250);
    setView('quiz'); renderQuestion();
  }
  function renderQuestion() {
    const q = state.questions[state.index]; state.order = shuffle(q.sentences.map((_, i) => i)); state.dragIndex = null; state.questionStartedAt = Date.now();
    $('#question-counter').textContent = `問題 ${state.index + 1} / ${state.questions.length}`; $('#progress-bar').style.width = `${state.index / state.questions.length * 100}%`;
    $('#question-title').textContent = q.title; $('#feedback').hidden = true; $('#submit-answer').hidden = false; $('#reset-order').hidden = false; $('#quiz-actions').hidden = false;
    renderOrder();
  }
  function renderOrder() {
    const q = state.questions[state.index]; const list = $('#sentence-list'); list.innerHTML = '';
    state.order.forEach((sentenceIndex, position) => {
      const sentence = q.sentences[sentenceIndex]; const li = document.createElement('li'); li.className = 'sentence-card'; li.draggable = true; li.dataset.position = String(position); li.tabIndex = 0;
      li.innerHTML = `<span class="order-number">${position + 1}</span><span class="sentence-text"></span><span class="drag-handle" aria-hidden="true">⠿</span><span class="move-buttons"><button class="move-button" data-move="-1" aria-label="${position + 1}番目の文章を上へ移動" ${position === 0 ? 'disabled' : ''}>↑</button><button class="move-button" data-move="1" aria-label="${position + 1}番目の文章を下へ移動" ${position === state.order.length - 1 ? 'disabled' : ''}>↓</button></span>`;
      li.querySelector('.sentence-text').textContent = sentence.text;
      li.addEventListener('dragstart', event => { state.dragIndex = position; li.classList.add('dragging'); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', String(position)); });
      li.addEventListener('dragend', () => { state.dragIndex = null; $$('.sentence-card').forEach(card => card.classList.remove('dragging', 'drop-target')); });
      li.addEventListener('dragover', event => { event.preventDefault(); li.classList.add('drop-target'); });
      li.addEventListener('dragleave', () => li.classList.remove('drop-target'));
      li.addEventListener('drop', event => { event.preventDefault(); const from = state.dragIndex ?? Number(event.dataTransfer.getData('text/plain')); moveItem(from, position); });
      li.querySelectorAll('.move-button').forEach(button => button.addEventListener('click', event => { event.stopPropagation(); moveItem(position, position + Number(button.dataset.move)); }));
      li.addEventListener('keydown', event => { if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) { event.preventDefault(); const to = position + (event.key === 'ArrowUp' ? -1 : 1); if (to >= 0 && to < state.order.length) moveItem(position, to); } });
      list.appendChild(li);
    });
  }
  function moveItem(from, to) { if (from == null || to < 0 || to >= state.order.length || from === to) return; const next = [...state.order]; const [item] = next.splice(from, 1); next.splice(to, 0, item); state.order = next; renderOrder(); }
  function submitAnswer() {
    const q = state.questions[state.index];
    const correct = state.order.every((sentenceIndex, position) => sentenceIndex === position);
    const duration = (Date.now() - state.questionStartedAt) / 1000;
    state.answers.push({ id: q.id, title: q.title, category: q.category, correct, duration, submittedOrder: [...state.order], correctOrder: q.sentences.map((_, i) => i), explanation: q.explanation, sentences: q.sentences });
    $('#submit-answer').hidden = true; $('#reset-order').hidden = true; $('#quiz-actions').hidden = true;
    showAnswerFlash(correct);
    $('#feedback').hidden = true;
    setTimeout(() => { state.index++; if (state.index >= state.questions.length) finishSession(); else renderQuestion(); }, 850);
  }
  function showAnswerFlash(correct) {
    const flash = $('#answer-flash');
    clearTimeout(flash.hideTimer);
    flash.classList.toggle('is-correct', correct);
    flash.classList.toggle('is-incorrect', !correct);
    flash.querySelector('.answer-flash-mark').textContent = correct ? '○' : '×';
    flash.querySelector('.answer-flash-label').textContent = correct ? '正解' : '不正解';
    flash.hidden = false;
    flash.hideTimer = setTimeout(() => { flash.hidden = true; }, 850);
  }
  function finishSession() {
    clearInterval(state.timerId); state.finished = true; const total = state.answers.length; const correct = state.answers.filter(a => a.correct).length; const duration = Math.round(elapsed()); const average = total ? Math.round(state.answers.reduce((sum, a) => sum + a.duration, 0) / total) : 0;
    const record = { date: new Date().toISOString(), category: state.category, count: total, correct, accuracy: Math.round(correct / total * 100), duration, average, answers: state.answers.map(a => ({ id: a.id, correct: a.correct, duration: Math.round(a.duration) })) };
    saveHistory(record); $('#result-accuracy').textContent = `${record.accuracy}%`; $('#result-time').textContent = formatTime(duration); $('#result-average').textContent = `${average}秒`;
    $('#result-message').textContent = record.accuracy === 100 ? '全問正解！順番の感覚がつかめてきましたね。' : record.accuracy >= 70 ? 'いい調子です。迷った問題を、また後で解いてみましょう。' : '繰り返すうちに、少しずつ見えてきます。同じ問題でもう一度どうぞ。';
    setCountControlsDisabled(false);
    $('#review-list').hidden = true; $('#review-list').innerHTML = ''; $('#review-button').textContent = '回答と解説を振り返る'; setView('result'); showReview(); renderHistory(); $('#progress-bar').style.width = '100%';
  }
  function showReview() {
    const list = $('#review-list'); list.hidden = !list.hidden;
    $('#review-button').textContent = list.hidden ? '回答と解説を振り返る' : '振り返りを閉じる';
    if (list.hidden) return;
    list.innerHTML = '<h4>回答一覧と解説</h4>';
    state.answers.forEach((answer, index) => {
      const item = document.createElement('article'); item.className = `review-item ${answer.correct ? 'review-correct' : 'review-incorrect'}`;
      const heading = document.createElement('div'); heading.className = 'review-heading';
      const status = document.createElement('span'); status.className = 'review-status'; status.textContent = answer.correct ? '○ 正解' : '× 不正解';
      const title = document.createElement('strong'); title.textContent = `${index + 1}. ${answer.title}`;
      heading.append(status, title);
      const submitted = document.createElement('div'); submitted.className = 'answer-box user-answer-box';
      const submittedLabel = document.createElement('p'); submittedLabel.className = 'answer-box-label'; submittedLabel.textContent = 'あなたの回答';
      const submittedOrder = document.createElement('ol'); submittedOrder.className = 'answer-lines';
      answer.submittedOrder.forEach(i => { const line = document.createElement('li'); line.textContent = answer.sentences[i].text; submittedOrder.appendChild(line); });
      submitted.append(submittedLabel, submittedOrder);
      const details = document.createElement('details'); details.className = 'review-explanation';
      const summary = document.createElement('summary'); summary.textContent = '解説を見る';
      const correctBox = document.createElement('div'); correctBox.className = 'answer-box correct-answer-box';
      const correctLabel = document.createElement('p'); correctLabel.className = 'answer-box-label'; correctLabel.textContent = '正しい順番';
      const correctOrder = document.createElement('ol'); correctOrder.className = 'answer-lines';
      answer.correctOrder.forEach(i => { const line = document.createElement('li'); line.textContent = answer.sentences[i].text; correctOrder.appendChild(line); });
      correctBox.append(correctLabel, correctOrder);
      const explanation = document.createElement('p'); explanation.textContent = answer.explanation;
      details.append(summary, correctBox, explanation); item.append(heading, submitted, details); list.appendChild(item);
    });
  }
  function renderChart(history) {
    const target = $('#history-chart'); const points = history.slice(0, 10).reverse();
    if (!points.length) { target.innerHTML = '<p class="empty-state">まずは1回、ドリルに挑戦してみましょう。</p>'; return; }
    const width = 680, height = 190, left = 34, right = 38, top = 18, bottom = 30, chartW = width-left-right, chartH = height-top-bottom;
    const maxTime = Math.max(10, Math.ceil(Math.max(...points.map(p => p.average || 0)) / 10) * 10);
    const dayKeyForDate = value => { const date = new Date(value); return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000; };
    const dayGroups = new Map();
    points.forEach((point, index) => {
      const dayKey = dayKeyForDate(point.date);
      if (!dayGroups.has(dayKey)) dayGroups.set(dayKey, []);
      dayGroups.get(dayKey).push(index);
    });
    const dayKeys = [...dayGroups.keys()];
    const firstDay = Math.min(...dayKeys), dayCount = Math.max(1, Math.max(...dayKeys) - firstDay + 1);
    const dayWidth = chartW / dayCount;
    const xForDay = dayKey => left + chartW * ((dayKey - firstDay + 0.5) / dayCount);
    const coords = points.map((p, index) => {
      const dayKey = dayKeyForDate(p.date), indexes = dayGroups.get(dayKey), position = indexes.indexOf(index);
      const withinDayOffset = dayWidth * 0.72 * ((position + 1) / (indexes.length + 1) - 0.5);
      return { x: xForDay(dayKey) + withinDayOffset, yA: top + chartH*(1-p.accuracy/100), yT: top + chartH*(1-(p.average || 0)/maxTime), p };
    });
    const grid = [0,50,100].map(v => { const y=top+chartH*(1-v/100); return `<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#e9e3d8" stroke-dasharray="3 4"/><text x="${left-8}" y="${y+4}" fill="#92958a" font-size="10" text-anchor="end">${v}</text><text x="${width-right+8}" y="${y+4}" fill="#92958a" font-size="10">${Math.round(maxTime*v/100)}s</text>`; }).join('');
    const accuracyLine = coords.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.yA}`).join(' ');
    const timeLine = coords.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.yT}`).join(' ');
    const accuracyDots = coords.map(p=>`<circle cx="${p.x}" cy="${p.yA}" r="4" fill="#476b54" stroke="#fffdf8" stroke-width="2"><title>${new Date(p.p.date).toLocaleString('ja-JP')}・正答率 ${p.p.accuracy}%</title></circle>`).join('');
    const timeDots = coords.map(p=>`<circle cx="${p.x}" cy="${p.yT}" r="4" fill="#c28b45" stroke="#fffdf8" stroke-width="2"><title>${new Date(p.p.date).toLocaleString('ja-JP')}・平均回答時間 ${p.p.average || 0}秒</title></circle>`).join('');
    const dateTicks = [...new Map(points.map(p => { const date = new Date(p.date); return [dayKeyForDate(p.date), date]; })).entries()];
    const tickIndexes = dateTicks.length <= 5 ? dateTicks.map((_, i) => i) : [0, Math.round((dateTicks.length-1)/4), Math.round((dateTicks.length-1)/2), Math.round((dateTicks.length-1)*3/4), dateTicks.length-1];
    const labels = [...new Set(tickIndexes)].map(i => { const [dayKey, date] = dateTicks[i]; return `<text x="${xForDay(dayKey)}" y="${height-8}" fill="#92958a" font-size="10" text-anchor="middle">${date.toLocaleDateString('ja-JP',{month:'2-digit',day:'2-digit'})}</text>`; }).join('');
    target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="日付を横軸に、正答率を左軸、平均回答時間を右軸で示します。">${grid}<path d="${accuracyLine}" fill="none" stroke="#476b54" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="${timeLine}" fill="none" stroke="#c28b45" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4"/>${accuracyDots}${timeDots}${labels}</svg><p class="chart-axis-note">横軸：日付　左軸：正答率（%）　右軸：平均回答時間（秒）</p>`;
  }
  function renderHistory() {
    const history = getHistory(); $('#total-sessions').innerHTML = `${history.length}<span>回</span>`; $('#total-questions').textContent = `回答した問題 ${history.reduce((sum, r) => sum + r.count, 0)}問`;
    const recent = history.slice(0, 5); $('#recent-accuracy').innerHTML = `${recent.length ? Math.round(recent.reduce((sum, r) => sum + r.accuracy, 0)/recent.length) : '—'}<span>%</span>`;
    renderChart(history); $('#history-count').textContent = `${Math.min(history.length, 10)}件`; const list = $('#history-list'); list.innerHTML = '';
    if (!history.length) { list.innerHTML = '<p class="empty-state">まだ記録はありません。</p>'; return; }
    history.slice(0, 10).forEach(record => { const row = document.createElement('div'); row.className = 'history-row'; const date = document.createElement('div'); const d = new Date(record.date); date.className = 'date'; date.textContent = `${d.toLocaleDateString('ja-JP', {month:'2-digit',day:'2-digit'})} ${d.toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})}`; const meta = document.createElement('div'); meta.className = 'session-meta'; meta.textContent = `${record.category}・${record.count}問`; const score = document.createElement('strong'); score.textContent = `${record.accuracy}%`; const time = document.createElement('span'); time.className = 'muted'; time.textContent = formatTime(record.duration); row.append(date, meta, score, time); list.appendChild(row); });
  }
  async function init() {
    try { const response = await fetch('data/problems.json'); if (!response.ok) throw new Error('問題データを読み込めませんでした'); const data = await response.json(); state.problems = data.problems || []; }
    catch (error) { $('#start-description').textContent = '問題データを読み込めませんでした。GitHub Pages の公開設定と data/problems.json を確認してください。'; $('#start-button').disabled = true; console.error(error); return; }
    $$('.mode-tab').forEach(button => button.addEventListener('click', () => { if (state.finished || !views.quiz.hidden) return; state.category = button.dataset.category; updateSetup(); }));
    $$('.count-button').forEach(button => button.addEventListener('click', () => { state.count = Number(button.dataset.count); updateSetup(); }));
    $('#start-button').addEventListener('click', () => startSession()); $('#submit-answer').addEventListener('click', submitAnswer);
    const helpModal = $('#help-modal');
    const closeHelp = () => { helpModal.hidden = true; };
    $('#help-button').addEventListener('click', () => { helpModal.hidden = false; $('#close-help-bottom').focus(); });
    $('#close-help').addEventListener('click', closeHelp); $('#close-help-bottom').addEventListener('click', closeHelp);
    helpModal.addEventListener('click', event => { if (event.target === helpModal) closeHelp(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !helpModal.hidden) closeHelp(); });
    $('#reset-order').addEventListener('click', () => { state.order = state.order.sort((a,b)=>a-b); renderOrder(); });
    $('#again-button').addEventListener('click', () => startSession(state.questions)); $('#review-button').addEventListener('click', showReview);
    $('#clear-history').addEventListener('click', () => { if (!getHistory().length) return; if (confirm('このブラウザに保存された学習記録をすべて削除しますか？')) { localStorage.removeItem(STORAGE_KEY); renderHistory(); } });
    updateSetup(); renderHistory();
  }
  init();
})();
