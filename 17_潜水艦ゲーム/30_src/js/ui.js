// ============================================================
// ui.js  UI コンポーネント（ドロー・コマンド・手札・情報表示）
// ============================================================
import { CAT, CAT_LABELS, CAT_COLORS, MAX_HAND, COMMAND_TIME_LIMIT, DIR_DELTA, rotateDir,
         VIRTUAL_MOVES, VIRTUAL_CARD_MAP } from './constants.js';
import { setCommandPreview, clearCommandPreview, renderState } from './render.js';
import { promptTarget, cancelBoardPick } from './modal.js';

let callbacks = {};  // { onDraw, onConfirm, calcFuelCost }
let selectedCards = [];  // コマンドフェーズで選択した手札uid
let selectedTargets = [];
let latestView = null;  // 最新のビュー（プレビュー更新用）

/* ============================================================
   初期化
   ============================================================ */
export function initUI(cbs) {
  callbacks = cbs;
  // ドローボタン
  document.querySelectorAll('.deck-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const deckType = btn.dataset.deck;
      if (deckType && callbacks.onDraw) callbacks.onDraw(deckType);
    });
  });
  // コマンド確定ボタン
  const confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (callbacks.onConfirm) {
        callbacks.onConfirm(selectedCards, selectedTargets);
        selectedCards = [];
        selectedTargets = [];
        confirmBtn.disabled = true;
      }
    });
  }
}

/* ============================================================
   状態更新
   ============================================================ */
export function updateUI(view) {
  if (!view) return;
  latestView = view;
  const me = view.players[view.myId];
  if (!me) return;

  // 燃料バー
  updateFuel(me);
  // 手札表示
  renderHand(me, view.phase, view);
  // プレイヤーリスト
  renderPlayerList(view);
  // デッキ残枚数
  updateDeckCounts(view.deckCounts);
  // ターンログ
  updateTurnLog(view.turnLog);
  // ドッグファイトバナー
  updateDogfightBanner(me, view);
}

/* ─── 燃料 ─── */
function updateFuel(me) {
  const fill = document.getElementById('fuel-fill');
  const label = document.getElementById('fuel-label');
  if (!fill) return;
  const used = selectedCards.reduce((sum, uid) => {
    const card = VIRTUAL_CARD_MAP[uid] || me.hand.find(c => c.uid === uid);
    return sum + (card ? card.fuel : 0);
  }, 0);
  const remaining = me.fuel - used;
  const pct = Math.max(0, (remaining / me.fuel) * 100);
  fill.style.width = pct + '%';
  fill.className = 'fuel-fill' + (pct < 30 ? ' low' : pct < 60 ? ' mid' : '');
  if (label) label.textContent = `${remaining} / ${me.fuel}`;
}

/* ─── 手札 ─── */
function renderHand(me, phase, view) {
  const container = document.getElementById('hand-area');
  if (!container) return;
  container.innerHTML = '';
  if (!me.hand) return;

  // ドローフェーズ中は手札をプレビュー表示（選択不可）
  me.hand.forEach(card => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.uid = card.uid;
    if (phase === 'draw') el.classList.add('card-preview');
    if (card.subtype === 'buff') el.classList.add('card-buff');
    if (card.subtype === 'debuff') el.classList.add('card-debuff');
    if (selectedCards.includes(card.uid)) el.classList.add('card-selected');

    const catColor = CAT_COLORS[card.cat] || '#888';
    el.style.borderColor = catColor;

    el.innerHTML = `
      <span class="card-cost">${card.fuel}</span>
      <span class="material-symbols-outlined card-icon">${card.icon}</span>
      <span class="card-name">${card.name}</span>
      ${card.desc ? `<span class="card-desc">${card.desc}</span>` : ''}
    `;

    // コマンドフェーズのみカード選択可能
    if (phase === 'command') {
      el.addEventListener('click', () => toggleCard(card, me, view || latestView));
    }

    container.appendChild(el);
  });
}

/**
 * 現在の selectedCards による移動を全て適用した仮想プレイヤー状態を返す。
 * ハープーン等の盤面ピック時に「移動後の位置」を起点にするために使う。
 */
function _getSimulatedMe(me) {
  const gs = latestView?.gridSize ?? 10;
  const cl = v => Math.max(0, Math.min(gs - 1, v));
  let vx = me.x, vy = me.y, vdir = me.dir;
  const hasHighOutput = selectedCards.some(uid => {
    const c = VIRTUAL_CARD_MAP[uid] || me.hand.find(h => h.uid === uid);
    return c?.id === 'high_output';
  });
  selectedCards.forEach((uid, i) => {
    const c = VIRTUAL_CARD_MAP[uid] || me.hand.find(h => h.uid === uid);
    if (!c) return;
    const t = selectedTargets[i] || {};
    const fwd = n => {
      const cnt = hasHighOutput ? n * 2 : n;
      const D = DIR_DELTA[vdir];
      for (let k = 0; k < cnt; k++) { vx = cl(vx + D.dx); vy = cl(vy + D.dy); }
    };
    switch (c.id) {
      case 'forward': case 'free_forward': fwd(1); break;
      case 'turbo_move': fwd(3); break;
      case 'rush': fwd(3); break;
      case 'free_turn_left':  vdir = rotateDir(vdir, -1); break;
      case 'free_turn_right': vdir = rotateDir(vdir,  1); break;
      case 'turn': vdir = t.turnDir === 'L' ? rotateDir(vdir,-1) : rotateDir(vdir,1); break;
      case 'strafe_left':  { const d=DIR_DELTA[rotateDir(vdir,-1)], n=hasHighOutput?2:1; for(let k=0;k<n;k++){vx=cl(vx+d.dx);vy=cl(vy+d.dy);} break; }
      case 'strafe_right': { const d=DIR_DELTA[rotateDir(vdir, 1)], n=hasHighOutput?2:1; for(let k=0;k<n;k++){vx=cl(vx+d.dx);vy=cl(vy+d.dy);} break; }
      case 'cruise':  { const d=DIR_DELTA[t.dir||vdir], n=hasHighOutput?2:1; for(let k=0;k<n;k++){vx=cl(vx+d.dx);vy=cl(vy+d.dy);} break; }
      case 'reverse': { vdir=rotateDir(vdir,2); const d=DIR_DELTA[vdir]; for(let k=0;k<2;k++){vx=cl(vx+d.dx);vy=cl(vy+d.dy);} break; }
      case 'escape':  { const d=DIR_DELTA[t.dir||vdir]; for(let k=0;k<4;k++){vx=cl(vx+d.dx);vy=cl(vy+d.dy);} break; }
    }
  });
  return { ...me, x: vx, y: vy, dir: vdir };
}

async function toggleCard(card, me, view) {
  // 仮想カード（←↑→固定ボタン）は選択解除させない → 常に追加扱い
  const isVirtual = !!VIRTUAL_CARD_MAP[card.uid];
  const idx = isVirtual ? -1 : selectedCards.indexOf(card.uid);
  if (idx >= 0) {
    selectedCards.splice(idx, 1);
    selectedTargets.splice(idx, 1);
  } else {
    // ターゲット入力が必要なカードの処理
    // 盤面ピック系は「選択済み移動を適用した仮想位置」を起点にする
    const target = await promptTarget(card, _getSimulatedMe(me));
    if (target === null) return; // キャンセル
    selectedCards.push(card.uid);
    selectedTargets.push(target);
  }
  // 燃料バリデーション（仮想カードも含める）
  if (callbacks.calcFuelCost) {
    const cards = selectedCards.map(uid => VIRTUAL_CARD_MAP[uid] || me.hand.find(c => c.uid === uid)).filter(Boolean);
    const cost = callbacks.calcFuelCost(cards, !!me.dogfightWith);
    if (cost > me.fuel) {
      selectedCards.pop();
      selectedTargets.pop();
    }
  }
  // 再描画
  const v = view || latestView;
  renderHand(me, 'command', v);
  _renderFreeMoves();
  updateFuel(me);
  // プレビュー更新
  _refreshPreview(me, v);
  // 確定ボタン有効化
  const btn = document.getElementById('confirm-btn');
  if (btn) btn.disabled = selectedCards.length === 0;
}
/* ─── 固定コマンドボタン（左旋回・前進・右旋回）─── */
function _setupFreeMoves(view) {
  const container = document.getElementById('free-moves-row');
  if (!container) return;
  container.classList.remove('hidden');
  container.innerHTML = '';
  const me = view.players[view.myId];
  if (!me?.alive) return;
  VIRTUAL_MOVES.forEach(card => {
    const btn = document.createElement('button');
    btn.className = 'card free-move-card';
    btn.dataset.uid = card.uid;
    btn.title = card.desc;
    btn.innerHTML = `
      <span class="card-cost">${card.fuel}</span>
      <span class="material-symbols-outlined card-icon">${card.icon}</span>
      <span class="card-name">${card.name}</span>
    `;
    btn.addEventListener('click', () => toggleCard(card, me, view));
    container.appendChild(btn);
  });
}

function _renderFreeMoves() {
  const container = document.getElementById('free-moves-row');
  if (!container) return;
  container.querySelectorAll('.free-move-card[data-uid]').forEach(btn => {
    btn.classList.toggle('card-selected', selectedCards.includes(btn.dataset.uid));
  });
}
function renderPlayerList(view) {
  const el = document.getElementById('player-list');
  if (!el) return;
  el.innerHTML = '';
  const colors = ['#00e5ff', '#ff4444', '#ffeb3b', '#4caf50', '#ab47bc', '#ff9800'];
  view.playerOrder.forEach((id, i) => {
    const p = view.players[id];
    const div = document.createElement('div');
    div.className = 'player-chip'
      + (p.alive ? '' : ' eliminated')
      + (id === view.myId ? ' is-me' : '');
    const statusIcon = !p.alive ? '✗'
      : (view.phase === 'command' ? (p.commandConfirmed ? '✓' : '…') : '');
    const hp = p.hp ?? '?';
    const hpCrit = typeof p.hp === 'number' && p.hp <= 1;
    div.innerHTML = `
      <span class="player-dot" style="background:${colors[i % colors.length]}"></span>
      <span class="player-chip-body">
        <span class="player-chip-name">${p.name}${id === view.myId ? '★' : ''}${statusIcon ? ' ' + statusIcon : ''}</span>
        <span class="player-chip-hp${hpCrit ? ' hp-crit' : ''}">HP ${hp}</span>
      </span>
    `;
    el.appendChild(div);
  });
}

/* ─── プレイヤーリスト（全員の HP を表示）─── */
function updateDeckCounts(counts) {
  if (!counts) return;
  for (const [cat, n] of Object.entries(counts)) {
    const el = document.querySelector(`.deck-btn[data-deck="${cat}"] .deck-count`);
    if (el) el.textContent = n;
  }
}

/* ─── ターンログ ─── */
function updateTurnLog(log) {
  const el = document.getElementById('turn-log');
  if (!el || !log) return;
  el.innerHTML = log.map(l => `<div class="log-line">${l}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

/* ─── ドッグファイトバナー ─── */
function updateDogfightBanner(me, view) {
  const el = document.getElementById('dogfight-banner');
  if (!el) return;
  if (me.dogfightWith) {
    const other = view.players[me.dogfightWith];
    el.classList.remove('hidden');
    el.innerHTML = `⚠ ドッグファイトモード ⚠<br><small>${other?.name || '不明'} と至近距離で交戦中</small>`;
  } else {
    el.classList.add('hidden');
  }
}

/* ============================================================
   フェーズ表示系
   ============================================================ */
export function showPhase(phase, turn) {
  const el = document.getElementById('phase-display');
  if (!el) return;
  const labels = {
    draw:    `ターン ${turn} — 戦術フェーズ（補充）`,
    command: `ターン ${turn} — 戦術フェーズ（確定）`,
    action:  `ターン ${turn} — 行動フェーズ`,
    ended: 'ゲーム終了',
  };
  el.textContent = labels[phase] || phase;
}

export function showPhaseOverlay(title, sub) {
  const el = document.getElementById('phase-overlay');
  if (!el) return;
  el.querySelector('.phase-overlay-title').textContent = title;
  el.querySelector('.phase-overlay-sub').textContent = sub || '';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

export function enableDraw(view) {
  cancelBoardPick(); // 前フェーズの未完了ボードピックをキャンセル
  const wrap    = document.getElementById('deck-row-wrap');
  const waitEl  = document.getElementById('draw-waiting');
  const freeRow = document.getElementById('free-moves-row');
  if (!wrap) return;
  const me        = view.players[view.myId];
  const remaining = me?.drawsLeft ?? 0;

  // フリームーブ行を隠す
  if (freeRow) freeRow.classList.add('hidden');

  if (remaining > 0) {
    wrap.classList.remove('hidden');
    if (waitEl) waitEl.classList.add('hidden');
  } else {
    wrap.classList.add('hidden');
    if (waitEl) {
      waitEl.classList.remove('hidden');
      const waitingCount = view.playerOrder.filter(
        id => id !== view.myId && view.players[id]?.alive && (view.players[id]?.drawsLeft ?? 0) > 0
      ).length;
      waitEl.textContent = waitingCount > 0
        ? `他${waitingCount}名の補充待ち…`
        : '補充完了 — 待機中…';
    }
  }
  const numEl = document.getElementById('draw-count-num');
  if (numEl) numEl.textContent = remaining;
  document.querySelectorAll('.deck-btn').forEach(btn => {
    btn.disabled = remaining <= 0;
  });
}

export function enableCommand(view, isNewPhase = false) {
  const area = document.getElementById('command-area');
  if (!area) return;
  area.classList.remove('hidden');
  // ドロー山札・待機表示を非表示
  const deckWrap = document.getElementById('deck-row-wrap');
  if (deckWrap) deckWrap.classList.add('hidden');
  const waitEl = document.getElementById('draw-waiting');
  if (waitEl) waitEl.classList.add('hidden');
  // 新規フェーズ突入時のみ初期化（state update による再呼び出しでは選択をリセットしない）
  if (isNewPhase) {
    selectedCards = [];
    selectedTargets = [];
    clearCommandPreview();
    _setupFreeMoves(view);
    // タイマー表示リセット
    const timer = document.getElementById('timer-display');
    if (timer) timer.textContent = COMMAND_TIME_LIMIT;
  }
  // 確定ボタン / 待機表示 切り替え
  const btn = document.getElementById('confirm-btn');
  const cmdWait = document.getElementById('cmd-waiting');
  const me = view.players[view.myId];
  if (me?.commandConfirmed) {
    if (btn) btn.classList.add('hidden');
    if (cmdWait) {
      cmdWait.classList.remove('hidden');
      const remaining = view.playerOrder.filter(
        id => id !== view.myId && view.players[id]?.alive && !view.players[id]?.commandConfirmed
      ).length;
      cmdWait.textContent = remaining > 0
        ? `他${remaining}名のコマンド確定待ち…`
        : '全員確定 — 実行中…';
    }
  } else {
    if (btn) { btn.classList.remove('hidden'); btn.disabled = !me?.alive; }
    if (cmdWait) cmdWait.classList.add('hidden');
  }
  // （selectedCards / selectedTargets / preview / freeMoves は isNewPhase 時のみ初期化済み）
}

/* ============================================================
   コマンドプレビュー計算
   ============================================================ */
function _refreshPreview(me, view) {
  if (!view || view.phase !== 'command') { clearCommandPreview(); return; }
  const steps = _computePreviewSteps(me, view);
  setCommandPreview(steps.length ? steps : null);
  renderState(view);
}

function _computePreviewSteps(me, view) {
  const gs = view?.gridSize ?? 10;
  const clamp = v => Math.max(0, Math.min(gs - 1, v));
  const steps = [];
  let vx = me.x, vy = me.y, vdir = me.dir;

  // high_output が含まれていれば移動距離 2 倍
  const hasHighOutput = selectedCards.some(uid => {
    const c = VIRTUAL_CARD_MAP[uid] || me.hand.find(h => h.uid === uid);
    return c?.id === 'high_output';
  });

  // 前進 n マスのヘルパー
  const pushFwd = (n) => {
    const count = hasHighOutput ? n * 2 : n;
    for (let k = 0; k < count; k++) {
      const D = DIR_DELTA[vdir];
      const nx = clamp(vx + D.dx), ny = clamp(vy + D.dy);
      steps.push({ type: 'path', x0: vx, y0: vy, x1: nx, y1: ny });
      vx = nx; vy = ny;
    }
  };

  selectedCards.forEach((uid, i) => {
    const card = VIRTUAL_CARD_MAP[uid] || me.hand.find(c => c.uid === uid);
    if (!card) return;
    const t = selectedTargets[i] || {};
    const D = DIR_DELTA[vdir];

    switch (card.id) {
      case 'free_forward':  pushFwd(1); break;
      case 'turbo_move':    pushFwd(3); break;
      case 'strafe_left': {
        const sdL = DIR_DELTA[rotateDir(vdir, -1)];
        const nL = hasHighOutput ? 2 : 1;
        for (let k = 0; k < nL; k++) {
          const nx = clamp(vx + sdL.dx), ny = clamp(vy + sdL.dy);
          steps.push({ type: 'path', x0: vx, y0: vy, x1: nx, y1: ny });
          vx = nx; vy = ny;
        }
        break;
      }
      case 'strafe_right': {
        const sdR = DIR_DELTA[rotateDir(vdir, 1)];
        const nR = hasHighOutput ? 2 : 1;
        for (let k = 0; k < nR; k++) {
          const nx = clamp(vx + sdR.dx), ny = clamp(vy + sdR.dy);
          steps.push({ type: 'path', x0: vx, y0: vy, x1: nx, y1: ny });
          vx = nx; vy = ny;
        }
        break;
      }
      case 'free_turn_left':
        steps.push({ type: 'turn', x: vx, y: vy, dir: 'L' });
        vdir = rotateDir(vdir, -1); break;
      case 'free_turn_right':
        steps.push({ type: 'turn', x: vx, y: vy, dir: 'R' });
        vdir = rotateDir(vdir,  1); break;
      case 'high_output': break; // 効果はフラグで反映済み
      case 'cruise': {
        const cd = DIR_DELTA[t.dir || vdir];
        const n = hasHighOutput ? 2 : 1;
        for (let k = 0; k < n; k++) {
          const nx = clamp(vx + cd.dx), ny = clamp(vy + cd.dy);
          steps.push({ type: 'path', x0: vx, y0: vy, x1: nx, y1: ny });
          vx = nx; vy = ny;
        }
        break;
      }
      case 'reverse': {
        const Rd = DIR_DELTA[rotateDir(vdir, 2)];
        for (let k = 0; k < 2; k++) {
          const nx = clamp(vx + Rd.dx), ny = clamp(vy + Rd.dy);
          steps.push({ type: 'path', x0: vx, y0: vy, x1: nx, y1: ny });
          vx = nx; vy = ny;
        }
        break;
      }
      case 'escape': {
        const Ed = DIR_DELTA[t.dir || vdir];
        for (let k = 0; k < 4; k++) {
          const nx = clamp(vx + Ed.dx), ny = clamp(vy + Ed.dy);
          steps.push({ type: 'path', x0: vx, y0: vy, x1: nx, y1: ny });
          vx = nx; vy = ny;
        }
        break;
      }
      case 'passive_sonar':
        steps.push({ type: 'sonar', x: vx, y: vy, r: 3 }); break;
      case 'active_sonar':
        steps.push({ type: 'sonar', x: vx, y: vy, r: 5 }); break;
      case 'hydrophone':
        steps.push({ type: 'sonar', x: vx, y: vy, r: 6 }); break;
      case 'torpedo': {
        const Td = DIR_DELTA[vdir]; // 常に現在向きでプレビュー
        steps.push({ type: 'attack', x0: vx, y0: vy,
          x1: clamp(vx + Td.dx * 6), y1: clamp(vy + Td.dy * 6) });
        break;
      }
      case 'harpoon': {
        if (t.x != null) {
          const ddx = t.x - vx, ddy = t.y - vy;
          let hDir;
          if (Math.abs(ddx) >= Math.abs(ddy)) hDir = ddx >= 0 ? 'E' : 'W';
          else hDir = ddy >= 0 ? 'S' : 'N';
          const lDir = rotateDir(vdir, -1), rDir = rotateDir(vdir, 1);
          if (hDir === lDir || hDir === rDir) {
            const r = Math.min(3, Math.max(Math.abs(ddx), Math.abs(ddy)));
            const HD = DIR_DELTA[hDir];
            steps.push({ type: 'attack', x0: vx, y0: vy,
              x1: clamp(vx + HD.dx * r), y1: clamp(vy + HD.dy * r) });
          }
        }
        break;
      }
      case 'guided_torpedo': {
        if (t.guidedPath?.length) {
          const seg = t.guidedPath[0];
          const Sd = DIR_DELTA[seg.dir];
          steps.push({ type: 'attack', x0: vx, y0: vy,
            x1: clamp(vx + Sd.dx * (seg.steps || 3)),
            y1: clamp(vy + Sd.dy * (seg.steps || 3)) });
        }
        break;
      }
      case 'barrage': {
        steps.push({ type: 'attack', x0: vx, y0: vy,
          x1: clamp(vx + D.dx * 5), y1: clamp(vy + D.dy * 5) });
        break;
      }
      case 'depth_charge':
        if (t.x != null) steps.push({ type: 'sonar', x: t.x, y: t.y, r: 1.5 }); break;
      case 'mine':
      case 'tracking_buoy':
        if (t.x != null) steps.push({ type: 'target', x: t.x, y: t.y }); break;
    }
  });
  return steps;
}

export function showActionEvents(events, view) {
  cancelBoardPick(); // コマンドフェーズ中の未完了ボードピックをキャンセル
  // コマンドフェーズの選択状態をクリア（タイマー強制確定時はボタン未押下）
  selectedCards = [];
  selectedTargets = [];
  // アクションフェーズ中のアニメ・ログ
  const area = document.getElementById('command-area');
  if (area) area.classList.add('hidden');
  const freeRow = document.getElementById('free-moves-row');
  if (freeRow) freeRow.classList.add('hidden');
  if (events && events.length > 0) {
    const log = events
      .filter(e => e.public || e.to === view.myId)
      .map(e => eventToText(e, view))
      .filter(Boolean);
    updateTurnLog(log);
  }
}

function eventToText(e, view) {
  const name = (pid) => view.players[pid]?.name || '不明';
  switch (e.type) {
    case 'damage': return `${name(e.pid)} が ${e.source} で ${e.dmg} ダメージ！ (HP:${e.hp})`;
    case 'explosion': return `(${e.x},${e.y}) で爆発！`;
    case 'eliminated': return `${name(e.pid)} が撃沈されました`;
    case 'sonar': return e.public ? `ソナー検知波を観測 付近 (${e.cx},${e.cy})` : `ソナースキャン完了`;
    case 'supply': return `補給ポイント (${e.supplyType}) を獲得`;
    case 'dogfight_start': return `ドッグファイト突入！`;
    case 'dogfight_end': return `ドッグファイト終了`;
    case 'buff': return `バフ発動: ${e.card}`;
    case 'repair': return `修理完了 HP:${e.hp}`;
    case 'emp': return `EMPパルス発動！ 付近 (${e.cx},${e.cy})`;
    case 'attack_leak': return e.public ? `攻撃音を検知！ (${e.card})` : null;
    case 'sound_leak': return e.public ? `音響を検知` : null;
    default: return null;
  }
}

export function showTurnSummary(view) {
  // ターンサマリのオーバーレイ表示 (簡易)
  showPhase(view.phase, view.turn);
}

/* ============================================================
   行動フェーズ「現在実行中アクション」カード表示
   ============================================================ */
const _AE_ICON = {
  move_simple:   'arrow_upward',
  move_card:     'directions_boat',
  torpedo:       'rocket_launch',
  damage:        'flash_on',
  eliminated:    'cancel',
  sonar:         'radar',
  depth_charge:  'explosion',
  explosion:     'local_fire_department',
  supply:        'bolt',
  dogfight:      'sports_mma',
  repair:        'build',
  default:       'info',
};

function _actionEventInfo(ev, view) {
  const pname = (pid) => view?.players?.[pid]?.name ?? '';
  switch (ev.type) {
    case 'move': {
      const simpleLabels = { free_forward: '前進', free_turn_left: '左旋回', free_turn_right: '右旋回' };
      if (simpleLabels[ev.card]) {
        return { icon: _AE_ICON.move_simple, label: simpleLabels[ev.card], sub: pname(ev.pid), color: '#4fc3f7' };
      }
      const labels = {
        turbo_move: 'ターボ移動', high_output: '高出力推進',
        strafe_left: '左横移動', strafe_right: '右横移動',
        cruise: '巡航', reverse: '反転機動', escape: '緊急離脱',
      };
      return { icon: _AE_ICON.move_card, label: labels[ev.card] || ev.card, sub: pname(ev.pid), color: '#00e5ff' };
    }
    case 'torpedo_fire': {
      const labels = { torpedo: '魚雷発射', harpoon: 'ハープーン発射', guided_torpedo: '誘導魚雷発射', barrage: '連装魚雷', recon_torpedo: '偵察魚雷' };
      return { icon: _AE_ICON.torpedo, label: labels[ev.card] || '魚雷発射', sub: `${pname(ev.pid)} が発射！`, color: '#ffaa00' };
    }
    case 'damage':
      return { icon: _AE_ICON.damage, label: `-${ev.dmg} ダメージ！`, sub: `${pname(ev.pid)}  HP → ${ev.hp}`, color: '#ff4444' };
    case 'eliminated':
      return { icon: _AE_ICON.eliminated, label: '撃沈！', sub: pname(ev.pid), color: '#ff2255' };
    case 'sonar': {
      const labels = { passive_sonar: 'パッシブソナー', active_sonar: 'アクティブソナー', hydrophone: '水中マイク', recon_torpedo: '偵察魚雷' };
      return { icon: _AE_ICON.sonar, label: labels[ev.card] || 'ソナー', sub: pname(ev.pid), color: '#00ff88' };
    }
    case 'attack_leak':
      if (ev.card !== 'depth_charge') return null;
      return { icon: _AE_ICON.depth_charge, label: '広域爆雷！', sub: `爆発半径 ${ev.r ?? 2} マス`, color: '#ff7700' };
    case 'explosion':
      return { icon: _AE_ICON.explosion, label: '爆発！', sub: `(${ev.x}, ${ev.y})`, color: '#ff6600' };
    case 'supply':
      return { icon: _AE_ICON.supply, label: '補給獲得！', sub: pname(ev.pid), color: '#ffeb3b' };
    case 'dogfight_start':
      return { icon: _AE_ICON.dogfight, label: 'ドッグファイト！', sub: null, color: '#ff0080' };
    case 'repair':
      return { icon: _AE_ICON.repair, label: '修理完了', sub: `HP → ${ev.hp}`, color: '#4caf50' };
    default:
      return null;
  }
}

export function showCurrentAction(ev, view) {
  const el = document.getElementById('action-event-card');
  if (!el) return;
  if (!ev) { el.classList.add('hidden'); return; }

  const info = _actionEventInfo(ev, view);
  if (!info) { el.classList.add('hidden'); return; }

  document.getElementById('ae-icon').textContent  = info.icon;
  document.getElementById('ae-label').textContent = info.label;
  document.getElementById('ae-sub').textContent   = info.sub || '';
  el.style.setProperty('--ae-color', info.color || 'var(--accent-cyan)');

  // アニメーション再起動（animation を一旦外してから再付与）
  el.classList.remove('hidden');
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

export function showGameOver(winnerId, view) {
  const overlay = document.getElementById('game-over-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  const resultLine = winnerId === null
    ? '<p class="winner-name">引き分け — 相打ち</p>'
    : `<p class="winner-name">${view?.players[winnerId]?.name || '不明'} の勝利！</p>`;
  overlay.innerHTML = `
    <div class="game-over-content">
      <h2>ゲーム終了</h2>
      ${resultLine}
      <button onclick="location.reload()" class="btn btn-primary">ロビーに戻る</button>
    </div>
  `;
}
