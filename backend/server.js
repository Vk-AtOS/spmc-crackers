// Sri Palani Murugan Crackers — Order backend
// Usage: cd backend && npm install && node server.js
// Required env: ADMIN_TOKEN, TURSO_URL, TURSO_AUTH_TOKEN
// Optional env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, WA_TOKEN, WA_PHONE_ID,
//               SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM,
//               CORS_ORIGIN (comma-separated), MIN_ORDER_AMOUNT

const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Simple in-memory rate limiter — no extra dep needed at this scale
const _rl = new Map();
function rateLimit(max, windowMs = 60_000) {
  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const r = _rl.get(ip) || { n: 0, t: now + windowMs };
    if (now > r.t) { r.n = 0; r.t = now + windowMs; }
    r.n++;
    _rl.set(ip, r);
    if (r.n > max) return res.status(429).json({ error: 'Too many requests' });
    next();
  };
}

const app = express();
const PORT = process.env.PORT || 3001;

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!ADMIN_TOKEN) { console.error('[FATAL] ADMIN_TOKEN env var not set'); process.exit(1); }
const TURSO_URL = process.env.TURSO_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
if (!TURSO_URL || !TURSO_AUTH_TOKEN) { console.error('[FATAL] TURSO_URL and TURSO_AUTH_TOKEN must be set'); process.exit(1); }
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WA_TOKEN = process.env.WA_TOKEN || '';
const WA_PHONE_ID = process.env.WA_PHONE_ID || '';

// Razorpay — optional, only if keys configured
let rzp = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    const Razorpay = require('razorpay');
    rzp = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    console.log('[RAZORPAY] Enabled');
  } catch { console.warn('[RAZORPAY] Package missing — run: npm install razorpay'); }
}

// Email — optional, only if SMTP configured
let transporter = null;
if (process.env.SMTP_HOST) {
  try {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    console.log('[EMAIL] Enabled via', process.env.SMTP_HOST);
  } catch { console.warn('[EMAIL] nodemailer missing — run: npm install nodemailer'); }
}
async function sendEmail(to, subject, text) {
  if (!transporter || !to || !to.includes('@')) return;
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM || 'SPMC Crackers <noreply@spmc.in>', to, subject, text });
    console.log('[EMAIL SENT]', to);
  } catch (err) { console.warn('[EMAIL FAIL]', err.message); }
}

const db = createClient({ url: TURSO_URL, authToken: TURSO_AUTH_TOKEN });

// Products cache — avoids N queries per order when resolving names/prices
let _productCache = null;
async function getProducts() {
  if (_productCache) return _productCache;
  const r = await db.execute('SELECT id,name,nameTa,cat,mrp,price,unit,emoji,active,noDiscount,desc,imageUrl,stock FROM products ORDER BY id');
  _productCache = r.rows;
  return _productCache;
}
function invalidateProductCache() { _productCache = null; }

async function parseOrder(row) {
  const products = await getProducts();
  const pMap = new Map(products.map(p => [Number(p.id), p]));
  const items = JSON.parse(row.itemsJson).map(i => {
    const p = pMap.get(Number(i.id));
    return { ...i, name: p ? `${p.emoji} ${p.name}` : `Product #${i.id}`, price: p ? Number(p.price) : 0 };
  });
  return {
    orderId: row.orderId,
    customer: JSON.parse(row.customerJson),
    items,
    total: row.total,
    status: row.status,
    payment: row.payment,
    paymentId: row.paymentId,
    paymentStatus: row.paymentStatus || 'pending',
    tracking: row.tracking,
    utr: row.utr || null,
    notes: row.notes,
    returnReason: row.returnReason || null,
    coupon: row.coupon || null,
    discount: Number(row.discount || 0),
    shippingCost: Number(row.shippingCost || 0),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['https://spmc-crackers.onrender.com', 'http://localhost:3001'];
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' }));
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdn.razorpay.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://spmc-crackers.onrender.com https://lumberjack.razorpay.com",
    "frame-src https://api.razorpay.com",
  ].join('; '));
  next();
});
app.use(express.static(path.join(__dirname, '..')));
app.use(rateLimit(200));

function adminAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  if (auth !== 'Bearer ' + ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// ── PUBLIC ROUTES ─────────────────────────────────────────

app.get('/config', (_req, res) => {
  res.json({
    razorpayEnabled: !!rzp,
    razorpayKeyId: RAZORPAY_KEY_ID,
    waApiEnabled: !!(WA_TOKEN && WA_PHONE_ID),
    minOrderAmount: Number(process.env.MIN_ORDER_AMOUNT || 0),
  });
});

// Customer order status — phone as lightweight auth
app.get('/order-status/:orderId', rateLimit(30), async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: 'phone required' });
  try {
    const result = await db.execute({ sql: 'SELECT * FROM orders WHERE orderId = ?', args: [req.params.orderId] });
    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found' });
    const row = result.rows[0];
    const c = JSON.parse(row.customerJson || '{}');
    if ((c.phone||'').replace(/\D/g,'').slice(-10) !== phone.replace(/\D/g,'').slice(-10))
      return res.status(403).json({ error: 'Phone number does not match' });
    const order = await parseOrder(row);
    res.json({
      orderId: order.orderId, status: order.status, paymentStatus: order.paymentStatus,
      tracking: order.tracking || null, total: order.total,
      items: order.items.map(i => ({ name: i.name, qty: i.qty })),
      createdAt: order.createdAt, updatedAt: order.updatedAt,
    });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// Customer order history by phone
app.get('/my-orders', rateLimit(10), async (req, res) => {
  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: 'phone required' });
  const norm = phone.replace(/\D/g, '').slice(-10);
  if (norm.length !== 10) return res.status(400).json({ error: 'Invalid phone number' });
  try {
    const r = await db.execute('SELECT * FROM orders ORDER BY createdAt DESC LIMIT 500');
    const orders = r.rows.filter(row => {
      try { return (JSON.parse(row.customerJson||'{}').phone||'').replace(/\D/g,'').slice(-10) === norm; }
      catch { return false; }
    });
    res.json(orders.map(row => ({
      orderId: row.orderId, total: row.total, status: row.status,
      paymentStatus: row.paymentStatus || 'pending', tracking: row.tracking || null,
      createdAt: row.createdAt,
    })));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// Validate coupon code
app.post('/validate-coupon', rateLimit(20), async (req, res) => {
  const { code, orderTotal } = req.body;
  if (!code) return res.status(400).json({ error: 'code required' });
  try {
    const r = await db.execute({ sql: 'SELECT * FROM coupons WHERE code = ? AND active = 1', args: [String(code).toUpperCase().trim()] });
    if (!r.rows[0]) return res.status(404).json({ error: 'Invalid or expired coupon code' });
    const cp = r.rows[0];
    if (cp.expiresAt && new Date(cp.expiresAt) < new Date()) return res.status(400).json({ error: 'Coupon has expired' });
    if (Number(cp.maxUses) > 0 && Number(cp.usedCount) >= Number(cp.maxUses)) return res.status(400).json({ error: 'Coupon usage limit reached' });
    const tot = parseFloat(orderTotal || '0');
    if (Number(cp.minOrder) > 0 && tot < Number(cp.minOrder)) return res.status(400).json({ error: `Minimum order ₹${cp.minOrder} required` });
    const raw = cp.type === 'percent' ? Math.round(tot * Number(cp.value) / 100) : Number(cp.value);
    const cap = Number(cp.maxDiscount) > 0 ? Number(cp.maxDiscount) : Infinity;
    const discount = Math.min(raw, cap, tot);
    res.json({ valid: true, code: cp.code, type: cp.type, value: Number(cp.value), discount });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// Shipping cost for a state + order total
app.get('/shipping-cost', async (req, res) => {
  const { state, total } = req.query;
  if (!state) return res.status(400).json({ error: 'state required' });
  try {
    const r = await db.execute({
      sql: `SELECT * FROM shipping_zones WHERE state = ? OR state = 'DEFAULT' ORDER BY CASE WHEN state = ? THEN 0 ELSE 1 END LIMIT 1`,
      args: [state, state],
    });
    const zone = r.rows[0] || { cost: 0, freeAbove: 0, etaDays: '5-7' };
    const orderTotal = parseFloat(total || '0');
    const freeAbove = Number(zone.freeAbove);
    const cost = freeAbove > 0 && orderTotal >= freeAbove ? 0 : Number(zone.cost);
    res.json({ state, cost, freeAbove, etaDays: zone.etaDays || '5-7', free: cost === 0 });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// Approved product reviews
app.get('/reviews', async (req, res) => {
  const { productId } = req.query;
  if (!productId) return res.status(400).json({ error: 'productId required' });
  try {
    const r = await db.execute({
      sql: `SELECT id,productId,rating,text,name,createdAt FROM reviews WHERE productId = ? AND status = 'approved' ORDER BY createdAt DESC LIMIT 50`,
      args: [+productId],
    });
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// Submit a review (post-delivery)
app.post('/reviews', rateLimit(10), async (req, res) => {
  const { orderId, productId, rating, text, name } = req.body;
  if (!orderId || !productId || !rating) return res.status(400).json({ error: 'orderId, productId, rating required' });
  if (+rating < 1 || +rating > 5) return res.status(400).json({ error: 'rating must be 1-5' });
  if (text && String(text).length > 1000) return res.status(400).json({ error: 'Review too long' });
  try {
    const ord = await db.execute({ sql: 'SELECT orderId FROM orders WHERE orderId = ?', args: [orderId] });
    if (!ord.rows[0]) return res.status(400).json({ error: 'Invalid order' });
    await db.execute({
      sql: 'INSERT INTO reviews (orderId,productId,rating,text,name,status,createdAt) VALUES (?,?,?,?,?,?,?)',
      args: [orderId, +productId, +rating, text?.trim()||null, name?.trim()||null, 'pending', new Date().toISOString()],
    });
    res.status(201).json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/orders', rateLimit(20), async (req, res) => {
  const { orderId, customer, items, total, notes, utr, coupon: couponCode, state } = req.body;
  if (!orderId || !customer || !items) return res.status(400).json({ error: 'Missing required fields' });
  if (typeof orderId !== 'string' || orderId.length > 40) return res.status(400).json({ error: 'Invalid orderId' });
  if (typeof total !== 'number' || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });
  if (items.length > 200) return res.status(400).json({ error: 'Too many items' });
  const c = customer;
  if (String(c.name||'').length > 100 || String(c.phone||'').length > 20 ||
      String(c.address||'').length > 300 || String(c.notes||'').length > 500)
    return res.status(400).json({ error: 'Field too long' });
  try {
    const products = await getProducts();
    const pMap = new Map(products.filter(p => p.active).map(p => [Number(p.id), p]));
    let serverTotal = 0;
    for (const item of items) {
      const prod = pMap.get(Number(item.id));
      if (!prod) return res.status(400).json({ error: 'One or more products are no longer available — please refresh your cart' });
      const stock = Number(prod.stock ?? -1);
      if (stock >= 0 && stock < (item.qty || 1))
        return res.status(400).json({ error: `"${prod.name}" is out of stock` });
      serverTotal += Number(prod.price) * Math.max(0, item.qty || 0);
    }

    // Coupon validation
    let discount = 0, appliedCoupon = null;
    if (couponCode) {
      const cr = await db.execute({ sql: 'SELECT * FROM coupons WHERE code = ? AND active = 1', args: [String(couponCode).toUpperCase().trim()] });
      const cp = cr.rows[0];
      if (!cp) return res.status(400).json({ error: 'Invalid coupon code' });
      if (cp.expiresAt && new Date(cp.expiresAt) < new Date()) return res.status(400).json({ error: 'Coupon has expired' });
      if (Number(cp.maxUses) > 0 && Number(cp.usedCount) >= Number(cp.maxUses)) return res.status(400).json({ error: 'Coupon usage limit reached' });
      if (Number(cp.minOrder) > 0 && serverTotal < Number(cp.minOrder)) return res.status(400).json({ error: `Minimum order ₹${cp.minOrder} required for this coupon` });
      const raw = cp.type === 'percent' ? Math.round(serverTotal * Number(cp.value) / 100) : Number(cp.value);
      const cap = Number(cp.maxDiscount) > 0 ? Number(cp.maxDiscount) : Infinity;
      discount = Math.min(raw, cap, serverTotal);
      appliedCoupon = cp.code;
    }

    // Shipping cost
    let shippingCost = 0;
    if (state) {
      const sr = await db.execute({
        sql: `SELECT * FROM shipping_zones WHERE state = ? OR state = 'DEFAULT' ORDER BY CASE WHEN state = ? THEN 0 ELSE 1 END LIMIT 1`,
        args: [state, state],
      });
      if (sr.rows[0]) {
        const zone = sr.rows[0];
        const freeAbove = Number(zone.freeAbove);
        shippingCost = freeAbove > 0 && serverTotal >= freeAbove ? 0 : Number(zone.cost);
      }
    }

    const minOrder = Number(process.env.MIN_ORDER_AMOUNT || 0);
    if (minOrder > 0 && serverTotal < minOrder) return res.status(400).json({ error: `Minimum order amount is ₹${minOrder}` });

    const expectedTotal = serverTotal - discount + shippingCost;
    if (Math.abs(expectedTotal - Number(total)) > 1) {
      console.warn('[ORDER TAMPER]', orderId, 'client total', total, 'vs server', expectedTotal);
      return res.status(400).json({ error: 'Order total mismatch — please refresh and retry' });
    }

    await db.execute({
      sql: `INSERT OR IGNORE INTO orders
        (orderId,customerJson,itemsJson,total,status,payment,paymentId,paymentStatus,utr,notes,coupon,discount,shippingCost,createdAt)
        VALUES (?,?,?,?,'pending',?,NULL,'pending',?,?,?,?,?,?)`,
      args: [
        orderId, JSON.stringify(customer), JSON.stringify(items),
        Number(total)||0, customer.payment||'', utr||null, notes||'',
        appliedCoupon||null, discount, shippingCost, new Date().toISOString(),
      ],
    });

    // Decrement stock for finite-stock products
    const stockUpdates = items.map(item => ({
      sql: 'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ? AND stock >= 0',
      args: [item.qty || 1, Number(item.id)],
    }));
    if (stockUpdates.length) { await db.batch(stockUpdates, 'write'); invalidateProductCache(); }

    // Low-stock / sold-out alert to admin
    if (process.env.ADMIN_EMAIL) {
      const soldOut = items.filter(i => {
        const prod = pMap.get(Number(i.id));
        return prod && Number(prod.stock ?? -1) >= 0 && (Number(prod.stock) - (i.qty || 1)) <= 0;
      }).map(i => pMap.get(Number(i.id))?.name);
      if (soldOut.length) {
        sendEmail(process.env.ADMIN_EMAIL, '⚠️ Out of Stock — SPMC',
          `Sold out after order ${orderId}:\n\n${soldOut.join('\n')}\n\nUpdate stock in admin panel.`);
      }
    }

    // Increment coupon usage count
    if (appliedCoupon) {
      await db.execute({ sql: 'UPDATE coupons SET usedCount = usedCount + 1 WHERE code = ?', args: [appliedCoupon] });
    }

    // Email confirmation if customer has email
    if (c.email) {
      sendEmail(c.email, `Order Confirmed — ${orderId}`,
        `Hi ${c.name},\n\nYour order ${orderId} has been received.\nTotal: ₹${Number(total).toLocaleString('en-IN')}\n\nWe'll confirm via WhatsApp within 2 hours.\n\n— Sri Palani Murugan Crackers`);
    }

    console.log('[ORDER]', orderId, customer.name, 'Rs.'+total, appliedCoupon?'coupon:'+appliedCoupon:'');
    res.status(201).json({ success: true, orderId });
  } catch (err) {
    console.error('[ORDER ERROR]', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/create-razorpay-order', async (req, res) => {
  if (!rzp) return res.status(503).json({ error: 'Razorpay not configured — add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to env' });
  const { amount, orderId } = req.body;
  if (!amount || !orderId) return res.status(400).json({ error: 'Missing amount or orderId' });
  try {
    const order = await rzp.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: orderId, notes: { source: 'spmc-website' } });
    res.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('[RAZORPAY CREATE]', err.message);
    res.status(500).json({ error: 'Payment order creation failed' });
  }
});

app.post('/verify-payment', async (req, res) => {
  if (!RAZORPAY_KEY_SECRET) return res.status(503).json({ error: 'Razorpay not configured' });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ error: 'Missing payment fields' });
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(body).digest('hex');
  if (expected !== razorpay_signature) return res.status(400).json({ error: 'Payment signature mismatch' });
  try {
    if (orderId) await db.execute({ sql: 'UPDATE orders SET paymentId=?,paymentStatus=?,updatedAt=? WHERE orderId=?', args: [razorpay_payment_id, 'paid', new Date().toISOString(), orderId] });
    console.log('[PAYMENT VERIFIED]', razorpay_payment_id, orderId || '');
    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// ── ADMIN ROUTES ──────────────────────────────────────────

app.get('/orders', adminAuth, async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit  || '200', 10), 500);
    const offset = parseInt(req.query.offset || '0', 10);
    const { from, to, status } = req.query;
    const conditions = [], args = [];
    if (from)   { conditions.push('createdAt >= ?'); args.push(from); }
    if (to)     { conditions.push('createdAt <= ?'); args.push(to + 'T23:59:59'); }
    if (status && status !== 'all') { conditions.push('status = ?'); args.push(status); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const result = await db.execute({ sql: `SELECT * FROM orders ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, args: [...args, limit, offset] });
    const total  = await db.execute({ sql: `SELECT COUNT(*) as n FROM orders ${where}`, args });
    res.json({ orders: await Promise.all(result.rows.map(parseOrder)), total: Number(total.rows[0].n), limit, offset });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.get('/orders/export', adminAuth, async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM orders ORDER BY createdAt DESC');
    const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"';
    const header = ['Order ID','Name','Phone','Address','City','State','Pincode','Payment','Total','Discount','Shipping','Coupon','Status','Payment Status','Tracking','Created At'].join(',');
    const lines = result.rows.map(row => {
      const c = JSON.parse(row.customerJson || '{}');
      return [esc(row.orderId),esc(c.name),esc(c.phone),esc(c.address),esc(c.city),esc(c.state),esc(c.pincode),esc(c.payment||row.payment),
        row.total||0,row.discount||0,row.shippingCost||0,esc(row.coupon||''),esc(row.status),esc(row.paymentStatus||'pending'),esc(row.tracking||''),esc(row.createdAt)].join(',');
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="spmc-orders.csv"');
    res.send([header, ...lines].join('\n'));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.get('/orders/:id', adminAuth, async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM orders WHERE orderId = ?', args: [req.params.id] });
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(await parseOrder(result.rows[0]));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.patch('/orders/:id/status', adminAuth, async (req, res) => {
  const VALID = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled', 'returned'];
  const { status, returnReason } = req.body;
  if (!VALID.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const prev = await db.execute({ sql: 'SELECT status,itemsJson FROM orders WHERE orderId = ?', args: [req.params.id] });
    if (!prev.rows[0]) return res.status(404).json({ error: 'Order not found' });
    const wasActive = !['cancelled','returned'].includes(prev.rows[0].status);
    const nowCancelled = ['cancelled','returned'].includes(status);

    await db.execute({
      sql: 'UPDATE orders SET status=?,returnReason=?,updatedAt=? WHERE orderId=?',
      args: [status, returnReason||null, new Date().toISOString(), req.params.id],
    });

    // Revert stock when cancelling/returning a previously active order
    if (wasActive && nowCancelled) {
      try {
        const items = JSON.parse(prev.rows[0].itemsJson || '[]');
        const reverts = items.map(i => ({ sql: 'UPDATE products SET stock=stock+? WHERE id=? AND stock>=0', args: [i.qty||1, Number(i.id)] }));
        if (reverts.length) { await db.batch(reverts, 'write'); invalidateProductCache(); }
      } catch {}
    }

    console.log('[STATUS]', req.params.id, '->', status);
    res.json({ success: true, orderId: req.params.id, status });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.patch('/orders/:id/payment', adminAuth, async (req, res) => {
  const { paymentStatus, utr } = req.body;
  if (!['paid','pending','failed'].includes(paymentStatus)) return res.status(400).json({ error: 'Invalid paymentStatus' });
  try {
    const result = await db.execute({ sql: 'UPDATE orders SET paymentStatus=?,utr=?,updatedAt=? WHERE orderId=?', args: [paymentStatus, utr?utr.trim():null, new Date().toISOString(), req.params.id] });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, orderId: req.params.id, paymentStatus, utr: utr||null });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.patch('/orders/:id/tracking', adminAuth, async (req, res) => {
  const { tracking } = req.body;
  if (!tracking || typeof tracking !== 'string' || tracking.length > 100) return res.status(400).json({ error: 'Invalid tracking number' });
  try {
    const result = await db.execute({ sql: 'UPDATE orders SET tracking=?,updatedAt=? WHERE orderId=?', args: [tracking.trim(), new Date().toISOString(), req.params.id] });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, tracking: tracking.trim() });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/orders/:id/notify', adminAuth, async (req, res) => {
  if (!WA_TOKEN || !WA_PHONE_ID) return res.status(503).json({ error: 'WhatsApp Cloud API not configured', hint: 'Add WA_TOKEN and WA_PHONE_ID env vars' });
  try {
    const result = await db.execute({ sql: 'SELECT * FROM orders WHERE orderId = ?', args: [req.params.id] });
    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found' });
    const order = await parseOrder(result.rows[0]);
    const rawPhone = (order.customer?.phone || '').replace(/\D/g, '');
    const phone = rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone;
    const { template } = req.body;
    const templateNames = {
      confirmed:  process.env.WA_TPL_CONFIRMED  || 'order_confirmed',
      dispatched: process.env.WA_TPL_DISPATCHED || 'order_dispatched',
      delivered:  process.env.WA_TPL_DELIVERED  || 'order_delivered',
    };
    if (!templateNames[template]) return res.status(400).json({ error: 'Unknown template. Use: confirmed | dispatched | delivered' });
    const params = [{ type: 'text', text: order.orderId }];
    if (template === 'dispatched' && result.rows[0].tracking) params.push({ type: 'text', text: result.rows[0].tracking });
    const waRes = await fetch(`https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + WA_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', to: phone, type: 'template',
        template: { name: templateNames[template], language: { code: 'en' }, components: [{ type: 'body', parameters: params }] } }),
    });
    const data = await waRes.json();
    if (!waRes.ok) throw new Error(JSON.stringify(data.error || data));

    // Email fallback if customer has email
    if (order.customer?.email) {
      const msgs = {
        confirmed:  `Your order ${order.orderId} has been confirmed and is being prepared for dispatch.`,
        dispatched: `Your order ${order.orderId} has been dispatched. Tracking: ${result.rows[0].tracking || 'N/A'}`,
        delivered:  `Your order ${order.orderId} has been delivered. Enjoy the celebrations!`,
      };
      sendEmail(order.customer.email, `Order ${template} — ${order.orderId}`, msgs[template] || '');
    }

    console.log('[WA NOTIFY]', order.orderId, template, data.messages?.[0]?.id);
    res.json({ success: true, messageId: data.messages?.[0]?.id });
  } catch (err) {
    console.error('[WA NOTIFY ERROR]', err.message);
    res.status(500).json({ error: 'WhatsApp notification failed', detail: err.message });
  }
});

// Analytics
app.get('/analytics', adminAuth, async (req, res) => {
  const days = Math.min(parseInt(req.query.days || '30', 10), 365);
  const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);
  try {
    const [dailyRes, allOrdersRes, statusRes, payRes] = await Promise.all([
      db.execute({ sql: `SELECT date(createdAt) as day, SUM(total) as revenue, COUNT(*) as orders FROM orders WHERE date(createdAt) >= ? AND status != 'cancelled' GROUP BY day ORDER BY day`, args: [since] }),
      db.execute({ sql: `SELECT itemsJson FROM orders WHERE createdAt >= ? AND status != 'cancelled'`, args: [since + 'T00:00:00'] }),
      db.execute({ sql: `SELECT status, COUNT(*) as n FROM orders WHERE createdAt >= ? GROUP BY status`, args: [since + 'T00:00:00'] }),
      db.execute({ sql: `SELECT paymentStatus as status, COUNT(*) as count, SUM(total) as revenue FROM orders WHERE createdAt >= ? GROUP BY paymentStatus`, args: [since + 'T00:00:00'] }),
    ]);

    const qtyMap = new Map();
    for (const row of allOrdersRes.rows) {
      try { JSON.parse(row.itemsJson).forEach(i => qtyMap.set(+i.id, (qtyMap.get(+i.id)||0) + (+i.qty||1))); }
      catch {}
    }
    const pMap = new Map((await getProducts()).map(p => [Number(p.id), p]));
    const topProducts = [...qtyMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([id, qty]) => { const p = pMap.get(id); return { name: p ? `${p.emoji||''} ${p.name}` : `#${id}`, qty }; });

    const statusBreakdown = {};
    statusRes.rows.forEach(r => { statusBreakdown[r.status] = Number(r.n); });
    const totalRevenue = dailyRes.rows.reduce((s, r) => s + Number(r.revenue), 0);
    const totalOrders = Object.values(statusBreakdown).reduce((s, n) => s + n, 0);

    res.json({
      daily: dailyRes.rows.map(r => ({ day: r.day, revenue: Number(r.revenue), orders: Number(r.orders) })),
      topProducts, statusBreakdown,
      paymentBreakdown: payRes.rows.map(r => ({ status: r.status, count: Number(r.count), revenue: Number(r.revenue) })),
      totals: { totalOrders, totalRevenue, pending: statusBreakdown.pending||0, delivered: statusBreakdown.delivered||0 },
    });
  } catch (err) { console.error('[ANALYTICS]', err.message); res.status(500).json({ error: 'Database error' }); }
});

// ── PRODUCT ROUTES ────────────────────────────────────────

app.get('/products', async (req, res) => {
  try {
    const isAdmin = req.headers.authorization === `Bearer ${ADMIN_TOKEN}`;
    const products = await getProducts();
    const visible = isAdmin ? products : products.filter(p => p.active);
    res.json(visible.map(r => ({
      id: Number(r.id), name: r.name, nameTa: r.nameTa, cat: r.cat,
      mrp: Number(r.mrp), price: Number(r.price), unit: r.unit, emoji: r.emoji,
      active: !!r.active, noDiscount: !!r.noDiscount,
      desc: r.desc || null, imageUrl: r.imageUrl || null,
      stock: Number(r.stock ?? -1),
    })));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.put('/products/:id', adminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const { name, nameTa, cat, mrp, price, unit, emoji, active, noDiscount, desc, imageUrl, stock } = req.body;
  try {
    const check = await db.execute({ sql: 'SELECT id FROM products WHERE id = ?', args: [id] });
    if (!check.rows[0]) return res.status(404).json({ error: 'Product not found' });
    await db.execute({
      sql: `UPDATE products SET
        name=COALESCE(?,name),nameTa=COALESCE(?,nameTa),cat=COALESCE(?,cat),
        mrp=COALESCE(?,mrp),price=COALESCE(?,price),unit=COALESCE(?,unit),
        emoji=COALESCE(?,emoji),active=COALESCE(?,active),noDiscount=COALESCE(?,noDiscount),
        desc=COALESCE(?,desc),imageUrl=COALESCE(?,imageUrl),stock=COALESCE(?,stock)
      WHERE id=?`,
      args: [
        name||null, nameTa||null, cat||null,
        mrp!=null?+mrp:null, price!=null?+price:null, unit||null, emoji||null,
        active!=null?(active?1:0):null, noDiscount!=null?(noDiscount?1:0):null,
        desc!==undefined?(desc||null):null, imageUrl!==undefined?(imageUrl||null):null,
        stock!=null?+stock:null, id,
      ],
    });
    invalidateProductCache();
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.delete('/products/:id', adminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const r = await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] });
    if (r.rowsAffected === 0) return res.status(404).json({ error: 'Product not found' });
    invalidateProductCache();
    console.log('[PRODUCT DELETE]', id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// Dedicated stock update endpoint (admin)
app.patch('/products/:id/stock', adminAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { stock } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  if (stock == null || isNaN(+stock) || +stock < -1) return res.status(400).json({ error: 'stock must be >= -1 (-1 = unlimited)' });
  try {
    const r = await db.execute({ sql: 'UPDATE products SET stock=? WHERE id=?', args: [+stock, id] });
    if (r.rowsAffected === 0) return res.status(404).json({ error: 'Product not found' });
    invalidateProductCache();
    res.json({ success: true, id, stock: +stock });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/products/:id/image', adminAuth, express.json({ limit: '500kb' }), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const { data } = req.body; // base64 JPEG data URI or raw base64
  if (!data) return res.status(400).json({ error: 'data required' });
  try {
    const base64 = data.replace(/^data:image\/\w+;base64,/, '');
    if (!/^[A-Za-z0-9+/=]+$/.test(base64.slice(0, 100))) return res.status(400).json({ error: 'Invalid image data' });
    const buf = Buffer.from(base64, 'base64');
    if (buf.length > 400 * 1024) return res.status(400).json({ error: 'Image too large after compression (max 400 KB)' });
    const filename = `${id}.jpg`;
    const dest = path.join(__dirname, '..', 'images', 'products', filename);
    fs.writeFileSync(dest, buf);
    const imageUrl = `images/products/${filename}`;
    await db.execute({ sql: 'UPDATE products SET imageUrl=? WHERE id=?', args: [imageUrl, id] });
    invalidateProductCache();
    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error('[IMAGE UPLOAD]', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.post('/products', adminAuth, async (req, res) => {
  const { name, nameTa, cat, mrp, price, unit, emoji, noDiscount, desc, imageUrl, stock } = req.body;
  if (!name || !cat || mrp == null || price == null) return res.status(400).json({ error: 'name, cat, mrp, price are required' });
  try {
    const maxResult = await db.execute('SELECT MAX(id) as m FROM products');
    const newId = (Number(maxResult.rows[0]?.m) || 0) + 1;
    await db.execute({
      sql: 'INSERT INTO products (id,name,nameTa,cat,mrp,price,unit,emoji,active,noDiscount,desc,imageUrl,stock) VALUES (?,?,?,?,?,?,?,?,1,?,?,?,?)',
      args: [newId, name.trim(), nameTa||null, cat, +mrp, +price, unit||'pkt', emoji||'🎆', noDiscount?1:0, desc||null, imageUrl||null, stock!=null?+stock:-1],
    });
    invalidateProductCache();
    console.log('[PRODUCT ADD]', newId, name.trim());
    res.status(201).json({ success: true, id: newId });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// ── COUPONS ───────────────────────────────────────────────

app.get('/coupons', adminAuth, async (req, res) => {
  try {
    const r = await db.execute('SELECT * FROM coupons ORDER BY createdAt DESC');
    res.json(r.rows.map(c => ({ ...c, value: Number(c.value), minOrder: Number(c.minOrder), maxUses: Number(c.maxUses), usedCount: Number(c.usedCount), maxDiscount: Number(c.maxDiscount), active: !!c.active })));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.post('/coupons', adminAuth, async (req, res) => {
  const { code, type, value, minOrder, maxUses, maxDiscount, expiresAt } = req.body;
  if (!code || !type || value == null) return res.status(400).json({ error: 'code, type, value required' });
  if (!['percent','flat'].includes(type)) return res.status(400).json({ error: 'type must be percent or flat' });
  const c = String(code).toUpperCase().trim();
  if (!/^[A-Z0-9_-]{2,20}$/.test(c)) return res.status(400).json({ error: 'Coupon code: 2-20 chars, A-Z 0-9 _ -' });
  try {
    await db.execute({
      sql: 'INSERT INTO coupons (code,type,value,minOrder,maxUses,maxDiscount,expiresAt,usedCount,active,createdAt) VALUES (?,?,?,?,?,?,?,0,1,?)',
      args: [c, type, +value, +(minOrder||0), +(maxUses||0), +(maxDiscount||0), expiresAt||null, new Date().toISOString()],
    });
    res.status(201).json({ success: true, code: c });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Coupon code already exists' });
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/coupons/:code', adminAuth, async (req, res) => {
  const { active, value, minOrder, maxUses, maxDiscount, expiresAt } = req.body;
  try {
    await db.execute({
      sql: `UPDATE coupons SET active=COALESCE(?,active),value=COALESCE(?,value),minOrder=COALESCE(?,minOrder),maxUses=COALESCE(?,maxUses),maxDiscount=COALESCE(?,maxDiscount),expiresAt=COALESCE(?,expiresAt) WHERE code=?`,
      args: [active!=null?(active?1:0):null, value!=null?+value:null, minOrder!=null?+minOrder:null, maxUses!=null?+maxUses:null, maxDiscount!=null?+maxDiscount:null, expiresAt||null, req.params.code.toUpperCase()],
    });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.delete('/coupons/:code', adminAuth, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM coupons WHERE code=?', args: [req.params.code.toUpperCase()] });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// ── SHIPPING ZONES ────────────────────────────────────────

app.get('/shipping-zones', adminAuth, async (req, res) => {
  try {
    const r = await db.execute('SELECT * FROM shipping_zones ORDER BY state');
    res.json(r.rows.map(z => ({ ...z, cost: Number(z.cost), freeAbove: Number(z.freeAbove) })));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.put('/shipping-zones/:state', adminAuth, async (req, res) => {
  const { cost, freeAbove, etaDays } = req.body;
  const state = req.params.state.toUpperCase().trim();
  try {
    await db.execute({
      sql: `INSERT INTO shipping_zones (state,cost,freeAbove,etaDays) VALUES (?,?,?,?) ON CONFLICT(state) DO UPDATE SET cost=excluded.cost,freeAbove=excluded.freeAbove,etaDays=excluded.etaDays`,
      args: [state, +(cost||0), +(freeAbove||0), etaDays||'5-7'],
    });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.delete('/shipping-zones/:state', adminAuth, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM shipping_zones WHERE state=?', args: [req.params.state.toUpperCase()] });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// ── REVIEWS ───────────────────────────────────────────────

app.get('/reviews/pending', adminAuth, async (req, res) => {
  try {
    const r = await db.execute(`SELECT * FROM reviews WHERE status='pending' ORDER BY createdAt DESC`);
    res.json(r.rows);
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.patch('/reviews/:id', adminAuth, async (req, res) => {
  // Accept both {status:'approved'} and {approved:true} (frontend sends approved:bool)
  let status = req.body.status;
  if (!status && req.body.approved != null) status = req.body.approved ? 'approved' : 'rejected';
  if (!['approved','rejected'].includes(status)) return res.status(400).json({ error: 'status must be approved or rejected' });
  try {
    await db.execute({ sql: 'UPDATE reviews SET status=? WHERE id=?', args: [status, +req.params.id] });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

app.delete('/reviews/:id', adminAuth, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM reviews WHERE id=?', args: [+req.params.id] });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// ─────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({
  status: 'ok', time: new Date().toISOString(),
  razorpay: !!rzp, waApi: !!(WA_TOKEN && WA_PHONE_ID), email: !!transporter,
}));

// ── INIT: create tables, run migrations, seed, listen ─────
async function init() {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS orders (
      orderId       TEXT PRIMARY KEY,
      customerJson  TEXT NOT NULL,
      itemsJson     TEXT NOT NULL,
      total         REAL NOT NULL DEFAULT 0,
      status        TEXT NOT NULL DEFAULT 'pending',
      payment       TEXT,
      paymentId     TEXT,
      paymentStatus TEXT NOT NULL DEFAULT 'pending',
      tracking      TEXT,
      notes         TEXT,
      utr           TEXT,
      returnReason  TEXT,
      coupon        TEXT,
      discount      REAL NOT NULL DEFAULT 0,
      shippingCost  REAL NOT NULL DEFAULT 0,
      createdAt     TEXT NOT NULL,
      updatedAt     TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id         INTEGER PRIMARY KEY,
      name       TEXT NOT NULL,
      nameTa     TEXT,
      cat        TEXT NOT NULL,
      mrp        REAL NOT NULL,
      price      REAL NOT NULL,
      unit       TEXT NOT NULL DEFAULT 'pkt',
      emoji      TEXT,
      active     INTEGER NOT NULL DEFAULT 1,
      noDiscount INTEGER NOT NULL DEFAULT 0,
      desc       TEXT,
      imageUrl   TEXT,
      stock      INTEGER NOT NULL DEFAULT -1
    )`,
    `CREATE TABLE IF NOT EXISTS coupons (
      code        TEXT PRIMARY KEY,
      type        TEXT NOT NULL DEFAULT 'flat',
      value       REAL NOT NULL DEFAULT 0,
      minOrder    REAL NOT NULL DEFAULT 0,
      maxUses     INTEGER NOT NULL DEFAULT 0,
      maxDiscount REAL NOT NULL DEFAULT 0,
      usedCount   INTEGER NOT NULL DEFAULT 0,
      active      INTEGER NOT NULL DEFAULT 1,
      expiresAt   TEXT,
      createdAt   TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS shipping_zones (
      state      TEXT PRIMARY KEY,
      cost       REAL NOT NULL DEFAULT 0,
      freeAbove  REAL NOT NULL DEFAULT 0,
      etaDays    TEXT NOT NULL DEFAULT '5-7'
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId   TEXT NOT NULL,
      productId INTEGER NOT NULL,
      rating    INTEGER NOT NULL,
      text      TEXT,
      name      TEXT,
      status    TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL
    )`,
    `CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(createdAt DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(productId, status)`,
  ], 'write');

  // Migrations for existing DBs that may be missing newer columns
  const migrations = [
    'ALTER TABLE products ADD COLUMN desc TEXT',
    'ALTER TABLE products ADD COLUMN imageUrl TEXT',
    'ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT -1',
    'ALTER TABLE orders ADD COLUMN utr TEXT',
    'ALTER TABLE orders ADD COLUMN returnReason TEXT',
    'ALTER TABLE orders ADD COLUMN coupon TEXT',
    'ALTER TABLE orders ADD COLUMN discount REAL NOT NULL DEFAULT 0',
    'ALTER TABLE orders ADD COLUMN shippingCost REAL NOT NULL DEFAULT 0',
  ];
  for (const sql of migrations) {
    try { await db.execute(sql); } catch {}
  }

  const countResult = await db.execute('SELECT COUNT(*) as n FROM products');
  if (Number(countResult.rows[0].n) === 0) {
    const seedData = require('./products_seed.json');
    const stmts = seedData.map(p => ({
      sql: 'INSERT INTO products (id,name,nameTa,cat,mrp,price,unit,emoji,active,noDiscount) VALUES (?,?,?,?,?,?,?,?,1,?)',
      args: [p.id, p.name, p.nameTa||null, p.cat, p.mrp, p.price, p.unit||'pkt', p.emoji||null, p.noDiscount?1:0],
    }));
    await db.batch(stmts, 'write');
    console.log('[PRODUCTS] Seeded', seedData.length, 'products from catalog');
  }

  app.listen(PORT, () => {
    console.log('SPMC Order Backend on port ' + PORT);
    console.log('[DB] Turso connected:', TURSO_URL);
    if (!rzp)         console.log('[INFO] Razorpay disabled — set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to enable');
    if (!WA_TOKEN)    console.log('[INFO] WhatsApp API disabled — set WA_TOKEN + WA_PHONE_ID to enable');
    if (!transporter) console.log('[INFO] Email disabled — set SMTP_HOST to enable');
  });
}

init().catch(err => {
  console.error('[FATAL] Startup failed:', err.message);
  process.exit(1);
});
