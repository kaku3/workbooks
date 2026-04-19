// ============================================================
// ui.js  v5.0 パネル操作制 UI
// ============================================================
import { OPS, COMMAND_TIME_LIMIT, DIR_DELTA, rotateDir, GRID_SIZE } from './constants.js';
import { setCommandPreview, clearCommandPreview, renderState } from './render.js';
import { promptTarget, cancelBoardPick } from './modal.js';

let callbacks = {};         // { onConfirm, calcTimeCost }
let selectedOps = [];       // { op: string, target: {} }[]
let _commandConfirmed = false; // 確定後〜アクション開始前: キュー表示をロック
let latestView = null;
let _sonarToggleActive = false; // ソナートグルモード中フラグ

/* ============================================================
   初期化
   ============================================================ */
export function initUI(cbs) {
  callbacks = cbs;
  const confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (callbacks.onConfirm) {
        _deactivateSonarToggle(); // ソナートグルを必ず解除
        callbacks.onConfirm(selectedOps.map(s => s.op), selectedOps.map(s => s.target));
        // selectedOps はアクションフェーズ開始（enableCommand isNewPhase=true）まで保持。
        // キャンバスプレビューも保持して、自分が確定した内容が見えるようにする。
        _commandConfirmed = true;
        confirmBtn.disabled = true;
        _showWaiting();
        _renderQueue(); // ロックモードで再描画（✕ボタン非表示）
        // clearCommandPreview() はここでは呼ばない → プレビューを維持
        if (latestView) renderState(latestView);
        updateUI(latestView);
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
  _updateTimeBar(me);
  _renderInventory(me);
  _renderPlayerList(view);
  _updateDogfightBanner(me, view);
  _updateTurnLog(view.turnLog);
}

/* ─── 単位時間バー ─── */
function _updateTimeBar(me) {
  const fill  = document.getElementById('time-fill');
  const label = document.getElementById('time-label');
  if (!fill) return;
  const used = selectedOps.reduce((sum, s) => sum + (OPS[s.op]?.cost ?? 0), 0);
  const remaining = (me.time ?? 10) - used;
  const pct = Math.max(0, (remaining / (me.maxTime ?? 10)) * 100);
  fill.style.width = pct + '%';
  fill.className = 'time-fill' + (pct < 30 ? ' low' : pct < 60 ? ' mid' : '');
  if (label) label.textContent = `${remaining} / ${me.maxTime ?? 10}`;
}

/* ─── 在庫表示 ─── */
function _renderInventory(me) {
  if (!me.inventory) return;
  // 在庫数バッジを更新し、在庫0はグレーアウト
  ['torpedo','guided','shotgun','decoy','mine','chaff','armor'].forEach(key => {
    const cnt = me.inventory[key] ?? 0;
    const el = document.querySelector(`.op-btn[data-op="${_invKeyToOpId(key)}"]`);
    if (!el) return;
    const badge = el.querySelector('.inv-count');
    if (badge) badge.textContent = `×${cnt}`;
    el.classList.toggle('depleted', cnt <= 0);
  });

  // 操作ボタンのタイムコスト検証（残り時間で押せないものをdisabled）
  _validateButtons(me);
}

function _invKeyToOpId(invKey) {
  return invKey; // OPS key == invKey for inventory ops
}

function _validateButtons(me) {
  const used = selectedOps.reduce((sum, s) => sum + (OPS[s.op]?.cost ?? 0), 0);
  const remaining = (me.time ?? 10) - used;

  document.querySelectorAll('.op-btn[data-op]').forEach(btn => {
    const opId = btn.dataset.op;
    const opDef = OPS[opId];
    if (!opDef) return;
    const cnt = opDef.invKey ? (me.inventory?.[opDef.invKey] ?? 0) : Infinity;
    const canAfford = opDef.cost <= remaining;
    const hasInv = cnt > 0 || !opDef.invKey;
    btn.disabled = !canAfford || !hasInv;
    btn.classList.toggle('cant-afford', !canAfford && hasInv);
  });
}

/* ─── コマンドプレビュー更新 ─── */
function _updateCommandPreview() {
  if (!latestView) return;
  const me = latestView.players[latestView.myId];
  if (!me || !me.alive) { clearCommandPreview(); return; }
  if (selectedOps.length === 0) {
    clearCommandPreview();
  } else {
    setCommandPreview(_buildCommandPreview(selectedOps, me));
  }
  renderState(latestView);
}

/**
 * キューに積まれた操作を順にシミュレートし、canvas プレビューステップを生成。
 * @param {{ op: string, target: object }[]} ops
 * @param {{ x: number, y: number, dir: string }} me
 */
function _buildCommandPreview(ops, me) {
  const steps = [];
  let sx = me.x, sy = me.y, sdir = me.dir;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  for (const { op, target } of ops) {
    switch (op) {
      case 'forward': {
        const d = DIR_DELTA[sdir];
        const nx = clamp(sx + d.dx, 0, GRID_SIZE - 1);
        const ny = clamp(sy + d.dy, 0, GRID_SIZE - 1);
        steps.push({ type: 'path', x0: sx, y0: sy, x1: nx, y1: ny });
        sx = nx; sy = ny;
        break;
      }
      case 'turn_left': {
        steps.push({ type: 'turn', x: sx, y: sy, dir: 'L', facing: sdir });
        sdir = rotateDir(sdir, -1);
        break;
      }
      case 'turn_right': {
        steps.push({ type: 'turn', x: sx, y: sy, dir: 'R', facing: sdir });
        sdir = rotateDir(sdir, 1);
        break;
      }
      case 'strafe_l': {
        const d = DIR_DELTA[rotateDir(sdir, -1)];
        const nx = clamp(sx + d.dx, 0, GRID_SIZE - 1);
        const ny = clamp(sy + d.dy, 0, GRID_SIZE - 1);
        steps.push({ type: 'path', x0: sx, y0: sy, x1: nx, y1: ny });
        sx = nx; sy = ny;
        break;
      }
      case 'strafe_r': {
        const d = DIR_DELTA[rotateDir(sdir, 1)];
        const nx = clamp(sx + d.dx, 0, GRID_SIZE - 1);
        const ny = clamp(sy + d.dy, 0, GRID_SIZE - 1);
        steps.push({ type: 'path', x0: sx, y0: sy, x1: nx, y1: ny });
        sx = nx; sy = ny;
        break;
      }
      case 'sonar': {
        if (target && typeof target.x === 'number') {
          steps.push({ type: 'sonar', x: target.x, y: target.y, r: 1 });
        }
        break;
      }
      case 'torpedo': {
        if (target && typeof target.x === 'number') {
          steps.push({ type: 'attack', x0: sx, y0: sy, x1: target.x, y1: target.y });
        }
        break;
      }
      case 'guided': {
        if (target && typeof target.x === 'number') {
          steps.push({ type: 'guided_preview', x: target.x, y: target.y });
        }
        break;
      }
      case 'shotgun': {
        // 前方扇状: 前進方向 + 左直交 + 右直交 、各 3 マス
        const dF  = DIR_DELTA[sdir];
        const dL  = DIR_DELTA[rotateDir(sdir, -1)];
        const dR  = DIR_DELTA[rotateDir(sdir,  1)];
        steps.push({
          type: 'attack',
          x0: sx, y0: sy,
          x1: clamp(sx + dF.dx * 3, 0, GRID_SIZE - 1),
          y1: clamp(sy + dF.dy * 3, 0, GRID_SIZE - 1),
        });
        steps.push({
          type: 'attack',
          x0: sx, y0: sy,
          x1: clamp(sx + dL.dx * 3, 0, GRID_SIZE - 1),
          y1: clamp(sy + dL.dy * 3, 0, GRID_SIZE - 1),
        });
        steps.push({
          type: 'attack',
          x0: sx, y0: sy,
          x1: clamp(sx + dR.dx * 3, 0, GRID_SIZE - 1),
          y1: clamp(sy + dR.dy * 3, 0, GRID_SIZE - 1),
        });
        break;
      }
      case 'decoy': {
        if (target && typeof target.x === 'number') {
          steps.push({ type: 'decoy_preview', x0: sx, y0: sy, x1: target.x, y1: target.y });
        }
        break;
      }
      case 'mine': {
        if (target && typeof target.x === 'number') {
          steps.push({ type: 'mine_preview', x: target.x, y: target.y });
        }
        break;
      }
      // chaff / armor: 盤面プレビューなし
    }
  }
  return steps;
}

/* ─── アクションキュー表示 ─── */
function _renderQueue() {
  const el = document.getElementById('action-queue');
  if (!el) return;
  if (selectedOps.length === 0) {
    el.innerHTML = '';
    return;
  }
  const totalCost = selectedOps.reduce((s, o) => s + (OPS[o.op]?.cost ?? 0), 0);
  const locked = _commandConfirmed;
  el.innerHTML = `
    <div class="queue-header">コマンドキュー（合計 ${totalCost} 単位時間）${locked ? ' 🔒' : ''}</div>
    <div class="queue-items">
      ${selectedOps.map((s, i) => `
        <div class="queue-item${locked ? ' confirmed' : ''}" data-qi="${i}">
          <span class="material-symbols-outlined queue-icon">${OPS[s.op]?.icon ?? 'help'}</span>
          <span class="queue-name">${OPS[s.op]?.name ?? s.op}</span>
          <span class="queue-cost">${OPS[s.op]?.cost ?? '?'}</span>
          ${locked ? '' : `<button class="queue-remove" data-qi="${i}">✕</button>`}
        </div>
      `).join('')}
    </div>
  `;
  if (locked) return; // 確定後は削除ボタンなし
  el.querySelectorAll('.queue-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.qi);
      selectedOps.splice(i, 1);
      _renderQueue();
      _updateCommandPreview();
      if (latestView) {
        updateUI(latestView);
        const confirmBtn = document.getElementById('confirm-btn');
        if (confirmBtn) confirmBtn.disabled = selectedOps.length === 0;
      }
    });
  });
}

/* ─── プレイヤーリスト ─── */
function _renderPlayerList(view) {
  const el = document.getElementById('player-list');
  if (!el) return;
  el.innerHTML = '';
  const colors = ['#00e5ff','#ff4444','#ffeb3b','#4caf50','#ab47bc','#ff9800'];
  const me = view.players[view.myId];
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
    // ドッグファイト相手の確定済みコマンドを表示
    const isDogfightPartner = id !== view.myId && me?.dogfightWith === id;
    const queueText = (isDogfightPartner && view.phase === 'command' && p.commandQueue?.length > 0)
      ? p.commandQueue.map(c => OPS[c.op]?.name ?? c.op).join('→')
      : '';
    div.innerHTML = `
      <span class="player-dot" style="background:${colors[i % colors.length]}"></span>
      <span class="player-chip-body">
        <span class="player-chip-name">${p.name}${id === view.myId ? '★' : ''}${statusIcon ? ' ' + statusIcon : ''}</span>
        <span class="player-chip-hp${hpCrit ? ' hp-crit' : ''}">HP ${hp}</span>
        ${queueText ? `<span class="player-chip-queue">${queueText}</span>` : ''}
      </span>
    `;
    el.appendChild(div);
  });
}

/* ─── ターンログ ─── */
function _updateTurnLog(log) {
  const el = document.getElementById('turn-log');
  if (!el || !log) return;
  el.innerHTML = log.map(l => `<div class="log-line">${l}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}

/* ─── ドッグファイトバナー ─── */
function _updateDogfightBanner(me, view) {
  const el = document.getElementById('dogfight-banner');
  if (!el) return;
  if (me.dogfightWith) {
    const other = view.players[me.dogfightWith];
    el.classList.remove('hidden');
    el.innerHTML = `⚠ ドッグファイトモード ⚠<br><small>${other?.name || '不明'} と近距離で交戦中</small>`;
  } else {
    el.classList.add('hidden');
  }
}

/* ============================================================
   フェーズ表示
   ============================================================ */
export function showPhase(phase, turn) {
  const el = document.getElementById('phase-display');
  if (!el) return;
  const labels = {
    command: `ターン ${turn} — コマンド入力`,
    action:  `ターン ${turn} — 行動フェーズ`,
    ended:   'ゲーム終了',
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

/* ============================================================
   コマンドフェーズ有効化
   ============================================================ */
/** タイマー切れ時に main.js から呼ばれる: 現在の selectedOps を返す */
export function getSelectedOps() {
  return { opIds: selectedOps.map(s => s.op), targets: selectedOps.map(s => s.target) };
}

export function enableCommand(view, isNewPhase = false) {
  const area = document.getElementById('command-area');
  if (area) area.classList.remove('hidden');

  if (isNewPhase) {
    _deactivateSonarToggle(); // ソナートグル解除（内部で cancelBoardPick も呼ぶ）
    cancelBoardPick();        // 非ソナーの盤面ピックも念のため解除
    _hideWaiting();
    _commandConfirmed = false;
    selectedOps = [];
    clearCommandPreview(); // アクション開始時にプレビューをクリア
    if (view) renderState(view);
    const timer = document.getElementById('timer-display');
    if (timer) timer.textContent = COMMAND_TIME_LIMIT;
    _renderQueue();
  }

  // パネル表示
  const panel = document.getElementById('op-panel');
  if (panel) panel.classList.remove('hidden');

  const confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn && isNewPhase) confirmBtn.disabled = true;

  // 操作ボタンのイベント設定（初回のみ）
  if (isNewPhase) _setupPanelButtons(view);

  updateUI(view);
}

function _setupPanelButtons(view) {
  document.querySelectorAll('.op-btn[data-op]').forEach(btn => {
    // 既存リスナーを消すために clone で置き換える
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', () => _onOpClick(fresh.dataset.op, view));
  });
}

/**
 * キューの移動をシミュレートし、現在の件が存在する最終位置を返す。
 * decoy/mine/sonar の promptTarget に渡すために使用。
 */
function _simulatedPosition(me, ops) {
  let sx = me.x, sy = me.y, sdir = me.dir;
  const cl = (v, mn, mx) => Math.max(mn, Math.min(mx, v));
  for (const { op } of ops) {
    switch (op) {
      case 'forward': { const d = DIR_DELTA[sdir]; sx = cl(sx+d.dx,0,GRID_SIZE-1); sy = cl(sy+d.dy,0,GRID_SIZE-1); break; }
      case 'turn_left':  sdir = rotateDir(sdir, -1); break;
      case 'turn_right': sdir = rotateDir(sdir,  1); break;
      case 'strafe_l': { const d = DIR_DELTA[rotateDir(sdir,-1)]; sx = cl(sx+d.dx,0,GRID_SIZE-1); sy = cl(sy+d.dy,0,GRID_SIZE-1); break; }
      case 'strafe_r': { const d = DIR_DELTA[rotateDir(sdir, 1)]; sx = cl(sx+d.dx,0,GRID_SIZE-1); sy = cl(sy+d.dy,0,GRID_SIZE-1); break; }
    }
  }
  return { ...me, x: sx, y: sy, dir: sdir };
}

/** ソナートグルを解除し盤面ピックをキャンセルする */
function _deactivateSonarToggle() {
  if (!_sonarToggleActive) return;
  _sonarToggleActive = false;
  cancelBoardPick();
  const btn = document.querySelector('.op-btn[data-op="sonar"]');
  if (btn) btn.classList.remove('toggle-active');
}

/** 待機メッセージ表示: バー・ボタン・パネルをまるごと置換 */
function _showWaiting() {
  const waiting    = document.getElementById('cmd-waiting');
  const confirmBtn = document.getElementById('confirm-btn');
  const timeBar    = document.querySelector('.time-bar-container');
  const opPanel    = document.getElementById('op-panel');
  if (confirmBtn) confirmBtn.classList.add('hidden');
  if (timeBar)    timeBar.classList.add('hidden');
  if (opPanel)    opPanel.classList.add('hidden');
  if (waiting)    { waiting.textContent = '他のプレイヤーのコマンドを待っています…'; waiting.classList.remove('hidden'); }
}
function _hideWaiting() {
  const waiting    = document.getElementById('cmd-waiting');
  const confirmBtn = document.getElementById('confirm-btn');
  const timeBar    = document.querySelector('.time-bar-container');
  if (waiting)    waiting.classList.add('hidden');
  if (confirmBtn) confirmBtn.classList.remove('hidden');
  if (timeBar)    timeBar.classList.remove('hidden');
}

async function _onOpClick(opId, view) {
  // ボードピック中なら必ずキャンセル（ハイライト情報も消える）
  cancelBoardPick();
  const me = view?.players[view?.myId] || latestView?.players[latestView?.myId];
  if (!me || !me.alive) return;
  const opDef = OPS[opId];
  if (!opDef) return;

  // ソナートグル中に再クリック → 解除して終了
  if (opId === 'sonar' && _sonarToggleActive) {
    _deactivateSonarToggle();
    return;
  }

  // ソナー以外のコマンドが押されたらトグル解除
  if (opId !== 'sonar') {
    _deactivateSonarToggle();
  }

  // コスト確認
  const used = selectedOps.reduce((sum, s) => sum + (OPS[s.op]?.cost ?? 0), 0);
  if (opDef.cost > (me.time ?? 10) - used) return;

  // 在庫確認
  if (opDef.invKey) {
    const inQueue = selectedOps.filter(s => s.op === opId).length;
    const avail = (me.inventory?.[opDef.invKey] ?? 0) - inQueue;
    if (avail <= 0) return;
  }

  // ──── ソナー: トグルモード（クリックするたびに追加し続ける） ────
  if (opId === 'sonar') {
    _sonarToggleActive = true;
    const sonarBtn = document.querySelector('.op-btn[data-op="sonar"]');
    if (sonarBtn) sonarBtn.classList.add('toggle-active');

    while (_sonarToggleActive) {
      // 毎ループで最新の残り時間・在庫を確認
      const cur = latestView?.players[latestView?.myId];
      if (!cur) { _deactivateSonarToggle(); break; }
      const usedNow = selectedOps.reduce((sum, s) => sum + (OPS[s.op]?.cost ?? 0), 0);
      if (opDef.cost > (cur.time ?? 10) - usedNow) { _deactivateSonarToggle(); break; }

      const simMe = _simulatedPosition(cur, selectedOps);
      const target = await promptTarget(opDef, simMe);
      if (target === null || !_sonarToggleActive) {
        _deactivateSonarToggle();
        break;
      }

      selectedOps.push({ op: opId, target });
      _renderQueue();
      _updateCommandPreview();
      updateUI(latestView);
      const confirmBtn = document.getElementById('confirm-btn');
      if (confirmBtn) confirmBtn.disabled = false;
    }
    return;
  }

  // ──── 通常コマンド ────
  const simMe = _simulatedPosition(me, selectedOps);
  const target = await promptTarget(opDef, simMe);
  if (target === null) return; // キャンセル

  selectedOps.push({ op: opId, target });
  _renderQueue();
  _updateCommandPreview();
  updateUI(latestView);

  const confirmBtn = document.getElementById('confirm-btn');
  if (confirmBtn) confirmBtn.disabled = false;
}

/* ============================================================
   アクションフェーズ
   ============================================================ */
export function showActionEvents(events, view) {
  // アニメーション中はパネルを隠す
  const panel = document.getElementById('op-panel');
  if (panel) panel.classList.add('hidden');
  const area = document.getElementById('command-area');
  if (area) area.classList.add('hidden');
}

export function showCurrentAction(ev, view) {
  const card = document.getElementById('action-event-card');
  if (!card) return;
  if (!ev) { card.classList.add('hidden'); return; }
  const iconEl = document.getElementById('ae-icon');
  const label  = document.getElementById('ae-label');
  const sub    = document.getElementById('ae-sub');
  const opDef  = ev.op ? OPS[ev.op] : null;
  if (iconEl) iconEl.textContent = opDef?.icon || 'info';
  if (label)  label.textContent  = opDef?.name || ev.type || '';
  if (sub)    sub.textContent    = '';
  card.classList.remove('hidden');
}

export function showTurnSummary() {}

/* ============================================================
   ゲームオーバー
   ============================================================ */
export function showGameOver(winnerId, view) {
  const overlay = document.getElementById('game-over-overlay');
  if (!overlay) return;
  const winner = view?.players[winnerId];
  overlay.innerHTML = `
    <div class="gameover-box">
      <div class="gameover-title">${winner ? winner.name : '誰か'} の勝利！</div>
      <div class="gameover-sub">${WIN_KILLS}キル達成</div>
      <button class="btn btn-primary" onclick="location.reload()">もう一度プレイ</button>
    </div>
  `;
  overlay.classList.remove('hidden');
}

/* ============================================================
   ダミーエクスポート（enableDraw は v5.0 では不要）
   ============================================================ */
export function enableDraw(view) {}
