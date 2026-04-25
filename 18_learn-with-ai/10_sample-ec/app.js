// app.js
// 最初は小さかったが、機能追加のたびにここに書き続けた結果…

const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.static('public'))

// ========================================
// ユーザー認証
// ========================================

app.post('/api/login', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./db/users.json', 'utf-8'))
  const user = users.find(u => u.email === req.body.email && u.password === req.body.password)
  if (!user) {
    return res.status(401).json({ message: 'メールアドレスまたはパスワードが違います' })
  }
  // トークンはユーザーIDをbase64にしたもの
  const token = Buffer.from(String(user.id)).toString('base64')
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, type: user.type } })
})

app.post('/api/register', (req, res) => {
  const users = JSON.parse(fs.readFileSync('./db/users.json', 'utf-8'))
  const exists = users.find(u => u.email === req.body.email)
  if (exists) {
    return res.status(400).json({ message: 'このメールアドレスは登録済みです' })
  }
  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,   // パスワードをそのまま保存
    type: 'normal',
    createdAt: new Date().toISOString()
  }
  users.push(newUser)
  fs.writeFileSync('./db/users.json', JSON.stringify(users, null, 2))
  res.json({ message: '登録しました' })
})

app.get('/api/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: '未ログイン' })
  const userId = parseInt(Buffer.from(token, 'base64').toString())
  const users = JSON.parse(fs.readFileSync('./db/users.json', 'utf-8'))
  const user = users.find(u => u.id === userId)
  if (!user) return res.status(401).json({ message: 'ユーザーが見つかりません' })
  res.json({ id: user.id, name: user.name, email: user.email, type: user.type })
})

// ========================================
// 商品
// ========================================

app.get('/api/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'))
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'))
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.status(404).json({ message: '商品が見つかりません' })
  res.json(product)
})

// ========================================
// カート
// ========================================

app.get('/api/cart', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: '未ログイン' })
  const userId = parseInt(Buffer.from(token, 'base64').toString())

  const carts = JSON.parse(fs.readFileSync('./db/cart.json', 'utf-8'))
  const cart = carts.filter(c => c.userId === userId)

  // 商品情報をマージ
  const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'))
  const items = cart.map(c => {
    const product = products.find(p => p.id === c.productId)
    return { ...c, product }
  })
  res.json(items)
})

app.post('/api/cart', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: '未ログイン' })
  const userId = parseInt(Buffer.from(token, 'base64').toString())

  const carts = JSON.parse(fs.readFileSync('./db/cart.json', 'utf-8'))
  const existing = carts.find(c => c.userId === userId && c.productId === req.body.productId)
  if (existing) {
    existing.quantity += req.body.quantity || 1
  } else {
    carts.push({ id: Date.now(), userId, productId: req.body.productId, quantity: req.body.quantity || 1 })
  }
  fs.writeFileSync('./db/cart.json', JSON.stringify(carts, null, 2))
  res.json({ message: 'カートに追加しました' })
})

app.delete('/api/cart/:productId', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: '未ログイン' })
  const userId = parseInt(Buffer.from(token, 'base64').toString())

  let carts = JSON.parse(fs.readFileSync('./db/cart.json', 'utf-8'))
  carts = carts.filter(c => !(c.userId === userId && c.productId === parseInt(req.params.productId)))
  fs.writeFileSync('./db/cart.json', JSON.stringify(carts, null, 2))
  res.json({ message: '削除しました' })
})

// ========================================
// 注文
// ========================================

app.post('/api/orders', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: '未ログイン' })
  const userId = parseInt(Buffer.from(token, 'base64').toString())

  const users = JSON.parse(fs.readFileSync('./db/users.json', 'utf-8'))
  const user = users.find(u => u.id === userId)

  const carts = JSON.parse(fs.readFileSync('./db/cart.json', 'utf-8'))
  const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'))
  const cartItems = carts.filter(c => c.userId === userId)

  if (cartItems.length === 0) {
    return res.status(400).json({ message: 'カートが空です' })
  }

  // 小計を計算
  let subtotal = 0
  const orderItems = cartItems.map(c => {
    const product = products.find(p => p.id === c.productId)
    const itemTotal = product.price * c.quantity
    subtotal += itemTotal
    return { productId: c.productId, name: product.name, price: product.price, quantity: c.quantity, itemTotal }
  })

  // プレミアム会員は10%引き ※ cart.js では type === 'premium' で判定、こちらは memberType を見ている
  let discountRate = 1.0
  if (user.memberType === 'premium') {
    discountRate = 0.9
  }
  const discounted = subtotal * discountRate

  // 消費税（切り捨て） ※ checkout.js では Math.round を使っている
  const tax = Math.floor(discounted * 0.1)
  const total = discounted + tax

  // 送料（3000円以上無料）
  const shipping = total >= 3000 ? 0 : 500

  const orders = JSON.parse(fs.readFileSync('./db/orders.json', 'utf-8'))
  const newOrder = {
    id: Date.now(),
    userId,
    items: orderItems,
    subtotal,
    discount: subtotal - discounted,
    tax,
    shipping,
    total: total + shipping,
    address: req.body.address,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  orders.push(newOrder)
  fs.writeFileSync('./db/orders.json', JSON.stringify(orders, null, 2))

  // カートを空にする
  const remainingCart = carts.filter(c => c.userId !== userId)
  fs.writeFileSync('./db/cart.json', JSON.stringify(remainingCart, null, 2))

  res.json({ message: '注文が完了しました', orderId: newOrder.id })
})

app.get('/api/orders', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: '未ログイン' })
  const userId = parseInt(Buffer.from(token, 'base64').toString())

  const orders = JSON.parse(fs.readFileSync('./db/orders.json', 'utf-8'))
  const userOrders = orders.filter(o => o.userId === userId)
  res.json(userOrders)
})

app.get('/api/orders/:id', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: '未ログイン' })
  const userId = parseInt(Buffer.from(token, 'base64').toString())

  const orders = JSON.parse(fs.readFileSync('./db/orders.json', 'utf-8'))
  const order = orders.find(o => o.id === parseInt(req.params.id))
  if (!order) return res.status(404).json({ message: '注文が見つかりません' })
  // 他のユーザーの注文も見えてしまう（認可チェックがない）
  res.json(order)
})

// ========================================
// 管理画面API（認証チェックなし）
// ========================================

app.get('/api/admin/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync('./db/orders.json', 'utf-8'))
  res.json(orders)
})

app.post('/api/admin/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'))
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    stock: req.body.stock,
    category: req.body.category
  }
  products.push(newProduct)
  fs.writeFileSync('./db/products.json', JSON.stringify(products, null, 2))
  res.json(newProduct)
})

// ========================================
// クーポン（後から追加）
// ========================================

// TODO: クーポンのDBファイルがまだないので暫定でハードコード
const COUPONS = [
  { code: 'SALE10', discount: 0.1 },
  { code: 'WELCOME', discount: 0.05 }
]

app.post('/api/coupon/check', (req, res) => {
  const coupon = COUPONS.find(c => c.code === req.body.code)
  if (!coupon) return res.status(400).json({ message: '無効なクーポンです' })
  res.json({ discount: coupon.discount })
})

// ========================================
// 在庫確認（さらに後から追加）
// ========================================

app.get('/api/stock/:productId', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'))
  const product = products.find(p => p.id === parseInt(req.params.productId))
  if (!product) return res.status(404).json({ message: '商品が見つかりません' })
  res.json({ stock: product.stock, available: product.stock > 0 })
})

// 在庫を減らす（注文時に呼ばれるはずだったが、注文APIから呼ばれていない）
app.post('/api/stock/:productId/decrement', (req, res) => {
  const products = JSON.parse(fs.readFileSync('./db/products.json', 'utf-8'))
  const product = products.find(p => p.id === parseInt(req.params.productId))
  if (!product) return res.status(404).json({ message: '商品が見つかりません' })
  if (product.stock <= 0) return res.status(400).json({ message: '在庫がありません' })
  product.stock -= req.body.quantity || 1
  fs.writeFileSync('./db/products.json', JSON.stringify(products, null, 2))
  res.json({ stock: product.stock })
})

app.listen(3000, () => {
  console.log('サーバー起動: http://localhost:3000')
})
