// ============================================================
// anim.js  コマンドプレビュー & アクションアニメーション描画
//
// render.js から initAnim() で canvas コンテキストを受け取り、
// Layer 9 以降の描画と状態管理をすべて担当する。
// ============================================================

import { GRID_SIZE } from './constants.js';

/** v5.0 操作ID → 日本語ラベル */
const OP_LABELS = {
  forward: '前進', turn_left: '←旋回', turn_right: '旋回→',
  strafe_l: '←横移', strafe_r: '横移→',
  sonar: 'ソナー', torpedo: '魚雷', guided: '追尾魚雷',
  shotgun: '散弾', decoy: 'デコイ', mine: '機雷',
  chaff: 'チャフ', armor: '装甲板',
};

let _ctx = null;
let _getCellSize   = () => 50;
let _getOffset     = () => ({ x: 0, y: 0 });
let _renderState   = null;   // renderState の参照（アニメループ用）
let _lastView      = null;   // 最後にレンダリングされたビュー（ハイライト用）
let _pickHighlightCells = []; // 盤面ピックモード時のハイライトセル
let _pickRafId     = null;   // ピックアニメーション rAF ID

/**
 * render.js の initRenderer() から呼ばれる初期化。
 * @param {CanvasRenderingContext2D} ctx
 * @param {() => number} getCellSize
 * @param {() => {x:number, y:number}} getOffset
 * @param {(view: object) => void} renderStateFn
 */
export function initAnim(ctx, getCellSize, getOffset, renderStateFn) {
  _ctx         = ctx;
  _getCellSize = getCellSize;
  _getOffset   = getOffset;
  _renderState = renderStateFn;
}

/* ============================================================
   コマンドプレビュー
   steps = [{type:'path',x0,y0,x1,y1} | {type:'sonar',x,y,r} |
            {type:'attack',x0,y0,x1,y1} | {type:'target',x,y}]
   ============================================================ */
let _previewSteps = null;

export function setCommandPreview(steps) { _previewSteps = steps; }
export function clearCommandPreview()    { _previewSteps = null; }

/** render.js が renderState のたびに呼ぶ — ハイライトアニメ用 */
export function setRenderedView(v) { _lastView = v; }

/** 盤面ピックモード開始: 指定セルを点滅ハイライト */
export function startPickHighlight(cells) {
  _pickHighlightCells = (cells && cells.length) ? cells : [];
  if (_pickRafId || !_pickHighlightCells.length) return;
  const loop = () => {
    if (!_pickHighlightCells.length || !_renderState || !_lastView) {
      _pickRafId = null;
      return;
    }
    _renderState(_lastView);
    _pickRafId = requestAnimationFrame(loop);
  };
  _pickRafId = requestAnimationFrame(loop);
}

/** 盤面ピックモード終了 */
export function stopPickHighlight() {
  _pickHighlightCells = [];
  if (_pickRafId) { cancelAnimationFrame(_pickRafId); _pickRafId = null; }
}

/**
 * renderState() の末尾（Layer 9）から呼ばれる。
 * プレビューが設定されていなければ何もしない。
 */
export function applyPreviewLayer() {
  const hasPreview   = _previewSteps && _previewSteps.length;
  const hasHighlight = _pickHighlightCells.length > 0;
  if (!hasPreview && !hasHighlight) return;
  const ctx      = _ctx;
  const cellSize = _getCellSize();
  const bo       = _getOffset();

  ctx.save();

  // 選択可能範囲ハイライト（ピックモード時点滅）
  if (hasHighlight) {
    const alpha = 0.10 + 0.13 * Math.abs(Math.sin(Date.now() / 450));
    ctx.fillStyle = `rgba(0,220,255,${alpha.toFixed(3)})`;
    for (const { x, y } of _pickHighlightCells) {
      ctx.fillRect(bo.x + x * cellSize, bo.y + y * cellSize, cellSize, cellSize);
    }
  }

  if (!hasPreview) { ctx.restore(); return; }
  for (const step of _previewSteps) {
    switch (step.type) {
      case 'path': {
        const x0 = bo.x + step.x0 * cellSize + cellSize / 2;
        const y0 = bo.y + step.y0 * cellSize + cellSize / 2;
        const x1 = bo.x + step.x1 * cellSize + cellSize / 2;
        const y1 = bo.y + step.y1 * cellSize + cellSize / 2;
        ctx.strokeStyle = 'rgba(0,229,255,0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.setLineDash([]);
        _arrowHead(x1, y1, x1 - x0, y1 - y0, 'rgba(0,229,255,0.85)');
        break;
      }
      case 'sonar': {
        const r = step.r ?? 1;
        const cx = bo.x + step.x * cellSize + cellSize / 2;
        const cy = bo.y + step.y * cellSize + cellSize / 2;
        const scanPx = (r + 0.5) * cellSize; // 3マス直径円形

        // ① 円形エリア塗り
        ctx.fillStyle = 'rgba(0,255,136,0.12)';
        ctx.beginPath(); ctx.arc(cx, cy, scanPx, 0, Math.PI * 2); ctx.fill();

        // ② 円形境界線（点線）
        ctx.strokeStyle = 'rgba(0,255,136,0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.arc(cx, cy, scanPx, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);

        // ③ 中心クロスヘア
        const cr = cellSize * 0.28;
        ctx.strokeStyle = 'rgba(0,255,136,0.90)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - cr, cy); ctx.lineTo(cx + cr, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - cr); ctx.lineTo(cx, cy + cr); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, cellSize * 0.22, 0, Math.PI * 2); ctx.stroke();
        break;
      }
      case 'attack': {
        const ax0 = bo.x + step.x0 * cellSize + cellSize / 2;
        const ay0 = bo.y + step.y0 * cellSize + cellSize / 2;
        const ax1 = bo.x + step.x1 * cellSize + cellSize / 2;
        const ay1 = bo.y + step.y1 * cellSize + cellSize / 2;
        ctx.strokeStyle = 'rgba(255,100,0,0.65)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.beginPath(); ctx.moveTo(ax0, ay0); ctx.lineTo(ax1, ay1); ctx.stroke();
        ctx.setLineDash([]);
        _arrowHead(ax1, ay1, ax1 - ax0, ay1 - ay0, 'rgba(255,100,0,0.8)');
        break;
      }
      case 'target': {
        const tx = bo.x + step.x * cellSize;
        const ty = bo.y + step.y * cellSize;
        const m = 4;
        ctx.strokeStyle = 'rgba(255,200,0,0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(tx + m, ty + m); ctx.lineTo(tx + cellSize - m, ty + cellSize - m); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx + cellSize - m, ty + m); ctx.lineTo(tx + m, ty + cellSize - m); ctx.stroke();
        break;
      }
      case 'turn': {
        const dirAngles = { N: -Math.PI/2, E: 0, S: Math.PI/2, W: Math.PI };
        const cx = bo.x + step.x * cellSize + cellSize / 2;
        const cy = bo.y + step.y * cellSize + cellSize / 2;
        const r = cellSize * 0.35;
        const isRight = step.dir === 'R';
        const startAngle = dirAngles[step.facing ?? 'N'];
        const endAngle   = startAngle + (isRight ? Math.PI/2 : -Math.PI/2);
        ctx.strokeStyle = 'rgba(80,200,255,0.90)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle, !isRight);
        ctx.stroke();
        const ex = cx + r * Math.cos(endAngle);
        const ey = cy + r * Math.sin(endAngle);
        const tanX = isRight ? -Math.sin(endAngle) : Math.sin(endAngle);
        const tanY = isRight ? Math.cos(endAngle) : -Math.cos(endAngle);
        _arrowHead(ex, ey, tanX, tanY, 'rgba(80,200,255,0.95)');
        break;
      }
      case 'guided_preview': {
        const tx = bo.x + step.x * cellSize;
        const ty = bo.y + step.y * cellSize;
        const m = 4;
        ctx.strokeStyle = 'rgba(255,200,0,0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(tx + m, ty + m); ctx.lineTo(tx + cellSize - m, ty + cellSize - m); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tx + cellSize - m, ty + m); ctx.lineTo(tx + m, ty + cellSize - m); ctx.stroke();
        ctx.beginPath(); ctx.arc(tx + cellSize/2, ty + cellSize/2, cellSize * 0.38, 0, Math.PI * 2); ctx.stroke();
        break;
      }
      case 'decoy_preview': {
        // 発射ライン
        const dx0 = bo.x + step.x0 * cellSize + cellSize/2;
        const dy0 = bo.y + step.y0 * cellSize + cellSize/2;
        const dx1 = bo.x + step.x1 * cellSize + cellSize/2;
        const dy1 = bo.y + step.y1 * cellSize + cellSize/2;
        ctx.strokeStyle = 'rgba(255,255,100,0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(dx0, dy0); ctx.lineTo(dx1, dy1); ctx.stroke();
        ctx.setLineDash([]);
        // 配置位置：デコイアイコン（黄円 + D文字）
        ctx.strokeStyle = 'rgba(255,255,100,0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(dx1, dy1, cellSize * 0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,100,0.9)';
        ctx.font = `bold ${Math.max(11, cellSize * 0.3)}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('D', dx1, dy1);
        break;
      }
      case 'mine_preview': {
        const mx = bo.x + step.x * cellSize + cellSize/2;
        const my = bo.y + step.y * cellSize + cellSize/2;
        // 機雷アイコン（赤円 + M文字）
        ctx.strokeStyle = 'rgba(255,80,80,0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(mx, my, cellSize * 0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = 'rgba(255,80,80,0.9)';
        ctx.font = `bold ${Math.max(11, cellSize * 0.3)}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('M', mx, my);
        break;
      }
    }
  }
  ctx.restore();
}

function _arrowHead(tipX, tipY, dx, dy, color) {
  const cellSize = _getCellSize();
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return;
  const ux = dx / len, uy = dy / len;
  const s = Math.min(10, cellSize * 0.22);
  _ctx.fillStyle = color;
  _ctx.beginPath();
  _ctx.moveTo(tipX, tipY);
  _ctx.lineTo(tipX - ux * s - uy * s * 0.5, tipY - uy * s + ux * s * 0.5);
  _ctx.lineTo(tipX - ux * s + uy * s * 0.5, tipY - uy * s - ux * s * 0.5);
  _ctx.fill();
}

/* ============================================================
   アクションフェーズ コマ送りアニメーション
   ============================================================ */
const EVENT_CARD_LABEL = {
  forward:'前進', turn:'転換', cruise:'巡航', rush:'急速推進',
  reverse:'反転', escape:'緊急離脱',
  free_forward:'前進', free_turn_left:'左旋回', free_turn_right:'右旋回',
  turbo_move:'ターボ移動', high_output:'高出力推進',
  strafe_left:'左横移動', strafe_right:'右横移動',
  passive_sonar:'ソナー', active_sonar:'アクソナー', hydrophone:'水中マイク',
  recon_torpedo:'偵察魚雷', tracking_buoy:'ブイ設置', decoy_signal:'欺瞞信号',
  torpedo:'魚雷', harpoon:'ハープーン', guided_torpedo:'誠導魚雷', depth_charge:'爆雷',
  mine:'機雷', barrage:'連装魚雷',
  repair:'修理', emp:'EMP', overcharge:'高出力炉', armor:'装甲',
};

let _actionQueue       = [];
let _actionBaseView    = null;
let _animView          = null;   // アニメーション中の可変ビュー（位置を逐次更新）
let _actionOnDone      = null;
let _actionOnEachEvent = null;
let _animTimeoutId     = null;

/** イベント種別ごとの表示時間（ms） */
function _eventDelay(ev) {
  switch (ev.type) {
    case 'eliminated':   return 4000;
    case 'damage':       return 3000;
    case 'torpedo_fire': return 3000;
    case 'guided_fire':  return 2500;
    case 'attack_leak':  return (ev.op === 'guided') ? 2000 : ev.card === 'depth_charge' ? 3000 : 400;
    case 'explosion':    return 2800;
    case 'sonar':        return 3000;
    case 'move': {
      const simple = ['free_forward', 'free_turn_left', 'free_turn_right'];
      return simple.includes(ev.card) ? 1200 : 2500;
    }
    case 'sound_leak':   return  400;
    default:             return 1500;
  }
}

export function startActionAnimation(events, view, onDone, onEachEvent) {
  _previewSteps       = null;           // プレビューをクリア
  _actionQueue        = (events || []).slice();
  _actionBaseView     = view;
  _actionOnDone       = onDone || null;
  _actionOnEachEvent  = onEachEvent || null;

  // アニメーション用の可変ビューを作成（各プレイヤーの位置を逐次更新する）
  _animView = { ...view, players: {} };
  Object.keys(view.players).forEach(pid => {
    _animView.players[pid] = { ...view.players[pid] };
  });
  // move イベントの fromX/fromY を使ってプレイヤーをアクション前の位置に巻き戻す
  const rewound = new Set();
  for (const ev of _actionQueue) {
    if (ev.type === 'move' && !rewound.has(ev.pid) && ev.fromX != null && _animView.players[ev.pid]) {
      _animView.players[ev.pid].x   = ev.fromX;
      _animView.players[ev.pid].y   = ev.fromY;
      _animView.players[ev.pid].dir = ev.fromDir;
      rewound.add(ev.pid);
    }
  }

  // ソナー結果をアニメ開始時はクリア→ソナーイベント発火時に復元
  if (_animView.players[view.myId]) {
    _animView.players[view.myId].sonarResults = [];
  }

  // 左巻きした初期状態を即座に描画（終了位置の一瞬表示を防ぐ）
  if (_renderState && _animView) _renderState(_animView);

  _nextActionStep();
}

/** アニメーションビューにイベントを適用してプレイヤー状態を更新 */
function _applyEventToAnimView(ev) {
  if (!_animView) return;
  const p = _animView.players[ev.pid];
  if (!p) return;
  switch (ev.type) {
    case 'move': p.x = ev.x; p.y = ev.y; p.dir = ev.dir; break;
    case 'damage': p.hp = ev.hp; break;
    case 'repair': p.hp = ev.hp; break;
    case 'eliminated': p.alive = false; break;
    case 'sonar': {
      // ソナーヒットをイベント発火時に復元（アニメ開始時はクリアしてある）
      if (ev.pid === _animView.myId && ev.hits) {
        if (!p.sonarResults) p.sonarResults = [];
        ev.hits.forEach(h => p.sonarResults.push(h));
      }
      break;
    }
  }
}

function _nextActionStep() {
  if (_actionQueue.length === 0) {
    // アニメ終了 — 最終状態をレンダリング
    if (_renderState && _actionBaseView) _renderState(_actionBaseView);
    const cb   = _actionOnDone;
    const evCb = _actionOnEachEvent;
    _animView          = null;
    _actionBaseView    = null;
    _actionOnDone      = null;
    _actionOnEachEvent = null;
    _animTimeoutId     = null;
    if (evCb) evCb(null);   // null = アニメ終了を通知（カードを消す）
    if (cb)   cb();
    return;
  }

  const ev = _actionQueue.shift();
  _applyEventToAnimView(ev);
  if (_renderState && _animView) _renderState(_animView);
  _drawEventAnnotation(ev);
  if (_actionOnEachEvent) _actionOnEachEvent(ev);
  _animTimeoutId = setTimeout(_nextActionStep, _eventDelay(ev));
}

/** ドローフェーズ開始時に呼び、初期化済みアニメタイマーをキャンセルする。 */
export function clearActionAnimation() {
  if (_animTimeoutId) { clearTimeout(_animTimeoutId); _animTimeoutId = null; }
  const evCb         = _actionOnEachEvent;
  _animView          = null;
  _actionBaseView    = null;
  _actionQueue       = [];
  _actionOnEachEvent = null;
  _actionOnDone      = null;
  if (evCb) evCb(null);  // 中断時もカードを非表示にする
}

function _drawEventAnnotation(ev) {
  const ctx      = _ctx;
  const cs       = _getCellSize();
  const bo       = _getOffset();
  const baseView = _animView || _actionBaseView;
  if (!ctx || !baseView) return;

  ctx.save();
  switch (ev.type) {
    case 'move': {
      const px = bo.x + ev.x * cs + cs / 2;
      const py = bo.y + ev.y * cs + cs / 2;
      // 移動がある場合は矢印、旋回のみの場合は円だけ
      const didMove = ev.fromX != null && (ev.fromX !== ev.x || ev.fromY !== ev.y);
      if (didMove) {
        const fx = bo.x + ev.fromX * cs + cs / 2;
        const fy = bo.y + ev.fromY * cs + cs / 2;
        ctx.strokeStyle = 'rgba(0,229,255,0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(px, py); ctx.stroke();
        ctx.setLineDash([]);
        _arrowHead(px, py, px - fx, py - fy, 'rgba(0,229,255,0.85)');
      }
      ctx.strokeStyle = 'rgba(0,229,255,0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(px, py, cs * 0.46, 0, Math.PI * 2); ctx.stroke();
      const opKey = ev.op ?? ev.card;
      const label = OP_LABELS[opKey] || EVENT_CARD_LABEL[opKey] || '';
      if (label) _eventLabel(label, ev.x, ev.y, '#00e5ff');
      break;
    }
    case 'sonar': {
      if (ev.cx == null) break;
      const sx = bo.x + ev.cx * cs + cs / 2;
      const sy = bo.y + ev.cy * cs + cs / 2;
      const scanR = ((ev.r ?? 1) + 0.5) * cs; // 3マス直径円形内接円

      // ① 円形エリア塗り
      ctx.fillStyle = 'rgba(0,255,136,0.12)';
      ctx.beginPath(); ctx.arc(sx, sy, scanR, 0, Math.PI * 2); ctx.fill();

      // ② 圆形境界線（点線）
      ctx.strokeStyle = 'rgba(0,255,136,0.75)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath(); ctx.arc(sx, sy, scanR, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      // ③ 中心クロスヘア
      const cr = cs * 0.25;
      ctx.strokeStyle = 'rgba(0,255,136,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx - cr, sy); ctx.lineTo(sx + cr, sy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, sy - cr); ctx.lineTo(sx, sy + cr); ctx.stroke();
      ctx.beginPath(); ctx.arc(sx, sy, cs * 0.2, 0, Math.PI * 2); ctx.stroke();

      // ④ 検知位置に「機影」ラベル + ×マーカー
      (ev.hits || []).forEach(h => {
        const hx = bo.x + h.x * cs + cs / 2;
        const hy = bo.y + h.y * cs + cs / 2;
        const hs = cs * 0.22;
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hx - hs, hy - hs); ctx.lineTo(hx + hs, hy + hs); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hx + hs, hy - hs); ctx.lineTo(hx - hs, hy + hs); ctx.stroke();
        ctx.beginPath(); ctx.arc(hx, hy, cs * 0.32, 0, Math.PI * 2); ctx.stroke();
        // 「機影」ラベル
        ctx.fillStyle = '#00ff88';
        ctx.font = `bold ${Math.max(10, cs * 0.22)}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.globalAlpha = 0.9;
        ctx.fillText('機影', hx, hy - cs * 0.35);
        ctx.globalAlpha = 1;
      });

      _eventLabel('ソナー', ev.cx, ev.cy, '#00ff88');
      break;
    }
    case 'damage': {
      const vp = baseView.players[ev.pid];
      if (vp && vp.x != null) {
        const px = bo.x + vp.x * cs;
        const py = bo.y + vp.y * cs;
        ctx.fillStyle = 'rgba(255,50,50,0.35)';
        ctx.fillRect(px, py, cs, cs);
        ctx.fillStyle = '#ff3333';
        ctx.font = `bold ${Math.max(13, cs * 0.38)}px "Share Tech Mono", monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`-${ev.dmg}`, px + cs / 2, py + cs / 2);
      }
      break;
    }
    case 'explosion': {
      const epx = bo.x + ev.x * cs + cs / 2;
      const epy = bo.y + ev.y * cs + cs / 2;
      ctx.fillStyle = 'rgba(255,120,0,0.45)';
      ctx.beginPath(); ctx.arc(epx, epy, cs * 0.52, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 2; ctx.stroke();
      _eventLabel('爆発', ev.x, ev.y, '#ff6600');
      break;
    }
    case 'eliminated': {
      const ep = _actionBaseView.players[ev.pid];
      if (ep && ep.x != null) {
        const epx = bo.x + ep.x * cs + cs / 2;
        const epy = bo.y + ep.y * cs + cs / 2;
        ctx.fillStyle = 'rgba(255,0,0,0.8)';
        ctx.font = `bold ${cs * 0.65}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('✕', epx, epy);
      }
      break;
    }
    case 'torpedo_fire': {
      const x1 = bo.x + ev.sx * cs + cs / 2;
      const y1 = bo.y + ev.sy * cs + cs / 2;
      const x2 = bo.x + ev.ex * cs + cs / 2;
      const y2 = bo.y + ev.ey * cs + cs / 2;
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      _arrowHead(x2, y2, x2 - x1, y2 - y1, '#ffaa00');
      _eventLabel(EVENT_CARD_LABEL[ev.card] || '魚雷', ev.sx, ev.sy, '#ffaa00');
      break;
    }
    case 'guided_fire': {
      // 追尾魚雷 発射軌跡（発射者のみ表示）
      const gx1 = bo.x + ev.sx * cs + cs / 2;
      const gy1 = bo.y + ev.sy * cs + cs / 2;
      const gx2 = bo.x + ev.tx * cs + cs / 2;
      const gy2 = bo.y + ev.ty * cs + cs / 2;
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(gx1, gy1); ctx.lineTo(gx2, gy2); ctx.stroke();
      ctx.setLineDash([]);
      _arrowHead(gx2, gy2, gx2 - gx1, gy2 - gy1, '#00e5ff');
      _eventLabel('追尾魚雷', ev.sx, ev.sy, '#00e5ff');
      break;
    }
    case 'attack_leak':
      if (ev.op === 'guided' && ev.cx != null) {
        // 追尾魚雷 着弾エリア（全員公開）
        const gcx = bo.x + ev.cx * cs + cs / 2;
        const gcy = bo.y + ev.cy * cs + cs / 2;
        const gr  = (ev.r ?? 2) * cs;
        ctx.fillStyle = 'rgba(0,229,255,0.12)';
        ctx.beginPath(); ctx.arc(gcx, gcy, gr, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(0,229,255,0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath(); ctx.arc(gcx, gcy, gr, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        _eventLabel('追尾魚雷', ev.cx, ev.cy, '#00e5ff');
      } else if (ev.card === 'depth_charge' && ev.cx != null) {
        const dcx = bo.x + ev.cx * cs + cs / 2;
        const dcy = bo.y + ev.cy * cs + cs / 2;
        const radius = (ev.r ?? 2) * cs;
        ctx.fillStyle = 'rgba(255,100,0,0.18)';
        ctx.beginPath(); ctx.arc(dcx, dcy, radius, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,130,0,0.85)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath(); ctx.arc(dcx, dcy, radius, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        _eventLabel('広域爆雷', ev.cx, ev.cy, '#ff7700');
      }
      break;
    case 'sound_leak':
      break; // 副作用はログのみ
  }
  ctx.restore();
}

function _eventLabel(text, gx, gy, color) {
  const ctx = _ctx;
  const cs  = _getCellSize();
  const bo  = _getOffset();
  const px  = bo.x + gx * cs + cs / 2;
  const py  = bo.y + gy * cs;
  const fs  = Math.max(11, cs * 0.26);
  ctx.font = `bold ${fs}px "Noto Sans JP", sans-serif`;
  const w = ctx.measureText(text).width + 10;
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(px - w / 2, py - fs - 4, w, fs + 4);
  ctx.fillStyle = color || '#fff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillText(text, px, py);
}

/* ============================================================
   パーティクル爆発エフェクト（requestAnimationFrame ベース）
   ============================================================ */
export function playExplosion(x, y) {
  const ctx = _ctx;
  if (!ctx) return;
  const cs = _getCellSize();
  const bo = _getOffset();
  const px = bo.x + x * cs + cs / 2;
  const py = bo.y + y * cs + cs / 2;

  let frame = 0;
  const maxFrames = 20;
  const particles = Array.from({ length: 15 }, () => ({
    dx: (Math.random() - 0.5) * 4,
    dy: (Math.random() - 0.5) * 4,
    color: ['#ff6600', '#ffaa00', '#ffffff'][Math.floor(Math.random() * 3)],
  }));

  function animate() {
    frame++;
    if (frame > maxFrames) return;
    const alpha = 1 - frame / maxFrames;
    particles.forEach(p => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px + p.dx * frame, py + p.dy * frame, 3 * alpha, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
}
