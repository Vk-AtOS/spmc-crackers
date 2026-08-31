// Sri Palani Murugan Crackers — Order backend
// Usage: cd backend && npm install && node server.js
// Env vars: ADMIN_TOKEN, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, WA_TOKEN, WA_PHONE_ID

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
if (!ADMIN_TOKEN) {
  console.error('[FATAL] ADMIN_TOKEN env var not set. Copy backend/.env.example to backend/.env and set a secure token.');
  process.exit(1);
}
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
  } catch (e) {
    console.warn('[RAZORPAY] razorpay package missing — run: npm install razorpay');
  }
}

// ── DB INIT ───────────────────────────────────────────────
const db = new Database(path.join(__dirname, 'orders.db'));
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
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
    createdAt     TEXT NOT NULL,
    updatedAt     TEXT
  )
`).run();

// Safe column migrations for existing DBs
['paymentId TEXT', 'paymentStatus TEXT NOT NULL DEFAULT "pending"', 'tracking TEXT', 'returnReason TEXT'].forEach(col => {
  try { db.prepare('ALTER TABLE orders ADD COLUMN ' + col).run(); } catch {}
});

// ── PRODUCTS TABLE ────────────────────────────────────────
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    nameTa     TEXT,
    cat        TEXT NOT NULL,
    mrp        REAL NOT NULL,
    price      REAL NOT NULL,
    unit       TEXT NOT NULL DEFAULT 'pkt',
    emoji      TEXT,
    active     INTEGER NOT NULL DEFAULT 1,
    noDiscount INTEGER NOT NULL DEFAULT 0
  )
`).run();

// Seed from static catalog on first run
const seedData = require('./products_seed.json');
if (db.prepare('SELECT COUNT(*) as n FROM products').get().n === 0) {
  const ins = db.prepare(
    'INSERT INTO products (id,name,nameTa,cat,mrp,price,unit,emoji,active,noDiscount) VALUES (?,?,?,?,?,?,?,?,1,?)'
  );
  db.transaction(pp => pp.forEach(p =>
    ins.run(p.id, p.name, p.nameTa || null, p.cat, p.mrp, p.price,
            p.unit || 'pkt', p.emoji || null, p.noDiscount ? 1 : 0)
  ))(seedData);
  console.log('[PRODUCTS] Seeded', seedData.length, 'products from catalog');
}

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '1mb' }));

function adminAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  if (auth !== 'Bearer ' + ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function parseOrder(row) {
  return {
    orderId: row.orderId,
    customer: JSON.parse(row.customerJson),
    items: JSON.parse(row.itemsJson),
    total: row.total,
    status: row.status,
    payment: row.payment,
    paymentId: row.paymentId,
    paymentStatus: row.paymentStatus || 'pending',
    tracking: row.tracking,
    notes: row.notes,
    returnReason: row.returnReason || null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ── PUBLIC ROUTES ─────────────────────────────────────────

// GET /config — frontend feature flags
app.get('/config', (_req, res) => {
  res.json({
    razorpayEnabled: !!rzp,
    razorpayKeyId: RAZORPAY_KEY_ID,
    waApiEnabled: !!(WA_TOKEN && WA_PHONE_ID),
  });
});

// POST /orders — place order
app.post('/orders', (req, res) => {
  const { orderId, customer, items, total, createdAt, notes, paymentId, paymentStatus } = req.body;
  if (!orderId || !customer || !items) return res.status(400).json({ error: 'Missing required fields' });
  if (typeof orderId !== 'string' || orderId.length > 40) return res.status(400).json({ error: 'Invalid orderId' });
  if (typeof total !== 'number' || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });
  try {
    db.prepare(`
      INSERT OR IGNORE INTO orders
        (orderId, customerJson, itemsJson, total, status, payment, paymentId, paymentStatus, notes, createdAt)
      VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)
    `).run(
      orderId, JSON.stringify(customer), JSON.stringify(items),
      Number(total) || 0, customer.payment || '',
      paymentId || null, paymentStatus || 'pending',
      notes || '', createdAt || new Date().toISOString(),
    );
    console.log('[ORDER]', orderId, customer.name, 'Rs.' + total, paymentStatus || 'pending');
    res.status(201).json({ success: true, orderId });
  } catch (err) {
    console.error('[ORDER ERROR]', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /create-razorpay-order — initiate online payment
app.post('/create-razorpay-order', async (req, res) => {
  if (!rzp) return res.status(503).json({ error: 'Razorpay not configured — add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to env' });
  const { amount, orderId } = req.body;
  if (!amount || !orderId) return res.status(400).json({ error: 'Missing amount or orderId' });
  try {
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: orderId,
      notes: { source: 'spmc-website' },
    });
    res.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error('[RAZORPAY CREATE]', err.message);
    res.status(500).json({ error: 'Payment order creation failed' });
  }
});

// POST /verify-payment — verify Razorpay signature and mark order paid
app.post('/verify-payment', (req, res) => {
  if (!RAZORPAY_KEY_SECRET) return res.status(503).json({ error: 'Razorpay not configured' });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' });
  }
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(body).digest('hex');
  if (expected !== razorpay_signature) return res.status(400).json({ error: 'Payment signature mismatch' });

  try {
    if (orderId) {
      db.prepare('UPDATE orders SET paymentId = ?, paymentStatus = ?, updatedAt = ? WHERE orderId = ?')
        .run(razorpay_payment_id, 'paid', new Date().toISOString(), orderId);
    }
    console.log('[PAYMENT VERIFIED]', razorpay_payment_id, orderId || '');
    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// ── ADMIN ROUTES ──────────────────────────────────────────

// GET /orders — list all
app.get('/orders', adminAuth, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
    res.json(rows.map(parseOrder));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// GET /orders/export — CSV download
app.get('/orders/export', adminAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"';
  const header = ['Order ID','Name','Phone','Address','City','State','Pincode','Payment Method','Total','Status','Payment Status','Tracking','Created At'].join(',');
  const lines = rows.map(row => {
    const c = JSON.parse(row.customerJson || '{}');
    return [
      esc(row.orderId), esc(c.name), esc(c.phone), esc(c.address),
      esc(c.city), esc(c.state), esc(c.pincode), esc(c.payment || row.payment),
      row.total || 0, esc(row.status), esc(row.paymentStatus || 'pending'),
      esc(row.tracking || ''), esc(row.createdAt),
    ].join(',');
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="spmc-orders.csv"');
  res.send([header, ...lines].join('\n'));
});

// GET /orders/:id — single order
app.get('/orders/:id', adminAuth, (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM orders WHERE orderId = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(parseOrder(row));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// PATCH /orders/:id/status — update dispatch status (includes returned)
app.patch('/orders/:id/status', adminAuth, (req, res) => {
  const VALID = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled', 'returned'];
  const { status, returnReason } = req.body;
  if (!VALID.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const result = db.prepare('UPDATE orders SET status = ?, returnReason = ?, updatedAt = ? WHERE orderId = ?')
      .run(status, returnReason || null, new Date().toISOString(), req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Order not found' });
    console.log('[STATUS]', req.params.id, '->', status);
    res.json({ success: true, orderId: req.params.id, status });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// PATCH /orders/:id/tracking — save tracking number
app.patch('/orders/:id/tracking', adminAuth, (req, res) => {
  const { tracking } = req.body;
  if (!tracking || typeof tracking !== 'string' || tracking.length > 100) {
    return res.status(400).json({ error: 'Invalid tracking number' });
  }
  try {
    const result = db.prepare('UPDATE orders SET tracking = ?, updatedAt = ? WHERE orderId = ?')
      .run(tracking.trim(), new Date().toISOString(), req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Order not found' });
    console.log('[TRACKING]', req.params.id, tracking);
    res.json({ success: true, tracking: tracking.trim() });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// POST /orders/:id/notify — WhatsApp Cloud API notification (requires approved templates)
app.post('/orders/:id/notify', adminAuth, async (req, res) => {
  if (!WA_TOKEN || !WA_PHONE_ID) {
    return res.status(503).json({
      error: 'WhatsApp Cloud API not configured',
      hint: 'Add WA_TOKEN and WA_PHONE_ID env vars. See: https://developers.facebook.com/docs/whatsapp/cloud-api',
    });
  }
  const row = db.prepare('SELECT * FROM orders WHERE orderId = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Order not found' });

  const order = parseOrder(row);
  const rawPhone = (order.customer?.phone || '').replace(/\D/g, '');
  const phone = rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone;
  const { template } = req.body;

  const templateNames = {
    confirmed:  process.env.WA_TPL_CONFIRMED  || 'order_confirmed',
    dispatched: process.env.WA_TPL_DISPATCHED || 'order_dispatched',
    delivered:  process.env.WA_TPL_DELIVERED  || 'order_delivered',
  };
  if (!templateNames[template]) return res.status(400).json({ error: 'Unknown template. Use: confirmed | dispatched | delivered' });

  // Body parameters per template: all include orderId; dispatched also includes tracking
  const params = [{ type: 'text', text: order.orderId }];
  if (template === 'dispatched' && row.tracking) params.push({ type: 'text', text: row.tracking });

  try {
    const waRes = await fetch(`https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + WA_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: templateNames[template],
          language: { code: 'en' },
          components: [{ type: 'body', parameters: params }],
        },
      }),
    });
    const data = await waRes.json();
    if (!waRes.ok) throw new Error(JSON.stringify(data.error || data));
    console.log('[WA NOTIFY]', order.orderId, template, data.messages?.[0]?.id);
    res.json({ success: true, messageId: data.messages?.[0]?.id });
  } catch (err) {
    console.error('[WA NOTIFY ERROR]', err.message);
    res.status(500).json({ error: 'WhatsApp notification failed', detail: err.message });
  }
});

// ── PRODUCT ROUTES ────────────────────────────────────────

// GET /products — public (used by shop to get live prices + active flag)
app.get('/products', (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM products ORDER BY id').all();
    res.json(rows.map(r => ({
      id: r.id, name: r.name, nameTa: r.nameTa, cat: r.cat,
      mrp: r.mrp, price: r.price, unit: r.unit, emoji: r.emoji,
      active: !!r.active, noDiscount: !!r.noDiscount,
    })));
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// PUT /products/:id — admin: edit name/price/active/etc
app.put('/products/:id', adminAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const { name, nameTa, cat, mrp, price, unit, emoji, active, noDiscount } = req.body;
  try {
    const row = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'Product not found' });
    db.prepare(`
      UPDATE products SET
        name=COALESCE(?,name), nameTa=COALESCE(?,nameTa), cat=COALESCE(?,cat),
        mrp=COALESCE(?,mrp), price=COALESCE(?,price), unit=COALESCE(?,unit),
        emoji=COALESCE(?,emoji), active=COALESCE(?,active), noDiscount=COALESCE(?,noDiscount)
      WHERE id=?
    `).run(
      name || null, nameTa || null, cat || null,
      mrp != null ? +mrp : null, price != null ? +price : null,
      unit || null, emoji || null,
      active != null ? (active ? 1 : 0) : null,
      noDiscount != null ? (noDiscount ? 1 : 0) : null,
      id
    );
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// POST /products — admin: add new product
app.post('/products', adminAuth, (req, res) => {
  const { name, nameTa, cat, mrp, price, unit, emoji, noDiscount } = req.body;
  if (!name || !cat || mrp == null || price == null)
    return res.status(400).json({ error: 'name, cat, mrp, price are required' });
  if (typeof +mrp !== 'number' || typeof +price !== 'number')
    return res.status(400).json({ error: 'mrp and price must be numbers' });
  try {
    const maxId = db.prepare('SELECT MAX(id) as m FROM products').get().m || 0;
    const newId = maxId + 1;
    db.prepare(
      'INSERT INTO products (id,name,nameTa,cat,mrp,price,unit,emoji,active,noDiscount) VALUES (?,?,?,?,?,?,?,?,1,?)'
    ).run(newId, name.trim(), nameTa || null, cat, +mrp, +price,
          unit || 'pkt', emoji || '🎆', noDiscount ? 1 : 0);
    console.log('[PRODUCT ADD]', newId, name.trim());
    res.status(201).json({ success: true, id: newId });
  } catch { res.status(500).json({ error: 'Database error' }); }
});

// Health
app.get('/health', (_req, res) => res.json({
  status: 'ok', time: new Date().toISOString(),
  razorpay: !!rzp, waApi: !!(WA_TOKEN && WA_PHONE_ID),
}));

app.listen(PORT, () => {
  console.log('SPMC Order Backend on port ' + PORT);
  console.log('Admin token: [set]');
  if (!rzp) console.log('[INFO] Razorpay disabled — set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to enable');
  if (!WA_TOKEN) console.log('[INFO] WhatsApp API disabled — set WA_TOKEN + WA_PHONE_ID to enable');
});
