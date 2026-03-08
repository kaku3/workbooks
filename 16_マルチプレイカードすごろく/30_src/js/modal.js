// ============================================================
// modal.js  モーダル・ターゲット選択・ロケーション効果UI
// ============================================================

import { LOCATIONS, CARD_TYPES } from './constants.js';
import { sendPlayCard, sendResolveLoc } from './peer.js';

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
}

function closeModal() {
  const { overlay } = getModal();
  if (overlay) overlay.style.display = 'none';
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
        if (['trade', 'steal'].includes(card.action)) {
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
  sub.textContent = '選んだカードは左隣のプレイヤーへ渡ります';
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
  if (msg.hintLabel) showToast(`スキャン結果: ${msg.hintLabel}`);
  else if (msg.role)  showToast(`捜査結果: ${msg.roleLabel}`);
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
export function showEffectOverlay(event) {
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
  };
}

// ============================================================
// ゲームオーバー
// ============================================================
export function showGameOver(winner) {
  const overlay = document.getElementById('gameover-overlay');
  const msg     = document.getElementById('gameover-msg');
  if (!overlay || !msg) return;
  msg.textContent = winner === 'bomber' ? '💥 爆弾魔チームの勝利！！' : '🔧 解除班チームの勝利！！';
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
