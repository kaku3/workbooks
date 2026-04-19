// ============================================================
// render.js  Canvas ボード描画
// ============================================================
import { GRID_SIZE, getSafeZone } from './constants.js';
import { initAnim, applyPreviewLayer, setRenderedView } from './anim.js';

// re-export so ui.js / main.js can import from one place:
export { setCommandPreview, clearCommandPreview,
         startActionAnimation, clearActionAnimation,
         startPickHighlight, stopPickHighlight } from './anim.js';

let canvas, ctx;
let cellSize = 50;
let boardOffset = { x: 0, y: 0 };
let _latestView = null; // ResizeObserver 再描画用

// 色定数
const C = {
  bg:       '#050d1a',
  bgGrad1:  '#050d1a',
  bgGrad2:  '#1a3a5c',
  grid:     'rgba(0,200,200,0.15)',
  gridBold: 'rgba(0,200,200,0.3)',
  danger:   'rgba(255,30,30,0.15)',
  dangerBorder: 'rgba(255,30,30,0.5)',
  self:     '#00e5ff',
  warning:  'rgba(255,160,0,0.2)',
  warnNear: 'rgba(255,160,0,0.45)',
  warnCrit: 'rgba(255,60,0,0.55)',
  supply:   { fuel: '#ffeb3b', repair: '#4caf50', armory: '#f44336', random: '#9c27b0' },
  playerColors: ['#00e5ff', '#ff4444', '#ffeb3b', '#4caf50', '#ab47bc', '#ff9800'],
};

const DIR_ARROW = {
  N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0],
};

/* ─── 初期化 ─── */
export function initRenderer(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  // コンテナサイズ変化（パネル表示切替等）でも再描画
  new ResizeObserver(() => { resize(); renderState(_latestView); }).observe(canvas.parentElement);
  // アニメーション・プレビューモジュールに canvas コンテキストを渡す
  initAnim(ctx, () => cellSize, () => boardOffset, renderState);
}

function resize() {
  const container = canvas.parentElement;
  const size = Math.max(200, Math.min(container.clientWidth - 8, container.clientHeight - 8));
  canvas.width = size;
  canvas.height = size;
  cellSize = Math.floor(size / (GRID_SIZE + 1));
  boardOffset = { x: cellSize * 0.5, y: cellSize * 0.5 };
}

/* ─── メイン描画 ─── */
export function renderState(view) {
  if (!ctx) return;
  setRenderedView(view);
  _latestView = view;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Layer 0: 背景
  drawBackground(w, h);
  // Layer 1: 収縮ゾーン
  drawShrinkZone(view);
  // Layer 2: グリッド
  drawGrid();
  // Layer 3: 補給ポイント
  drawSupplyPoints(view.supplyPoints);
  // Layer 4: マーカー（機雷・ブイ）
  drawMarkers(view);
  // Layer 5: 前方警戒
  drawForwardWarning(view);
  // Layer 6: 潜水艦
  drawSubmarine(view);
  // Layer 7: ソナー結果
  drawSonarResults(view);
  // Layer 8: 座標ラベル
  drawLabels();
  // Layer 9: コマンドプレビュー (anim.js)
  applyPreviewLayer();
}

/* ─── Layer 0: 背景 ─── */
function drawBackground(w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, C.bgGrad1);
  g.addColorStop(1, C.bgGrad2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/* ─── Layer 1: 収縮ゾーン ─── */
function drawShrinkZone(view) {
  if (!view.safeZone) return;
  const z = view.safeZone;
  ctx.fillStyle = C.danger;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (x < z.minX || x > z.maxX || y < z.minY || y > z.maxY) {
        const px = boardOffset.x + x * cellSize;
        const py = boardOffset.y + y * cellSize;
        ctx.fillRect(px, py, cellSize, cellSize);
      }
    }
  }
  // 安全境界の枠線
  ctx.strokeStyle = C.dangerBorder;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(
    boardOffset.x + z.minX * cellSize,
    boardOffset.y + z.minY * cellSize,
    (z.maxX - z.minX + 1) * cellSize,
    (z.maxY - z.minY + 1) * cellSize,
  );
  ctx.setLineDash([]);
}

/* ─── Layer 2: グリッド ─── */
function drawGrid() {
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    const bold = i === 0 || i === GRID_SIZE;
    ctx.strokeStyle = bold ? C.gridBold : C.grid;
    // 縦線
    const x = boardOffset.x + i * cellSize;
    ctx.beginPath(); ctx.moveTo(x, boardOffset.y); ctx.lineTo(x, boardOffset.y + GRID_SIZE * cellSize); ctx.stroke();
    // 横線
    const y = boardOffset.y + i * cellSize;
    ctx.beginPath(); ctx.moveTo(boardOffset.x, y); ctx.lineTo(boardOffset.x + GRID_SIZE * cellSize, y); ctx.stroke();
  }
}

/* ─── Layer 3: 補給ポイント ─── */
function drawSupplyPoints(supplyPoints) {
  if (!supplyPoints) return;
  const icons = { fuel: '⛽', repair: '🔧', armory: '🔫', random: '❓' };
  for (const sp of supplyPoints) {
    const px = boardOffset.x + sp.x * cellSize + cellSize / 2;
    const py = boardOffset.y + sp.y * cellSize + cellSize / 2;
    // 背景円
    ctx.fillStyle = C.supply[sp.type] || '#888';
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(px, py, cellSize * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // アイコン
    ctx.font = `${cellSize * 0.45}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(icons[sp.type] || '?', px, py);
  }
}

/* ─── Layer 4: マーカー ─── */
function drawMarkers(view) {
  // 自分の機雷
  if (view.myMines) {
    for (const m of view.myMines) {
      const px = boardOffset.x + m.x * cellSize + cellSize / 2;
      const py = boardOffset.y + m.y * cellSize + cellSize / 2;
      ctx.font = `${cellSize * 0.35}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('💣', px, py);
    }
  }
  // 自分のブイ
  if (view.myBuoys) {
    ctx.fillStyle = '#00e5ff';
    for (const b of view.myBuoys) {
      const px = boardOffset.x + b.x * cellSize + cellSize / 2;
      const py = boardOffset.y + b.y * cellSize + cellSize / 2;
      ctx.beginPath(); ctx.arc(px, py, cellSize * 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,229,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py, cellSize * 0.8, 0, Math.PI * 2); ctx.stroke();
    }
  }
}

/* ─── Layer 5: 前方警戒 ─── */
function drawForwardWarning(view) {
  const me = view.players[view.myId];
  if (!me || !me.forwardWarning) return;
  const d = DIR_ARROW[me.dir];
  if (!d) return;
  const colors = { far: C.warning, near: C.warnNear, critical: C.warnCrit };
  ctx.fillStyle = colors[me.forwardWarning] || C.warning;
  for (let step = 1; step <= 3; step++) {
    const fx = me.x + d[0] * step, fy = me.y + d[1] * step;
    if (fx < 0 || fx >= GRID_SIZE || fy < 0 || fy >= GRID_SIZE) continue;
    const px = boardOffset.x + fx * cellSize;
    const py = boardOffset.y + fy * cellSize;
    ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
  }
}

/* ─── Layer 6: 潜水艦 ─── */
function drawSubmarine(view) {
  const me = view.players[view.myId];
  if (!me || !me.alive) return;

  // プレイヤーインデックスを playerOrder から決定（色の一貫性のため）
  const myColorIdx = view.playerOrder.indexOf(view.myId);

  // 自艦
  drawSub(me.x, me.y, me.dir, C.playerColors[myColorIdx % C.playerColors.length], true, me.name);

  // 他プレイヤー (ドッグファイト時のみ位置が公開される)
  view.playerOrder.forEach((id, idx) => {
    if (id === view.myId) return;
    const p = view.players[id];
    // x/y が null/undefined でなく数値のときのみ描画
    if (p && p.alive && typeof p.x === 'number' && typeof p.y === 'number') {
      drawSub(p.x, p.y, p.dir, C.playerColors[idx % C.playerColors.length], false, p.name);
    }
  });
}

function drawSub(x, y, dir, color, isSelf, name) {
  const px = boardOffset.x + x * cellSize + cellSize / 2;
  const py = boardOffset.y + y * cellSize + cellSize / 2;
  const r = cellSize * 0.35;

  // 本体
  ctx.fillStyle = color;
  ctx.globalAlpha = isSelf ? 1 : 0.8;
  ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // 向き矢印
  if (dir) {
    const d = DIR_ARROW[dir];
    ctx.strokeStyle = isSelf ? '#fff' : color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + d[0] * r * 1.4, py + d[1] * r * 1.4);
    ctx.stroke();
    // 矢頭
    const ax = px + d[0] * r * 1.4, ay = py + d[1] * r * 1.4;
    ctx.fillStyle = isSelf ? '#fff' : color;
    ctx.beginPath();
    ctx.arc(ax, ay, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 名前（小さく上に）
  if (name) {
    ctx.fillStyle = color;
    ctx.font = `${Math.max(10, cellSize * 0.22)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(name, px, py - r - 2);
  }
}

/* ─── Layer 7: ソナー結果 ─── */
function drawSonarResults(view) {
  const me = view.players[view.myId];
  if (!me || !me.sonarResults) return;
  for (const sr of me.sonarResults) {
    const px = boardOffset.x + sr.x * cellSize + cellSize / 2;
    const py = boardOffset.y + sr.y * cellSize + cellSize / 2;
    // パルスリング
    ctx.strokeStyle = sr.fake ? '#ff4444' : '#00ff88';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(px, py, cellSize * 0.3, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    // ×印
    const s = cellSize * 0.15;
    ctx.beginPath(); ctx.moveTo(px - s, py - s); ctx.lineTo(px + s, py + s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + s, py - s); ctx.lineTo(px - s, py + s); ctx.stroke();
    // 検知プレイヤー名の代わりに「機影発見」と表示
    if (sr.playerId || sr.fake) {
      ctx.fillStyle = sr.fake ? '#ff4444' : '#00ff88';
      ctx.font = `bold ${Math.max(9, cellSize * 0.2)}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.globalAlpha = 0.85;
      ctx.fillText(sr.fake ? '欺瞞波' : '機影', px, py - cellSize * 0.32 - 2);
      ctx.globalAlpha = 1;
    }
  }
}

/* ─── Layer 8: 座標ラベル ─── */
function drawLabels() {
  ctx.fillStyle = 'rgba(0,229,255,0.5)';
  ctx.font = `${Math.max(9, cellSize * 0.22)}px "Share Tech Mono", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const cols = 'ABCDEFGHIJ';
  for (let i = 0; i < GRID_SIZE; i++) {
    // 列ラベル (上)
    const cx = boardOffset.x + i * cellSize + cellSize / 2;
    ctx.fillText(cols[i], cx, boardOffset.y - cellSize * 0.3);
    // 行ラベル (左)
    const ry = boardOffset.y + i * cellSize + cellSize / 2;
    ctx.fillText(String(i + 1), boardOffset.x - cellSize * 0.35, ry);
  }
}

/* ─── 盤面クリック → グリッド座標変換 ─── */
export function getBoardCellFromEvent(clientX, clientY) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const gx = Math.floor(((clientX - rect.left) * scaleX - boardOffset.x) / cellSize);
  const gy = Math.floor(((clientY - rect.top)  * scaleY - boardOffset.y) / cellSize);
  if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE) return null;
  return { x: gx, y: gy };
}

/* render.js はここで終わり。
   コマンドプレビュー / アクションアニメーション → anim.js */
