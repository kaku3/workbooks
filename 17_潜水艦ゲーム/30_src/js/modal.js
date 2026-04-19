// ============================================================
// modal.js  操作ターゲット選択モーダル (v5.0)
//
// 外部 API: promptTarget(op, me) => Promise<object|null>
// ============================================================
import { getBoardCellFromEvent, startPickHighlight, stopPickHighlight } from './render.js';
import { DIR_DELTA, rotateDir, GRID_SIZE } from './constants.js';

let _boardPickAbortFn = null;

/** アクティブな盤面クリック待機をキャンセルする（外部出し） */
export function cancelBoardPick() {
  if (_boardPickAbortFn) { _boardPickAbortFn(); _boardPickAbortFn = null; }
}

/**
 * 操作に応じたターゲット選択を行う。
 * @param {object} op  OPS エントリ (id, name, ...)
 * @param {object} me  自プレイヤー状態
 * @returns {Promise<object|null>} target オブジェクト、またはキャンセル時 null
 */
export async function promptTarget(op, me) {
  switch (op.id) {
    case 'sonar':  return _boardCoordPick('ソナー', 'スキャン中心を盤面でクリック');
    case 'guided': return _boardCoordPick('追尾魚雷', '標的座標を盤面でクリック');
    case 'decoy': {
      const cells = _forwardCells(me, 5, 2);
      return _boardCoordPick('デコイ', '発射先を盤面でクリック（前方範囲）', cells);
    }
    case 'mine': {
      const cells = _forwardCells(me, 2, 2);
      return _boardCoordPick('機雷', '設置先を盤面でクリック（近傍）', cells);
    }
    default: return {};
  }
}

/* ──────────────────────────────────────────
   盤面クリックで座標選択（キャンセル対応）
────────────────────────────────────────── */
function _boardCoordPick(cardName, hint = '設置箇所を盤面でクリック', highlightCells = null) {
  return new Promise(resolve => {
    if (_boardPickAbortFn) _boardPickAbortFn(); // 前の未完了ピックをキャンセル
    const overlay = document.getElementById('board-place-overlay');
    const canvas  = document.getElementById('board-canvas');
    const cleanup = () => {
      if (overlay) overlay.classList.add('hidden');
      if (canvas) { canvas.style.cursor = ''; canvas.removeEventListener('click', handler); }
      stopPickHighlight();
      _boardPickAbortFn = null;
    };
    _boardPickAbortFn = () => { cleanup(); resolve(null); };
    if (overlay) {
      overlay.textContent = `${cardName} 〈${hint}〉`;
      overlay.classList.remove('hidden');
    }
    if (canvas) canvas.style.cursor = 'crosshair';
    if (highlightCells) startPickHighlight(highlightCells);
    const handler = (e) => {
      const cell = getBoardCellFromEvent(e.clientX, e.clientY);
      if (!cell) return; // グリッド外クリックは無視
      cleanup();
      resolve({ x: cell.x, y: cell.y });
    };
    canvas?.addEventListener('click', handler);
  });
}

/* 前方から指定距離内のセル一覧（発射・設置系操作用） */
function _forwardCells(me, fwdRange, latSpread) {
  if (me.x == null || !me.dir) return null;
  const d  = DIR_DELTA[me.dir];
  const dL = DIR_DELTA[rotateDir(me.dir, -1)];
  const cells = [];
  for (let f = 1; f <= fwdRange; f++) {
    for (let l = -latSpread; l <= latSpread; l++) {
      const x = me.x + d.dx * f + dL.dx * l;
      const y = me.y + d.dy * f + dL.dy * l;
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) cells.push({ x, y });
    }
  }
  return cells.length ? cells : null;
}

/* ハープーンの選択可能セル（左右方向の射程内セル）を返す */
function _harpoonCells(me) {
  if (me.x == null || me.y == null || !me.dir) return null;
  const leftDir  = rotateDir(me.dir, -1);
  const rightDir = rotateDir(me.dir,  1);
  const cells = [];
  for (let r = 1; r <= 3; r++) {
    const dl = DIR_DELTA[leftDir];
    const dr = DIR_DELTA[rightDir];
    const lx = me.x + dl.dx * r, ly = me.y + dl.dy * r;
    const rx = me.x + dr.dx * r, ry = me.y + dr.dy * r;
    if (lx >= 0 && lx < GRID_SIZE && ly >= 0 && ly < GRID_SIZE) cells.push({ x: lx, y: ly });
    if (rx >= 0 && rx < GRID_SIZE && ry >= 0 && ry < GRID_SIZE) cells.push({ x: rx, y: ry });
  }
  return cells;
}

/* ──────────────────────────────────────────
   モーダル基盤
────────────────────────────────────────── */
function _showModal(title, buildFn) {
  return new Promise(resolve => {
    const overlay   = document.getElementById('card-modal');
    const titleEl   = document.getElementById('card-modal-title');
    const bodyEl    = document.getElementById('card-modal-body');
    const okBtn     = document.getElementById('card-modal-ok');
    const cancelBtn = document.getElementById('card-modal-cancel');

    titleEl.textContent = title;
    bodyEl.innerHTML = '';
    okBtn.disabled = true;

    let result = null;
    const setResult = (val) => {
      result = val;
      okBtn.disabled = (val === null || val === undefined);
    };

    buildFn(bodyEl, setResult);
    overlay.classList.remove('hidden');

    const close = () => overlay.classList.add('hidden');
    okBtn.onclick     = () => { close(); resolve(result); };
    cancelBtn.onclick = () => { close(); resolve(null); };
  });
}

/* コンパス方向選択ウィジェット */
function _compassWidget(body, defaultDir, onPick) {
  const compass = document.createElement('div');
  compass.className = 'modal-compass';
  const cells  = ['', 'N', '', 'W', '●', 'E', '', 'S', ''];
  const arrows = { N: '↑', S: '↓', E: '→', W: '←' };

  cells.forEach(d => {
    if (d && d !== '●') {
      const btn = document.createElement('button');
      btn.className = 'modal-compass-btn' + (d === defaultDir ? ' active' : '');
      btn.dataset.dir = d;
      btn.textContent = arrows[d];
      btn.addEventListener('click', () => {
        compass.querySelectorAll('.modal-compass-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onPick(d);
      });
      compass.appendChild(btn);
    } else if (d === '●') {
      const center = document.createElement('div');
      center.className = 'modal-compass-center';
      center.textContent = '◎';
      compass.appendChild(center);
    } else {
      const empty = document.createElement('div');
      empty.className = 'modal-compass-empty';
      compass.appendChild(empty);
    }
  });
  body.appendChild(compass);
  if (defaultDir) onPick(defaultDir);
}

/* 数値ボタン列 (0〜9) */
function _numRow(body, label, onPick, current = null) {
  const lbl = document.createElement('div');
  lbl.className = 'modal-label';
  lbl.textContent = label;
  body.appendChild(lbl);

  const row = document.createElement('div');
  row.className = 'modal-btn-row';
  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.className = 'modal-btn number-btn' + (i === current ? ' active' : '');
    btn.textContent = i;
    btn.dataset.val = i;
    btn.addEventListener('click', () => {
      row.querySelectorAll('.modal-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onPick(i);
    });
    row.appendChild(btn);
  }
  body.appendChild(row);
}

/* ── 各カード用モーダル ── */

function _modalTurnDir() {
  return _showModal('方向転換', (body, setResult) => {
    const row = document.createElement('div');
    row.className = 'modal-btn-row';
    [{ label: '↺ 左回転', val: 'L' }, { label: '↻ 右回転', val: 'R' }].forEach(({ label, val }) => {
      const btn = document.createElement('button');
      btn.className = 'modal-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        row.querySelectorAll('.modal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setResult({ turnDir: val });
      });
      row.appendChild(btn);
    });
    body.appendChild(row);
  });
}

function _modalDir(title, defaultDir) {
  return _showModal(title + ' — 方向を選択', (body, setResult) => {
    _compassWidget(body, defaultDir, d => setResult({ dir: d }));
  });
}

function _modalGuidedPath(defaultDir) {
  return _showModal('誘導魚雷 — 経路を設定', (body, setResult) => {
    const state = { dir0: defaultDir, dir1: null, dir2: null };
    const update = () => {
      const path = [{ dir: state.dir0, steps: 3 }];
      if (state.dir1) path.push({ dir: state.dir1, steps: 2 });
      if (state.dir2) path.push({ dir: state.dir2, steps: 2 });
      setResult({ guidedPath: path });
    };
    const sep = () => { const d = document.createElement('div'); d.className = 'modal-sep'; return d; };

    const lbl0 = document.createElement('div');
    lbl0.className = 'modal-label';
    lbl0.textContent = '初期方向（3マス直進）';
    body.appendChild(lbl0);
    _compassWidget(body, defaultDir, d => { state.dir0 = d; update(); });

    body.appendChild(sep());

    const lbl1 = document.createElement('div');
    lbl1.className = 'modal-label';
    lbl1.textContent = '転換1（任意）';
    body.appendChild(lbl1);
    const comp1 = document.createElement('div');
    body.appendChild(comp1);
    _compassWidget(comp1, null, d => { state.dir1 = d; update(); });

    const skip1 = document.createElement('button');
    skip1.className = 'modal-btn';
    skip1.style.cssText = 'display:block;margin:6px auto 0;';
    skip1.textContent = '転換なし';
    skip1.addEventListener('click', () => {
      comp1.querySelectorAll('.modal-compass-btn').forEach(b => b.classList.remove('active'));
      state.dir1 = null; state.dir2 = null; update();
    });
    body.appendChild(skip1);

    body.appendChild(sep());

    const lbl2 = document.createElement('div');
    lbl2.className = 'modal-label';
    lbl2.textContent = '転換2（任意）';
    body.appendChild(lbl2);
    const comp2 = document.createElement('div');
    body.appendChild(comp2);
    _compassWidget(comp2, null, d => { state.dir2 = d; update(); });

    const skip2 = document.createElement('button');
    skip2.className = 'modal-btn';
    skip2.style.cssText = 'display:block;margin:6px auto 0;';
    skip2.textContent = '転換なし';
    skip2.addEventListener('click', () => {
      comp2.querySelectorAll('.modal-compass-btn').forEach(b => b.classList.remove('active'));
      state.dir2 = null; update();
    });
    body.appendChild(skip2);

    update();
  });
}

function _modalCoord(title) {
  return _showModal(title, (body, setResult) => {
    let xVal = null, yVal = null;
    const refresh = () => {
      if (xVal !== null && yVal !== null) setResult({ x: xVal, y: yVal });
      else setResult(null);
    };
    _numRow(body, 'X（列 0〜9）', v => { xVal = v; refresh(); });
    _numRow(body, 'Y（行 0〜9）', v => { yVal = v; refresh(); });
  });
}

function _modalDecoyCoord() {
  return _showModal('欺瞞信号 — 偽装座標', (body, setResult) => {
    let xVal = null, yVal = null;
    const refresh = () => {
      if (xVal !== null && yVal !== null) setResult({ fakeX: xVal, fakeY: yVal });
      else setResult(null);
    };
    _numRow(body, 'X（列 0〜9）', v => { xVal = v; refresh(); });
    _numRow(body, 'Y（行 0〜9）', v => { yVal = v; refresh(); });
  });
}

function _modalHydrophone() {
  return _showModal('水中マイク — 監視方向を選択', (body, setResult) => {
    let mode = null, num = null;
    const refresh = () => {
      if (mode !== null && num !== null)
        setResult(mode === 'r' ? { row: num } : { col: num });
      else setResult(null);
    };

    const modeRow = document.createElement('div');
    modeRow.className = 'modal-btn-row';
    [{ label: '横（行）スキャン', val: 'r' }, { label: '縦（列）スキャン', val: 'c' }].forEach(({ label, val }) => {
      const btn = document.createElement('button');
      btn.className = 'modal-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        modeRow.querySelectorAll('.modal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        mode = val; refresh();
      });
      modeRow.appendChild(btn);
    });
    body.appendChild(modeRow);
    _numRow(body, '番号（0〜9）', v => { num = v; refresh(); });
  });
}

function _modalResupply(me) {
  return _showModal('艦底放流 — 設定', (body, setResult) => {
    let discardUid = undefined;
    let deck1 = 'move', deck2 = 'attack';
    const refresh = () => setResult({ discardUid, drawDeck1: deck1, drawDeck2: deck2 });

    const discardLbl = document.createElement('div');
    discardLbl.className = 'modal-label';
    discardLbl.textContent = '捨てるカード（任意）';
    body.appendChild(discardLbl);

    const handRow = document.createElement('div');
    handRow.className = 'modal-btn-row';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'modal-btn active';
    skipBtn.textContent = 'スキップ';
    skipBtn.addEventListener('click', () => {
      handRow.querySelectorAll('.modal-btn').forEach(b => b.classList.remove('active'));
      skipBtn.classList.add('active');
      discardUid = undefined; refresh();
    });
    handRow.appendChild(skipBtn);

    (me.hand || []).forEach(card => {
      const btn = document.createElement('button');
      btn.className = 'modal-btn';
      btn.textContent = card.name;
      btn.addEventListener('click', () => {
        handRow.querySelectorAll('.modal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        discardUid = card.uid; refresh();
      });
      handRow.appendChild(btn);
    });
    body.appendChild(handRow);

    const sep = document.createElement('div');
    sep.className = 'modal-sep';
    body.appendChild(sep);

    const DECKS = [
      { val: 'move',    label: '移動' },
      { val: 'recon',   label: '索敵' },
      { val: 'attack',  label: '攻撃' },
      { val: 'special', label: '特殊' },
    ];
    const makeRow = (lbl, initial, onChange) => {
      const L = document.createElement('div');
      L.className = 'modal-label';
      L.textContent = lbl;
      body.appendChild(L);
      const r = document.createElement('div');
      r.className = 'modal-btn-row';
      DECKS.forEach(({ val, label }) => {
        const btn = document.createElement('button');
        btn.className = 'modal-btn' + (val === initial ? ' active' : '');
        btn.textContent = label;
        btn.addEventListener('click', () => {
          r.querySelectorAll('.modal-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          onChange(val);
        });
        r.appendChild(btn);
      });
      body.appendChild(r);
    };
    makeRow('1枚目の山札', deck1, v => { deck1 = v; refresh(); });
    makeRow('2枚目の山札', deck2, v => { deck2 = v; refresh(); });

    refresh();
  });
}
