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
let _spriteSheet = null;
let _spriteReady = false;

const SPRITESHEET_URL = new URL('../assets/spritesheet.svg', import.meta.url).href;
const SPRITES = {
  submarine_cyan:   { x: 0,   y: 0,  w: 64, h: 64 },
  submarine_red:    { x: 64,  y: 0,  w: 64, h: 64 },
  submarine_yellow: { x: 128, y: 0,  w: 64, h: 64 },
  submarine_green:  { x: 192, y: 0,  w: 64, h: 64 },
  submarine_purple: { x: 256, y: 0,  w: 64, h: 64 },
  submarine_orange: { x: 320, y: 0,  w: 64, h: 64 },
  torpedo:          { x: 384, y: 0,  w: 64, h: 64 },
  guided_torpedo:   { x: 448, y: 0,  w: 64, h: 64 },
  mine_friendly:    { x: 0,   y: 64, w: 64, h: 64 },
  mine_enemy:       { x: 64,  y: 64, w: 64, h: 64 },
  supply_fuel:      { x: 128, y: 64, w: 64, h: 64 },
  supply_random:    { x: 192, y: 64, w: 64, h: 64 },
  supply_ammo:      { x: 256, y: 64, w: 64, h: 64 },
  supply_repair:    { x: 320, y: 64, w: 64, h: 64 },
};
const SUBMARINE_SPRITES = [
  'submarine_cyan',
  'submarine_red',
  'submarine_yellow',
  'submarine_green',
  'submarine_purple',
  'submarine_orange',
];

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
  supply:   { fuel: '#ffeb3b', repair: '#4caf50', ammo: '#f44336', armory: '#f44336', random: '#9c27b0' },
  playerColors: ['#00e5ff', '#ff4444', '#ffeb3b', '#4caf50', '#ab47bc', '#ff9800'],
};

const DIR_ARROW = {
  N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0],
};

/* ─── 初期化 ─── */
export function initRenderer(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  _loadSpriteSheet();
  resize();
  window.addEventListener('resize', resize);
  // コンテナサイズ変化（パネル表示切替等）でも再描画
  new ResizeObserver(() => { resize(); renderState(_latestView); }).observe(canvas.parentElement);
  // アニメーション・プレビューモジュールに canvas コンテキストを渡す
  initAnim(ctx, () => cellSize, () => boardOffset, renderState);
}

function _loadSpriteSheet() {
  const img = new Image();
  img.onload = () => {
    _spriteSheet = img;
    _spriteReady = true;
    if (_latestView) renderState(_latestView);
  };
  img.onerror = () => {
    _spriteReady = false;
    _spriteSheet = null;
  };
  img.src = SPRITESHEET_URL;
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
  // Layer 1: 収縮ゾーン（収縮無効化のため非表示）
  // drawShrinkZone(view);
  // Layer 2: グリッド
  drawGrid();
  // Layer 3: 補給ポイント
  drawSupplyPoints(view.supplyPoints);
  // Layer 4: マーカー（機雷・デコイ）
  drawMarkers(view);
  // Layer 4b: 近辺可視（敵機雷・敵デコイ・近接敵）
  drawNearby(view);
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
  const icons = { fuel: '⛽', repair: '🔧', ammo: '🔫', armory: '🔫', random: '❓' };
  const spriteByType = {
    fuel: 'supply_fuel',
    repair: 'supply_repair',
    ammo: 'supply_ammo',
    armory: 'supply_ammo',
    random: 'supply_random',
  };
  for (const sp of supplyPoints) {
    const px = boardOffset.x + sp.x * cellSize + cellSize / 2;
    const py = boardOffset.y + sp.y * cellSize + cellSize / 2;
    // 背景円
    ctx.fillStyle = C.supply[sp.type] || '#888';
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(px, py, cellSize * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // ammo/repair はスプライト、その他は既存アイコンで表示
    const spriteName = spriteByType[sp.type];
    const drewSprite = spriteName ? _drawSprite(spriteName, px, py, cellSize * 0.78, 0, 0.95) : false;
    if (!drewSprite) {
      ctx.font = `${cellSize * 0.45}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(icons[sp.type] || '?', px, py);
    }
  }
}

/* ─── Layer 4: マーカー ─── */
function drawMarkers(view) {
  // 自分の機雷
  if (view.myMines) {
    for (const m of view.myMines) {
      const px = boardOffset.x + m.x * cellSize + cellSize / 2;
      const py = boardOffset.y + m.y * cellSize + cellSize / 2;
      _drawMineMarker(px, py, 'friendly', 1);
    }
  }
  // 自分のデコイ
  if (view.myDecoys) {
    for (const d of view.myDecoys) {
      const px = boardOffset.x + d.x * cellSize + cellSize / 2;
      const py = boardOffset.y + d.y * cellSize + cellSize / 2;
      ctx.strokeStyle = 'rgba(255,255,100,0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, cellSize * 0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,100,0.9)';
      ctx.font = `bold ${Math.max(10, cellSize * 0.28)}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('D', px, py);
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

/* ─── Layer 4b: 近辺可視 ─── */
function drawNearby(view) {
  // 敵機雷（半透明）
  if (view.nearbyMines) {
    for (const m of view.nearbyMines) {
      const px = boardOffset.x + m.x * cellSize + cellSize / 2;
      const py = boardOffset.y + m.y * cellSize + cellSize / 2;
      _drawMineMarker(px, py, 'enemy', 0.8);
    }
  }
  // 敵デコイ（赤縁）
  if (view.nearbyDecoys) {
    for (const d of view.nearbyDecoys) {
      const px = boardOffset.x + d.x * cellSize + cellSize / 2;
      const py = boardOffset.y + d.y * cellSize + cellSize / 2;
      ctx.strokeStyle = 'rgba(255,100,100,0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, cellSize * 0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,100,100,0.9)';
      ctx.font = `bold ${Math.max(10, cellSize * 0.28)}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('D', px, py);
    }
  }
  // 近接敵（ドッグファイト以外で3マス以内）
  // 行動フェーズ中はアニメ側の本体表示と重複するためマーカーを描かない
  if (view.phase !== 'action' && view.nearbyEnemies) {
    const colors = ['#00e5ff','#ff4444','#ffeb3b','#4caf50','#ab47bc','#ff9800'];
    for (const ep of view.nearbyEnemies) {
      const idx = view.playerOrder.indexOf(ep.id);
      const color = colors[idx % colors.length];
      const px = boardOffset.x + ep.x * cellSize + cellSize / 2;
      const py = boardOffset.y + ep.y * cellSize + cellSize / 2;
      const r = cellSize * 0.35;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.arc(px, py, r * 1.6, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

function _drawMineMarker(px, py, mineType, alpha = 1) {
  const spriteName = mineType === 'enemy' ? 'mine_enemy' : 'mine_friendly';
  if (_drawSprite(spriteName, px, py, cellSize * 0.84, 0, alpha)) return;

  const color = mineType === 'enemy' ? '#ff6b6b' : '#00e5ff';
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, cellSize * 0.06);
  ctx.beginPath();
  ctx.arc(px, py, cellSize * 0.24, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = `bold ${Math.max(10, cellSize * 0.24)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('M', px, py);

  ctx.globalAlpha = alpha * 0.35;
  ctx.beginPath();
  ctx.arc(px, py, cellSize * 0.36, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/* ─── Layer 5: 前方警戒 ─── */

/* ─── Layer 6: 潜水艦 ─── */
function drawSubmarine(view) {
  const me = view.players[view.myId];
  if (!me) return;

  // プレイヤーインデックスを playerOrder から決定（色の一貫性のため）
  const myColorIdx = view.playerOrder.indexOf(view.myId);

  // 自艦: alive かつ座標が有効なときのみ描画
  if (me.alive && typeof me.x === 'number' && typeof me.y === 'number') {
    drawSub(me.x, me.y, me.dir, C.playerColors[myColorIdx % C.playerColors.length], true, me.name, myColorIdx);
  }

  // 他プレイヤー: alive かつ座標が有効なときのみ描画
  // 霧戦フィルタは sanitizeStateForPlayer（ターン終了時）と
  // startActionAnimation の fog-of-war 修正（アニメ中）が責任を持つ
  view.playerOrder.forEach((id, idx) => {
    if (id === view.myId) return;
    const p = view.players[id];
    if (p && p.alive && typeof p.x === 'number' && typeof p.y === 'number') {
      drawSub(p.x, p.y, p.dir, C.playerColors[idx % C.playerColors.length], false, p.name, idx);
    }
  });
}

function drawSub(x, y, dir, color, isSelf, name, playerIdx = 0) {
  const px = boardOffset.x + x * cellSize + cellSize / 2;
  const py = boardOffset.y + y * cellSize + cellSize / 2;
  const r = cellSize * 0.35;
  const rot = { N: -Math.PI / 2, E: 0, S: Math.PI / 2, W: Math.PI }[dir] || 0;
  const submarineSprite = SUBMARINE_SPRITES[playerIdx % SUBMARINE_SPRITES.length];
  const drewSprite = _drawSprite(submarineSprite, px, py, cellSize * 0.9, rot, isSelf ? 1 : 0.85);

  if (!drewSprite) {
    // フォールバック: 既存のベクター描画
    ctx.fillStyle = color;
    ctx.globalAlpha = isSelf ? 1 : 0.8;
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    if (dir) {
      const d = DIR_ARROW[dir];
      ctx.strokeStyle = isSelf ? '#fff' : color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + d[0] * r * 1.4, py + d[1] * r * 1.4);
      ctx.stroke();
      const ax = px + d[0] * r * 1.4, ay = py + d[1] * r * 1.4;
      ctx.fillStyle = isSelf ? '#fff' : color;
      ctx.beginPath();
      ctx.arc(ax, ay, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 名前（小さく上に）
  if (name) {
    ctx.fillStyle = color;
    ctx.font = `${Math.max(10, cellSize * 0.22)}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(name, px, py - r - 2);
  }
}

function _drawSprite(name, centerX, centerY, drawSize, rotation = 0, alpha = 1) {
  if (!_spriteReady || !_spriteSheet) return false;
  const frame = SPRITES[name];
  if (!frame) return false;
  const half = drawSize / 2;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.drawImage(
    _spriteSheet,
    frame.x, frame.y, frame.w, frame.h,
    -half, -half, drawSize, drawSize
  );
  ctx.restore();
  return true;
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
