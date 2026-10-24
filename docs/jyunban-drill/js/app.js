(() => {
  'use strict';
  const STORAGE_KEY = 'junban-drill-history-v1';
  const CAREER_STORAGE_KEY = 'junban-drill-career-v1';
  const ATTENDANCE_STORAGE_KEY = 'junban-drill-attendance-v1';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const state = { problems: [], careerConfig: null, attendanceDays: [], calendarYear: new Date().getFullYear(), calendarMonth: new Date().getMonth(), category: '説明の順番', count: 5, questions: [], index: 0, startedAt: 0, questionStartedAt: 0, timerId: null, order: [], answers: [], dragIndex: null, finished: false, sessionType: 'practice', sessionId: '', dailyDate: '', earnedPoints: 0, earnedMilestones: [] };
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
  function correctOnlyAverage(record) {
    if (Array.isArray(record.answers)) {
      const durations = record.answers.filter(answer => answer.correct && Number.isFinite(answer.duration)).map(answer => answer.duration);
      return durations.length ? Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length) : null;
    }
    return Number.isFinite(record.average) ? record.average : null;
  }
  function saveCareer(career) { try { localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(career)); } catch { /* Keep the drill usable when storage is unavailable. */ } }
  function getCareer() {
    try {
      const stored = JSON.parse(localStorage.getItem(CAREER_STORAGE_KEY) || 'null');
      if (stored && stored.version === 1) return {
        version: 1, points: Number(stored.points) || 0, correctCount: Number(stored.correctCount) || 0,
        milestones: Array.isArray(stored.milestones) ? stored.milestones : [],
        processedEvents: Array.isArray(stored.processedEvents) ? stored.processedEvents : [],
        dailyCompletedDates: Array.isArray(stored.dailyCompletedDates) ? stored.dailyCompletedDates : [],
        hasPlayed: Boolean(stored.hasPlayed)
      };
    } catch { /* Initialize from any intact history below. */ }
    const history = getHistory();
    const correctCount = history.reduce((sum, record) => sum + (Array.isArray(record.answers) ? record.answers.filter(answer => answer.correct).length : 0), 0);
    const milestones = state.careerConfig ? state.careerConfig.rewards.milestones.filter(item => correctCount >= item.correct).map(item => item.correct) : [];
    const points = correctCount * (state.careerConfig?.rewards.practiceCorrect || 0) + (state.careerConfig?.rewards.milestones.filter(item => milestones.includes(item.correct)).reduce((sum, item) => sum + item.bonus, 0) || 0);
    const migrated = { version: 1, points, correctCount, milestones, processedEvents: [], dailyCompletedDates: [], hasPlayed: history.length > 0 };
    saveCareer(migrated);
    return migrated;
  }
  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function loadAttendanceDays() {
    let savedDays = [];
    try {
      const days = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || '[]');
      if (Array.isArray(days)) savedDays = days.filter(day => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day));
    } catch { /* Merge with completed sessions even when attendance storage is malformed. */ }
    const historyDays = getHistory().map(record => localDateKey(new Date(record.date)));
    const allDays = [...new Set([...savedDays, ...historyDays])].sort();
    if (allDays.length !== savedDays.length) { try { localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(allDays)); } catch { /* The in-memory calendar still works. */ } }
    return allDays;
  }
  function markAttendance(date = localDateKey()) {
    if (state.attendanceDays.includes(date)) return;
    state.attendanceDays.push(date); state.attendanceDays.sort();
    try { localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(state.attendanceDays)); } catch { /* Keep the current page state usable. */ }
    renderAttendanceCalendar();
  }
  function renderAttendanceCalendar() {
    const { calendarYear: year, calendarMonth: month } = state;
    const monthLabel = `${year}年${month + 1}月`;
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
    $('#attendance-month').textContent = monthLabel;
    $('#attendance-count').textContent = `今月の回答日数 ${state.attendanceDays.filter(day => day.startsWith(monthPrefix)).length}日`;
    const calendar = $('#attendance-calendar');
    const weekdayRow = document.createElement('div'); weekdayRow.className = 'calendar-week calendar-weekdays'; weekdayRow.setAttribute('role', 'row');
    ['日', '月', '火', '水', '木', '金', '土'].forEach(day => {
      const weekday = document.createElement('div'); weekday.className = 'calendar-weekday'; weekday.setAttribute('role', 'columnheader'); weekday.textContent = day; weekdayRow.appendChild(weekday);
    });
    const cells = [];
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const today = localDateKey();
    for (let index = 0; index < cellCount; index++) {
      const dayNumber = index - firstWeekday + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        const empty = document.createElement('div'); empty.className = 'calendar-empty'; empty.setAttribute('aria-hidden', 'true'); cells.push(empty); continue;
      }
      const date = `${monthPrefix}${String(dayNumber).padStart(2, '0')}`;
      const attended = state.attendanceDays.includes(date);
      const cell = attended ? document.createElement('button') : document.createElement('div');
      if (attended) cell.type = 'button';
      cell.className = `calendar-day${attended ? ' is-attended is-clickable' : ''}${date === today ? ' is-today' : ''}`;
      cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-label', `${date} ${attended ? '記録を表示' : '回答なし'}`);
      const number = document.createElement('span'); number.textContent = String(dayNumber); cell.appendChild(number); cells.push(cell);
      if (attended) cell.addEventListener('click', () => openDailyRecords(date));
    }
    calendar.replaceChildren(weekdayRow);
    for (let index = 0; index < cells.length; index += 7) {
      const row = document.createElement('div'); row.className = 'calendar-week'; row.setAttribute('role', 'row');
      row.append(...cells.slice(index, index + 7)); calendar.appendChild(row);
    }
  }
  function shiftAttendanceMonth(offset) {
    const next = new Date(state.calendarYear, state.calendarMonth + offset, 1);
    state.calendarYear = next.getFullYear(); state.calendarMonth = next.getMonth(); renderAttendanceCalendar();
  }
  let dailyRecordOpener = null;
  function openDailyRecords(date) {
    const modal = $('#daily-record-modal'), content = $('#daily-record-content');
    const dateObject = new Date(`${date}T12:00:00`);
    $('#daily-record-title').textContent = `${dateObject.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}の記録`;
    content.replaceChildren();
    const sessions = getHistory().filter(record => localDateKey(new Date(record.date)) === date).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!sessions.length) {
      const note = document.createElement('p'); note.className = 'daily-record-empty';
      note.textContent = 'この日は問題に回答しました。セッションを最後まで完了した記録はありません。'; content.appendChild(note);
    } else {
      sessions.forEach(record => {
        const session = document.createElement('article'); session.className = 'daily-session';
        const heading = document.createElement('div'); heading.className = 'daily-session-heading';
        const sessionDate = new Date(record.date);
        const title = document.createElement('strong'); title.textContent = `${sessionDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}　${record.category}`;
        const score = document.createElement('span'); score.className = 'daily-session-score'; score.textContent = `${record.correct}/${record.count}問・${record.accuracy}%`;
        heading.append(title, score);
        const stats = document.createElement('p'); stats.className = 'daily-session-stats';
        const avg = correctOnlyAverage(record);
        stats.textContent = `所要時間 ${formatTime(record.duration)} ・ 正解した問題の平均 ${avg == null ? '—' : `${avg}秒`}`;
        session.append(heading, stats);
        if (Array.isArray(record.answers) && record.answers.length) {
          const answers = document.createElement('ul'); answers.className = 'daily-session-answers';
          record.answers.forEach(answer => {
            const item = document.createElement('li'); item.className = answer.correct ? 'is-correct' : 'is-incorrect';
            const problem = state.problems.find(question => question.id === answer.id);
            const result = document.createElement('span'); result.className = 'daily-answer-result'; result.textContent = answer.correct ? '○' : '×';
            const name = document.createElement('span'); name.className = 'daily-answer-name'; name.textContent = problem ? problem.title : `問題 ${answer.id}`;
            const duration = document.createElement('span'); duration.className = 'daily-answer-duration'; duration.textContent = `${Math.round(answer.duration)}秒`;
            item.append(result, name, duration); answers.appendChild(item);
          });
          session.appendChild(answers);
        }
        content.appendChild(session);
      });
    }
    dailyRecordOpener = document.activeElement;
    modal.hidden = false; $('#daily-record-close').focus();
  }
  function closeDailyRecords() {
    $('#daily-record-modal').hidden = true;
    if (dailyRecordOpener?.isConnected) dailyRecordOpener.focus();
  }
  function getDailyQuestion(dateKey = localDateKey()) {
    if (!state.problems.length) return null;
    const [year, month, day] = dateKey.split('-').map(Number);
    const dayNumber = Date.UTC(year, month - 1, day) / 86400000;
    const index = (Math.imul(dayNumber, 2654435761) >>> 0) % state.problems.length;
    return state.problems[index];
  }
  function recordAnswerReward({ eventId, correct, isDaily = false, date = '' }) {
    if (!state.careerConfig) return { points: 0, milestones: [] };
    const career = getCareer();
    if (career.processedEvents.includes(eventId) || (isDaily && career.dailyCompletedDates.includes(date))) {
      // Clearing session history allows a daily retry, but the same daily reward is only paid once.
      if (isDaily && !career.dailyCompletedDates.includes(date)) {
        career.dailyCompletedDates.push(date);
        career.dailyCompletedDates = [...new Set(career.dailyCompletedDates)].slice(-1000);
        saveCareer(career);
      }
      return { points: 0, milestones: [] };
    }
    career.processedEvents.push(eventId);
    career.processedEvents = career.processedEvents.slice(-2000);
    if (isDaily) {
      career.dailyCompletedDates.push(date);
      career.dailyCompletedDates = [...new Set(career.dailyCompletedDates)].slice(-1000);
    }
    let points = 0;
    const earnedMilestones = [];
    if (correct) {
      career.correctCount++;
      points = isDaily ? state.careerConfig.rewards.dailyCorrect : state.careerConfig.rewards.practiceCorrect;
      career.points += points;
      state.careerConfig.rewards.milestones.forEach(milestone => {
        if (career.correctCount >= milestone.correct && !career.milestones.includes(milestone.correct)) {
          career.milestones.push(milestone.correct);
          career.points += milestone.bonus;
          points += milestone.bonus;
          earnedMilestones.push(milestone.correct);
        }
      });
    }
    saveCareer(career);
    return { points, milestones: earnedMilestones };
  }
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
  function renderDailyChallenge() {
    const section = $('#daily-challenge');
    if (!state.careerConfig) { section.hidden = true; return; }
    const career = getCareer();
    if (!career.hasPlayed) { section.hidden = true; return; }
    const date = localDateKey();
    const question = getDailyQuestion(date);
    const completed = career.dailyCompletedDates.includes(date);
    section.hidden = false;
    $('#daily-category').textContent = question ? question.category : '';
    $('#daily-description').textContent = completed ? '今日の1問は完了しました。明日また挑戦できます。' : `今日だけの問題です。正解すると${state.careerConfig.rewards.dailyCorrect}ptが加算されます。`;
    const button = $('#daily-start-button');
    button.disabled = completed || !question || (!views.quiz.hidden && !state.finished);
    button.innerHTML = completed ? '今日の1問は完了しました' : '今日の1問に挑戦 <span aria-hidden="true">→</span>';
  }
  function renderCareer() {
    const section = $('.career-section');
    if (!state.careerConfig) { section.hidden = true; return; }
    const career = getCareer();
    const nextMilestone = state.careerConfig.rewards.milestones.find(item => item.correct > career.correctCount);
    const milestonePrompt = $('#milestone-prompt');
    milestonePrompt.hidden = !nextMilestone;
    if (nextMilestone) {
      const remaining = nextMilestone.correct - career.correctCount;
      milestonePrompt.textContent = `あと ${remaining} 問正解でボーナス ${nextMilestone.bonus} pt Get`;
    }
    let stageIndex = 0;
    const stages = state.careerConfig.stages;
    stages.forEach((stage, index) => { if (career.points >= stage.points) stageIndex = index; });
    const stage = stages[stageIndex], next = stages[stageIndex + 1];
    $('#career-stage-label').textContent = `キャリア ${stageIndex + 1}/${stages.length}`;
    $('#career-title').textContent = stage.title;
    $('#career-points').textContent = `${career.points} pt`;
    $('#career-story').textContent = stage.story;
    $('#career-room').textContent = stage.room;
    const progress = next ? Math.max(0, Math.min(100, Math.round((career.points - stage.points) / (next.points - stage.points) * 100))) : 100;
    $('#career-progress-fill').style.width = `${progress}%`;
    $('#career-progress').setAttribute('aria-valuenow', String(progress));
    $('#career-next').textContent = next ? `次のキャリアまであと${next.points - career.points} pt` : 'これまでのキャリアがすべて開きました。ポイントはこれからも積み重なります。';
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
  function startSession(existingQuestions, sessionType = 'practice', dailyDate = '') {
    clearInterval(state.timerId); state.questions = existingQuestions || buildQuestionSet();
    if (!state.questions.length) { alert('この種類の問題がありません。'); return; }
    $('#setup-row').hidden = sessionType === 'daily';
    setCountControlsDisabled(true);
    state.sessionType = sessionType; state.dailyDate = dailyDate; state.sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    state.earnedPoints = 0; state.earnedMilestones = [];
    $('#daily-start-button').disabled = true;
    state.index = 0; state.answers = []; state.finished = false; state.startedAt = Date.now(); state.questionStartedAt = Date.now(); state.timerId = setInterval(() => { $('#timer').textContent = formatTime(elapsed()); }, 250);
    setView('quiz'); renderQuestion();
    if (sessionType === 'daily') $('.practice').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    markAttendance();
    state.answers.push({ id: q.id, title: q.title, category: q.category, correct, duration, submittedOrder: [...state.order], correctOrder: q.sentences.map((_, i) => i), explanation: q.explanation, sentences: q.sentences });
    const reward = recordAnswerReward({
      eventId: state.sessionType === 'daily' ? `daily:${state.dailyDate}` : `${state.sessionId}:${state.index}`,
      correct, isDaily: state.sessionType === 'daily', date: state.dailyDate
    });
    state.earnedPoints += reward.points;
    state.earnedMilestones.push(...reward.milestones);
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
    clearInterval(state.timerId); state.finished = true; const total = state.answers.length; const correct = state.answers.filter(a => a.correct).length; const duration = Math.round(elapsed());
    const correctAnswers = state.answers.filter(answer => answer.correct);
    const averageCorrect = correctAnswers.length ? Math.round(correctAnswers.reduce((sum, answer) => sum + answer.duration, 0) / correctAnswers.length) : null;
    const record = { date: new Date().toISOString(), category: state.questions[0]?.category || state.category, count: total, correct, accuracy: Math.round(correct / total * 100), duration, average: averageCorrect, answers: state.answers.map(a => ({ id: a.id, correct: a.correct, duration: a.duration })) };
    saveHistory(record);
    if (state.sessionType === 'practice' && state.careerConfig) { const career = getCareer(); career.hasPlayed = true; saveCareer(career); }
    renderDailyChallenge(); renderCareer();
    $('#result-accuracy').textContent = `${record.accuracy}%`; $('#result-time').textContent = formatTime(duration); $('#result-average').textContent = averageCorrect == null ? '—' : `${averageCorrect}秒`;
    const milestoneNote = state.earnedMilestones.length ? '（節目ボーナスを含む）' : '';
    $('#reward-summary').textContent = state.earnedPoints ? `今回獲得：+${state.earnedPoints} pt${milestoneNote}` : '今回はポイント獲得はありません。次の練習でまた積み重ねられます。';
    $('#again-button').hidden = state.sessionType === 'daily';
    $('#daily-return-button').hidden = state.sessionType !== 'daily';
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
    const knownAverages = points.map(correctOnlyAverage).filter(Number.isFinite);
    const maxTime = Math.max(10, Math.ceil(Math.max(0, ...knownAverages) / 10) * 10);
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
      const average = correctOnlyAverage(p);
      return { x: xForDay(dayKey) + withinDayOffset, yA: top + chartH*(1-p.accuracy/100), yT: average == null ? null : top + chartH*(1-average/maxTime), average, p };
    });
    const grid = [0,50,100].map(v => { const y=top+chartH*(1-v/100); return `<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#e9e3d8" stroke-dasharray="3 4"/><text x="${left-8}" y="${y+4}" fill="#92958a" font-size="10" text-anchor="end">${v}</text><text x="${width-right+8}" y="${y+4}" fill="#92958a" font-size="10">${Math.round(maxTime*v/100)}s</text>`; }).join('');
    const accuracyLine = coords.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.yA}`).join(' ');
    const timedCoords = coords.filter(p => p.average != null);
    const timeLine = timedCoords.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.yT}`).join(' ');
    const accuracyDots = coords.map(p=>`<circle cx="${p.x}" cy="${p.yA}" r="4" fill="#476b54" stroke="#fffdf8" stroke-width="2"><title>${new Date(p.p.date).toLocaleString('ja-JP')}・正答率 ${p.p.accuracy}%</title></circle>`).join('');
    const timeDots = timedCoords.map(p=>`<circle cx="${p.x}" cy="${p.yT}" r="4" fill="#c28b45" stroke="#fffdf8" stroke-width="2"><title>${new Date(p.p.date).toLocaleString('ja-JP')}・正解した問題の平均回答時間 ${p.average}秒</title></circle>`).join('');
    const dateTicks = [...new Map(points.map(p => { const date = new Date(p.date); return [dayKeyForDate(p.date), date]; })).entries()];
    const tickIndexes = dateTicks.length <= 5 ? dateTicks.map((_, i) => i) : [0, Math.round((dateTicks.length-1)/4), Math.round((dateTicks.length-1)/2), Math.round((dateTicks.length-1)*3/4), dateTicks.length-1];
    const labels = [...new Set(tickIndexes)].map(i => { const [dayKey, date] = dateTicks[i]; return `<text x="${xForDay(dayKey)}" y="${height-8}" fill="#92958a" font-size="10" text-anchor="middle">${date.toLocaleDateString('ja-JP',{month:'2-digit',day:'2-digit'})}</text>`; }).join('');
    target.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="日付を横軸に、正答率を左軸、平均回答時間を右軸で示します。">${grid}<path d="${accuracyLine}" fill="none" stroke="#476b54" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="${timeLine}" fill="none" stroke="#c28b45" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4"/>${accuracyDots}${timeDots}${labels}</svg><p class="chart-axis-note">横軸：日付　左軸：正答率（%）　右軸：平均回答時間（秒）</p>`;
  }
  function renderHistory() {
    const history = getHistory(); $('#total-sessions').innerHTML = `${history.length}<span>回</span>`; $('#total-questions').textContent = `回答した問題 ${history.reduce((sum, r) => sum + r.count, 0)}問`;
    const recent = history.slice(0, 5); $('#recent-accuracy').innerHTML = `${recent.length ? Math.round(recent.reduce((sum, r) => sum + r.accuracy, 0)/recent.length) : '—'}<span>%</span>`;
    const trend = $('#accuracy-trend'), previous = history.slice(5, 10);
    if (!recent.length || !previous.length) {
      trend.textContent = '—'; trend.className = 'accuracy-trend'; trend.setAttribute('aria-label', '推移を比較する記録がありません');
    } else {
      const recentAverage = recent.reduce((sum, record) => sum + record.accuracy, 0) / recent.length;
      const previousAverage = previous.reduce((sum, record) => sum + record.accuracy, 0) / previous.length;
      const difference = recentAverage - previousAverage;
      const direction = difference > 0 ? 'up' : difference < 0 ? 'down' : 'flat';
      const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';
      const description = direction === 'up' ? '上向き' : direction === 'down' ? '下向き' : '横ばい';
      trend.textContent = arrow; trend.className = `accuracy-trend is-${direction}`;
      trend.setAttribute('aria-label', `直近${recent.length}回の平均は、その前の${previous.length}回と比べて${description}です`);
      trend.title = `直近${recent.length}回と、その前の${previous.length}回を比較`;
    }
    renderChart(history);
  }
  async function init() {
    try { const response = await fetch('data/problems.json'); if (!response.ok) throw new Error('問題データを読み込めませんでした'); const data = await response.json(); state.problems = data.problems || []; }
    catch (error) { $('#start-description').textContent = '問題データを読み込めませんでした。GitHub Pages の公開設定と data/problems.json を確認してください。'; $('#start-button').disabled = true; console.error(error); return; }
    try {
      const response = await fetch('data/career.json');
      if (!response.ok) throw new Error('キャリアデータを読み込めませんでした');
      const data = await response.json();
      if (data.version !== 1 || !Array.isArray(data.stages) || !data.stages.length || !data.rewards || !Number.isFinite(data.rewards.practiceCorrect) || !Number.isFinite(data.rewards.dailyCorrect) || !Array.isArray(data.rewards.milestones) || data.rewards.milestones.some(item => !Number.isFinite(item.correct) || !Number.isFinite(item.bonus)) || data.stages.some(stage => !Number.isFinite(stage.points) || !stage.title || !stage.story || !stage.room)) throw new Error('キャリアデータの形式が正しくありません');
      state.careerConfig = data;
    } catch (error) { console.error(error); }
    $$('.mode-tab').forEach(button => button.addEventListener('click', () => { if (state.finished || !views.quiz.hidden) return; state.category = button.dataset.category; updateSetup(); }));
    $$('.count-button').forEach(button => button.addEventListener('click', () => { state.count = Number(button.dataset.count); updateSetup(); }));
    $('#start-button').addEventListener('click', () => startSession()); $('#submit-answer').addEventListener('click', submitAnswer);
    const helpModal = $('#help-modal');
    const closeHelp = () => { helpModal.hidden = true; };
    $('#help-button').addEventListener('click', () => { helpModal.hidden = false; $('#close-help-bottom').focus(); });
    $('#close-help').addEventListener('click', closeHelp); $('#close-help-bottom').addEventListener('click', closeHelp);
    helpModal.addEventListener('click', event => { if (event.target === helpModal) closeHelp(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !$('#daily-record-modal').hidden) closeDailyRecords();
      else if (event.key === 'Escape' && !helpModal.hidden) closeHelp();
    });
    $('#daily-record-close').addEventListener('click', closeDailyRecords);
    $('#daily-record-modal').addEventListener('click', event => { if (event.target === $('#daily-record-modal')) closeDailyRecords(); });
    $('#reset-order').addEventListener('click', () => { state.order = state.order.sort((a,b)=>a-b); renderOrder(); });
    $('#again-button').addEventListener('click', () => startSession(state.questions)); $('#review-button').addEventListener('click', showReview);
    $('#daily-return-button').addEventListener('click', () => {
      $('#setup-row').hidden = false;
      setView('start');
      renderDailyChallenge();
      $('#practice-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#daily-start-button').addEventListener('click', () => {
      const date = localDateKey(), question = getDailyQuestion(date);
      if (question && !getCareer().dailyCompletedDates.includes(date)) startSession([question], 'daily', date);
    });
    state.attendanceDays = loadAttendanceDays();
    $('#attendance-prev').addEventListener('click', () => shiftAttendanceMonth(-1));
    $('#attendance-next').addEventListener('click', () => shiftAttendanceMonth(1));
    $('#clear-history').addEventListener('click', () => {
      const hasSavedData = [STORAGE_KEY, CAREER_STORAGE_KEY, ATTENDANCE_STORAGE_KEY].some(key => localStorage.getItem(key) !== null);
      if (!hasSavedData) return;
      if (confirm('全ての記録・ポイントを消去します。よろしいですか？')) {
        [STORAGE_KEY, CAREER_STORAGE_KEY, ATTENDANCE_STORAGE_KEY].forEach(key => localStorage.removeItem(key));
        state.attendanceDays = [];
        renderDailyChallenge(); renderCareer(); renderHistory(); renderAttendanceCalendar();
      }
    });
    updateSetup(); renderCareer(); renderDailyChallenge(); renderHistory(); renderAttendanceCalendar();
  }
  init();
})();
