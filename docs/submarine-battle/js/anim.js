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
  shotgun: '散弾', mine: '機雷', chaff: 'チャフ',
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
let _overlayEffects = []; // 再描画で消えない短命エフェクト

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
 * また、アニメーション中の飛翔体も常時描画する（ティック間で消えないよう）。
 */
export function applyPreviewLayer() {
  const hasPreview     = _previewSteps && _previewSteps.length;
  const hasHighlight   = _pickHighlightCells.length > 0;
  const hasProjectiles = _animView?.projectiles && Object.keys(_animView.projectiles).length > 0;
  const now = performance.now();
  _overlayEffects = _overlayEffects.filter(fx => fx.until > now);
  const hasOverlayFx = _overlayEffects.length > 0;
  if (!hasPreview && !hasHighlight && !hasProjectiles && !hasOverlayFx) return;
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

  // 飛翔体をボード上に常時表示（アニメ間で消えないよう renderState のたびに重描画）
  if (hasProjectiles) {
    _drawActiveProjectiles(ctx, cellSize, bo);
  }

  if (hasOverlayFx) {
    _drawOverlayEffects(ctx, cellSize, bo, now);
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
      case 'mine_preview': {
        const mx = bo.x + step.x * cellSize + cellSize/2;
        const my = bo.y + step.y * cellSize + cellSize/2;
        ctx.strokeStyle = 'rgba(255,80,80,0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(mx, my, cellSize * 0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = 'rgba(255,80,80,0.9)';
        ctx.font = `bold ${Math.max(11, cellSize * 0.3)}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('M', mx, my);
        break;
      }
      case 'chaff_preview': {
        const cx2 = bo.x + step.x * cellSize + cellSize / 2;
        const cy2 = bo.y + step.y * cellSize + cellSize / 2;
        ctx.fillStyle = 'rgba(200,230,255,0.15)';
        ctx.fillRect(bo.x + step.x * cellSize + 1, bo.y + step.y * cellSize + 1, cellSize - 2, cellSize - 2);
        ctx.strokeStyle = 'rgba(180,220,255,0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath(); ctx.arc(cx2, cy2, cellSize * 0.40, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(180,220,255,0.85)';
        ctx.font = `bold ${Math.max(9, cellSize * 0.22)}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('チャフ', cx2, cy2);
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

function _pushOverlayEffect(effect) {
  if (!effect || effect.x == null || effect.y == null) return;
  _overlayEffects.push(effect);
}

function _drawOverlayEffects(ctx, cs, bo, now) {
  ctx.save();
  for (const fx of _overlayEffects) {
    const t = Math.max(0, Math.min(1, (now - fx.start) / Math.max(1, fx.until - fx.start)));
    const alpha = 1 - t;
    if (fx.type === 'explosion') {
      const px = bo.x + fx.x * cs + cs / 2;
      const py = bo.y + fx.y * cs + cs / 2;
      const color = fx.color || '#ff6600';
      const r = cs * (0.52 + 0.25 * t);
      const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 1.25);
      grad.addColorStop(0, `rgba(255,240,120,${0.92 * alpha})`);
      grad.addColorStop(0.35, `rgba(255,140,0,${0.80 * alpha})`);
      grad.addColorStop(1, 'rgba(255,60,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(px, py, r * 1.25, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.9 * alpha;
      ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
    } else if (fx.type === 'damage') {
      const px = bo.x + fx.x * cs;
      const py = bo.y + fx.y * cs;
      ctx.fillStyle = `rgba(255,50,50,${0.35 * alpha})`;
      ctx.fillRect(px, py, cs, cs);
      if (fx.dmg != null) {
        ctx.fillStyle = `rgba(255,51,51,${0.95 * alpha})`;
        ctx.font = `bold ${Math.max(13, cs * 0.38)}px "Share Tech Mono", monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`-${fx.dmg}`, px + cs / 2, py + cs / 2);
      }
    }
  }
  ctx.restore();
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
let _animMineCache     = [];     // アニメ中に既知の機雷一覧
let _actionOnDone      = null;
let _actionOnEachEvent = null;
let _animTimeoutId     = null;

/* ──────────────────────────────────────────────────────────────────
   飛翔体 rAF ループ（単一ループで全飛翔体をピクセル座標で滑らか描画）
   各飛翔体は _animView.projectiles[id] に以下のフィールドを持つ:
     pixX, pixY    … 現在のピクセル座標（浮動小数）
     velX, velY    … 速度（px/ms）
     toPixX,toPixY … 目標ピクセル座標
     color, projType, ownerId
   ────────────────────────────────────────────────────────────────── */
let _projRafId   = null;
let _projLastTime = 0;

/** 飛翔体 rAF ループを起動（既に動いていれば何もしない） */
function _startProjLoop() {
  if (_projRafId !== null) return;
  _projLastTime = performance.now();
  const loop = (now) => {
    if (!_animView?.projectiles || Object.keys(_animView.projectiles).length === 0) {
      _projRafId = null;
      return;
    }
    const dt = Math.min(now - _projLastTime, 50);
    _projLastTime = now;
    for (const proj of Object.values(_animView.projectiles)) {
      if (proj.pixX == null) continue;
      proj.pixX += proj.velX * dt;
      proj.pixY += proj.velY * dt;
      // 目標に達したら速度を0にして止める
      const dx = proj.toPixX - proj.pixX, dy = proj.toPixY - proj.pixY;
      if (Math.hypot(dx, dy) < Math.hypot(proj.velX, proj.velY) * dt + 0.5) {
        proj.pixX = proj.toPixX; proj.pixY = proj.toPixY;
        proj.velX = 0; proj.velY = 0;
      }
    }
    if (_renderState && _animView) _renderState(_animView);
    _projRafId = requestAnimationFrame(loop);
  };
  _projRafId = requestAnimationFrame(loop);
}

/** 飛翔体 rAF ループを停止 */
function _stopProjLoop() {
  if (_projRafId !== null) { cancelAnimationFrame(_projRafId); _projRafId = null; }
}

/**
 * アニメーション中の全飛翔体を現在ピクセル座標でグロードット描画する。
 * applyPreviewLayer() から呼ばれる（Layer 9）。
 * rAFループも renderState → applyPreviewLayer の流れで描画するため一本化されている。
 */
function _drawActiveProjectiles(ctx, cs, bo) {
  if (!_animView?.projectiles) return;
  ctx.save();
  Object.values(_animView.projectiles).forEach(proj => {
    // pixX/pixY があればピクセル座標をそのまま使用（スムーズ移動）
    const px = proj.pixX != null ? proj.pixX : bo.x + proj.x * cs + cs / 2;
    const py = proj.pixY != null ? proj.pixY : bo.y + proj.y * cs + cs / 2;
    const color = proj.projType === 'guided' ? '#00e5ff' : '#ffaa00';
    const r = cs * 0.13;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2.5);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(px, py, r * 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(px, py, r * 0.6, 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
}

/** 着弾爆発エフェクト（rAF アニメ終了時の onDone から呼ぶ） */
function _drawExplosion(x, y, color = '#ff6600') {
  const ctx = _ctx; if (!ctx) return;
  const cs = _getCellSize();
  const bo = _getOffset();
  const px = bo.x + x * cs + cs / 2;
  const py = bo.y + y * cs + cs / 2;
  ctx.save();
  const grad = ctx.createRadialGradient(px, py, 0, px, py, cs * 0.72);
  grad.addColorStop(0,    'rgba(255,240,120,0.95)');
  grad.addColorStop(0.35, 'rgba(255,140,0,0.85)');
  grad.addColorStop(1,    'rgba(255,60,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(px, py, cs * 0.72, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(px, py, cs * 0.52, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(px, py, cs * 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
/** イベント種別ごとの表示時間（ms） */
function _eventDelay(ev) {
  switch (ev.type) {
    case 'tick_start':       return  80;  // ティック境界の短い間
    case 'eliminated':       return 600;
    case 'damage':           return 500;
    case 'torpedo_fire':
    case 'guided_fire':
    case 'shotgun_fire':     return  400;  // 発射エフェクト
    case 'projectile_tick':  return ev.projType === 'guided' ? 400 : 200;  // 追尾魚雷は遅く
    case 'projectile_hit':   return 220;   // ヒット時も進行を止めすぎない
    case 'projectile_miss':  return  350;
    case 'explosion':        return 260;
    case 'sonar':            return 900;
    case 'sonar_detected':   return 2000;
    case 'move':             return  400;  // 並列ティック内は高速再生
    case 'buff':             return 1500;
    case 'sound_leak':       return  300;
    case 'attack_leak':      return  400;
    default:                 return 1200;
  }
}

export function startActionAnimation(events, view, onDone, onEachEvent) {
  _previewSteps       = null;           // プレビューをクリア
  _overlayEffects     = [];
  _actionQueue        = (events || []).slice();
  _actionBaseView     = view;
  _actionOnDone       = onDone || null;
  _actionOnEachEvent  = onEachEvent || null;

  // アニメーション用の可変ビューを作成（各プレイヤーの位置を逐次更新する）
  _animView = { ...view, players: {}, projectiles: {} };
  Object.keys(view.players).forEach(pid => {
    _animView.players[pid] = { ...view.players[pid] };
  });
  const rewound = rewindPlayersToActionStart(_animView, _actionQueue);
  restoreAliveStateForPendingEliminations(_animView, view, _actionQueue, rewound);
  hidePendingDogfightRevealAtActionStart(_animView, _actionQueue, rewound);
  restoreMinesForActionStart(_animView, _actionQueue);
  _initAnimMineCache(_animView);
  _syncAnimNearbyMines(_animView);

  // ソナー結果をアニメ開始時はクリア→ソナーイベント発火時に復元
  if (_animView.players[view.myId]) {
    _animView.players[view.myId].sonarResults = [];
    initializeAnimDogfightState(_animView, _actionQueue);
  }

  // 左巻きした初期状態を即座に描画（終了位置の一瞬表示を防ぐ）
  if (_renderState && _animView) _renderState(_animView);

  _nextActionStep();
}

function rewindPlayersToActionStart(animView, actionQueue) {
  // move イベントの fromX/fromY を使ってプレイヤーをアクション前の位置に巻き戻す
  // ただし capturedView で x が null のプレイヤー（視界外）は巻き戻さない
  const rewound = new Set();
  for (const ev of actionQueue) {
    if (ev.type !== 'move' || rewound.has(ev.pid) || ev.fromX == null) continue;
    const player = animView.players[ev.pid];
    if (player && player.x != null) {
      // 視界内プレイヤーのみ巻き戻す
      player.x = ev.fromX;
      player.y = ev.fromY;
      player.dir = ev.fromDir;
    }
    rewound.add(ev.pid);
  }
  return rewound;
}

function restoreAliveStateForPendingEliminations(animView, capturedView, actionQueue, rewound) {
  // alive 状態の巻き戻し + fog-of-war 修正:
  //   今ターン eliminated されるプレイヤー → アニメ開始時は alive=true に戻す
  //   move イベントがなく、かつ元々座標が非公開なら初期座標を隠す
  //   → eliminated イベント発火時にはじめて座標が公開される
  const eliminatedThisTurn = new Set(
    actionQueue.filter(e => e.type === 'eliminated').map(e => e.pid)
  );
  Object.keys(animView.players).forEach(pid => {
    const ap = animView.players[pid];
    if (!ap.alive && eliminatedThisTurn.has(pid)) {
      ap.alive = true;
      ap.respawning = false;
      if (!rewound.has(pid) && capturedView.players[pid]?.x == null) {
        ap.x = undefined; ap.y = undefined; ap.dir = undefined;
      }
    }
  });
}

function hidePendingDogfightRevealAtActionStart(animView, actionQueue, rewound) {
  const meId = animView.myId;
  const hiddenTargets = new Set();
  for (const ev of actionQueue) {
    if (ev.type !== 'dogfight_start' || !Array.isArray(ev.pids)) continue;
    if (!ev.pids.includes(meId)) continue;
    const otherId = ev.pids.find(id => id !== meId);
    if (otherId) hiddenTargets.add(otherId);
  }

  for (const pid of hiddenTargets) {
    if (rewound.has(pid)) continue;
    const p = animView.players?.[pid];
    if (!p) continue;
    p.x = undefined;
    p.y = undefined;
    p.dir = undefined;
  }
}

function restoreMinesForActionStart(animView, actionQueue) {
  if (!animView) return;
  const myMines = Array.isArray(animView.myMines) ? [...animView.myMines] : [];
  const nearbyMines = Array.isArray(animView.nearbyMines) ? [...animView.nearbyMines] : [];
  const hasMine = (arr, x, y) => arr.some(m => m.x === x && m.y === y);

  // 行動中に爆発する機雷は開始時に見えている状態へ戻す
  for (const ev of actionQueue) {
    if (ev.type !== 'explosion' || ev.x == null || ev.y == null) continue;
    if (!hasMine(myMines, ev.x, ev.y) && !hasMine(nearbyMines, ev.x, ev.y)) {
      nearbyMines.push({ x: ev.x, y: ev.y, ownerId: null });
    }
  }

  animView.myMines = myMines;
  animView.nearbyMines = nearbyMines;
}

function _initAnimMineCache(animView) {
  const merged = [
    ...(Array.isArray(animView.myMines) ? animView.myMines : []),
    ...(Array.isArray(animView.nearbyMines) ? animView.nearbyMines : []),
  ];
  const keySet = new Set();
  _animMineCache = [];
  for (const m of merged) {
    const key = `${m.x},${m.y}`;
    if (keySet.has(key)) continue;
    keySet.add(key);
    _animMineCache.push({ x: m.x, y: m.y, ownerId: m.ownerId ?? null });
  }
}

function _syncAnimNearbyMines(animView) {
  if (!animView) return;
  const me = animView.players?.[animView.myId];
  if (!me || typeof me.x !== 'number' || typeof me.y !== 'number') {
    animView.nearbyMines = [];
    return;
  }

  const myMineKeys = new Set((animView.myMines || []).map(m => `${m.x},${m.y}`));
  const nearby = _animMineCache.filter(m => {
    if (myMineKeys.has(`${m.x},${m.y}`)) return false;
    const dx = Math.abs(me.x - m.x);
    const dy = Math.abs(me.y - m.y);
    return Math.max(dx, dy) <= 3;
  });
  animView.nearbyMines = nearby;
}

function initializeAnimDogfightState(animView, actionQueue) {
  const meId = animView.myId;
  const me = animView.players[meId];
  if (!me) return;

  // いったんリセットし、イベントから必要な初期状態だけ復元する
  me.dogfightWith = null;

  const hasStartForMe = actionQueue.some(ev =>
    ev.type === 'dogfight_start' && Array.isArray(ev.pids) && ev.pids.includes(meId)
  );
  if (hasStartForMe) return;

  // このターンに dogfight_end だけが届く場合、前ターンから交戦中だったとみなして復元
  // （start は前ターンで発生済み。終了アニメを見せるために初期値を補う）
  const endForMe = actionQueue.find(ev => ev.type === 'dogfight_end' && ev.pid === meId && ev.otherId);
  if (endForMe) me.dogfightWith = endForMe.otherId;
}

/** アニメーションビューにイベントを適用してプレイヤー状態を更新 */
function _applyEventToAnimView(ev) {
  if (!_animView) return;
  // pid を持つイベントのみプレイヤー参照を取得（pid なしのイベントをスキップしない）
  const p = ev.pid ? _animView.players[ev.pid] : null;
  switch (ev.type) {
    case 'move':
      if (p) { p.x = ev.x; p.y = ev.y; p.dir = ev.dir; }
      if (ev.pid === _animView.myId) _syncAnimNearbyMines(_animView);
      break;
    case 'damage':    if (p) p.hp = ev.hp; break;
    case 'repair':    if (p) p.hp = ev.hp; break;
    case 'eliminated':
      if (p) {
        p.alive = false;
        if (ev.respawning != null) p.respawning = ev.respawning;
        // 死亡座標が含まれていれば位置を確定（霧が晴れても正しい位置に表示）
        if (ev.x != null) { p.x = ev.x; p.y = ev.y; }
      }
      // 死亡時点で残り演出を打ち切るため、飛翔体を停止する
      if (_animView?.projectiles) _animView.projectiles = {};
      _stopProjLoop();
      break;
    case 'dogfight_start': {
      // ドッグファイト開始: 位置が公開される → _animView に反映してバナー表示
      if (ev.pids && _actionBaseView) {
        const me = _animView.myId;
        if (ev.pids.includes(me)) {
          for (const pid of ev.pids) {
            if (pid !== me && ev.x != null && ev.y != null) {
              // 座標はイベント内に含まれていれば使用（なければ現在のまま）
            }
          }
          // バナーを表示（myプレイヤーの dogfightWith を animView に設定）
          const otherId = ev.pids.find(id => id !== me);
          if (otherId && _animView.players[me]) {
            _animView.players[me].dogfightWith = otherId;
          }
          _updateAnimDogfightBanner(_animView);
        }
      }
      break;
    }
    case 'dogfight_end': {
      if (p) {
        p.dogfightWith = null;
      }
      _updateAnimDogfightBanner(_animView);
      break;
    }
    case 'sonar': {
      // ソナーヒットをイベント発火時に復元（アニメ開始時はクリアしてある）
      if (p && ev.pid === _animView.myId && ev.hits) {
        if (!p.sonarResults) p.sonarResults = [];
        ev.hits.forEach(h => p.sonarResults.push(h));
      }
      break;
    }
    // 飛翔体発射: ピクセル座標で初期化し rAF ループ起動
    case 'torpedo_fire':
    case 'guided_fire': {
      if (!_animView.projectiles) _animView.projectiles = {};
      const projType = ev.type === 'torpedo_fire' ? 'torpedo' : 'guided';
      const cs = _getCellSize(), bo = _getOffset();
      const sx = bo.x + ev.sx * cs + cs / 2;
      const sy = bo.y + ev.sy * cs + cs / 2;
      _animView.projectiles[ev.projId] = {
        x: ev.sx, y: ev.sy,
        pixX: sx, pixY: sy,
        toPixX: sx, toPixY: sy,
        velX: 0, velY: 0,
        projType, ownerId: ev.pid,
      };
      _startProjLoop();
      break;
    }
    // 飛翔体位置更新: 目標ピクセル座標と速度をセットして rAF に任せる
    case 'projectile_tick': {
      if (!_animView.projectiles) _animView.projectiles = {};
      const proj = _animView.projectiles[ev.projId];
      if (!proj) break;
      const cs = _getCellSize(), bo = _getOffset();
      const toX = bo.x + ev.x * cs + cs / 2;
      const toY = bo.y + ev.y * cs + cs / 2;
      const durationMs = _eventDelay(ev);
      const dist = Math.hypot(toX - (proj.pixX ?? toX), toY - (proj.pixY ?? toY));
      const speed = dist > 0 ? dist / durationMs : 0;
      const angle = Math.atan2(toY - (proj.pixY ?? toY), toX - (proj.pixX ?? toX));
      proj.toPixX = toX; proj.toPixY = toY;
      proj.velX = speed * Math.cos(angle);
      proj.velY = speed * Math.sin(angle);
      proj.x = ev.x; proj.y = ev.y;
      _startProjLoop();
      break;
    }
    case 'projectile_hit':
    case 'projectile_miss':
      if (_animView.projectiles) delete _animView.projectiles[ev.projId];
      break;
    case 'mine_place':
      if (ev.x != null && ev.y != null) {
        if (!_animView.myMines) _animView.myMines = [];
        if (!_animView.myMines.some(m => m.x === ev.x && m.y === ev.y)) {
          _animView.myMines.push({ x: ev.x, y: ev.y, ownerId: ev.pid });
        }
        if (!_animMineCache.some(m => m.x === ev.x && m.y === ev.y)) {
          _animMineCache.push({ x: ev.x, y: ev.y, ownerId: ev.pid });
        }
        _syncAnimNearbyMines(_animView);
      }
      break;
    case 'explosion':
      if (ev.x != null && ev.y != null) {
        if (_animView.myMines) _animView.myMines = _animView.myMines.filter(m => !(m.x === ev.x && m.y === ev.y));
        if (_animView.nearbyMines) _animView.nearbyMines = _animView.nearbyMines.filter(m => !(m.x === ev.x && m.y === ev.y));
        _animMineCache = _animMineCache.filter(m => !(m.x === ev.x && m.y === ev.y));
        _syncAnimNearbyMines(_animView);
      }
      break;
  }
}

function _updateAnimDogfightBanner(animView) {
  const el = document.getElementById('dogfight-banner');
  if (!el) return;
  const me = animView.players[animView.myId];
  if (me?.dogfightWith) {
    const other = animView.players[me.dogfightWith];
    el.classList.remove('hidden');
    el.innerHTML = `⚠ ドッグファイトモード ⚠<br><small>${other?.name || '不明'} と近距離で交戦中</small>`;
  } else {
    el.classList.add('hidden');
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

  // 死亡発生後は残りイベントを再生せず終了へ向かう
  if (ev?.type === 'eliminated') {
    _actionQueue = [];
  }

  _animTimeoutId = setTimeout(_nextActionStep, _eventDelay(ev));
}

/** ドローフェーズ開始時に呼び、初期化済みアニメタイマーをキャンセルする。 */
export function clearActionAnimation() {
  _stopProjLoop();
  if (_animTimeoutId) { clearTimeout(_animTimeoutId); _animTimeoutId = null; }
  const evCb         = _actionOnEachEvent;
  _overlayEffects    = [];
  _animMineCache     = [];
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
      const hitX = vp?.x != null ? vp.x : ev.x;
      const hitY = vp?.y != null ? vp.y : ev.y;
      if (hitX != null && hitY != null) {
        const start = performance.now();
        _pushOverlayEffect({ type: 'damage', x: hitX, y: hitY, dmg: ev.dmg, start, until: start + 420 });
      }
      break;
    }
    case 'explosion': {
      const start = performance.now();
      _pushOverlayEffect({ type: 'explosion', x: ev.x, y: ev.y, color: '#ff6600', start, until: start + 320 });
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
      // 発射フラッシュ（実際の飛翔は projectile_tick イベントでアニメーションする）
      const tpx = bo.x + ev.sx * cs + cs / 2;
      const tpy = bo.y + ev.sy * cs + cs / 2;
      ctx.fillStyle = 'rgba(255,170,0,0.4)';
      ctx.beginPath(); ctx.arc(tpx, tpy, cs * 0.5, 0, Math.PI * 2); ctx.fill();
      _eventLabel('\u9b5a\u96f7\u767a\u5c04', ev.sx, ev.sy, '#ffaa00');
      break;
    }
    case 'guided_fire': {
      // 発射フラッシュ
      const gpx = bo.x + ev.sx * cs + cs / 2;
      const gpy = bo.y + ev.sy * cs + cs / 2;
      ctx.fillStyle = 'rgba(0,229,255,0.4)';
      ctx.beginPath(); ctx.arc(gpx, gpy, cs * 0.5, 0, Math.PI * 2); ctx.fill();
      _eventLabel('\u8ffd\u5c3e\u767a\u5c04', ev.sx, ev.sy, '#00e5ff');
      break;
    }
    case 'shotgun_fire': {
      // 散弾: 発射位置から扇形エリアを表示
      if (ev.dir != null) {
        const DD = { N:{dx:0,dy:-1}, S:{dx:0,dy:1}, E:{dx:1,dy:0}, W:{dx:-1,dy:0} };
        const RL = (d, t) => { const l=['N','E','S','W']; return l[(l.indexOf(d)+t+4)%4]; };
        const fwd = DD[ev.dir];
        const fanCells = [
          { dx: fwd.dx, dy: fwd.dy },
          { dx: DD[RL(ev.dir,-1)].dx + fwd.dx, dy: DD[RL(ev.dir,-1)].dy + fwd.dy },
          { dx: DD[RL(ev.dir, 1)].dx + fwd.dx, dy: DD[RL(ev.dir, 1)].dy + fwd.dy },
        ];
        ctx.fillStyle = 'rgba(255,160,0,0.22)';
        fanCells.forEach(fc => {
          const fx = bo.x + Math.max(0, Math.min(9, ev.sx + fc.dx)) * cs;
          const fy = bo.y + Math.max(0, Math.min(9, ev.sy + fc.dy)) * cs;
          ctx.fillRect(fx + 1, fy + 1, cs - 2, cs - 2);
        });
        ctx.strokeStyle = 'rgba(255,160,0,0.85)'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        fanCells.forEach(fc => {
          const fx = bo.x + Math.max(0, Math.min(9, ev.sx + fc.dx)) * cs;
          const fy = bo.y + Math.max(0, Math.min(9, ev.sy + fc.dy)) * cs;
          ctx.strokeRect(fx + 1, fy + 1, cs - 2, cs - 2);
        });
        ctx.setLineDash([]);
        _eventLabel('\u6563\u5f3e', ev.sx, ev.sy, '#ffa000');
      }
      break;
    }
    case 'projectile_tick': {
      // 飛翔体移動は _applyEventToAnimView で vel/pos を設定し rAF ループが描画する
      // アノテーションラベルのみここで出す
      const color = ev.projType === 'guided' ? '#00e5ff' : ev.projType === 'shotgun' ? '#ffa000' : '#ffaa00';
      const label = ev.projType === 'guided' ? '追尾' : ev.projType === 'shotgun' ? '散弾' : '魚雷';
      _eventLabel(label, ev.x, ev.y, color);
      break;
    }
    case 'projectile_hit': {
      // 命中爆発 (blocked = チャフ無効化)
      const hitColor = ev.projType === 'guided' ? '#00e5ff' : '#ffaa00';
      if (ev.blocked) {
        _eventLabel('\u30c1\u30e3\u30d5\u7121\u52b9', ev.x, ev.y, '#b4dcff');
      } else {
        const start = performance.now();
        _pushOverlayEffect({ type: 'explosion', x: ev.x, y: ev.y, color: hitColor, start, until: start + 300 });
        _eventLabel('\u547d\u4e2d', ev.x, ev.y, '#ff4444');
      }
      break;
    }
    case 'projectile_miss': {
      // 射程切れ・屋外れ: 小さなパフ
      const mpx = bo.x + ev.x * cs + cs / 2, mpy = bo.y + ev.y * cs + cs / 2;
      ctx.strokeStyle = 'rgba(180,180,180,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(mpx, mpy, cs * 0.28, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case 'tick_start':
      break; // ティック境界は視覚アノテーションなし
      if (ev.op === 'torpedo' && ev.sx != null && ev.ex != null) {
        const x1 = bo.x + ev.sx * cs + cs / 2;
        const y1 = bo.y + ev.sy * cs + cs / 2;
        const x2 = bo.x + ev.ex * cs + cs / 2;
        const y2 = bo.y + ev.ey * cs + cs / 2;
        ctx.strokeStyle = 'rgba(255,170,0,0.55)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.setLineDash([]);
        _arrowHead(x2, y2, x2 - x1, y2 - y1, 'rgba(255,170,0,0.7)');
        _eventLabel('魚雷', ev.sx, ev.sy, '#ffaa00');
      } else if (ev.op === 'shotgun') {
        // 散弾: 発射者の位置 + 方向から扇形3セルを描画
        const vp = baseView.players[ev.pid];
        if (vp && vp.x != null && ev.dir) {
          const DD = { N:{dx:0,dy:-1}, S:{dx:0,dy:1}, E:{dx:1,dy:0}, W:{dx:-1,dy:0} };
          const RL = (dir, t) => { const l=['N','E','S','W']; return l[(l.indexOf(dir)+t+4)%4]; };
          const ox = bo.x + vp.x * cs + cs / 2;
          const oy = bo.y + vp.y * cs + cs / 2;
          const fwd = DD[ev.dir];
          const fanCells = [
            { dx: fwd.dx,                              dy: fwd.dy                             },
            { dx: DD[RL(ev.dir,-1)].dx + fwd.dx,      dy: DD[RL(ev.dir,-1)].dy + fwd.dy     },
            { dx: DD[RL(ev.dir, 1)].dx + fwd.dx,      dy: DD[RL(ev.dir, 1)].dy + fwd.dy     },
          ];
          // セル塗り
          ctx.fillStyle = 'rgba(255,160,0,0.22)';
          fanCells.forEach(fc => {
            const fx = bo.x + Math.max(0,Math.min(9,vp.x + fc.dx)) * cs;
            const fy = bo.y + Math.max(0,Math.min(9,vp.y + fc.dy)) * cs;
            ctx.fillRect(fx + 1, fy + 1, cs - 2, cs - 2);
          });
          // セル枠
          ctx.strokeStyle = 'rgba(255,160,0,0.85)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          fanCells.forEach(fc => {
            const fx = bo.x + Math.max(0,Math.min(9,vp.x + fc.dx)) * cs;
            const fy = bo.y + Math.max(0,Math.min(9,vp.y + fc.dy)) * cs;
            ctx.strokeRect(fx + 1, fy + 1, cs - 2, cs - 2);
          });
          ctx.setLineDash([]);
          // 発射元→各セルへ矢印
          fanCells.forEach(fc => {
            const ex = bo.x + Math.max(0,Math.min(9,vp.x + fc.dx)) * cs + cs / 2;
            const ey = bo.y + Math.max(0,Math.min(9,vp.y + fc.dy)) * cs + cs / 2;
            ctx.strokeStyle = 'rgba(255,200,0,0.75)';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
            _arrowHead(ex, ey, ex - ox, ey - oy, 'rgba(255,200,0,0.9)');
          });
          _eventLabel('散弾', vp.x, vp.y, '#ffa000');
        }
      } else if (ev.op === 'guided' && ev.cx != null) {
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
    case 'buff': {
      // チャフ / 盾甲板の発動アニメーション
      const bp = baseView.players[ev.pid];
      if (bp && bp.x != null) {
        const bx = bo.x + bp.x * cs + cs / 2;
        const by = bo.y + bp.y * cs + cs / 2;
        if (ev.op === 'chaff') {
          // 青白のリングパルス
          ctx.strokeStyle = 'rgba(180,220,255,0.85)';
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 2]);
          ctx.beginPath(); ctx.arc(bx, by, cs * 0.48, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(180,220,255,0.15)';
          ctx.beginPath(); ctx.arc(bx, by, cs * 0.48, 0, Math.PI * 2); ctx.fill();
          _eventLabel('チャフ展開', bp.x, bp.y, '#b4dcff');
        } else if (ev.op === 'armor') {
          // 黄色の実線リング
          ctx.strokeStyle = 'rgba(255,215,0,0.9)';
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.arc(bx, by, cs * 0.48, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = 'rgba(255,215,0,0.12)';
          ctx.fill();
          _eventLabel('盾甲展開', bp.x, bp.y, '#ffd700');
        }
      }
      break;
    }
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
