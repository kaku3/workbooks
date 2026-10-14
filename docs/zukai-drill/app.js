const state = {
  problems: [],
  index: null,
  resumeIndex: null,
  shuffledOptionsByProblem: {},
  progressByProblem: {}
};

const STORAGE_KEY = "zukai-drill-progress-v1";

const DEFAULT_PROGRESS = Object.freeze({
  selected: [],
  scored: false,
  summary: "",
  revealed: false,
  revealedReview: false,
  revealedCreate: false,
  findings: "",
  revealedOnce: false
});

function createProgressState() {
  return { ...DEFAULT_PROGRESS };
}

function normalizeProgressEntry(progress) {
  const selected = Array.isArray(progress?.selected) ? progress.selected.filter((item) => typeof item === "string") : [];
  const scored = typeof progress?.scored === "boolean" ? progress.scored : false;
  const summary = typeof progress?.summary === "string" ? progress.summary : "";
  const revealed = typeof progress?.revealed === "boolean" ? progress.revealed : false;
  const revealedReview = typeof progress?.revealedReview === "boolean" ? progress.revealedReview : false;
  const revealedCreate = typeof progress?.revealedCreate === "boolean" ? progress.revealedCreate : false;
  const findings = typeof progress?.findings === "string" ? progress.findings : "";
  const revealedOnce = typeof progress?.revealedOnce === "boolean" ? progress.revealedOnce : false;

  return {
    selected,
    scored,
    summary,
    revealed,
    revealedReview,
    revealedCreate,
    findings,
    revealedOnce
  };
}

const refs = {
  progress: document.getElementById("progress"),
  container: document.getElementById("problem-container"),
  reviewTemplate: document.getElementById("review-template"),
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
    state.progressByProblem[problem.id] = createProgressState();
  }

  loadStateFromStorage();

  bindGlobalEvents();
  renderSidebar();
  renderProgress();

}

function bindGlobalEvents() {
  refs.startFirstBtn.addEventListener("click", () => {
    const resume =
      Number.isInteger(state.resumeIndex) &&
      state.resumeIndex >= 0 &&
      state.resumeIndex < state.problems.length
        ? state.resumeIndex
        : 0;
    openProblem(resume, true);
  });

  refs.questionNavList.addEventListener("click", (event) => {
    const item = event.target.closest(".question-nav-item");
    const button = item?.querySelector("button[data-index]");
    if (!button) return;

    const idx = Number.parseInt(button.dataset.index, 10);
    if (!Number.isInteger(idx) || idx < 0 || idx >= state.problems.length) return;
    if (idx === state.index) {
      scrollToProblemTop();
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
  state.resumeIndex = index;
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

  // 現行の問題はすべてレビュー形式で表示する。
  const reviewFragment = refs.reviewTemplate.content.cloneNode(true);
  renderReviewProblem(reviewFragment, problem, progress);
  refs.container.replaceChildren(reviewFragment);

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
      const statusMarkup = done
        ? '<span class="qnav-status done" aria-label="完了">✓</span>'
        : "";
      const activeClass = idx === state.index ? "active" : "";

      return `
      <li class="question-nav-item">
        <button class="question-nav-btn ${activeClass}" type="button" data-index="${idx}">
          <span class="qnav-title">${escapeHtml(problem.title)}</span>
          ${statusMarkup}
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

// ---- レビュー形式(problem.review を持つ問題)の画面 ----------------------
// AIが描いた図をレビューする4手順: 仕様を読む → AIの図を見る → 残すものを選ぶ → 要約を書く

function renderReviewProblem(fragment, problem, progress) {
  const review = problem.review;

  const bind = (name, text) => {
    fragment.querySelectorAll(`[data-bind="${name}"]`).forEach((node) => {
      node.textContent = text ?? "";
    });
  };

  bind("number", `LESSON ${String(state.index + 1).padStart(2, "0")}`);
  bind("difficulty", `難易度 ${problem.difficultyLabel}`);
  bind("title", problem.title);
  bind("lead", review.lead);
  bind("specNote", review.specNote);
  fragment.querySelectorAll('[data-bind="scenario"]').forEach((node) => {
    typewriterText(node, problem.scenario, () => {
      const figurePanel = refs.container.querySelector(".review-figure-panel");
      const figure = refs.container.querySelector("#ai-figure");
      const reviewCard = refs.container.querySelector(".review-card");
      if (!figurePanel || !figure || !reviewCard) return;
      figurePanel.classList.add("sequence-ready");
      const img = figure.querySelector("img");
      const revealReview = () => reviewCard.classList.add("sequence-enter");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealReview();
      } else if (img && img.complete && img.naturalWidth) {
        img.addEventListener("animationend", revealReview, { once: true });
        img.classList.add("diagram-draw-in");
      } else if (!img) revealReview();
    });
  });
  bind("figureNote", review.figureNote);
  bind("findingsLabel", review.findingsLabel);
  bind("keepLead", review.keepLead);
  bind("copyLead", review.copyLead);
  bind("fixedNote", review.fixedNote);
  // 要約例が未設定の問題でも、解答欄の「要約」セクション自体は維持する。
  bind("copyExample", review.copyExample || "この問題の要約例は準備中です。");
  bind("transfer", review.transferTip);

  // fragment は画面に載せると空になるので、使う要素は先に拾っておく
  const ui = {
    focusBox: fragment.getElementById("focus-options"),
    findingsInput: fragment.getElementById("findings-input"),
    copyInput: fragment.getElementById("copy-input"),
    materials: fragment.getElementById("copy-materials"),
    materialsList: fragment.getElementById("copy-materials-list"),
    reviewRevealBtn: fragment.querySelector('.reveal-answer-trigger[data-answer-role="review"]'),
    createRevealBtn: fragment.getElementById("reveal-answer"),
    reviewAnswerBlock: fragment.getElementById("review-answer-block"),
    createAnswerBlock: fragment.getElementById("create-answer-block"),
    yourFindings: fragment.getElementById("your-findings"),
    yourCopy: fragment.getElementById("your-copy"),
    keepScore: fragment.getElementById("keep-score"),
    keepCore: fragment.getElementById("keep-core"),
    keepOut: fragment.getElementById("keep-out"),
    promptBox: fragment.getElementById("ai-eval-prompt"),
    copyBtn: fragment.getElementById("copy-ai-prompt"),
    copyStatus: fragment.getElementById("copy-status")
  };

  // 図は、押すと原寸で開く(スマホでは縮んで文字が小さくなるため)
  const placeFigure = (box, src, alt) => {
    const link = document.createElement("a");
    link.className = "figure-link";
    if (box.id === "ai-figure") box.classList.add("sequence-figure");
    link.href = src;
    link.target = "_blank";
    link.rel = "noopener";
    box.prepend(link);
    renderDiagramImage(link, src, alt);
  };
  placeFigure(
    fragment.getElementById("ai-figure"),
    `./data/diagrams/${problem.id}_bad-diagram.drawio.png`,
    review.figureAlt
  );
  placeFigure(
    fragment.getElementById("create-fixed-figure"),
    `./data/diagrams/${problem.id}_good-diagram.drawio.png`,
    review.fixedAlt
  );

  // 3: 選択肢(データを直したときに残る古い選択は捨てる)
  const options = getShuffledOptions(problem);
  const optionIds = new Set(options.map((opt) => opt.id));
  progress.selected = progress.selected.filter((id) => optionIds.has(id));
  const coreCount = options.filter((opt) => opt.isCore).length;
  fragment.getElementById("keep-count").textContent = `${coreCount}つ選んでください。`;
  renderFocusOptions(fragment, options, progress.selected);

  // 2・4: 入力欄
  ui.findingsInput.value = progress.findings;
  ui.findingsInput.placeholder = review.findingsPlaceholder;
  const findingsHint = fragment.getElementById("findings-hint");
  const leadHint = review.lead.match(/特に、(.+?)(?:。|$)/);
  findingsHint.textContent = leadHint ? `ヒント：${leadHint[1]}。` : "ヒント：図の中で、情報の順序・関係・役割が伝わりにくい箇所を探してみましょう。";
  ui.copyInput.value = progress.summary;
  ui.copyInput.placeholder = review.copyPlaceholder;

  // 答えのうち、入力に左右されない部分
  const findingsList = fragment.getElementById("findings-list");
  // 学習データによっては解説項目が未定義のため、配列であることを確認して描画する。
  const findings = Array.isArray(review.findings) ? review.findings : [];
  for (const item of findings) {
    if (!item || typeof item !== "object") continue;
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = item.title || "確認ポイント";
    const why = document.createElement("span");
    why.className = "why";
    why.textContent = item.why || "";
    li.append(strong, why);
    findingsList.append(li);
  }
  fillPlainList(fragment.getElementById("copy-points"), Array.isArray(review.copyPoints) ? review.copyPoints : []);
  fillPlainList(fragment.getElementById("create-fixed-points"), Array.isArray(review.fixedPoints) ? review.fixedPoints : []);

  const showYours = (wrap, text) => {
    wrap.classList.toggle("hidden", text.trim().length === 0);
    wrap.querySelector(".yours-text").textContent = text;
  };

  const updateMaterials = () => {
    const picked = new Set(progress.selected);
    const items = options.filter((opt) => picked.has(opt.id)).map((opt) => opt.label);
    ui.materials.classList.toggle("hidden", items.length === 0);
    ui.materialsList.replaceChildren(
      ...items.map((label) => {
        const li = document.createElement("li");
        li.textContent = label;
        return li;
      })
    );
  };

  // 答えのうち、入力で変わる部分(答え合わせ・本人の入力のエコー・AI採点用の文章)
  const renderAnswer = () => {
    showYours(ui.yourFindings, progress.findings);
    showYours(ui.yourCopy, progress.summary);

    const picked = new Set(progress.selected);
    let hit = 0;
    let extra = 0;
    ui.keepCore.replaceChildren();
    ui.keepOut.replaceChildren();

    for (const opt of problem.tasks.focusOptions) {
      const isPicked = picked.has(opt.id);
      let tagClass;
      let tagText;
      if (opt.isCore) {
        hit += isPicked ? 1 : 0;
        tagClass = isPicked ? "ok" : "miss";
        tagText = isPicked ? "o" : "x";
      } else {
        extra += isPicked ? 1 : 0;
        tagClass = isPicked ? "extra" : "skip";
        tagText = isPicked ? "x" : "o";
      }

      const li = document.createElement("li");
      const tag = document.createElement("span");
      tag.className = `tag ${tagClass}`;
      tag.textContent = tagText;
      const label = document.createElement("span");
      label.textContent = opt.label;
      li.append(tag, label);
      if (!opt.isCore && opt.note) {
        const note = document.createElement("span");
        note.className = "keep-note";
        note.textContent = opt.note;
        li.append(note);
      }
      (opt.isCore ? ui.keepCore : ui.keepOut).append(li);
    }

    if (progress.selected.length === 0) {
      ui.keepScore.textContent = "「主題」は、まだ選んでいません。";
    } else {
      const extraText = extra > 0 ? `図の外に回すものを、${extra}つ選んでいます。` : "";
      ui.keepScore.textContent = `主題${coreCount}つのうち、${hit}つを選べました。${extraText}`;
    }

    ui.promptBox.value = buildReviewPrompt(problem.scenario, progress.summary.trim() || "(未入力)");
  };

  const syncVisibility = () => {
    ui.reviewAnswerBlock.classList.toggle("hidden", !progress.revealedReview);
    ui.createAnswerBlock.classList.toggle("hidden", !progress.revealedCreate);

    if (ui.reviewRevealBtn) {
      const label = ui.reviewRevealBtn.querySelector(".button-label");
      if (label) label.textContent = progress.revealedReview ? "答えを隠す" : "答えを見る";
    }
    if (ui.createRevealBtn) {
      const label = ui.createRevealBtn.querySelector(".button-label");
      if (label) label.textContent = progress.revealedCreate ? "答えを隠す" : "答えを見る";
    }
  };

  const afterEdit = () => {
    if (progress.revealedReview || progress.revealedCreate) {
      renderAnswer();
    }
    saveStateToStorage();
    renderSidebar();
    renderProgress();
  };

  ui.findingsInput.addEventListener("input", () => {
    progress.findings = ui.findingsInput.value;
    afterEdit();
  });

  ui.copyInput.addEventListener("input", () => {
    progress.summary = ui.copyInput.value;
    afterEdit();
  });

  ui.focusBox.addEventListener("change", () => {
    progress.selected = Array.from(ui.focusBox.querySelectorAll('input[type="checkbox"]:checked')).map((x) => x.value);
    updateMaterials();
    afterEdit();
  });

  if (ui.reviewRevealBtn) {
    ui.reviewRevealBtn.addEventListener("click", () => {
      animateAnswerButton(ui.reviewRevealBtn);
      progress.revealedReview = !progress.revealedReview;
      if (progress.revealedReview) {
        progress.revealedOnce = true;
        renderAnswer();
      }
      syncVisibility();
      if (progress.revealedReview) {
        ui.reviewAnswerBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      saveStateToStorage();
      renderSidebar();
      renderProgress();
    });
  }

  if (ui.createRevealBtn) {
    ui.createRevealBtn.addEventListener("click", () => {
      animateAnswerButton(ui.createRevealBtn);
      progress.revealedCreate = !progress.revealedCreate;
      if (progress.revealedCreate) {
        progress.revealedOnce = true;
        renderAnswer();
      }
      syncVisibility();
      if (progress.revealedCreate) {
        ui.createAnswerBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      saveStateToStorage();
      renderSidebar();
      renderProgress();
    });
  }

  ui.copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ui.promptBox.value);
      ui.copyStatus.textContent = "コピーしました。";
    } catch (error) {
      ui.promptBox.focus();
      ui.promptBox.select();
      ui.copyStatus.textContent = "自動コピーに失敗しました。選択済みの内容をコピーしてください。";
    }
  });

  updateMaterials();
  renderAnswer();
  syncVisibility();
}

function fillPlainList(list, items) {
  for (const text of items) {
    const li = document.createElement("li");
    li.textContent = text;
    list.append(li);
  }
}

function buildReviewPrompt(scenario, copy) {
  return [
    "以下の情報をもとに、図の要約を評価してください。",
    "要約は、仕様をもとにAIが描いた図をレビューして修正したあと、その図の主題や全体像を伝える1〜2文の文章です。",
    "",
    "[仕様]",
    scenario,
    "",
    "[要約]",
    copy,
    "",
    "評価観点:",
    "1. 何の図か: 何が起きて、どうなるかを言い切れているか",
    "2. 仕様どおりか: 仕様にないことを足していないか、順番を勝手に決めていないか",
    "3. 本筋か: 予定や補足の話が混ざっていないか",
    "4. 読み手視点: 初見の人が、この1-2文だけで図の見方をつかめるか",
    "5. 簡潔さ: 1-2文で過不足なく要点を表現できているか",
    "",
    "出力形式:",
    "- 総合評価: A/B/C/D",
    "- 観点別評価: 各観点を5点満点で採点し、理由を1行で記載",
    "- 改善提案: 箇条書きで3点まで",
    "- 改善後の要約例: 1〜2文"
  ].join("\n");
}

function typewriterText(node, text, onComplete) {
  node.textContent = "";
  node.classList.add("typewriter-text");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    node.textContent = text ?? "";
    node.classList.remove("typewriter-text");
    if (onComplete) onComplete();
    return;
  }
  let position = 0;
  const step = () => {
    if (!node.isConnected) return;
    position = Math.min(position + 2, text.length);
    node.textContent = text.slice(0, position);
    if (position < text.length) window.setTimeout(step, 12);
    else {
      node.classList.remove("typewriter-text");
      if (onComplete) onComplete();
    }
  };
  window.setTimeout(step, 120);
}

function animateAnswerButton(button) {
  button.classList.remove("answer-pulse");
  // Reflow restarts the short tap animation on repeated clicks.
  void button.offsetWidth;
  button.classList.add("answer-pulse");
  window.setTimeout(() => button.classList.remove("answer-pulse"), 420);
}

function renderDiagramImage(container, src, alt) {
  const img = document.createElement("img");
  img.className = "diagram-svg";
  img.alt = alt;
  img.decoding = "async";
  img.loading = "lazy";

  img.addEventListener("error", () => {
    container.innerHTML = '<p class="hint">図画像の読み込みに失敗しました。</p>';
  });

  img.addEventListener("load", () => {
    if (!img.naturalWidth || !img.naturalHeight) {
      container.innerHTML = '<p class="hint">図画像が空でした。</p>';
    } else {
      container.replaceChildren(img);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const sequenceFigure = container.closest(".sequence-figure");
        if (!sequenceFigure) img.classList.add("diagram-draw-in");
        else if (sequenceFigure.classList.contains("sequence-ready")) {
          img.addEventListener("animationend", () => {
            const reviewCard = container.closest(".review")?.querySelector(".review-card");
            if (reviewCard) reviewCard.classList.add("sequence-enter");
          }, { once: true });
          img.classList.add("diagram-draw-in");
        }
      } else {
        const reviewCard = container.closest(".review")?.querySelector(".review-card");
        if (reviewCard) reviewCard.classList.add("sequence-enter");
      }
    }
  });

  container.replaceChildren(img);
  img.src = src;
}

function isProblemCompleted(problemId) {
  const progress = state.progressByProblem[problemId];
  if (!progress) {
    return false;
  }

  const normalized = normalizeProgressEntry(progress);
  const problem = state.problems.find((item) => item.id === problemId);
  if (!problem) {
    return false;
  }

  if (problem.review) {
    // レビュー形式: レビュー側と作成側の両方の解答を見てから完了とする
    return (
      normalized.findings.trim().length > 0 &&
      normalized.summary.trim().length > 0 &&
      normalized.revealedReview === true &&
      normalized.revealedCreate === true
    );
  }

  const coreIds = problem.tasks.focusOptions.filter((item) => item.isCore).map((item) => item.id);
  const selectedSet = new Set(normalized.selected);
  const hasAllCore = coreIds.every((id) => selectedSet.has(id));

  const q1Completed = normalized.scored === true && hasAllCore;
  const q2Completed = normalized.revealed === true && normalized.summary.trim().length > 0;
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
        state.progressByProblem[problem.id] = normalizeProgressEntry({
          selected: saved.selected,
          scored: saved.scored,
          summary: saved.summary,
          revealed: saved.revealed,
          revealedReview: saved.revealedReview,
          revealedCreate: saved.revealedCreate,
          findings: saved.findings,
          revealedOnce: saved.revealedOnce
        });
      } else {
        state.progressByProblem[problem.id] = normalizeProgressEntry(current);
      }

      const savedOrder = savedShuffled[problem.id];
      if (Array.isArray(savedOrder) && savedOrder.length === problem.tasks.focusOptions.length) {
        state.shuffledOptionsByProblem[problem.id] = savedOrder;
      }
    }

    if (Number.isInteger(parsed.index)) {
      state.resumeIndex = parsed.index;
    }
  } catch (error) {
    console.warn("ローカル保存データの復元に失敗しました", error);
  }
}

function saveStateToStorage() {
  try {
    const progressByProblem = Object.fromEntries(
      Object.entries(state.progressByProblem).map(([problemId, progress]) => [problemId, normalizeProgressEntry(progress)])
    );

    const payload = {
      index: state.resumeIndex,
      progressByProblem,
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

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
