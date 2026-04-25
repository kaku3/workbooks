// common.js
// フロントエンド共通処理。utils.js（サーバー側）と似た関数が並んでいる。

// ── フォーマット ──────────────────────────────────────

function formatPrice(amount) {
  // utils.js にも同名の関数がある（サーバー側）
  return '¥' + Number(amount).toLocaleString()
}

function formatDate(dateStr) {
  // utils.js の formatDate とほぼ同じだが、こちらは文字列を受け取る
  const d = new Date(dateStr)
  return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
}

// ── 認証・ユーザー系 ──────────────────────────────────

function getToken() {
  return localStorage.getItem('token')
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user') || 'null')
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  location.href = '/login.html'
}

// ── ナビゲーション更新 ────────────────────────────────

function updateUserNav() {
  const user = getCurrentUser()
  const nav = document.getElementById('user-nav')
  if (!nav) return
  if (user) {
    nav.innerHTML = `<span>${user.name}さん</span> | <a href="/mypage.html">マイページ</a> | <a href="#" onclick="logout()">ログアウト</a>`
  } else {
    nav.innerHTML = '<a href="/login.html">ログイン</a>'
  }
}

// ── カートバッジ更新 ──────────────────────────────────

async function updateCartCount() {
  const token = getToken()
  if (!token) {
    const el = document.getElementById('cart-count')
    if (el) el.textContent = '0'
    return
  }
  const res = await fetch('/api/cart', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  if (res.ok) {
    const items = await res.json()
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const el = document.getElementById('cart-count')
    if (el) el.textContent = count
  }
}

// ── エラー表示 ────────────────────────────────────────

function showError(message, targetId) {
  const el = document.getElementById(targetId || 'error-msg')
  if (!el) { alert(message); return }
  el.textContent = message
  el.style.display = ''
}

function hideError(targetId) {
  const el = document.getElementById(targetId || 'error-msg')
  if (el) el.style.display = 'none'
}

// ページ読み込み時にナビ更新
updateUserNav()
