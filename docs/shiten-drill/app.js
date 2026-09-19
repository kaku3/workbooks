const drillData = window.SHITEN_DRILL_DATA || { DATA: [], CATEGORIES: [], CLASSIFY_DATA: [] };
const DRILL_ITEMS = drillData.DATA || [];
const DRILL_CATEGORIES = drillData.CATEGORIES || [];
const DRILL_CLASSIFY = drillData.CLASSIFY_DATA || [];

if (!DRILL_ITEMS.length) {
  console.warn('SHITEN_DRILL_DATA is missing or empty.');
}

let current = 0;
let clCurrent = 0;
let activeMapTab = 'write';
let activeListTab = 'write';
let modalState = null;

const answered = new Set(JSON.parse(localStorage.getItem('shiten_answered') || '[]'));
const clAnswered = new Set(JSON.parse(localStorage.getItem('shiten_classified') || '[]'));

function directionFor(i) {
  return i % 2 === 0 ? 'sys2usr' : 'usr2sys';
}

function statusText(doneCount, totalCount) {
  if (doneCount === 0) return '未着手';
  if (doneCount === totalCount) return '完了';
  return '進行中';
}

function setMapTab(tab) {
  activeMapTab = tab;
  const writeTab = document.getElementById('mapWriteTab');
  const classifyTab = document.getElementById('mapClassifyTab');
  writeTab.classList.toggle('active', tab === 'write');
  classifyTab.classList.toggle('active', tab === 'classify');
  writeTab.setAttribute('aria-selected', String(tab === 'write'));
  classifyTab.setAttribute('aria-selected', String(tab === 'classify'));
  renderSidebar();
  updateProgress();
}

function setListTab(tab) {
  activeListTab = tab;
  const writeTab = document.getElementById('listWriteTab');
  const classifyTab = document.getElementById('listClassifyTab');
  writeTab.classList.toggle('active', tab === 'write');
  classifyTab.classList.toggle('active', tab === 'classify');
  writeTab.setAttribute('aria-selected', String(tab === 'write'));
  classifyTab.setAttribute('aria-selected', String(tab === 'classify'));
  renderQuestionList();
}

function renderSidebar() {
  const nav = document.getElementById('questionNav');
  nav.innerHTML = '';

  DRILL_ITEMS.forEach((_, i) => {
    const done = activeMapTab === 'write' ? answered.has(i) : clAnswered.has(i);

    const btn = document.createElement('button');
    btn.type = 'button';
    const isActive = activeMapTab === 'write' ? current === i : clCurrent === i;
    btn.className = `nav-item ${isActive ? 'active' : ''} ${done ? 'done' : ''}`;
    btn.innerHTML = `
      <span class="nav-index">Q${i + 1}</span>
      <span class="nav-state">${done ? '完了' : '未着手'}</span>
    `;
    btn.addEventListener('click', () => {
      if (activeMapTab === 'write') {
        current = i;
        openListModal('write', i);
      } else {
        clCurrent = i;
        openListModal('classify', i);
      }
      renderSidebar();
    });
    nav.appendChild(btn);
  });
}

function renderQuestionList() {
  const list = document.getElementById('allList');
  list.innerHTML = '';

  DRILL_ITEMS.forEach((item, i) => {
    const dir = directionFor(i);
    const card = document.createElement('button');
    card.type = 'button';
    const done = activeListTab === 'write' ? answered.has(i) : clAnswered.has(i);
    card.className = `review-card ${done ? 'done' : ''}`;
    card.innerHTML = `
      <div class="review-card-header">
        <span class="review-badge">Q${i + 1}</span>
        <span class="review-state">${done ? '解答済み' : '未解答'}</span>
      </div>
      <span class="review-type">${activeListTab === 'write' ? (dir === 'sys2usr' ? 'システム→ユーザー' : 'ユーザー→システム') : '分類問題'}</span>
      <p>${activeListTab === 'write' ? item.sys : item.usr}</p>
    `;
    card.addEventListener('click', () => {
      openListModal(activeListTab, i);
    });
    list.appendChild(card);
  });
}

function renderWriteQuestion() {
  if (!DRILL_ITEMS.length) return;

  const item = DRILL_ITEMS[current];
  const dir = directionFor(current);
  const qtag = document.getElementById('qtag');
  const given = document.getElementById('given');
  const task = document.getElementById('task');
  const answerInput = document.getElementById('answerInput');
  const answerBox = document.getElementById('answerBox');
  if (!qtag || !given || !task || !answerInput || !answerBox) return;

  answerBox.classList.remove('open');
  answerInput.value = '';

  if (dir === 'sys2usr') {
    qtag.textContent = 'システム目線 → ユーザー目線';
    qtag.className = 'qtag sys';
    given.textContent = item.sys;
    task.textContent = 'この一文を、ユーザー目線の表現に書き換えてください。';
  } else {
    qtag.textContent = 'ユーザー目線 → システム目線';
    qtag.className = 'qtag usr';
    given.textContent = item.usr;
    task.textContent = 'この体験の裏側にある仕様を、システム目線で書いてください。';
  }

  const qCounter = document.getElementById('qCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (qCounter) qCounter.textContent = `${current + 1} / ${DRILL_ITEMS.length}`;
  if (prevBtn) prevBtn.disabled = current === 0;
  if (nextBtn) nextBtn.disabled = current === DRILL_ITEMS.length - 1;
}

function applyClassifyVisualState(chosen, correct) {
  const options = document.querySelectorAll('#clOptions .cl-opt');
  options.forEach((opt) => {
    opt.classList.remove('correct', 'wrong', 'dim');
    if (opt.dataset.cat === correct) {
      opt.classList.add('correct');
    } else if (opt.dataset.cat === chosen && chosen !== correct) {
      opt.classList.add('wrong');
    } else {
      opt.classList.add('dim');
    }
  });
}

function applyClassifyVisualStateIn(container, chosen, correct) {
  const options = container.querySelectorAll('.cl-opt');
  options.forEach((opt) => {
    opt.classList.remove('correct', 'wrong', 'dim');
    if (opt.dataset.cat === correct) {
      opt.classList.add('correct');
    } else if (opt.dataset.cat === chosen && chosen !== correct) {
      opt.classList.add('wrong');
    } else {
      opt.classList.add('dim');
    }
  });
}

function renderClassifyQuestion() {
  if (!DRILL_ITEMS.length) return;

  const item = DRILL_ITEMS[clCurrent];
  const meta = DRILL_CLASSIFY[clCurrent];
  const options = document.getElementById('clOptions');
  const explain = document.getElementById('clExplain');
  if (!options || !explain) return;

  const clCounter = document.getElementById('clCounter');
  const clNumLabel = document.getElementById('clNumLabel');
  const clSysLine = document.getElementById('clSysLine');
  const clUsrLine = document.getElementById('clUsrLine');
  const clCorrect = document.getElementById('clCorrect');
  const clExplainText = document.getElementById('clExplainText');
  if (clCounter) clCounter.textContent = `${clCurrent + 1} / ${DRILL_ITEMS.length}`;
  if (clNumLabel) clNumLabel.textContent = `Q${clCurrent + 1}`;
  if (clSysLine) clSysLine.textContent = item.sys;
  if (clUsrLine) clUsrLine.textContent = item.usr;
  if (clCorrect) clCorrect.textContent = `正解：${meta.cat}`;
  if (clExplainText) clExplainText.textContent = meta.explain;

  options.innerHTML = '';
  DRILL_CATEGORIES.forEach((category) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cl-opt';
    btn.dataset.cat = category;
    btn.textContent = category;
    btn.addEventListener('click', () => {
      applyClassifyVisualState(category, meta.cat);
      explain.classList.add('open');
      if (!clAnswered.has(clCurrent)) {
        clAnswered.add(clCurrent);
        localStorage.setItem('shiten_classified', JSON.stringify([...clAnswered]));
      }
      updateProgress();
      updateClProgress();
      renderSidebar();
      if (activeListTab === 'classify') renderQuestionList();
    });
    options.appendChild(btn);
  });

  explain.classList.remove('open');
  if (clAnswered.has(clCurrent)) {
    applyClassifyVisualState(meta.cat, meta.cat);
    explain.classList.add('open');
  }

  const clPrevBtn = document.getElementById('clPrevBtn');
  const clNextBtn = document.getElementById('clNextBtn');
  if (clPrevBtn) clPrevBtn.disabled = clCurrent === 0;
  if (clNextBtn) clNextBtn.disabled = clCurrent === DRILL_ITEMS.length - 1;
}

function openListModal(mode, index) {
  const modal = document.getElementById('listModal');
  modalState = { mode, index };
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  renderModalQuestion();
}

function closeListModal() {
  const modal = document.getElementById('listModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalState = null;
}

function renderModalQuestion() {
  if (!modalState) return;

  const { mode, index } = modalState;
  const item = DRILL_ITEMS[index];
  const meta = DRILL_CLASSIFY[index];
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  title.innerHTML = `
    <span class="modal-title-main">Q${index + 1} ${mode === 'write' ? '目線問題' : '分類問題'}</span>
    <span class="modal-title-meta">
      <span class="modal-title-q">${index + 1}/${DRILL_ITEMS.length}</span>
      <span class="modal-title-state ${((mode === 'write' ? answered.has(index) : clAnswered.has(index)) ? 'done' : '')}" id="modalTitleState">${(mode === 'write' ? answered.has(index) : clAnswered.has(index)) ? '解答済み' : '未解答'}</span>
    </span>
  `;

  if (mode === 'write') {
    const dir = directionFor(index);
    const qtag = dir === 'sys2usr' ? 'システム目線 → ユーザー目線' : 'ユーザー目線 → システム目線';
    const qClass = dir === 'sys2usr' ? 'sys' : 'usr';
    const given = dir === 'sys2usr' ? item.sys : item.usr;
    const task = dir === 'sys2usr'
      ? 'この一文を、ユーザー目線の表現に書き換えてください。'
      : 'この体験の裏側にある仕様を、システム目線で書いてください。';
    const solved = answered.has(index);

    body.innerHTML = `
      <div class="modal-qa-layout">
        <div class="modal-qa-content">
          <div class="card modal-qa-card">
            <span class="qtag ${qClass}">${qtag}</span>
            <p class="given">${given}</p>
            <p class="task">${task}</p>
            <textarea id="modalAnswerInput" placeholder="ここに書き換えを入力..."></textarea>
            ${solved ? '' : `<div class="card-actions" id="modalCheckWrap"><button class="btn" id="modalCheckBtn">解答を見る</button></div>`}
            <div class="answer ${solved ? 'open' : ''}" id="modalAnswerBox">
              <div class="answer-block answer-example">
                <span class="label">解答例</span>
                <p class="model">${dir === 'sys2usr' ? item.usr : item.sys}</p>
              </div>
              <div class="answer-block answer-explain">
                <span class="label">説明</span>
                <p class="tip">${item.tip}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="nav-row modal-nav-row">
          <button class="btn ghost" id="modalPrevBtn" ${index === 0 ? 'disabled' : ''}>← 前の問題</button>
          <button class="btn ghost" id="modalNextBtn" ${index === DRILL_ITEMS.length - 1 ? 'disabled' : ''}>次の問題 →</button>
        </div>
      </div>
    `;

    const modalCheckBtn = document.getElementById('modalCheckBtn');
    if (modalCheckBtn) {
      modalCheckBtn.addEventListener('click', () => {
        answered.add(index);
        localStorage.setItem('shiten_answered', JSON.stringify([...answered]));
        const answerBox = document.getElementById('modalAnswerBox');
        answerBox.classList.add('open');
        const checkWrap = document.getElementById('modalCheckWrap');
        if (checkWrap) checkWrap.remove();
        current = index;
        updateProgress();
        renderSidebar();
        if (activeListTab === 'write') renderQuestionList();
        const state = document.getElementById('modalTitleState');
        if (state) {
          state.textContent = '解答済み';
          state.classList.add('done');
        }
      });
    }
  } else {
    const solved = clAnswered.has(index);
    const optsHtml = DRILL_CATEGORIES.map((category) => `<button type="button" class="cl-opt" data-cat="${category}">${category}</button>`).join('');

    body.innerHTML = `
      <div class="modal-qa-layout">
        <div class="modal-qa-content">
          <div class="cl-card modal-qa-card">
            <div class="cl-question">以下仕様がどのカテゴリに分類されるか選択してください。</div>
            <div class="cl-pair">
              <p class="sys-line"><span class="label">システム目線</span>${item.sys}</p>
              <p class="usr-line"><span class="label">ユーザー目線</span>${item.usr}</p>
            </div>
            <div class="cl-options" id="modalClOptions">${optsHtml}</div>
            <div class="cl-explain ${solved ? 'open' : ''}" id="modalClExplain">
              <p><span class="correct-label">正解：${meta.cat}</span></p>
              <p style="margin:8px 0 0;">${meta.explain}</p>
            </div>
          </div>
        </div>
        <div class="nav-row modal-nav-row">
          <button class="btn ghost" id="modalPrevBtn" ${index === 0 ? 'disabled' : ''}>← 前の問題</button>
          <button class="btn ghost" id="modalNextBtn" ${index === DRILL_ITEMS.length - 1 ? 'disabled' : ''}>次の問題 →</button>
        </div>
      </div>
    `;

    const modalOpts = document.getElementById('modalClOptions');
    if (solved) {
      applyClassifyVisualStateIn(modalOpts, meta.cat, meta.cat);
    }

    modalOpts.querySelectorAll('.cl-opt').forEach((opt) => {
      opt.addEventListener('click', () => {
        const chosen = opt.dataset.cat;
        applyClassifyVisualStateIn(modalOpts, chosen, meta.cat);
        document.getElementById('modalClExplain').classList.add('open');
        if (!clAnswered.has(index)) {
          clAnswered.add(index);
          localStorage.setItem('shiten_classified', JSON.stringify([...clAnswered]));
        }

        updateProgress();
        updateClProgress();
        renderSidebar();
        if (activeListTab === 'classify') renderQuestionList();
        const state = document.getElementById('modalTitleState');
        if (state) {
          state.textContent = '解答済み';
          state.classList.add('done');
        }
      });
    });
  }

  const prevBtn = document.getElementById('modalPrevBtn');
  const nextBtn = document.getElementById('modalNextBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (!modalState || modalState.index === 0) return;
      modalState.index -= 1;
      renderModalQuestion();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!modalState || modalState.index >= DRILL_ITEMS.length - 1) return;
      modalState.index += 1;
      renderModalQuestion();
    });
  }
}

function updateProgress() {
  const writeSolved = answered.size;
  const classifySolved = clAnswered.size;
  const totalSolved = writeSolved + classifySolved;
  const totalAll = DRILL_ITEMS.length * 2;

  document.getElementById('sidebarSolved').textContent = totalSolved;
  document.getElementById('sidebarStatus').textContent = statusText(totalSolved, totalAll);

  const tabSolved = activeMapTab === 'write' ? writeSolved : classifySolved;
  document.getElementById('mapTabSolved').textContent = tabSolved;
  document.getElementById('mapTabTotal').textContent = DRILL_ITEMS.length;
}

function updateClProgress() {
  const solved = clAnswered.size;
  const total = DRILL_ITEMS.length || 1;
  const percent = (solved / total) * 100;

  const clNum = document.getElementById('clNum');
  const clTotal = document.getElementById('clTotal');
  const clFill = document.getElementById('clFill');
  if (clNum) clNum.textContent = solved;
  if (clTotal) clTotal.textContent = DRILL_ITEMS.length;
  if (clFill) clFill.style.width = `${percent}%`;
}

const checkBtn = document.getElementById('checkBtn');
if (checkBtn) {
  checkBtn.addEventListener('click', () => {
    const item = DRILL_ITEMS[current];
    const dir = directionFor(current);
    document.getElementById('modelAnswer').textContent = dir === 'sys2usr' ? item.usr : item.sys;
    document.getElementById('tip').textContent = item.tip;
    document.getElementById('answerBox').classList.add('open');
    answered.add(current);
    localStorage.setItem('shiten_answered', JSON.stringify([...answered]));
    updateProgress();
    renderSidebar();
    if (activeListTab === 'write') renderQuestionList();
  });
}

const prevBtn = document.getElementById('prevBtn');
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (current > 0) {
      current -= 1;
      renderWriteQuestion();
      renderSidebar();
    }
  });
}

const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (current < DRILL_ITEMS.length - 1) {
      current += 1;
      renderWriteQuestion();
      renderSidebar();
    }
  });
}

const clPrevBtn = document.getElementById('clPrevBtn');
if (clPrevBtn) {
  clPrevBtn.addEventListener('click', () => {
    if (clCurrent > 0) {
      clCurrent -= 1;
      renderClassifyQuestion();
      renderSidebar();
    }
  });
}

const clNextBtn = document.getElementById('clNextBtn');
if (clNextBtn) {
  clNextBtn.addEventListener('click', () => {
    if (clCurrent < DRILL_ITEMS.length - 1) {
      clCurrent += 1;
      renderClassifyQuestion();
      renderSidebar();
    }
  });
}

document.getElementById('mapWriteTab').addEventListener('click', () => setMapTab('write'));
document.getElementById('mapClassifyTab').addEventListener('click', () => setMapTab('classify'));
document.getElementById('listWriteTab').addEventListener('click', () => setListTab('write'));
document.getElementById('listClassifyTab').addEventListener('click', () => setListTab('classify'));

document.getElementById('modalBackdrop').addEventListener('click', closeListModal);
document.getElementById('modalCloseBtn').addEventListener('click', closeListModal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeListModal();
});

setMapTab('write');
setListTab('write');
updateClProgress();
updateProgress();
renderSidebar();
