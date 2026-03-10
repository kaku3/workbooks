// ============================================================
// render.js  ゲーム画面の描画（DOM操作のみ）
// ============================================================

import { LOCATIONS, CARD_TYPES, ROLES } from './constants.js';
import { getCurrentPlayer } from './gameLogic.js';
import { showEffectOverlay } from './modal.js';

// Monopoly型ペリメター配置: [row, col] (5列5行グリッド)
const BOARD_POSITIONS = [
  [5, 1], // 0: スタート
  [5, 2], // 1: ジャンク屋
  [5, 3], // 2: 酒場
  [5, 4], // 3: 探偵事務所
  [5, 5], // 4: パーツ工場
  [4, 5], // 5: カジノ
  [3, 5], // 6: タワー
  [2, 5], // 7: スクランブル交差点
  [1, 5], // 8: 交番
  [1, 4], // 9: 闇市
  [1, 3], // 10: 放送局
  [1, 2], // 11: 工事現場
  [1, 1], // 12: 廃材置き場
  [2, 1], // 13: 病院
  [3, 1], // 14: 警察本部
  [4, 1], // 15: 倉庫
];

// ターン開始オーバーレイの表示制御
let lastRenderedTurnCount = -1;
let turnAutoTimer = null;

// 移動アニメーション用モジュール局所変数
let prevPlayerPos = {}; // { playerId: 前回の位置 }
let isAnimating   = false;

// プレイヤーカラー（座席順で固定割り当て）
const PLAYER_COLORS = [
  { bg: '#c0392b', text: '#fff', name: '赤' }, // 0: 赤
  { bg: '#2471a3', text: '#fff', name: '青' }, // 1: 青
  { bg: '#1e8449', text: '#fff', name: '緑' }, // 2: 緑
  { bg: '#b7950b', text: '#111', name: '黄' }, // 3: 黄
  { bg: '#7d3c98', text: '#fff', name: '紫' }, // 4: 紫
  { bg: '#117a65', text: '#fff', name: '青緑' }, // 5: 青緑
];

// ロケーションごとのパステル背景色（16マス分）
const LOCATION_COLORS = [
  '#ffe0a0', // 0 スタート（温かい黄）
  '#b2dfdb', // 1 ジャンク屋（ミントグリーン）
  '#ffccbc', // 2 酒場（サーモンピンク）
  '#bbdefb', // 3 探偵事務所（スカイブルー）
  '#e1bee7', // 4 パーツ工場（ラベンダー）
  '#fff9c4', // 5 カジノ（ボールドイエロー）
  '#ffcdd2', // 6 タワー（コーラルピンク）
  '#c8e6c9', // 7 スクランブル交差点（パステルグリーン）
  '#b3e5fc', // 8 交番（ライトブルー）
  '#d7ccc8', // 9 闇市（ベージュグレー）
  '#f8bbd0', // 10 放送局（パールピンク）
  '#ffe0b2', // 11 工事現場（オレンジ）
  '#d1c4e9', // 12 廃材置き場（ラベンダーパープル）
  '#dcedc8', // 13 病院（ライムグリーン）
  '#cfd8dc', // 14 警察本部（スチールブルー）
  '#ffe082', // 15 倉庫（アンバーイエロー）
];
function getColor(state, playerId) {
  const idx = state.players.findIndex(p => p.id === playerId);
  return PLAYER_COLORS[idx] ?? PLAYER_COLORS[0];
}

/**
 * ゲーム画面全体を再描画する。
 * @param {object}   state            - 自分視点のサニタイズ済みゲーム状態
 * @param {string}   myId             - 自分の PeerJS ID
 * @param {object}   nameMap          - { peerId: displayName } のマップ
 * @param {function} onCardClick      - カードクリック時コールバック (card) => void
 * @param {function} onLocationPrompt - ロケーション効果解決UI表示コールバック (loc, state) => void
 * @param {function} onDraw           - カードドロー実行コールバック () => void
 */
export function renderGame(state, myId, nameMap, onCardClick, onLocationPrompt, onDraw) {
  // ---- 移動アニメーション検出 ----
  if (!isAnimating) {
    const cur = getCurrentPlayer(state);
    if (cur && state.phase === 'location') {
      const prevPos = prevPlayerPos[cur.id];
      if (prevPos != null && prevPos !== cur.position) {
        // 前回位置を先に更新（再トリガーを防ぐ）
        prevPlayerPos[cur.id] = cur.position;
        isAnimating = true;
        // ロケーションプロンプト以外を先に描画
        renderPlayerList(state, myId, nameMap);
        renderMyHand(state, myId, onCardClick);
        renderLog(state);
        showTurnStartIfNeeded(state, myId, nameMap, onDraw);
        _applyRoleBadge(state, myId);
        // アニメーション実行 → 完了後にモーダル表示
        animatePawnMove(state, myId, cur.id, prevPos, cur.position).then(() => {
          isAnimating = false;
          renderBoard(state, myId); // 確定位置で再描画
          const modal = document.getElementById('modal-overlay');
          const isMyturnNow = getCurrentPlayer(state)?.id === myId;
          if (isMyturnNow && !state.winner &&
              (!modal || modal.style.display !== 'flex') &&
              state.pendingAction?.locationIndex != null) {
            onLocationPrompt?.(LOCATIONS[state.pendingAction.locationIndex], state);
          }
        });
        return;
      }
    }
    // アニメーション中以外は常に位置を記録
    state.players.forEach(p => { prevPlayerPos[p.id] = p.position; });
  }

  // 通常描画
  renderBoard(state, myId);
  renderPlayerList(state, myId, nameMap);
  renderMyHand(state, myId, onCardClick);
  renderLog(state);
  renderPhaseControls(state, myId, nameMap, onLocationPrompt);
  showTurnStartIfNeeded(state, myId, nameMap, onDraw);
  _applyRoleBadge(state, myId);
}

function _applyRoleBadge(state, myId) {
  const me = state.players.find(p => p.id === myId);
  if (me?.role) {
    const label = me.role === ROLES.BOMBER ? ' 爆弾魔' : ' 解除班';
    const roleEl    = document.getElementById('my-role-indicator');
    const roleBadge = document.getElementById('my-role-badge');
    if (roleEl)    roleEl.textContent    = label;
    if (roleBadge) roleBadge.textContent = label;
  }
}

// ---- ボード（モノポリー型長方形外周配置） ----
function renderBoard(state, myId) {
  const board = document.getElementById('board');
  if (!board) return;
  board.innerHTML = '';

  // 中央装飾エリア
  const center = document.createElement('div');
  center.className = 'board-center';
  center.style.gridRow    = '2 / 5';
  center.style.gridColumn = '2 / 5';
  const cur = getCurrentPlayer(state);
  const curName = cur ? (cur.id === myId ? 'あなた' : (cur.name ?? cur.id.slice(0, 6))) : '';
  const curCol = cur ? getColor(state, cur.id) : null;
  const turnHtml = cur
    ? `<div class="board-center-turn" style="background:${curCol.bg};color:${curCol.text}">▶ ${curName}</div>`
    : '';
  center.innerHTML = `<div class="board-center-icon"></div><div class="board-center-title">爆弾魔 vs 解除班</div>${turnHtml}`;
  board.appendChild(center);

  LOCATIONS.forEach((loc, idx) => {
    const [row, col] = BOARD_POSITIONS[idx];
    const cell = document.createElement('div');
    cell.className = 'location-cell';
    cell.dataset.idx = idx;
    cell.style.gridRow    = row;
    cell.style.gridColumn = col;
    cell.style.backgroundColor = LOCATION_COLORS[idx] ?? 'var(--bg2)';

    if (state.blockedLocation === idx) cell.classList.add('blocked');

    const here = state.players.filter(p => p.position === idx);
    cell.innerHTML = `
      <div class="loc-name">${loc.name}</div>
      <div class="loc-bg-emoji">${loc.emoji}</div>
      <div class="loc-pawns">${here.map(p => pawnHtml(p, state, myId)).join('')}</div>
    `;
    cell.title = loc.desc + (state.blockedLocation === idx ? '  通行止め中' : '');
    cell.addEventListener('click', () => {
      const blocked = state.blockedLocation === idx;
      showEffectOverlay({
        icon:  loc.emoji,
        title: loc.name,
        body:  loc.desc + (blocked ? '\n🚧 現在通行止め中！' : ''),
      });
    });
    board.appendChild(cell);
  });
}

function pawnHtml(player, state, myId) {
  const col           = getColor(state, player.id);
  const isMe          = player.id === myId;
  const isActiveTurn  = player.id === getCurrentPlayer(state)?.id;
  const name          = isMe ? 'あなた' : player.id.slice(0, 4);
  const ring          = isMe ? ' pawn-me' : '';
  const activeCls     = isActiveTurn ? ' pawn-active' : '';
  return `<span class="pawn${ring}${activeCls}" style="background:${col.bg};color:${col.text}" title="${name}"></span>`;
}

// ---- プレイヤー一覧（自分を先頭に、ターン順） ----
function renderPlayerList(state, myId, nameMap) {
  const panel = document.getElementById('player-list-inner');
  if (!panel) return;
  panel.innerHTML = '';

  const currentPlayerId = getCurrentPlayer(state)?.id;

  // 自分を先頭にターン順で並べる
  const myIdx = state.players.findIndex(p => p.id === myId);
  const ordered = myIdx >= 0
    ? [...state.players.slice(myIdx), ...state.players.slice(0, myIdx)]
    : [...state.players];

  ordered.forEach(p => {
    const isMe      = p.id === myId;
    const isCurrent = p.id === currentPlayerId;
    const col       = getColor(state, p.id);
    const div = document.createElement('div');
    div.className = `player-item${isCurrent ? ' current-turn' : ''}${isMe ? ' is-me' : ''}`;
    div.style.borderLeftColor = col.bg;
    div.style.background = isCurrent
      ? `${col.bg}33`   // 20% opacity tint when active
      : `${col.bg}18`;  // subtle tint always

    const name   = nameMap?.[p.id] ?? (isMe ? 'あなた' : p.id.slice(0, 6));
    const dot    = `<span class="player-dot" style="background:${col.bg};color:${col.text}"></span>`;
    if (isCurrent) {
      div.style.background = '#fef9c3';
      div.style.color = '#1a1a1a';
    }
    div.innerHTML = `
      <div class="player-item-name">${dot}${name}${isMe ? ' 👤' : ''}</div>
      <div class="player-item-sub">手札 ${p.hand.length}枚</div>
      <div class="player-item-sub">${LOCATIONS[p.position]?.emoji} ${LOCATIONS[p.position]?.name}</div>
    `;
    panel.appendChild(div);
  });
}

// ---- 自分の手札 ----
// 手札ソート状態の保持
let handSorted = false;

function getSortedHand(hand) {
  // 移動 → アクション → アイテムの順、各カテゴリ内は id 順
  const typeOrder = { [CARD_TYPES.MOVE]: 0, [CARD_TYPES.ACTION]: 1, [CARD_TYPES.ITEM]: 2 };
  return [...hand].sort((a, b) => {
    const td = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
    if (td !== 0) return td;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

/** 現在のソート設定を適用した表示用手札を返す（modal.jsに渡す用） */
export function getDisplayHand(hand) {
  return handSorted ? getSortedHand(hand) : hand;
}

function renderMyHand(state, myId, onCardClick) {
  const handEl = document.getElementById('my-hand');
  if (!handEl) return;
  handEl.innerHTML = '';

  const me = state.players.find(p => p.id === myId);
  if (!me) return;

  const isMyturn = getCurrentPlayer(state)?.id === myId;

  // 手札パネルのハイライト（自分のターンのみ明るく）
  document.querySelector('.hand-panel')?.classList.toggle('my-turn', isMyturn);

  const displayHand = handSorted ? getSortedHand(me.hand) : me.hand;
  displayHand.forEach(card => {
    handEl.appendChild(createCardElement(card, isMyturn, onCardClick));
  });

  // ソートボタン
  const sortBtn = document.getElementById('btn-sort');
  if (sortBtn) {
    sortBtn.textContent = handSorted ? '↓ ソート中' : '🔀 ソート';
    sortBtn.onclick = () => {
      handSorted = !handSorted;
      renderMyHand(state, myId, onCardClick);
    };
  }

  // 確保宣言ボタン（解除班がキット3種揃えて誰かと同マスにいるとき表示）
  const arrestBtn = document.getElementById('btn-arrest');
  if (arrestBtn) {
    const hasAllKits = ['kit_x', 'kit_y', 'kit_z'].every(f => me.hand.some(c => c.family === f));
    const othersHere = state.players.some(p => p.id !== myId && p.position === me.position);
    arrestBtn.style.display = (me.role === ROLES.DEFUSER && hasAllKits && othersHere) ? 'inline-block' : 'none';
  }
}

// assets/cards.png スプライトタイルマップ（8列×4行）
// key → [col, row]  col:0-7, row:0-3
// テーマは constants.js の card.theme で上書き可能 ('dark' | 'light')
// デフォルト 'dark'（暗い下地＋白文字）。明るい画像のカードは 'light' を指定。

// スプライトシート内忍島定数 (cards.png)
// タイル 1枚の元サイズとギャップから、カード表示サイズに合わせた
const SPRITE = (() => {
  const TILE_W = 80, TILE_H = 96, GAP = 0, COLS = 8, ROWS = 4;
  const CARD_H = 110;
  // X方向: タイル幅 = カード幅なのでスケール不要
  // Y方向: タイルをカード上下中央に配置するオフセット
  const offsetY = (CARD_H - TILE_H) / 2; // = 7px
  return {
    BG_W:    (COLS * TILE_W) + 'px',  // 640px
    BG_H:    (ROWS * TILE_H) + 'px',  // 384px
    STEP_X:  TILE_W,                   // 80px
    STEP_Y:  TILE_H,                   // 96px
    OFFSET_Y: offsetY,                 // 7px
  };
})();

const CARD_TILE_MAP = {
  // 移動カード（移動量別）
  move_1:  [0,0], move_2:  [1,0], move_3:  [2,0], move_4:  [3,0],
  move_5:  [4,0], move_6:  [5,0], move_7:  [6,0], move_8:  [7,0],
  move_9:  [0,1], move_10: [1,1], move_11: [2,1], move_12: [3,1],
  // アクションカード（action 名別）
  trade:   [4,1], steal:   [5,1], pass:    [6,1], dump:    [7,1],
  peek:    [0,2], expose:  [1,2], whisper: [2,2], skip:    [3,2],
  block:   [4,2], detect:  [5,2], dash:    [6,2], smoke:   [7,2],
  // アイテムカード（family 別）
  bomb_a:  [0,3], bomb_b:  [1,3], bomb_c:  [2,3],
  kit_x:   [3,3], kit_y:   [4,3], kit_z:   [5,3],
  dummy:   [6,3],
};

function getCardTile(card) {
  if (card.type === CARD_TYPES.MOVE)   return CARD_TILE_MAP[`move_${card.value}`] ?? null;
  if (card.type === CARD_TYPES.ACTION) return CARD_TILE_MAP[card.action]           ?? null;
  if (card.type === CARD_TYPES.ITEM)   return CARD_TILE_MAP[card.family]           ?? CARD_TILE_MAP['dummy'];
  return null;
}

/**
 * カード要素を生成して返す。
 */
export function createCardElement(card, playable, onClickCb) {
  const div = document.createElement('div');
  div.className = 'card';

  if (card.hidden) {
    div.classList.add('hidden-card');
    div.textContent = '?';
    return div;
  }

  const typeClass = card.type === CARD_TYPES.MOVE   ? 'card-move'
                  : card.type === CARD_TYPES.ITEM   ? 'card-item'
                  : 'card-action';
  div.classList.add(typeClass);

  // スプライト画像を .card-art 子要素に設定（height:96px で下の行をクリップ）
  const tile = getCardTile(card);
  const artDiv = document.createElement('div');
  artDiv.className = 'card-art';
  if (tile) {
    const [col, row] = tile;
    artDiv.style.backgroundSize     = `${SPRITE.BG_W} ${SPRITE.BG_H}`;
    artDiv.style.backgroundPosition = `${-(col * SPRITE.STEP_X)}px ${-(row * SPRITE.STEP_Y)}px`;
  }

  // テーマ: dark=暗い下地＋白文字 / light=明るい下地＋黒文字
  // constants.js の card.theme プロパティで個別上書き可能
  div.dataset.theme = card.theme ?? 'dark';

  // カード種別に応じたレイアウト
  if (card.type === CARD_TYPES.MOVE) {
    // 移動カード: 左上数字ラベルを card-art の中にオーバーレイ
    artDiv.insertAdjacentHTML('beforeend', `<div class="card-label card-label--corner">${card.label}</div>`);
    div.appendChild(artDiv);
    div.insertAdjacentHTML('beforeend', `<div class="card-desc card-desc--bar">${card.desc}</div>`);
  } else {
    // アクション/アイテムカード: 上全幅ラベルを card-art の中にオーバーレイ
    artDiv.insertAdjacentHTML('beforeend', `<div class="card-label card-label--top">${card.label}</div>`);
    div.appendChild(artDiv);
    div.insertAdjacentHTML('beforeend', `<div class="card-desc card-desc--bar">${card.desc}</div>`);
  }

  if (playable && card.type !== CARD_TYPES.ITEM && onClickCb) {
    div.classList.add('playable');
    div.addEventListener('click', () => onClickCb(card));
  }
  return div;
}

// ---- ログ ----
function renderLog(state) {
  const logEl = document.getElementById('game-log');
  if (!logEl) return;
  logEl.innerHTML = state.log.slice(-10).reverse().map(
    l => `<p>[T${l.turn}] ${l.message}</p>`
  ).join('');
}

// ---- フェーズ別コントロール ----
function renderPhaseControls(state, myId, nameMap, onLocationPrompt) {
  const isMyturn = getCurrentPlayer(state)?.id === myId;
  // ロケーション効果が保留中  解決 UIを表示（モーダルが既に開いている場合はスキップ）
  if (isMyturn && !state.winner && state.phase === 'location' && state.pendingAction?.locationIndex != null) {
    const modal = document.getElementById('modal-overlay');
    if (!modal || modal.style.display !== 'flex') {
      const loc = LOCATIONS[state.pendingAction.locationIndex];
      if (onLocationPrompt) onLocationPrompt(loc, state);
    }
  }
}

// ---- コマ移動アニメーション ----
async function animatePawnMove(state, myId, moverId, fromPos, toPos) {
  const total = LOCATIONS.length;
  let pos = fromPos;
  const steps = [];
  while (pos !== toPos) {
    pos = (pos + 1) % total;
    steps.push(pos);
  }

  for (const stepPos of steps) {
    const fakeState = {
      ...state,
      players: state.players.map(p =>
        p.id === moverId ? { ...p, position: stepPos } : p
      ),
    };
    renderBoard(fakeState, myId);

    // 到着セルを一時ハイライト
    document.querySelectorAll('.location-cell').forEach(c => c.classList.remove('pawn-landing'));
    document.querySelector(`.location-cell[data-idx="${stepPos}"]`)?.classList.add('pawn-landing');

    await new Promise(r => setTimeout(r, 180));
  }

  // ハイライト解除
  document.querySelectorAll('.location-cell').forEach(c => c.classList.remove('pawn-landing'));
}

// ---- ターン開始オーバーレイ ----
function showTurnStartIfNeeded(state, myId, nameMap, onDraw) {
  if (state.phase !== 'draw') return;
  if (state.turnCount === lastRenderedTurnCount) return;
  lastRenderedTurnCount = state.turnCount;

  const cur      = getCurrentPlayer(state);
  const isMyTurn = cur?.id === myId;
  const name     = nameMap?.[cur?.id] ?? (isMyTurn ? 'あなた' : (cur?.id?.slice(0, 8) ?? '?'));

  const overlay = document.getElementById('turn-start-overlay');
  if (!overlay) return;

  if (turnAutoTimer) { clearTimeout(turnAutoTimer); turnAutoTimer = null; }

  overlay.innerHTML = `<div class="turn-start-name">${name} のターン</div>`;

  if (isMyTurn) {
    const btn = document.createElement('button');
    btn.className = 'btn-primary turn-start-draw-btn';
    btn.textContent = ' カードをドロー';
    btn.onclick = () => {
      overlay.style.display = 'none';
      if (onDraw) onDraw();
    };
    overlay.appendChild(btn);
  } else {
    turnAutoTimer = setTimeout(() => {
      overlay.style.display = 'none';
    }, 2000);
  }

  overlay.style.display = 'flex';
}
