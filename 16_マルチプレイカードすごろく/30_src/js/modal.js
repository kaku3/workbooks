// ============================================================
// modal.js  モーダル・ターゲット選択・ロケーション効果UI
// ============================================================

import { LOCATIONS, CARD_TYPES } from './constants.js';
import { sendPlayCard, sendResolveLoc } from './peer.js';
import { getCardTile } from './render.js';

// ============================================================
// カードオーバーレイ キュー（複数枚順番表示）
// ============================================================
const _overlayQueue = [];
let _overlayPlaying = false;

export function enqueueCardOverlay(event) {
  _overlayQueue.push(event);
  if (!_overlayPlaying) _flushOverlayQueue();
}

function _flushOverlayQueue() {
  if (_overlayQueue.length === 0) { _overlayPlaying = false; return; }
  _overlayPlaying = true;
  const ev = _overlayQueue.shift();
  if (ev.isLost) showLostCardOverlay(ev, _flushOverlayQueue);
  else            showDrawCardOverlay(ev, _flushOverlayQueue);
}

// ---- 内部ヘルパー ----
function getModal() {
  return {
    overlay: document.getElementById('modal-overlay'),
    content: document.getElementById('modal-content'),
  };
}

function openModal() {
  const { overlay } = getModal();
  if (!overlay) return;
  overlay.style.display = 'flex';
  overlay.classList.remove('modal-open');
  void overlay.offsetWidth; // reflow でアニメーション再起動
  overlay.classList.add('modal-open');
  document.body.classList.add('modal-scroll-lock');
}

function closeModal() {
  const { overlay } = getModal();
  if (overlay) overlay.style.display = 'none';
  document.body.classList.remove('modal-scroll-lock');
}

// ============================================================
// プレイヤー/ロケーション ターゲット選択
// ============================================================
/**
 * アクションカードのターゲット選択モーダルを表示する。
 * @param {object}   card        - プレイしようとしているカード
 * @param {object}   localState  - 自分視点のゲーム状態
 * @param {string}   myId        - 自分の PeerJS ID
 */
export function showTargetSelector(card, localState, myId, nameMap = {}, getDisplayHand = null) {
  const { content } = getModal();
  if (!content) return;

  const otherPlayers = localState.players.filter(p => p.id !== myId);
  const isLocation   = card.action === 'block';

  content.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = `${card.label} の対象を選んでください`;
  content.appendChild(title);

  if (isLocation) {
    // スタート・タワーは通行止め不可
    LOCATIONS
      .filter(loc => loc.type !== 'start' && loc.type !== 'tower')
      .forEach(loc => {
      const btn = document.createElement('button');
      btn.textContent = `${loc.emoji} ${loc.name}`;
      btn.onclick = () => {
        closeModal();
        sendPlayCard(card.id, null, null, loc.id);
      };
      content.appendChild(btn);
    });
  } else {
    otherPlayers.forEach(p => {
      const btn = document.createElement('button');
      btn.textContent = nameMap[p.id] ?? p.id.slice(0, 8);
      btn.onclick = () => {
        closeModal();
        if (card.action === 'trade') {
          showMyCardSelector(card, p.id, localState, myId, getDisplayHand);
        } else {
          sendPlayCard(card.id, p.id);
        }
      };
      content.appendChild(btn);
    });
  }

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'キャンセル';
  cancelBtn.className = 'btn-cancel';
  cancelBtn.onclick = closeModal;
  content.appendChild(cancelBtn);

  openModal();
}

// ============================================================
// 渡すカード選択
// ============================================================
/**
 * trade/steal で自分の手札から渡すカードを選ぶモーダルを表示する。
 */
export function showMyCardSelector(card, targetId, localState, myId, getDisplayHand = null) {
  const { content } = getModal();
  if (!content) return;

  const me = localState.players.find(p => p.id === myId);
  const displayHand = getDisplayHand ? getDisplayHand(me.hand) : me.hand;

  content.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = '🤝 取引：渡すカードを選んでください';
  content.appendChild(title);

  const sub = document.createElement('p');
  sub.textContent = '選んだカードを相手に渡します';
  sub.style.fontSize = '0.85rem';
  sub.style.color = 'var(--text-dim, #aaa)';
  content.appendChild(sub);

  displayHand
    .filter(c => c.id !== card.id)  // 使った取引カード自身を除外
    .forEach(c => {
      const btn = document.createElement('button');
      btn.innerHTML = `<strong>${c.label}</strong><br><small>${c.desc ?? ''}</small>`;
      btn.style.display = 'block';
      btn.style.width = '100%';
      btn.style.marginBottom = '6px';
      btn.onclick = () => {
        closeModal();
        sendPlayCard(card.id, targetId, c.id);
      };
      content.appendChild(btn);
    });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'キャンセル';
  cancelBtn.className = 'btn-cancel';
  cancelBtn.onclick = closeModal;
  content.appendChild(cancelBtn);

  openModal();
}

// ============================================================
// ロケーション効果解決UI
// ============================================================
/**
 * 手番プレイヤーがロケーション効果を解決するためのモーダルを表示する。
 * @param {object} loc     - ロケーション定義
 * @param {object} state   - 自分視点のゲーム状態
 * @param {string} myId    - 自分の PeerJS ID
 * @param {object} nameMap - { peerId: displayName }
 */
export function showLocationPrompt(loc, state, myId, nameMap = {}) {
  const { content } = getModal();
  if (!content) return;

  content.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = `${loc.emoji} ${loc.name}`;
  content.appendChild(title);

  // 通行止め中チェック
  if (state.blockedLocation === loc.id) {
    const msg = document.createElement('p');
    msg.textContent = '🚧 このマスは通行止め中！ロケーション効果なし。';
    msg.style.color = '#c0392b';
    msg.style.fontWeight = 'bold';
    content.appendChild(msg);
    const ok = document.createElement('button');
    ok.textContent = '次のターンへ';
    ok.onclick = () => { closeModal(); sendResolveLoc(loc.type); };
    content.appendChild(ok);
    openModal();
    return;
  }

  const desc = document.createElement('p');
  desc.textContent = loc.desc;
  content.appendChild(desc);

  switch (loc.type) {
    case 'factory': {
      const pile = state.pendingAction?.itemPile || [];
      if (pile.length === 0) {
        const info = document.createElement('p');
        info.textContent = 'アイテムパイルが空です。';
        content.appendChild(info);
        const ok = document.createElement('button');
        ok.textContent = 'OK';
        ok.onclick = () => { closeModal(); sendResolveLoc(loc.type); };
        content.appendChild(ok);
      } else {
        const info = document.createElement('p');
        info.textContent = 'アイテムパイルから1枚選んでください：';
        info.style.fontSize = '0.85rem';
        content.appendChild(info);
        pile.forEach(c => {
          const btn = document.createElement('button');
          btn.innerHTML = `<strong>${c.label}</strong><br><small>${c.desc}</small>`;
          btn.style.display = 'block';
          btn.style.width = '100%';
          btn.style.marginBottom = '6px';
          btn.onclick = () => { closeModal(); sendResolveLoc(loc.type, c.id); };
          content.appendChild(btn);
        });
      }
      break;
    }
    case 'tower': {
      const deckPreview = state.pendingAction?.deck || [];
      if (deckPreview.length === 0) {
        const info = document.createElement('p');
        info.textContent = '山札が空のため効果なし。';
        content.appendChild(info);
        const ok = document.createElement('button');
        ok.textContent = 'OK';
        ok.onclick = () => { closeModal(); sendResolveLoc(loc.type); };
        content.appendChild(ok);
      } else {
        deckPreview.forEach(c => {
          const btn = document.createElement('button');
          btn.textContent = c.label;
          btn.onclick = () => { closeModal(); sendResolveLoc(loc.type, c.id); };
          content.appendChild(btn);
        });
      }
      break;
    }
    case 'alley':
    case 'black_mkt': {
      const discardPreview = state.pendingAction?.discard || [];
      if (discardPreview.length === 0) {
        const info = document.createElement('p');
        info.textContent = '捨て札がありません。';
        content.appendChild(info);
        const ok = document.createElement('button');
        ok.textContent = 'OK';
        ok.onclick = () => { closeModal(); sendResolveLoc(loc.type); };
        content.appendChild(ok);
      } else {
        discardPreview.forEach(c => {
          const btn = document.createElement('button');
          btn.textContent = c.label;
          btn.onclick = () => { closeModal(); sendResolveLoc(loc.type, c.id); };
          content.appendChild(btn);
        });
      }
      break;
    }
    case 'detective':
    case 'police_box':
    case 'police_hq': {
      state.players.filter(p => p.id !== myId).forEach(p => {
        const btn = document.createElement('button');
        btn.textContent = nameMap[p.id] ?? p.id.slice(0, 8);
        btn.onclick = () => { closeModal(); sendResolveLoc(loc.type, p.id); };
        content.appendChild(btn);
      });
      break;
    }
    default: {
      const ok = document.createElement('button');
      ok.textContent = '効果を受ける';
      ok.onclick = () => { closeModal(); sendResolveLoc(loc.type); };
      content.appendChild(ok);
    }
  }

  openModal();
}

// ============================================================
// 横流しカード選択（全員同時）
// ============================================================
/**
 * 横流しで渡すカードを選ぶモーダルを表示する。
 * @param {object}   state    - 自分視点のゲーム状態
 * @param {string}   myId     - 自分の PeerJS ID
 * @param {object}   nameMap  - { peerId: displayName }
 * @param {Function} onChoose - (cardId: string) => void
 */
/**
 * 取引で相手が渡すカードを選ぶモーダル
 */
export function showTradeTargetSelector(localState, myId, onChoose, getDisplayHand = null) {
  const { content } = getModal();
  if (!content) return;
  const me = localState.players.find(p => p.id === myId);
  if (!me || me.hand.length === 0) return;

  const displayHand = getDisplayHand ? getDisplayHand(me.hand) : me.hand;

  const attacker = localState.players.find(p =>
    localState.pendingAction?.waitingFor === myId &&
    localState.currentTurnIndex !== undefined &&
    localState.players[localState.currentTurnIndex]?.id !== myId
  ) || null;

  content.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = '🤝 取引：渡すカードを選んでください';
  content.appendChild(title);

  const sub = document.createElement('p');
  sub.textContent = '相手から取引を求められています。渡すカードを選んでください';
  sub.style.fontSize = '0.85rem';
  sub.style.color = 'var(--text-dim, #aaa)';
  content.appendChild(sub);

  displayHand.forEach(c => {
    if (c.hidden) return;
    const btn = document.createElement('button');
    btn.innerHTML = `<strong>${c.label}</strong><br><small>${c.desc}</small>`;
    btn.style.display = 'block';
    btn.style.width = '100%';
    btn.style.marginBottom = '6px';
    btn.onclick = () => { closeModal(); onChoose(c.id); };
    content.appendChild(btn);
  });

  openModal();
}

export function showPassCardSelector(state, myId, nameMap = {}, onChoose, getDisplayHand = null) {
  const { content } = getModal();
  if (!content) return;

  const me = state.players.find(p => p.id === myId);
  if (!me || me.hand.length === 0) return;

  const displayHand = getDisplayHand ? getDisplayHand(me.hand) : me.hand;

  content.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = '🔀 横流し：渡すカードを選んでください';
  content.appendChild(title);

  const sub = document.createElement('p');
  sub.textContent = '選んだカードは次のプレイヤーへ渡ります';
  sub.style.fontSize = '0.85rem';
  sub.style.color = 'var(--text2, #aaa)';
  content.appendChild(sub);

  const submitted = state.pendingAction?.submitted ?? [];
  const total = state.players.filter(p => p.hand.length > 0).length;
  const progress = document.createElement('p');
  progress.textContent = `選択完了: ${submitted.length} / ${total} 人`;
  progress.style.fontSize = '0.8rem';
  content.appendChild(progress);

  displayHand.forEach(c => {
    const btn = document.createElement('button');
    btn.innerHTML = `<strong>${c.label}</strong><br><small>${c.desc}</small>`;
    btn.style.display = 'block';
    btn.style.width   = '100%';
    btn.style.marginBottom = '6px';
    btn.onclick = () => {
      closeModal();
      onChoose(c.id);
    };
    content.appendChild(btn);
  });

  openModal();
}

// ============================================================
// ダッシュ: 移動カード選択
// ============================================================
export function showDashCardSelector(state, myId, onChoose, getDisplayHand = null) {
  const { content } = getModal();
  if (!content) return;

  const me = state.players.find(p => p.id === myId);
  if (!me) return;

  const displayHand = getDisplayHand ? getDisplayHand(me.hand) : me.hand;
  const moveCards   = displayHand.filter(c => c.type === CARD_TYPES.MOVE);

  content.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = 'ダッシュ：移動カードを選んでください';
  content.appendChild(title);

  const sub = document.createElement('p');
  sub.textContent = '選んだカードの移動量+2で移動します';
  sub.style.fontSize = '0.85rem';
  sub.style.color = 'var(--text2, #aaa)';
  content.appendChild(sub);

  moveCards.forEach(c => {
    const btn = document.createElement('button');
    btn.innerHTML = `<strong>${c.label} + 2 = ${c.value + 2}マス</strong><br><small>${c.desc ?? ''}</small>`;
    btn.style.display      = 'block';
    btn.style.width        = '100%';
    btn.style.marginBottom = '6px';
    btn.onclick = () => { closeModal(); onChoose(c.id); };
    content.appendChild(btn);
  });

  openModal();
}

// ============================================================
// 情報開示通知
// ============================================================
export function showPrivateReveal(msg) {
  if (msg.card) {
    showEffectOverlay({
      icon:  '🃏',
      title: msg.revealTitle ?? 'カード確認（本人のみ）',
      body:  `「${msg.card.label}」\n${msg.card.desc ?? ''}`,
    });
    return;
  }
  // 探知機のヒント結果
  if (msg.roleLabel && msg.targetName !== undefined) {
    const pct = msg.accuracy !== undefined ? `（精度 ${msg.accuracy}%）` : '';
    showEffectOverlay({
      icon:  '📡',
      title: `探知機スキャン結果${pct}`,
      body:  `${msg.targetName} は「${msg.roleLabel}」らしい\n\n（精度が低い場合は誤検の可能性あり）`,
    });
    return;
  }
  if (msg.hintLabel) showToast(`スキャン結果: ${msg.hintLabel}`);
  else if (msg.role)  showEffectOverlay({ icon: '📽️', title: '搼査結果（本人のみ）', body: `${msg.targetName ?? msg.roleLabel} は「${msg.roleLabel}」だ！` });
}

export function showPublicReveal(msg) {
  if (msg.card) showToast(`【全員公開】${msg.ownerName ?? msg.owner?.slice(0, 6)} の手札: ${msg.card.label}`, 4000);
}

// ============================================================
// 効果結果オーバーレイ（アクション・ロケーション・ドロー共通）
// ============================================================
/**
 * アクション / ロケーション / ドロー効果の結果を全画面オーバーレイで表示する。
 * @param {{ icon: string, title: string, body: string }} event
 */
export function showEffectOverlay(event, onClose = null) {
  const overlay = document.getElementById('effect-overlay');
  if (!overlay) return;
  document.getElementById('effect-icon').textContent  = event.icon  ?? '';
  document.getElementById('effect-title').textContent = event.title ?? '';
  document.getElementById('effect-body').textContent  = event.body  ?? '';
  overlay.style.display = 'flex';
  // 再アニメーション
  overlay.style.animation = 'none';
  void overlay.offsetWidth;
  overlay.style.animation = '';
  document.getElementById('effect-close-btn').onclick = () => {
    overlay.style.display = 'none';
    onClose?.();
  };
}

// ============================================================
// カードドロー演出オーバーレイ
// ============================================================
/**
 * ドローしたカードをフリップアニメで見せる専用オーバーレイ。
 * @param {{ icon, cardLabel, cardDesc, cardType }} event
 */
export function showDrawCardOverlay(event, onClose = null) {
  const overlay = document.getElementById('draw-card-overlay');
  // 専用オーバーレイが存在しない場合は汎用に fallback
  if (!overlay) { showEffectOverlay(event); return; }

  const card  = document.getElementById('drcard');
  const front = document.getElementById('drcard-front');
  const scene = overlay.querySelector('.drcard-scene');
  const hint  = document.getElementById('drcard-hint');

  // 内容をセット
  document.getElementById('drcard-label').textContent = event.cardLabel ?? '';
  document.getElementById('drcard-desc').textContent  = event.cardDesc  ?? '';
  const titleEl = document.getElementById('drcard-title');
  if (titleEl) titleEl.textContent = event.title ?? '';

  // アート（スプライト画像）をドローカードオーバーレイ用のスケールで適用
  // drcard-art は幅150px。スプライトタイルを 80px → 150px にスケール (×1.875)
  const artEl = document.getElementById('drcard-art');
  if (artEl) {
    const SCALE   = 150 / 80;                       // 1.875
    const BG_W    = Math.round(640 * SCALE) + 'px'; // 1200px
    const BG_H    = Math.round(384 * SCALE) + 'px'; // 720px
    const STEP_X  = Math.round(80  * SCALE);         // 150px
    const STEP_Y  = Math.round(96  * SCALE);         // 180px
    const tile = event.card ? getCardTile(event.card) : null;
    if (tile) {
      const [col, row] = tile;
      artEl.style.backgroundSize     = `${BG_W} ${BG_H}`;
      artEl.style.backgroundPosition = `${-(col * STEP_X)}px ${-(row * STEP_Y)}px`;
    } else {
      artEl.style.backgroundSize     = '';
      artEl.style.backgroundPosition = '';
    }
  }

  // フロント面の色クラスをリセット
  front.className = 'drcard-front';
  if      (event.cardType === 'move')   front.classList.add('type-move');
  else if (event.cardType === 'action') front.classList.add('type-action');
  else                                   front.classList.add('type-item');

  // 状態リセット
  card.className = 'drcard-card';
  scene.classList.remove('drcard-glow', 'drcard-lost-glow');
  hint.classList.remove('visible');
  overlay.classList.remove('drcard-mode-lost');
  overlay.style.display = 'flex';

  // ① 落下バウンス（裏向き）
  requestAnimationFrame(() => {
    card.classList.add('drcard-appear');
    card.addEventListener('animationend', function onAppear(e) {
      if (e.target !== card) return;
      card.removeEventListener('animationend', onAppear);
      card.classList.remove('drcard-appear');

      // ② フリップ（裏→表）
      requestAnimationFrame(() => {
        card.classList.add('drcard-flip');
        card.addEventListener('animationend', function onFlip(e) {
          if (e.target !== card) return;
          card.removeEventListener('animationend', onFlip);
          card.classList.remove('drcard-flip');
          card.classList.add('drcard-revealed');

          // ③ グロー放射 + ヒント表示
          scene.classList.add('drcard-glow');
          hint.classList.add('visible');
        });
      });
    });
  });

  // タップで閉じる
  overlay.onclick = () => {
    overlay.style.display = 'none';
    overlay.onclick = null;
    overlay.classList.remove('drcard-mode-lost');
    onClose?.();
  };
}

// ============================================================
// カードロスト演出オーバーレイ
// ============================================================
/**
 * 没収・ロストしたカードを表向きで下から上に飛び去らせる演出。
 * @param {{ isLost, card, cardLabel, cardDesc, cardType, title }} event
 * @param {Function} [onClose]
 */
export function showLostCardOverlay(event, onClose = null) {
  const overlay = document.getElementById('draw-card-overlay');
  if (!overlay) { showEffectOverlay(event); onClose?.(); return; }

  const card  = document.getElementById('drcard');
  const front = document.getElementById('drcard-front');
  const scene = overlay.querySelector('.drcard-scene');
  const hint  = document.getElementById('drcard-hint');

  // コンテンツをセット
  document.getElementById('drcard-label').textContent = event.cardLabel ?? '';
  document.getElementById('drcard-desc').textContent  = event.cardDesc  ?? '';
  const titleEl = document.getElementById('drcard-title');
  if (titleEl) titleEl.textContent = event.title ?? '';

  // アート
  const artEl = document.getElementById('drcard-art');
  if (artEl) {
    const SCALE  = 150 / 80;
    const BG_W   = Math.round(640 * SCALE) + 'px';
    const BG_H   = Math.round(384 * SCALE) + 'px';
    const STEP_X = Math.round(80  * SCALE);
    const STEP_Y = Math.round(96  * SCALE);
    const tile = event.card ? getCardTile(event.card) : null;
    if (tile) {
      const [col, row] = tile;
      artEl.style.backgroundSize     = `${BG_W} ${BG_H}`;
      artEl.style.backgroundPosition = `${-(col * STEP_X)}px ${-(row * STEP_Y)}px`;
    } else {
      artEl.style.backgroundSize     = '';
      artEl.style.backgroundPosition = '';
    }
  }

  // 表面の色クラス
  front.className = 'drcard-front';
  if      (event.cardType === 'move')   front.classList.add('type-move');
  else if (event.cardType === 'action') front.classList.add('type-action');
  else                                   front.classList.add('type-item');

  // 状態リセット：最初から表向き
  card.className = 'drcard-card';
  scene.classList.remove('drcard-glow', 'drcard-lost-glow');
  hint.classList.remove('visible');
  overlay.classList.add('drcard-mode-lost');
  overlay.style.display = 'flex';

  let cancelled = false;
  let flyTimer  = null;

  function doClose() {
    if (cancelled) return;
    cancelled = true;
    if (flyTimer) { clearTimeout(flyTimer); flyTimer = null; }
    overlay.style.display = 'none';
    overlay.onclick = null;
    overlay.classList.remove('drcard-mode-lost');
    onClose?.();
  }

  // ① 下から表向きで登場
  requestAnimationFrame(() => {
    card.classList.add('drcard-lost-enter');
    card.addEventListener('animationend', function onEnter(e) {
      if (e.target !== card) return;
      card.removeEventListener('animationend', onEnter);
      if (cancelled) return;
      card.classList.remove('drcard-lost-enter');
      card.classList.add('drcard-revealed');
      // 赤グロー
      scene.classList.add('drcard-lost-glow');
      // ② 短い間見せてから上へ飛び去る
      flyTimer = setTimeout(() => {
        if (cancelled) return;
        card.classList.add('drcard-lost-fly');
        card.addEventListener('animationend', function onFly(e) {
          if (e.target !== card) return;
          card.removeEventListener('animationend', onFly);
          doClose();
        });
      }, 700);
    });
  });

  // タップで早送り
  overlay.onclick = () => doClose();
}

// ============================================================
// ゲームオーバー
// ============================================================
export function showGameOver(winner, players = [], nameMap = {}) {
  const overlay = document.getElementById('gameover-overlay');
  const msgEl   = document.getElementById('gameover-msg');
  if (!overlay || !msgEl) return;

  const isBomber = winner === 'bomber';
  const titleText = isBomber ? '💥 爆弾魔チームの勝利！！' : '🔧 解除班チームの勝利！！';
  let html = `<div class="gameover-title">${titleText}</div>`;

  if (players.length > 0) {
    const bombers  = players.filter(p => p.role === 'bomber');
    const defusers = players.filter(p => p.role === 'defuser');
    const nm = p => nameMap[p.id] ?? p.name ?? p.id.slice(0, 6);
    html += `<div class="gameover-teams">`;
    html += `<div class="gameover-team${isBomber ? ' winner' : ''}">`;
    html += `<div class="gameover-team-name">💣 爆弾魔チーム</div>`;
    bombers.forEach(p => { html += `<div class="gameover-member"> ${nm(p)}</div>`; });
    html += `</div>`;
    html += `<div class="gameover-team${!isBomber ? ' winner' : ''}">`;
    html += `<div class="gameover-team-name">🛡️ 解除班チーム</div>`;
    defusers.forEach(p => { html += `<div class="gameover-member"> ${nm(p)}</div>`; });
    html += `</div>`;
    html += `</div>`;
  }

  msgEl.innerHTML = html;
  overlay.style.display = 'flex';
}

// ============================================================
// トースト通知
// ============================================================
export function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function showError(message) {
  showToast('⚠️ ' + message, 4000);
}
