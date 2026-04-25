// utils.js
// 「共通処理はここに置く」というルールだけが残り、何でも入るようになった

const fs = require('fs')

// ── 日付・フォーマット系 ──────────────────────────────

function formatDate(date) {
  const d = new Date(date)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function formatDateTime(date) {
  const d = new Date(date)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ── 金額系 ──────────────────────────────────────────

function formatPrice(amount) {
  return '¥' + Number(amount).toLocaleString()
}

// 消費税を計算して返す（税額のみ） ※ app.js の計算と端数処理が違う
function calcTax(amount) {
  return Math.round(amount * 0.1)
}

// 税込み金額を返す
function calcTaxIncluded(amount) {
  return amount + calcTax(amount)
}

// ── バリデーション系 ─────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone) {
  return /^0\d{9,10}$/.test(phone)
}

function isValidPostalCode(code) {
  return /^\d{3}-?\d{4}$/.test(code)
}

// ── 認証系 ───────────────────────────────────────────
// ※ app.js にも同様のトークン処理がある

function generateToken(userId) {
  // app.js のものとは別実装になっている（こちらはタイムスタンプ付き）
  return Buffer.from(userId + ':' + Date.now()).toString('base64')
}

function getUserIdFromToken(token) {
  if (!token) return null
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    // app.js は parseInt(decoded) でそのまま使っているが
    // こちらはコロン区切りを想定している（互換性がない）
    const parts = decoded.split(':')
    return parseInt(parts[0])
  } catch {
    return null
  }
}

// ── DB読み書き系 ─────────────────────────────────────
// ※ app.js では fs.readFileSync を直接呼んでいるが、こちらは関数化している

function readDB(filename) {
  const filePath = './db/' + filename + '.json'
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeDB(filename, data) {
  fs.writeFileSync('./db/' + filename + '.json', JSON.stringify(data, null, 2))
}

// ── ユーザー系 ───────────────────────────────────────
// ※ 本来は別モジュールにすべきだが「共通処理」としてここに追加された

function findUserById(id) {
  const users = readDB('users')
  return users.find(u => u.id === id) || null
}

function findUserByEmail(email) {
  const users = readDB('users')
  return users.find(u => u.email === email) || null
}

// ── カート計算系 ─────────────────────────────────────
// ※ cart.js（フロント）にも同名の関数がある

function calcCartSubtotal(items) {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

// プレミアム割引 ※ app.js の判定条件と異なる（こちらは type を見る）
function applyDiscount(subtotal, userType) {
  if (userType === 'premium') {
    return Math.floor(subtotal * 0.9)
  }
  return subtotal
}

// ── 注文ステータス系 ─────────────────────────────────

const ORDER_STATUS = {
  pending: '注文受付',
  confirmed: '確認済み',
  shipped: '発送済み',
  delivered: '配達完了',
  cancelled: 'キャンセル'
}

function getStatusLabel(status) {
  return ORDER_STATUS[status] || '不明'
}

module.exports = {
  formatDate,
  formatDateTime,
  formatPrice,
  calcTax,
  calcTaxIncluded,
  isValidEmail,
  isValidPhone,
  isValidPostalCode,
  generateToken,
  getUserIdFromToken,
  readDB,
  writeDB,
  findUserById,
  findUserByEmail,
  calcCartSubtotal,
  applyDiscount,
  getStatusLabel
}
