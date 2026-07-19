// Cart logic — localStorage backed, shared across all pages

const Cart = {
  _key: 'spmc_cart',

  get() {
    try { return JSON.parse(localStorage.getItem(this._key)) || []; }
    catch { return []; }
  },

  save(items) {
    localStorage.setItem(this._key, JSON.stringify(items));
    this._dispatch();
  },

  _dispatch() {
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this.get() }));
    this.updateBadge();
  },

  add(productId, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 99);
    } else {
      const p = getProduct(productId);
      if (!p) return;
      items.push({ id: productId, qty });
    }
    this.save(items);
  },

  remove(productId) {
    this.save(this.get().filter(i => i.id !== productId));
  },

  setQty(productId, qty) {
    if (qty <= 0) { this.remove(productId); return; }
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = Math.min(qty, 99); this.save(items); }
  },

  clear() {
    localStorage.removeItem(this._key);
    this._dispatch();
  },

  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },

  total() {
    return this.get().reduce((s, i) => {
      const p = getProduct(i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
  },

  // Build WhatsApp message for order
  toWhatsApp(customerInfo) {
    const items = this.get();
    const lines = items.map(i => {
      const p = getProduct(i.id);
      return `• ${p.name} × ${i.qty} = ₹${(p.price * i.qty).toLocaleString('en-IN')}`;
    });
    const total = this.total();
    const msg = [
      `🎆 *New Order — Sri Palani Murugan Crackers*`,
      ``,
      `*Customer:* ${customerInfo.name}`,
      `*Phone:* ${customerInfo.phone}`,
      `*Address:* ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} — ${customerInfo.pincode}`,
      ``,
      `*Order Details:*`,
      ...lines,
      ``,
      `*Total:* ₹${total.toLocaleString('en-IN')}`,
      `*Payment:* ${customerInfo.payment}`,
      ``,
      `_Order placed via website_`,
    ].join('\n');
    return encodeURIComponent(msg);
  },

  updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = this.count();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  },
};

// Init badge on load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
