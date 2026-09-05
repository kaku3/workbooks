const state = {
  problems: [],
  index: null,
  shuffledOptionsByProblem: {},
  progressByProblem: {}
};

const STORAGE_KEY = "zukai-drill-progress-v1";

const refs = {
  progress: document.getElementById("progress"),
  container: document.getElementById("problem-container"),
  template: document.getElementById("problem-template"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  questionNavList: document.getElementById("question-nav-list"),
  completionSummary: document.getElementById("completion-summary"),
  problemWrap: document.getElementById("problem-wrap"),
  startFirstBtn: document.getElementById("start-first-btn")
};

init().catch((error) => {
  refs.container.innerHTML = `<p>データ読み込みに失敗しました: ${error.message}</p>`;
});

async function init() {
  const response = await fetch("./data/problems.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("problems.json を取得できませんでした");
  }

  const json = await response.json();
  if (!Array.isArray(json.problems) || json.problems.length === 0) {
    throw new Error("問題データが空です");
  }

  state.problems = json.problems;
  for (const problem of state.problems) {
    state.progressByProblem[problem.id] = {
      selected: [],
      scored: false,
      summary: "",
      revealed: false
    };
  }

  loadStateFromStorage();

  bindGlobalEvents();
  renderSidebar();
  renderProgress();

  if (Number.isInteger(state.index) && state.index >= 0 && state.index < state.problems.length) {
    refs.problemWrap.classList.remove("hidden");
    renderCurrentProblem();
  }
}

function bindGlobalEvents() {
  refs.startFirstBtn.addEventListener("click", () => {
    openProblem(0, true);
  });

  refs.questionNavList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-index]");
    if (!button) {
      return;
    }

    const idx = Number(button.dataset.index);
    if (Number.isNaN(idx)) {
      return;
    }

    openProblem(idx, true);
  });

  refs.prevBtn.addEventListener("click", () => {
    if (state.index === null || state.index <= 0) {
      return;
    }

    openProblem(state.index - 1, true);
  });

  refs.nextBtn.addEventListener("click", () => {
    if (state.index === null || state.index >= state.problems.length - 1) {
      return;
    }

    openProblem(state.index + 1, true);
  });
}

function openProblem(index, shouldScroll) {
  state.index = index;
  refs.problemWrap.classList.remove("hidden");
  renderCurrentProblem();
  saveStateToStorage();
  if (shouldScroll) {
    scrollToProblemTop();
  }
}

function scrollToProblemTop() {
  const top = refs.problemWrap.getBoundingClientRect().top + window.scrollY - 10;
  window.scrollTo({ top, behavior: "smooth" });
}

function renderCurrentProblem() {
  if (state.index === null) {
    return;
  }

  renderProgress();
  renderSidebar();

  const problem = state.problems[state.index];
  const progress = state.progressByProblem[problem.id];
  const fragment = refs.template.content.cloneNode(true);

  fragment.querySelector('[data-bind="number"]').textContent = `LESSON ${String(state.index + 1).padStart(2, "0")}`;
  fragment.querySelector('[data-bind="difficulty"]').textContent = `難易度 ${problem.difficultyLabel}`;
  fragment.querySelector('[data-bind="title"]').textContent = problem.title;
  fragment.querySelector('[data-bind="learningGoal"]').textContent = problem.learningGoal;
  fragment.querySelector('[data-bind="scenario"]').textContent = problem.scenario;

  const focusOptions = getShuffledOptions(problem);
  renderFocusOptions(fragment, focusOptions, progress.selected);
  wireScoring(fragment, focusOptions, problem.id);
  wireSampleToggle(fragment, problem, problem.id);

  refs.container.replaceChildren(fragment);

  refs.prevBtn.disabled = state.index === 0;
  refs.nextBtn.disabled = state.index === state.problems.length - 1;
}

function renderSidebar() {
  let completed = 0;

  const html = state.problems
    .map((problem, idx) => {
      const done = isProblemCompleted(problem.id);
      if (done) {
        completed += 1;
      }

      const statusClass = done ? "done" : "todo";
      const statusText = done ? "完了" : "未了";
      const activeClass = idx === state.index ? "active" : "";

      return `
      <li class="question-nav-item">
        <button class="question-nav-btn ${activeClass}" type="button" data-index="${idx}">
          <div class="qnav-top">
            <span class="qnav-no">LESSON ${String(idx + 1).padStart(2, "0")}</span>
            <span class="qnav-status ${statusClass}">${statusText}</span>
          </div>
          <div class="qnav-title">${escapeHtml(problem.title)}</div>
        </button>
      </li>`;
    })
    .join("");

  refs.questionNavList.innerHTML = html;
  refs.completionSummary.textContent = `完了 ${completed} / ${state.problems.length}`;
}

function renderProgress() {
  refs.progress.innerHTML = state.problems
    .map((problem, i) => {
      const isActive = i === state.index;
      const isDone = isProblemCompleted(problem.id);
      const className = `progress-dot ${isActive ? "active" : ""} ${isDone ? "done" : ""}`.trim();
      return `<span class="${className}"></span>`;
    })
    .join("");
}

function renderFocusOptions(fragment, options, selectedValues) {
  const selectedSet = new Set(selectedValues || []);
  const box = fragment.getElementById("focus-options");

  box.innerHTML = options
    .map((opt) => {
      const checked = selectedSet.has(opt.id) ? "checked" : "";
      return `
      <label class="option-item">
        <input type="checkbox" value="${opt.id}" ${checked} />
        <span>${escapeHtml(opt.label)}</span>
      </label>`;
    })
    .join("");
}

function wireScoring(fragment, options, problemId) {
  const scoreBtn = fragment.getElementById("score-btn");
  const scoreText = fragment.getElementById("score-text");
  const focusBox = fragment.getElementById("focus-options");

  const syncSelected = () => {
    const selected = Array.from(focusBox.querySelectorAll('input[type="checkbox"]:checked')).map((x) => x.value);
    state.progressByProblem[problemId].selected = selected;
    saveStateToStorage();
  };

  focusBox.addEventListener("change", syncSelected);

  scoreBtn.addEventListener("click", () => {
    syncSelected();
    const selected = state.progressByProblem[problemId].selected;
    const coreSet = new Set(options.filter((x) => x.isCore).map((x) => x.id));

    let correct = 0;
    for (const value of selected) {
      if (coreSet.has(value)) {
        correct += 1;
      }
    }

    let nonCoreSelected = 0;
    for (const value of selected) {
      if (!coreSet.has(value)) {
        nonCoreSelected += 1;
      }
    }

    const score = Math.max(0, correct * 2 - nonCoreSelected);
    scoreText.textContent = `自己採点: ${score} 点 | 主情報 ${correct} 件 / 補足情報の選択 ${nonCoreSelected} 件`;

    state.progressByProblem[problemId].scored = true;
    saveStateToStorage();
    renderSidebar();
    renderProgress();
  });
}

function wireSampleToggle(fragment, problem, problemId) {
  const progress = state.progressByProblem[problemId];

  const btn = fragment.getElementById("reveal-answer");
  const answerBlock = fragment.getElementById("answer-block");
  const area = fragment.getElementById("sample-area");
  const storyInput = fragment.getElementById("story-answer");
  const promptBox = fragment.getElementById("ai-eval-prompt");
  const copyBtn = fragment.getElementById("copy-ai-prompt");
  const copyStatus = fragment.getElementById("copy-status");

  fragment.querySelector('[data-bind="badTitle"]').textContent = problem.badDiagram.title;
  fragment.querySelector('[data-bind="goodTitle"]').textContent = problem.goodDiagram.title;

  const badDiagram = fragment.getElementById("bad-diagram");
  badDiagram.innerHTML = buildBadDiagramSvg(problem.badDiagram);

  const mistakes = fragment.getElementById("mistakes-list");
  mistakes.innerHTML = problem.badDiagram.mistakes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const goodDiagram = fragment.getElementById("good-diagram");
  goodDiagram.innerHTML = buildGoodDiagramSvg(problem.goodDiagram);

  const principles = fragment.getElementById("principles-list");
  principles.innerHTML = problem.goodDiagram.principles.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const transfer = fragment.getElementById("transfer-text");
  transfer.textContent = problem.transferTip;

  storyInput.value = progress.summary;

  const updatePrompt = () => {
    const summary = storyInput.value.trim() || "(未入力)";
    progress.summary = storyInput.value;
    promptBox.value = buildEvaluationPrompt(problem.scenario, summary);

    saveStateToStorage();
    renderSidebar();
    renderProgress();
  };

  updatePrompt();
  storyInput.addEventListener("input", updatePrompt);

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(promptBox.value);
      copyStatus.textContent = "コピーしました。";
    } catch (error) {
      promptBox.focus();
      promptBox.select();
      copyStatus.textContent = "自動コピーに失敗しました。選択済みの内容をコピーしてください。";
    }
  });

  if (progress.revealed) {
    answerBlock.classList.remove("hidden");
    btn.classList.add("hidden");
    area.classList.remove("hidden");
  }

  btn.addEventListener("click", () => {
    progress.revealed = true;
    answerBlock.classList.remove("hidden");
    btn.classList.add("hidden");
    area.classList.remove("hidden");
    updatePrompt();
    answerBlock.scrollIntoView({ behavior: "smooth", block: "start" });

    saveStateToStorage();
    renderSidebar();
    renderProgress();
  });
}

function isProblemCompleted(problemId) {
  const progress = state.progressByProblem[problemId];
  if (!progress) {
    return false;
  }

  const problem = state.problems.find((item) => item.id === problemId);
  if (!problem) {
    return false;
  }

  const coreIds = problem.tasks.focusOptions.filter((item) => item.isCore).map((item) => item.id);
  const selectedSet = new Set(progress.selected);
  const hasAllCore = coreIds.every((id) => selectedSet.has(id));

  const q1Completed = progress.scored && hasAllCore;
  const q2Completed = progress.revealed && progress.summary.trim().length > 0;
  return q1Completed && q2Completed;
}

function getShuffledOptions(problem) {
  const cached = state.shuffledOptionsByProblem[problem.id];
  if (cached) {
    return cached;
  }

  const cloned = problem.tasks.focusOptions.map((item) => ({ ...item }));
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }

  state.shuffledOptionsByProblem[problem.id] = cloned;
  saveStateToStorage();
  return cloned;
}

function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);
    const savedProgress = parsed.progressByProblem || {};
    const savedShuffled = parsed.shuffledOptionsByProblem || {};

    for (const problem of state.problems) {
      const current = state.progressByProblem[problem.id];
      const saved = savedProgress[problem.id];
      if (saved && typeof saved === "object") {
        current.selected = Array.isArray(saved.selected) ? saved.selected : [];
        current.scored = Boolean(saved.scored);
        current.summary = typeof saved.summary === "string" ? saved.summary : "";
        current.revealed = Boolean(saved.revealed);
      }

      const savedOrder = savedShuffled[problem.id];
      if (Array.isArray(savedOrder) && savedOrder.length === problem.tasks.focusOptions.length) {
        state.shuffledOptionsByProblem[problem.id] = savedOrder;
      }
    }

    if (Number.isInteger(parsed.index)) {
      state.index = parsed.index;
    }
  } catch (error) {
    console.warn("ローカル保存データの復元に失敗しました", error);
  }
}

function saveStateToStorage() {
  try {
    const payload = {
      index: state.index,
      progressByProblem: state.progressByProblem,
      shuffledOptionsByProblem: state.shuffledOptionsByProblem
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("ローカル保存に失敗しました", error);
  }
}

function buildBadDiagramSvg(badDiagram) {
  const mainLine = badDiagram.lines[0] || "";
  const nodes = splitFlow(mainLine);
  const extraLines = badDiagram.lines.slice(1);

  const width = 820;
  const laneTop = 26;
  const gapX = 150;
  const gapY = 76;
  const perRow = 5;
  const rowCount = Math.max(1, Math.ceil(nodes.length / perRow));
  const height = Math.max(260, laneTop + rowCount * gapY + 96);

  const points = nodes.map((label, idx) => {
    const row = Math.floor(idx / perRow);
    const col = idx % perRow;
    const zigzagCol = row % 2 === 0 ? col : perRow - 1 - col;
    const x = 24 + zigzagCol * gapX + (idx % 2 === 0 ? 0 : 8);
    const y = laneTop + row * gapY + (idx % 3 === 0 ? 0 : 4);
    return { x, y, label };
  });

  const edges = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];
    const x1 = from.x + 56;
    const y1 = from.y + 20;
    const x2 = to.x + 56;
    const y2 = to.y + 20;
    const cx = (x1 + x2) / 2 + (i % 2 === 0 ? -20 : 24);
    const cy = (y1 + y2) / 2 + (i % 3 === 0 ? 18 : -16);
    edges.push(`<path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" class="bad-edge" marker-end="url(#bad-arrow)" />`);
  }

  const nodeSvg = points
    .map(({ x, y, label }) => {
      const lines = wrapLabel(label, 8, 2);
      const textY = lines.length === 1 ? y + 24 : y + 18;
      return `
      <g>
        <rect x="${x}" y="${y}" width="112" height="40" rx="8" class="bad-node" />
        ${toSvgText(x + 56, textY, lines, "bad-text", 12)}
      </g>`;
    })
    .join("");

  const noiseTokens = extraLines
    .flatMap((line) => line.split(/->|→|\/|／|,|、/))
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);

  const bubbleRx = 44;
  const noiseMinX = 16 + bubbleRx;
  const noiseMaxX = width - 16 - bubbleRx;
  const noiseStep =
    noiseTokens.length > 1 ? (noiseMaxX - noiseMinX) / (noiseTokens.length - 1) : 0;

  const noise = noiseTokens
    .map((item, idx) => {
      const x = noiseTokens.length === 1 ? width / 2 : noiseMinX + idx * noiseStep;
      const y = height - 54 + (idx % 2 === 0 ? -8 : 8);
      const line = wrapLabel(item, 7, 1)[0];
      return `
      <g>
        <ellipse cx="${x}" cy="${y}" rx="${bubbleRx}" ry="16" class="noise-bubble" />
        <text x="${x}" y="${y + 4}" text-anchor="middle" class="noise-text">${escapeHtml(line)}</text>
      </g>`;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="diagram-svg bad-svg" role="img" aria-label="悪い図の例">
      <defs>
        <marker id="bad-arrow" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#b26f58" />
        </marker>
      </defs>
      ${edges.join("")}
      ${nodeSvg}
      ${noise}
    </svg>`;
}

function buildGoodDiagramSvg(goodDiagram) {
  const lanes = goodDiagram.lanes || [];
  const laneHeight = 94;
  const laneGap = 12;
  const headerWidth = 120;
  const stepWidth = 120;
  const stepGap = 22;
  const maxSteps = Math.max(1, ...lanes.map((lane) => lane.steps.length));
  const width = Math.max(820, headerWidth + 28 + maxSteps * (stepWidth + stepGap) + 18);
  const height = 18 + lanes.length * (laneHeight + laneGap);

  const laneSvg = lanes
    .map((lane, laneIdx) => {
      const y = 14 + laneIdx * (laneHeight + laneGap);
      const laneBase = `
        <rect x="12" y="${y}" width="${width - 24}" height="${laneHeight}" rx="12" class="good-lane" />
        <text x="26" y="${y + 32}" class="good-lane-title">${escapeHtml(lane.name)}</text>`;

      const steps = lane.steps
        .map((step, stepIdx) => {
          const x = headerWidth + 20 + stepIdx * (stepWidth + stepGap);
          const lines = wrapLabel(step, 9, 2);
          const textY = lines.length === 1 ? y + 51 : y + 45;
          const arrow =
            stepIdx === lane.steps.length - 1
              ? ""
              : `<line x1="${x + stepWidth}" y1="${y + 47}" x2="${x + stepWidth + stepGap - 8}" y2="${y + 47}" class="good-edge" marker-end="url(#good-arrow)" />`;
          return `
            <g>
              <rect x="${x}" y="${y + 26}" width="${stepWidth}" height="40" rx="8" class="good-node" />
              ${toSvgText(x + stepWidth / 2, textY, lines, "good-text", 12)}
              ${arrow}
            </g>`;
        })
        .join("");

      return laneBase + steps;
    })
    .join("");

  return `
    <svg viewBox="0 0 ${width} ${height}" class="diagram-svg good-svg" role="img" aria-label="良い図の例">
      <defs>
        <marker id="good-arrow" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#2d7a72" />
        </marker>
      </defs>
      ${laneSvg}
    </svg>`;
}

function splitFlow(line) {
  return line
    .split(/->|→/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function wrapLabel(text, maxUnitsPerLine, maxLines) {
  const tokens = tokenizeLabel(text);
  if (tokens.length === 0) {
    return [""];
  }

  const lines = [];
  let current = "";
  let units = 0;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const tokenUnits = getVisualUnits(token);

    if (units + tokenUnits <= maxUnitsPerLine) {
      current += token;
      units += tokenUnits;
      continue;
    }

    if (current.length === 0) {
      current = truncateToken(token, maxUnitsPerLine);
      lines.push(current);
      current = "";
      units = 0;
    } else {
      lines.push(current);
      current = token;
      units = tokenUnits;
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && current.length > 0) {
    lines.push(current);
  }

  const estimatedUnits = tokens.reduce((sum, token) => sum + getVisualUnits(token), 0);
  if (estimatedUnits > maxUnitsPerLine * maxLines && lines.length > 0) {
    const lastIdx = lines.length - 1;
    const last = lines[lastIdx];
    lines[lastIdx] = `${last.slice(0, Math.max(0, last.length - 1))}…`;
  }

  return lines.slice(0, maxLines);
}

function tokenizeLabel(text) {
  return String(text || "")
    .trim()
    .match(/[A-Za-z0-9]+|[^A-Za-z0-9\s]/g) || [];
}

function getVisualUnits(token) {
  if (/^[A-Za-z0-9]+$/.test(token)) {
    return token.length;
  }
  return 1;
}

function truncateToken(token, maxUnits) {
  if (!token) {
    return "";
  }
  if (getVisualUnits(token) <= maxUnits) {
    return token;
  }
  return `${token.slice(0, Math.max(1, maxUnits - 1))}…`;
}

function toSvgText(x, y, lines, className, lineHeight) {
  const tspans = lines
    .map((line, idx) => `<tspan x="${x}" dy="${idx === 0 ? 0 : lineHeight}">${escapeHtml(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" text-anchor="middle" class="${className}">${tspans}</text>`;
}

function buildEvaluationPrompt(scenario, summary) {
  return [
    "以下の情報をもとに、問2の概要文を評価してください。",
    "",
    "[問題文]",
    scenario,
    "",
    "[概要文]",
    summary,
    "",
    "評価観点:",
    "1. 主題の明確さ: 何を説明したい図かが明確か",
    "2. 変化の提示: 現状と改善後の違いが伝わるか",
    "3. 情報整理: 重要情報と補足情報を分けられているか",
    "4. 読み手視点: 初見の人でも流れを追える表現か",
    "5. 簡潔さ: 1-2文で過不足なく要点を表現できているか",
    "",
    "出力形式:",
    "- 総合評価: A/B/C/D",
    "- 観点別評価: 各観点を5点満点で採点し、理由を1行で記載",
    "- 改善提案: 箇条書きで3点まで",
    "- 改善後の概要文サンプル: 1-2文"
  ].join("\n");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
