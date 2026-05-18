'use strict';

const ROOT_STORAGE_KEY = 'commu-checker-training-history';
const SUBJECTS_STORAGE_KEY = 'commu-checker-training-subjects';
const SUMMARY_TAB = 'summary';

const urlParams = new URLSearchParams(location.search);
const isViewer = urlParams.has('check');
let currentType;
let viewerRootState = {};
let enrolledTypes = [];

let weekTotals = {};
let phaseWeeks = {};
let weekOrder = [];
let totalChecks = 0;
let encodedViewerPayload = urlParams.get('check') || '';

const TYPE_MENU_LABELS = {
  d1: 'D1型',
  d2: 'D2型',
  m1: 'M1型',
  m2: 'M2型',
  r1: 'R1型',
  r2: 'R2型',
  r3: 'R3型',
  s1: 'S1型',
  s2: 'S2型',
  s3: 'S3型',
};

const TYPE_BADGE_CODES = {
  d1: '11',
  d2: '12',
  m1: '21',
  m2: '22',
  r1: '31',
  r2: '32',
  r3: '33',
  s1: '51',
  s2: '52',
  s3: '53',
};

const TYPE_DISPLAY_ORDER = ['r1', 'r2', 'r3', 's1', 's2', 's3', 'd1', 'd2', 'm1', 'm2'];
const SUMMARY_TYPE_ORDER = ['r1', 'r2', 'r3', 's1', 's2', 's3', 'd1', 'd2', 'm1', 'm2'];

currentType = resolveInitialType();

function isTrainingType(type) {
  return TRAINING_TYPES.includes(type);
}

function getOrderedTypes() {
  return TYPE_DISPLAY_ORDER.filter((type) => TRAINING_TYPES.includes(type));
}

function sortTypesForSummary(types) {
  const rank = new Map(SUMMARY_TYPE_ORDER.map((t, i) => [t, i]));
  return [...types].sort((a, b) => (rank.get(a) ?? 999) - (rank.get(b) ?? 999));
}

function getCountToneClass(count) {
  if (count >= 10) {
    return 'count-10';
  }
  if (count >= 5) {
    return 'count-5';
  }
  if (count >= 1) {
    return 'count-1';
  }
  return 'count-0';
}

function sanitizeTypeList(list) {
  const valid = new Set(TRAINING_TYPES);
  const out = [];
  (list || []).forEach((raw) => {
    const t = String(raw || '').toLowerCase().trim();
    if (!valid.has(t) || out.includes(t)) {
      return;
    }
    out.push(t);
  });
  return out;
}

function loadStoredSubjects() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? sanitizeTypeList(parsed) : [];
  } catch {
    return [];
  }
}

function saveSubjects(subjects) {
  try {
    localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(sanitizeTypeList(subjects)));
  } catch {}
}

function parseSubjectsFromURL() {
  const raw = (
    urlParams.get('subjects')
    || urlParams.get('subject')
    || urlParams.get('types')
    || ''
  ).trim();
  if (!raw) {
    return [];
  }
  return sanitizeTypeList(raw.split(/[,+\s]+/));
}

function ensureCurrentTypeInSubjects() {
  if (!isTrainingType(currentType)) {
    return;
  }
  if (!enrolledTypes.includes(currentType)) {
    enrolledTypes.push(currentType);
    enrolledTypes = sanitizeTypeList(enrolledTypes);
    saveSubjects(enrolledTypes);
  }
}

function initSubjects() {
  const fromUrl = parseSubjectsFromURL();
  const stored = loadStoredSubjects();

  if (stored.length > 0) {
    // 既存の受講順を維持しつつ、URLに含まれる新科目だけ末尾に追加
    const merged = [...stored];
    fromUrl.forEach((t) => { if (!merged.includes(t)) merged.push(t); });
    enrolledTypes = sanitizeTypeList(merged);
    if (fromUrl.length > 0) saveSubjects(enrolledTypes);
    return;
  }

  if (fromUrl.length > 0) {
    enrolledTypes = fromUrl;
    saveSubjects(enrolledTypes);
    return;
  }

  enrolledTypes = getOrderedTypes();
  saveSubjects(enrolledTypes);
}

function stripEmojiPrefix(text) {
  return (text || '').replace(/^\s*[⚡\u{2600}-\u{27BF}\u{1F300}-\u{1FAFF}]\s*/u, '').trim();
}

function getTypeExtraLabel(type) {
  const page = TRAINING_PAGES[type];
  if (!page || !page.mainHtml) {
    return '';
  }

  // Material Icons が span 内に入っているため DOMParser でテキストノードのみ抽出
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${page.mainHtml}</div>`, 'text/html');
    const el = doc.querySelector('.insight-gap-label');
    if (el) {
      let text = '';
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent;
        }
      });
      const trimmed = text.trim();
      if (trimmed) {
        return trimmed;
      }
    }
  } catch {
    // fall through to regex fallback
  }

  const match = page.mainHtml.match(/insight-gap-label">([^<]+)</);
  if (!match || !match[1]) {
    return '';
  }

  return stripEmojiPrefix(match[1]);
}

function normalizeGapLabel(label) {
  return (label || '').replace(/\s+/g, '').trim();
}

function resolveBadgeCode(type) {
  const fromUrl = (
    urlParams.get('code')
    || urlParams.get('diag')
    || urlParams.get('id')
    || urlParams.get('typeNo')
    || ''
  ).trim();

  if (/^\d{2,3}$/.test(fromUrl)) {
    return fromUrl;
  }
  return TYPE_BADGE_CODES[type] || (TYPE_MENU_LABELS[type] || '').replace(/\D/g, '');
}

function getTodayCountByType(type) {
  const sourceState = isViewer
    ? (viewerRootState[type] && typeof viewerRootState[type] === 'object' ? viewerRootState[type] : {})
    : getTypeState(type);
  const state = cleanOldChecks(sourceState);
  const t = today();
  return Object.values(state).filter((entry) => hasCheckOnDay(entry, t)).length;
}

function buildTypeMenuText(type) {
  const base = TYPE_MENU_LABELS[type] || TRAINING_PAGES[type].label;
  const extra = getTypeExtraLabel(type);
  const todayCount = getTodayCountByType(type);
  const countLabel = todayCount > 0 ? ` (${todayCount})` : '';

  if (extra) {
    return `${base} ${extra}${countLabel}`;
  }
  return `${base}${countLabel}`;
}

function buildTypeDisplayText(type) {
  const base = TYPE_MENU_LABELS[type] || TRAINING_PAGES[type].label;
  const extra = getTypeExtraLabel(type);
  return extra ? `${base} ${extra}` : base;
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const summaryCheckItemsCache = {};
const summaryCheckEntriesCache = {};

function getCheckItemsByType(type) {
  if (summaryCheckItemsCache[type]) {
    return summaryCheckItemsCache[type];
  }

  const page = TRAINING_PAGES[type];
  if (!page || !page.mainHtml) {
    summaryCheckItemsCache[type] = [];
    return summaryCheckItemsCache[type];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${page.mainHtml}</div>`, 'text/html');
    const items = Array.from(doc.querySelectorAll('.check-text'))
      .map((el) => (el.textContent || '').trim())
      .filter(Boolean);
    summaryCheckItemsCache[type] = items;
    return items;
  } catch {
    const items = [];
    const re = /<div class="check-text(?:\s+[^"]+)?">([\s\S]*?)<\/div>/g;
    let m;
    while ((m = re.exec(page.mainHtml)) !== null) {
      const v = String(m[1] || '').replace(/<[^>]*>/g, '').trim();
      if (v) {
        items.push(v);
      }
    }
    summaryCheckItemsCache[type] = items;
    return items;
  }
}

function getCheckEntriesByType(type) {
  if (summaryCheckEntriesCache[type]) {
    return summaryCheckEntriesCache[type];
  }

  const page = TRAINING_PAGES[type];
  if (!page || !page.mainHtml) {
    summaryCheckEntriesCache[type] = [];
    return summaryCheckEntriesCache[type];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${page.mainHtml}</div>`, 'text/html');
    const entries = [];
    doc.querySelectorAll('.check-list[id^="checks-"]').forEach((listEl) => {
      const weekId = (listEl.id || '').replace(/^checks-/, '');
      const texts = Array.from(listEl.querySelectorAll('.check-item .check-text'));
      texts.forEach((textEl, idx) => {
        const text = (textEl.textContent || '').trim();
        if (!text || !weekId) {
          return;
        }
        entries.push({ text, key: `${weekId}-${idx}` });
      });
    });
    summaryCheckEntriesCache[type] = entries;
    return entries;
  } catch {
    const items = getCheckItemsByType(type);
    summaryCheckEntriesCache[type] = items.map((text, idx) => ({ text, key: `unknown-${idx}` }));
    return summaryCheckEntriesCache[type];
  }
}

function buildTrendOverlaySvg(counts) {
  const points = Array.from({ length: 29 }, (_, i) => Number(counts[i] || 0));
  const maxY = Math.max(1, ...points);

  const w = 220;
  const h = 92;
  const left = 22;
  const top = 10;
  const right = 8;
  const bottom = 20;
  const pw = w - left - right;
  const ph = h - top - bottom;

  const xAt = (i) => left + (pw * i) / 28;
  const yAt = (v) => top + ph - (ph * v) / maxY;

  const polyline = points.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  const circles = points.map((v, i) => `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="1.7" />`).join('');

  const midY = yAt(Math.round(maxY / 2));
  const maxLineY = yAt(maxY);

  return `
    <svg class="summary-trend-svg" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <line class="axis" x1="${left}" y1="${top}" x2="${left}" y2="${top + ph}" />
      <line class="axis" x1="${left}" y1="${top + ph}" x2="${left + pw}" y2="${top + ph}" />
      <line class="grid" x1="${left}" y1="${midY.toFixed(1)}" x2="${left + pw}" y2="${midY.toFixed(1)}" />
      <line class="grid" x1="${left}" y1="${maxLineY.toFixed(1)}" x2="${left + pw}" y2="${maxLineY.toFixed(1)}" />
      <polyline class="line" points="${polyline}" />
      <g class="dots">${circles}</g>
      <text class="label x" x="${left}" y="${h - 6}">1</text>
      <text class="label x" x="${left + pw}" y="${h - 6}" text-anchor="end">29</text>
      <text class="label y" x="${left - 6}" y="${top + 4}" text-anchor="end">${maxY}</text>
      <text class="label y" x="${left - 6}" y="${top + ph + 4}" text-anchor="end">0</text>
    </svg>
  `;
}

function resolveInitialType() {
  const typeFromUrl = (urlParams.get('type') || '').toLowerCase();
  if (typeFromUrl === SUMMARY_TAB) {
    return SUMMARY_TAB;
  }
  if (TRAINING_TYPES.includes(typeFromUrl)) {
    return typeFromUrl;
  }
  const ordered = getOrderedTypes();
  return ordered[0] || TRAINING_TYPES[0];
}

function getStateForType(type) {
  if (isViewer) {
    const viewerState = viewerRootState[type];
    return viewerState && typeof viewerState === 'object' ? cleanOldChecks(viewerState) : {};
  }
  const cleaned = cleanOldChecks(getTypeState(type));
  saveTypeState(type, cleaned);
  return cleaned;
}

function buildMergedState(types) {
  const merged = {};
  (types || []).forEach((type) => {
    const s = getStateForType(type);
    Object.entries(s).forEach(([k, v]) => {
      merged[`${type}:${k}`] = v;
    });
  });
  return merged;
}

function getTodayTargetByType(type, activeDay) {
  return getTodayTargetCount(getStateForType(type), activeDay);
}

function getRootState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ROOT_STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveRootState(next) {
  try {
    localStorage.setItem(ROOT_STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function getTypeState(type) {
  const root = getRootState();
  const state = root[type];
  return state && typeof state === 'object' ? state : {};
}

function saveTypeState(type, state) {
  const root = getRootState();
  root[type] = state;
  saveRootState(root);
}

function cleanOldChecks(data) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const out = {};
  Object.entries(data || {}).forEach(([key, entry]) => {
    const dates = normalizeCheckEntry(entry).filter((d) => d >= cutoffStr);
    if (dates.length > 0) {
      out[key] = dates;
    }
  });
  return out;
}

function checkKey(weekId, idx) {
  return `${weekId}-${idx}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function dateFromYmd(ymd) {
  return new Date(`${ymd}T00:00:00`);
}

function addDaysToYmd(baseYmd, days) {
  const d = dateFromYmd(baseYmd);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function diffDaysYmd(baseYmd, targetYmd) {
  const a = dateFromYmd(baseYmd);
  const b = dateFromYmd(targetYmd);
  return Math.max(0, Math.floor((b - a) / 86400000));
}

function encodeCheckKeyCompact(key) {
  const m = String(key || '').match(/^week-(\d+)-(\d+)$/);
  if (m) {
    return `w${Number(m[1]).toString(36)}i${Number(m[2]).toString(36)}`;
  }
  return `u${encodeURIComponent(String(key || ''))}`;
}

function decodeCheckKeyCompact(encoded) {
  const s = String(encoded || '');
  const m = s.match(/^w([0-9a-z]+)i([0-9a-z]+)$/i);
  if (m) {
    return `week-${parseInt(m[1], 36)}-${parseInt(m[2], 36)}`;
  }
  if (s.startsWith('u')) {
    try {
      return decodeURIComponent(s.slice(1));
    } catch {
      return s.slice(1);
    }
  }
  return s;
}

function encodeShareStateCompact(allTypeState) {
  const allDates = [];
  Object.values(allTypeState || {}).forEach((state) => {
    Object.values(state || {}).forEach((entry) => {
      allDates.push(...normalizeCheckEntry(entry));
    });
  });

  if (allDates.length === 0) {
    return '';
  }

  allDates.sort();
  const base = allDates[0];

  const typeBlocks = Object.entries(allTypeState || {})
    .map(([type, state]) => {
      const entries = Object.entries(state || {})
        .map(([key, entry]) => {
          const dates = normalizeCheckEntry(entry);
          if (dates.length === 0) {
            return '';
          }
          const offs = dates
            .map((d) => diffDaysYmd(base, d).toString(36))
            .join('.');
          return `${encodeCheckKeyCompact(key)}@${offs}`;
        })
        .filter(Boolean)
        .join(';');

      if (!entries) {
        return '';
      }
      return `${type}~${entries}`;
    })
    .filter(Boolean)
    .join('#');

  if (!typeBlocks) {
    return '';
  }
  return `v3|b:${base}|d:${typeBlocks}`;
}

function decodeShareStateCompact(raw) {
  const text = String(raw || '');
  if (!text.startsWith('v3|')) {
    return null;
  }

  const parts = text.split('|');
  const base = (parts.find((p) => p.startsWith('b:')) || '').slice(2);
  const data = (parts.find((p) => p.startsWith('d:')) || '').slice(2);
  if (!base || !data) {
    return {};
  }

  const root = {};
  data.split('#').forEach((typeBlock) => {
    const i = typeBlock.indexOf('~');
    if (i <= 0) {
      return;
    }
    const type = typeBlock.slice(0, i);
    const body = typeBlock.slice(i + 1);
    if (!TRAINING_TYPES.includes(type)) {
      return;
    }

    const state = {};
    body.split(';').forEach((entry) => {
      const j = entry.indexOf('@');
      if (j <= 0) {
        return;
      }
      const key = decodeCheckKeyCompact(entry.slice(0, j));
      const offStr = entry.slice(j + 1);
      const dates = offStr
        .split('.')
        .map((o) => parseInt(o, 36))
        .filter((n) => Number.isFinite(n) && n >= 0)
        .map((n) => addDaysToYmd(base, n));
      const normalized = normalizeCheckEntry(dates);
      if (normalized.length > 0) {
        state[key] = normalized;
      }
    });

    if (Object.keys(state).length > 0) {
      root[type] = state;
    }
  });

  return root;
}

function normalizeCheckEntry(entry) {
  if (Array.isArray(entry)) {
    const uniq = Array.from(new Set(entry.filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d))));
    uniq.sort();
    return uniq;
  }
  if (typeof entry === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry)) {
    return [entry];
  }
  return [];
}

function hasCheckOnDay(entry, day) {
  return normalizeCheckEntry(entry).includes(day);
}

function getLatestCheckDate(entry) {
  const dates = normalizeCheckEntry(entry);
  return dates.length > 0 ? dates[dates.length - 1] : '';
}

function getCheckCountForEntry(entry) {
  return normalizeCheckEntry(entry).length;
}

function getAllDatesFromState(state) {
  return Object.values(state || {}).flatMap((entry) => normalizeCheckEntry(entry));
}

function decodeViewerData() {
  if (!isViewer || !encodedViewerPayload) {
    return {};
  }
  try {
    const normalized = encodedViewerPayload + '='.repeat((4 - (encodedViewerPayload.length % 4)) % 4);
    const raw = decodeURIComponent(escape(atob(
      normalized.replace(/-/g, '+').replace(/_/g, '/')
    )));

    // New format v2: JSON { v: 2, data: { type: { week-idx: date[] } } }
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.data && typeof parsed.data === 'object') {
        return parsed.data;
      }
    } catch {
      // fall through to legacy format
    }

    // Compact format v3: diff+key compressed text
    const compact = decodeShareStateCompact(raw);
    if (compact) {
      return compact;
    }

    // Legacy format: "week-1-0:YYYY-MM-DD|..." for one type
    const legacy = Object.fromEntries(
      raw.split('|')
        .filter((entry) => entry.includes(':'))
        .map((entry) => {
          const i = entry.indexOf(':');
          return [entry.slice(0, i), entry.slice(i + 1)];
        })
    );
    return { [currentType]: legacy };
  } catch (e) {
    console.warn('share URL decode error', e);
    return {};
  }
}

function migrateLegacyState() {
  const root = getRootState();
  let changed = false;

  TRAINING_TYPES.forEach((type) => {
    const legacyKey = `commu-checker-${type}-history`;
    let legacyData = {};
    try {
      legacyData = JSON.parse(localStorage.getItem(legacyKey) || '{}');
    } catch {
      legacyData = {};
    }

    if (!legacyData || typeof legacyData !== 'object' || Object.keys(legacyData).length === 0) {
      return;
    }

    const merged = {
      ...legacyData,
      ...(root[type] && typeof root[type] === 'object' ? root[type] : {}),
    };
    root[type] = merged;
    changed = true;
  });

  if (changed) {
    saveRootState(root);
  }
}

function renderSummaryContent() {
  const content = document.getElementById('type-content');
  const subjectChecks = getOrderedTypes().map((type) => {
    const isChecked = enrolledTypes.includes(type);
    const checked = isChecked ? 'checked' : '';
    const disabled = isViewer ? 'disabled' : '';
    return `
      <label class="subject-item">
        <input type="checkbox" class="subject-check" value="${type}" ${checked} ${disabled}>
        <span>${buildTypeDisplayText(type)}</span>
      </label>
    `;
  }).join('');

  content.innerHTML = `
    <section class="summary-board">
      <div class="summary-card summary-subjects">
        <div class="summary-title">受講科目</div>
        <div class="summary-sub">チェックで増減できます</div>
        <div class="subject-list">${subjectChecks}</div>
      </div>
      <div class="summary-card summary-kpi">
        <div class="summary-title">本日目標</div>
        <div class="summary-num" id="summary-target">0</div>
      </div>
      <div class="summary-card summary-kpi">
        <div class="summary-title">本日チェック</div>
        <div class="summary-num" id="summary-today">0</div>
      </div>
      <div class="summary-card summary-kpi">
        <div class="summary-title">累計チェック</div>
        <div class="summary-num" id="summary-total">0</div>
      </div>
      <div class="summary-card summary-heatmap">
        <div class="heatmap-header">
          <div class="heatmap-title">📅 90日のチェック記録（結合）</div>
          <div class="heatmap-streak" id="heatmap-streak" style="display:none"></div>
        </div>
        <div class="heatmap-scroll">
          <div class="heatmap-grid" id="heatmap-grid"></div>
        </div>
        <div class="heatmap-footer">
          <div class="heatmap-total" id="heatmap-total"></div>
          <div class="heatmap-legend">
            <span>少ない</span>
            <div class="heatmap-legend-cell" style="background:#EBEBEB"></div>
            <div class="heatmap-legend-cell" style="background:#9BE9C4"></div>
            <div class="heatmap-legend-cell" style="background:#40C28A"></div>
            <div class="heatmap-legend-cell" style="background:#1D9E75"></div>
            <div class="heatmap-legend-cell" style="background:#0e7a58"></div>
            <span>多い</span>
          </div>
        </div>
      </div>
      <div class="summary-card summary-target-list-card">
        <div class="summary-title">チェック対象一覧</div>
        <div class="summary-sub">各科目の累計チェック回数</div>
        <div class="summary-target-list" id="summary-target-list"></div>
      </div>
    </section>
  `;

  content.querySelectorAll('.subject-check').forEach((el) => {
    el.addEventListener('change', () => {
      const type = String(el.value || '').toLowerCase();
      if (!isTrainingType(type)) {
        return;
      }

      if (el.checked) {
        if (!enrolledTypes.includes(type)) {
          enrolledTypes.push(type);
        }
      } else {
        enrolledTypes = enrolledTypes.filter((t) => t !== type);
      }
      enrolledTypes = sanitizeTypeList(enrolledTypes);
      saveSubjects(enrolledTypes);

      if (!enrolledTypes.includes(currentType) && currentType !== SUMMARY_TAB) {
        currentType = SUMMARY_TAB;
      }

      buildTypeMenu();
      syncMenuActive();
      renderSummaryStats();
    });
  });
}

function renderSummaryStats() {
  const activeDay = today();
  const orderedEnrolled = sortTypesForSummary(enrolledTypes);
  const merged = buildMergedState(orderedEnrolled);
  const todayDone = orderedEnrolled.reduce((sum, type) => sum + getTodayCountByType(type), 0);
  const todayTarget = orderedEnrolled.reduce((sum, type) => sum + getTodayTargetByType(type, activeDay), 0);
  const perTypeTotals = orderedEnrolled.map((type) => {
    const state = getStateForType(type);
    const total = Object.values(state).reduce((sum, entry) => sum + getCheckCountForEntry(entry), 0);
    return { type, total };
  });
  const totalChecks = perTypeTotals.reduce((sum, row) => sum + row.total, 0);

  const targetEl = document.getElementById('summary-target');
  const todayEl = document.getElementById('summary-today');
  const totalEl = document.getElementById('summary-total');
  if (targetEl) {
    targetEl.textContent = String(todayTarget);
  }
  if (todayEl) {
    todayEl.textContent = String(todayDone);
  }
  if (totalEl) {
    totalEl.textContent = String(totalChecks);
  }

  const listEl = document.getElementById('summary-target-list');
  if (listEl) {
    if (perTypeTotals.length === 0) {
      listEl.innerHTML = '<div class="summary-target-row empty">受講科目が未選択です</div>';
    } else {
      listEl.innerHTML = perTypeTotals.map((row) => {
        const state = getStateForType(row.type);
        const checkEntries = getCheckEntriesByType(row.type);
        const trendCounts = checkEntries.slice(0, 29).map((entry) => getCheckCountForEntry(state[entry.key]));
        const itemsHtml = checkEntries.length === 0
          ? '<div class="summary-target-item empty">チェック項目が見つかりません</div>'
          : checkEntries.map((entry) => {
              const count = getCheckCountForEntry(state[entry.key]);
              const toneClass = getCountToneClass(count);
              const checkedToday = hasCheckOnDay(state[entry.key], activeDay);
              const actionableClass = isViewer ? '' : ' summary-target-item-actionable';
              const todayClass = checkedToday ? ' summary-target-item-today' : '';
              const actionAttrs = isViewer
                ? ''
                : ` data-type="${row.type}" data-key="${entry.key}" role="button" tabindex="0" aria-pressed="${checkedToday ? 'true' : 'false'}"`;
              return `
              <div class="summary-target-item ${toneClass}${actionableClass}${todayClass}"${actionAttrs}>
                <span class="summary-target-item-text">${escapeHtml(entry.text)}</span>
                <span class="summary-target-item-count">${count}</span>
              </div>
            `;
            }).join('');

        return `
          <div class="summary-target-group">
            <div class="summary-target-group-head">
              <span class="summary-target-type">${buildTypeDisplayText(row.type)}</span>
              <span class="summary-target-count">${row.total} 回</span>
            </div>
            <div class="summary-target-items">${itemsHtml}</div>
            <div class="summary-target-overlay">${buildTrendOverlaySvg(trendCounts)}</div>
          </div>
        `;
      }).join('');

      if (!isViewer) {
        listEl.querySelectorAll('.summary-target-item-actionable').forEach((item) => {
          item.addEventListener('click', () => {
            const type = item.dataset.type;
            const key = item.dataset.key;
            toggleSummaryCheck(type, key, item);
          });

          item.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
              return;
            }
            event.preventDefault();
            const type = item.dataset.type;
            const key = item.dataset.key;
            toggleSummaryCheck(type, key, item);
          });
        });
      }
    }
  }

  const pct = todayTarget > 0 ? Math.round(todayDone / todayTarget * 100) : 0;
  document.getElementById('sticky-fill').style.width = `${Math.max(0, Math.min(100, pct))}%`;
  document.getElementById('sticky-pct').textContent = `${pct}%`;
  document.getElementById('sticky-label').textContent = `今日 ${todayDone} / ${todayTarget} チェック`;

  renderHeatmap(merged);
}

function applyTypeTone(type) {
  if (type === SUMMARY_TAB) {
    const root = document.documentElement;
    root.style.setProperty('--tone-d-bg', '#f2f8ff');
    root.style.setProperty('--tone-d-border', '#c7defa');
    root.style.setProperty('--tone-d-text', '#1f4e8a');
    document.title = '受講サマリー｜コミュ力診断';
    return;
  }

  const page = TRAINING_PAGES[type];
  if (!page) {
    return;
  }
  const root = document.documentElement;
  root.style.setProperty('--tone-d-bg', page.tone.bg);
  root.style.setProperty('--tone-d-border', page.tone.border);
  root.style.setProperty('--tone-d-text', page.tone.text);
  document.title = page.title;
}

function buildTypeMenu() {
  const menu = document.getElementById('type-menu');
  menu.innerHTML = '';
  const orderedEnrolled = sortTypesForSummary(enrolledTypes);

  const summaryBtn = document.createElement('button');
  summaryBtn.className = 'type-menu-btn';
  summaryBtn.textContent = 'サマリー';
  summaryBtn.dataset.type = SUMMARY_TAB;
  summaryBtn.addEventListener('click', () => {
    switchType(SUMMARY_TAB);
  });
  menu.appendChild(summaryBtn);

  orderedEnrolled.forEach((type) => {
    const page = TRAINING_PAGES[type];
    if (!page) {
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'type-menu-btn';
    btn.textContent = buildTypeMenuText(type);
    btn.dataset.type = type;
    if (page && page.tone) {
      btn.style.setProperty('--tab-bg', page.tone.bg);
      btn.style.setProperty('--tab-border', page.tone.border);
      btn.style.setProperty('--tab-text', page.tone.text);
    }
    btn.addEventListener('click', () => {
      switchType(type);
    });
    menu.appendChild(btn);
  });

  if (isViewer) {
    document.body.classList.add('viewer-mode');
    document.getElementById('viewer-banner').classList.add('show');
  }
}

function mountShareButtonToSubHeader() {
  const host = document.getElementById('subheader-share');
  if (!host) {
    return;
  }

  host.innerHTML = '';
  if (isViewer) {
    return;
  }

  const shareButton = document.getElementById('share-btn');
  if (!shareButton) {
    return;
  }

  const sourceWrap = shareButton.closest('.share-wrap');
  if (sourceWrap) {
    sourceWrap.style.display = 'none';
  }
  host.appendChild(shareButton);
}

function applyTypeGapBadge(type) {
  if (type === SUMMARY_TAB) {
    return;
  }

  const title = document.querySelector('.type-hero-title');
  if (!title) {
    return;
  }

  const existing = title.querySelector('.type-gap-badge');
  if (existing) {
    existing.remove();
  }

  const extra = normalizeGapLabel(getTypeExtraLabel(type));
  if (!extra) {
    return;
  }

  const code = resolveBadgeCode(type);
  const badge = document.createElement('span');
  badge.className = 'type-gap-badge';
  badge.textContent = code ? `(${code}- ${extra})` : `(${extra})`;
  title.appendChild(badge);
}

function mountPhaseTabsToSubHeader() {
  const host = document.getElementById('phase-menu-host');
  if (!host) {
    return;
  }

  if (currentType === SUMMARY_TAB) {
    host.innerHTML = '';
    return;
  }

  host.innerHTML = '';
  const tabs = document.querySelector('.progress-overview');
  if (tabs) {
    host.appendChild(tabs);
  }
}

function getPhaseByWeekNo(weekNo) {
  if (weekNo <= 3) {
    return 1;
  }
  if (weekNo <= 6) {
    return 2;
  }
  if (weekNo <= 9) {
    return 3;
  }
  return 4;
}

function applyThreeWeekPhaseLayout() {
  const weekBlocks = Array.from(document.querySelectorAll('.week-block[id^="week-"]'));
  if (weekBlocks.length === 0) {
    return;
  }

  const phaseMap = { 1: [], 2: [], 3: [], 4: [] };

  weekBlocks.forEach((block) => {
    const m = block.id.match(/^week-(\d+)$/);
    if (!m) {
      return;
    }
    const weekNo = Number(m[1]);

    // 9週間 + 卒業試験(WK10)に絞る
    if (weekNo > 10) {
      block.classList.add('is-archived');
      block.style.display = 'none';
      return;
    }
    block.classList.remove('is-archived');
    block.style.display = '';

    const phase = getPhaseByWeekNo(weekNo);

    block.classList.remove('phase-1', 'phase-2', 'phase-3', 'phase-4');
    block.classList.add(`phase-${phase}`);
    phaseMap[phase].push({ weekNo, block });
  });

  for (let p = 1; p <= 4; p++) {
    phaseMap[p].sort((a, b) => a.weekNo - b.weekNo);

    const heading = document.getElementById(`phase-${p}`);
    const banner = document.getElementById(`banner-${p}`);
    if (!heading || !banner || !banner.parentNode) {
      continue;
    }

    phaseMap[p].forEach(({ block }) => {
      heading.parentNode.insertBefore(block, banner);
    });
  }

  const chipWeeks = {
    1: '1〜3週',
    2: '4〜6週',
    3: '7〜9週',
    4: '10週',
  };

  const chipNames = {
    4: '卒業試験',
  };

  const headingNames = {
    1: '知る・体験',
    2: '一人で試す',
    3: '定着させる',
    4: '卒業試験',
  };

  for (let p = 1; p <= 4; p++) {
    const chip = document.getElementById(`chip-${p}`);
    if (!chip) {
      continue;
    }
    const weekLabel = chip.querySelector('.phase-chip-week');
    if (weekLabel) {
      weekLabel.textContent = chipWeeks[p];
    }
    const nameLabel = chip.querySelector('.phase-chip-name');
    if (nameLabel && chipNames[p]) {
      nameLabel.textContent = chipNames[p];
    }

    const heading = document.getElementById(`phase-${p}`);
    if (heading) {
      const tagText = `PHASE ${p}`;
      heading.innerHTML = '';
      const tag = document.createElement('span');
      tag.className = 'phase-tag';
      tag.textContent = tagText;
      heading.appendChild(tag);
      heading.appendChild(document.createTextNode(` ${headingNames[p]}（${chipWeeks[p]}）`));
    }
  }
}

function swapWeekHeadingText(weekA, weekB) {
  const aTitle = weekA.querySelector('.week-title');
  const bTitle = weekB.querySelector('.week-title');
  const aSub = weekA.querySelector('.week-sub');
  const bSub = weekB.querySelector('.week-sub');
  if (!aTitle || !bTitle || !aSub || !bSub) {
    return;
  }

  const t = aTitle.textContent;
  aTitle.textContent = bTitle.textContent;
  bTitle.textContent = t;

  const s = aSub.textContent;
  aSub.textContent = bSub.textContent;
  bSub.textContent = s;
}

function normalizeMTypeGraduationWeek() {
  if (currentType !== 'm1' && currentType !== 'm2') {
    return;
  }

  const week8 = document.getElementById('week-8');
  const week10 = document.getElementById('week-10');
  if (!week8 || !week10) {
    return;
  }

  const week8Title = week8.querySelector('.week-title');
  const week10Title = week10.querySelector('.week-title');
  if (!week8Title || !week10Title) {
    return;
  }

  // M1/M2は元データ上で卒業判定がWK8側にあるため、表示時にWK10へ寄せる
  if (week8Title.textContent.includes('卒業判定') && !week10Title.textContent.includes('卒業判定')) {
    swapWeekHeadingText(week8, week10);
  }

  const week10Num = week10.querySelector('.week-num');
  if (week10Num) {
    week10Num.textContent = 'WK 10';
  }
}

function refreshTypeMenuLabels() {
  document.querySelectorAll('.type-menu-btn').forEach((btn) => {
    const type = btn.dataset.type;
    if (!type || type === SUMMARY_TAB) {
      return;
    }
    btn.textContent = buildTypeMenuText(type);
  });
}

function syncMenuActive() {
  document.querySelectorAll('.type-menu-btn').forEach((btn) => {
    const active = btn.dataset.type === currentType;
    btn.classList.toggle('active', active);
    btn.disabled = false;
  });
}

function switchType(type) {
  if (type !== SUMMARY_TAB && !TRAINING_PAGES[type]) {
    return;
  }
  currentType = type;
  applyTypeTone(type);

  const content = document.getElementById('type-content');
  if (type === SUMMARY_TAB) {
    renderSummaryContent();
    mountPhaseTabsToSubHeader();
    mountShareButtonToSubHeader();
    weekTotals = {};
    phaseWeeks = {};
    weekOrder = [];
    totalChecks = 0;
  } else {
    content.innerHTML = TRAINING_PAGES[type].mainHtml;
    applyTypeGapBadge(type);
    mountPhaseTabsToSubHeader();
    applyThreeWeekPhaseLayout();
    normalizeMTypeGraduationWeek();
    mountShareButtonToSubHeader();

    rebuildDerivedState();
    openAllWeeks();
  }

  syncMenuActive();
  renderAll();

  if (!isViewer) {
    const query = `?type=${encodeURIComponent(currentType)}`;
    history.replaceState(null, '', `${location.pathname}${query}`);
  }
}

function openAllWeeks() {
  if (currentType === SUMMARY_TAB) {
    return;
  }

  document.querySelectorAll('.week-block[id^="week-"]').forEach((block) => {
    block.classList.add('open');
  });
}

function rebuildDerivedState() {
  weekTotals = {};
  phaseWeeks = {};
  weekOrder = [];
  totalChecks = 0;

  const weekBlocks = Array.from(document.querySelectorAll('.week-block[id^="week-"]:not(.is-archived)'));
  weekBlocks.forEach((block) => {
    const weekId = block.id;
    const count = block.querySelectorAll('.check-list .check-item').length;
    weekTotals[weekId] = count;
    weekOrder.push(weekId);
    totalChecks += count;
  });

  for (let p = 1; p <= 4; p++) {
    phaseWeeks[p] = Array.from(document.querySelectorAll(`.week-block.phase-${p}`))
      .map((el) => el.id);
  }
}

function getActiveState() {
  if (currentType === SUMMARY_TAB) {
    return buildMergedState(enrolledTypes);
  }

  if (isViewer) {
    const state = viewerRootState[currentType];
    return state && typeof state === 'object' ? cleanOldChecks(state) : {};
  }
  return getStateForType(currentType);
}

function renderAll() {
  if (currentType === SUMMARY_TAB) {
    refreshTypeMenuLabels();
    renderSummaryStats();
    return;
  }

  const state = getActiveState();
  refreshTypeMenuLabels();
  const todayStr = today();
  const activeDay = (() => {
    if (!isViewer) {
      return todayStr;
    }
    const dates = getAllDatesFromState(state).sort();
    return dates.length ? dates[dates.length - 1] : todayStr;
  })();

  let dayDone = 0;

  Object.keys(weekTotals).forEach((weekId) => {
    let weekDayDone = 0;

    for (let i = 0; i < weekTotals[weekId]; i++) {
      const key = checkKey(weekId, i);
      const entry = state[key];
      const item = document.querySelector(`#checks-${weekId} .check-item:nth-child(${i + 1})`);
      const dateEl = document.getElementById(`date-${weekId}-${i}`);

      if (!item) {
        continue;
      }

      item.classList.remove('checked', 'past-checked');
      if (hasCheckOnDay(entry, activeDay)) {
        item.classList.add('checked');
        weekDayDone++;
        if (dateEl) {
          dateEl.textContent = activeDay;
        }
      } else if (getCheckCountForEntry(entry) > 0) {
        item.classList.add('past-checked');
        if (dateEl) {
          dateEl.textContent = getLatestCheckDate(entry);
        }
      } else if (dateEl) {
        dateEl.textContent = '';
      }
    }

    dayDone += weekDayDone;
    const cnt = document.getElementById(`cnt-${weekId}`);
    if (cnt) {
      cnt.textContent = `${weekDayDone}/${weekTotals[weekId]}`;
      cnt.classList.toggle('done', weekDayDone === weekTotals[weekId]);
    }
  });

  const targetPerDay = getTodayTargetCount(state, activeDay);
  const pct = targetPerDay > 0 ? Math.round(dayDone / targetPerDay * 100) : 0;
  document.getElementById('sticky-fill').style.width = `${Math.max(0, Math.min(100, pct))}%`;
  document.getElementById('sticky-pct').textContent = `${pct}%`;
  const dayLabel = isViewer ? activeDay : '今日';
  document.getElementById('sticky-label').textContent = `${dayLabel} ${dayDone} / ${targetPerDay} チェック`;

  for (let p = 1; p <= 4; p++) {
    const weeks = phaseWeeks[p] || [];
    const phaseDone = weeks.length > 0 && weeks.every((weekId) => {
      let done = 0;
      for (let i = 0; i < (weekTotals[weekId] || 0); i++) {
        if (hasCheckOnDay(state[checkKey(weekId, i)], activeDay)) {
          done++;
        }
      }
      return done >= (weekTotals[weekId] || 0);
    });

    const banner = document.getElementById(`banner-${p}`);
    const chip = document.getElementById(`chip-${p}`);
    if (banner) {
      banner.classList.toggle('visible', phaseDone);
    }
    if (chip) {
      chip.classList.toggle('done', phaseDone);
    }
  }

  const gradSection = document.getElementById('grad-section');
  if (gradSection) {
    gradSection.style.display = dayDone >= totalChecks ? 'block' : 'none';
  }

  renderHeatmap(state);
}

function getTodayTargetCount(state, activeDay) {
  const dates = getAllDatesFromState(state).sort();
  if (dates.length === 0) {
    return 3;
  }

  const first = new Date(`${dates[0]}T00:00:00`);
  const ref = new Date(`${activeDay}T00:00:00`);
  const diffDays = Math.max(0, Math.floor((ref - first) / 86400000));
  const weekNo = Math.floor(diffDays / 7) + 1;
  return weekNo * 3;
}

function toggleCheck(el, weekId, idx) {
  if (isViewer) {
    return;
  }

  const state = cleanOldChecks(getTypeState(currentType));
  const key = checkKey(weekId, idx);
  const todayStr = today();
  const history = normalizeCheckEntry(state[key]);

  if (history.includes(todayStr)) {
    const next = history.filter((d) => d !== todayStr);
    if (next.length === 0) {
      delete state[key];
    } else {
      state[key] = next;
    }
  } else {
    history.push(todayStr);
    state[key] = normalizeCheckEntry(history);
    burst(el);
  }

  saveTypeState(currentType, state);
  renderAll();

  if (hasCheckOnDay(state[key], today())) {
    autoOpenNext(weekId);
  }
}

function toggleSummaryCheck(type, key, el) {
  if (isViewer) {
    return;
  }
  if (!isTrainingType(type) || !key) {
    return;
  }

  const state = cleanOldChecks(getTypeState(type));
  const todayStr = today();
  const history = normalizeCheckEntry(state[key]);

  if (history.includes(todayStr)) {
    const next = history.filter((d) => d !== todayStr);
    if (next.length === 0) {
      delete state[key];
    } else {
      state[key] = next;
    }
  } else {
    history.push(todayStr);
    state[key] = normalizeCheckEntry(history);
    if (el) {
      burst(el);
    }
  }

  saveTypeState(type, state);
  renderAll();
}

function autoOpenNext(weekId) {
  const state = getTypeState(currentType);
  const todayStr = today();
  const total = weekTotals[weekId] || 0;

  let doneToday = 0;
  for (let i = 0; i < total; i++) {
    if (hasCheckOnDay(state[checkKey(weekId, i)], todayStr)) {
      doneToday++;
    }
  }

  if (doneToday >= total) {
    const idx = weekOrder.indexOf(weekId);
    if (idx >= 0 && idx < weekOrder.length - 1) {
      const nextId = weekOrder[idx + 1];
      const nextBlock = document.getElementById(nextId);
      if (nextBlock && !nextBlock.classList.contains('open')) {
        setTimeout(() => {
          nextBlock.classList.add('open');
          const header = nextBlock.querySelector('.week-head') || nextBlock;
          const stickyOffset = 68;
          const targetTop = Math.max(0, window.scrollY + header.getBoundingClientRect().top - stickyOffset);
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }, 350);
      }
    }
  }
}

function toggleWeek(weekId) {
  return;
}

function getStickyOffset() {
  const siteHeader = document.querySelector('.site-header');
  const subHeader = document.querySelector('.type-sidebar');
  const h1 = siteHeader ? siteHeader.getBoundingClientRect().height : 0;
  let h2 = 0;

  if (subHeader) {
    const style = window.getComputedStyle(subHeader);
    if (style.position === 'sticky') {
      h2 = subHeader.getBoundingClientRect().height;
    }
  }
  return Math.ceil(h1 + h2 + 8);
}

function scrollToPhase(p) {
  const el = document.getElementById(`phase-${p}`);
  if (el) {
    const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top - getStickyOffset());
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function buildShareURL(allTypeState) {
  const compact = encodeShareStateCompact(allTypeState);
  const payload = compact || JSON.stringify({ v: 2, data: allTypeState });
  const encoded = btoa(unescape(encodeURIComponent(payload)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${location.origin}${location.pathname}?type=${encodeURIComponent(currentType)}&check=${encoded}`;
}

function collectShareState() {
  const root = getRootState();
  const out = {};
  TRAINING_TYPES.forEach((type) => {
    const state = cleanOldChecks(root[type] && typeof root[type] === 'object' ? root[type] : {});
    if (Object.keys(state).length > 0) {
      out[type] = state;
    }
  });
  return out;
}

function shareProgress() {
  const allState = collectShareState();
  const total = Object.values(allState).reduce((sum, s) => sum + Object.keys(s).length, 0);
  if (total === 0) {
    alert('まだチェックがありません。チェックを入れてから共有してください。');
    return;
  }

  const url = buildShareURL(allState);
  const btn = document.getElementById('share-btn');

  navigator.clipboard.writeText(url).then(() => {
    btn.textContent = '✅ コピーしました！';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📤 メンターに共有';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);

    btn.textContent = '✅ コピーしました！';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📤 メンターに共有';
      btn.classList.remove('copied');
    }, 2000);
  });
}

function renderHeatmap(state) {
  const dateCounts = {};
  Object.values(state).forEach((entry) => {
    normalizeCheckEntry(entry).forEach((date) => {
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
  });

  const todayD = new Date();
  todayD.setHours(0, 0, 0, 0);

  const start = new Date(todayD);
  // 13列(91日)の最終列を常に「今週」に合わせる
  // 今週の日曜から12週前の日曜を開始日にする
  start.setDate(start.getDate() - todayD.getDay() - (12 * 7));

  const grid = document.getElementById('heatmap-grid');
  if (!grid) {
    return;
  }
  grid.innerHTML = '';

  const cursor = new Date(start);
  for (let w = 0; w < 13; w++) {
    const col = document.createElement('div');
    col.className = 'heatmap-col';
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div');
      const ds = cursor.toISOString().slice(0, 10);
      const isFuture = cursor > todayD;
      if (isFuture) {
        cell.className = 'heatmap-cell future';
      } else {
        const cnt = dateCounts[ds] || 0;
        cell.className = `heatmap-cell level-${Math.min(cnt, 4)}`;
        cell.title = `${ds}：${cnt > 0 ? `${cnt}件チェック` : 'チェックなし'}`;
      }
      col.appendChild(cell);
      cursor.setDate(cursor.getDate() + 1);
    }
    grid.appendChild(col);
  }

  let streak = 0;
  const d2 = new Date(todayD);
  while (true) {
    const ds = d2.toISOString().slice(0, 10);
    if (dateCounts[ds]) {
      streak++;
      d2.setDate(d2.getDate() - 1);
    } else {
      break;
    }
  }

  const streakEl = document.getElementById('heatmap-streak');
  if (streak > 0) {
    streakEl.textContent = `🔥 ${streak}日連続`;
    streakEl.style.display = '';
  } else {
    streakEl.style.display = 'none';
  }

  const activeDays = Object.keys(dateCounts).length;
  const totalCheckCount = Object.values(dateCounts).reduce((a, b) => a + b, 0);
  const totalEl = document.getElementById('heatmap-total');
  if (totalEl) {
    totalEl.textContent = activeDays > 0
      ? `${activeDays}日間・計${totalCheckCount}チェック`
      : 'まだチェックがありません';
  }
}

function burst(el) {
  const wrap = document.getElementById('confetti-wrap');
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#1D9E75', '#378ADD', '#E97B2A', '#E24B4A', '#9B59B6'];

  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:fixed;left:${cx}px;top:${cy}px;
      background:${colors[i % colors.length]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      width:8px;height:8px;opacity:0;pointer-events:none;z-index:9999;
    `;
    wrap.appendChild(p);

    const angle = (i / 14) * 360;
    const dist = 60 + Math.random() * 60;
    const dx = Math.cos(angle * Math.PI / 180) * dist;
    const dy = Math.sin(angle * Math.PI / 180) * dist - 20;

    p.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      {
        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0) rotate(${Math.random() * 360}deg)`,
        opacity: 0,
      },
    ], {
      duration: 600,
      easing: 'cubic-bezier(0,.9,.57,1)',
      fill: 'forwards',
    }).onfinish = () => p.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  migrateLegacyState();
  viewerRootState = decodeViewerData();
  initSubjects();

  if (currentType === SUMMARY_TAB && enrolledTypes.length === 0) {
    enrolledTypes = getOrderedTypes();
    saveSubjects(enrolledTypes);
  }
  ensureCurrentTypeInSubjects();

  if (isViewer) {
    const viewerType = (urlParams.get('type') || '').toLowerCase();
    if (viewerType === SUMMARY_TAB || TRAINING_TYPES.includes(viewerType)) {
      currentType = viewerType;
    }
  }

  buildTypeMenu();
  switchType(currentType);
});
