// Bilingual support chat widget — FAQ-based, safe DOM construction

const SUPPORT_FAQ = {
  en: [
    { q: 'Do you deliver?', a: 'Yes! We deliver pan-India. Tamil Nadu: 3–5 days. Other states: 5–7 days.' },
    { q: 'Minimum order?', a: 'Minimum order is ₹500. Gift boxes have no minimum order.' },
    { q: 'Payment methods?', a: 'We accept UPI (PhonePe/GPay/Paytm), bank transfer, and COD for select areas.' },
    { q: 'Prices after discount?', a: 'Yes! All prices shown already include 50% Diwali discount. Gift boxes are full price.' },
    { q: 'Is COD available?', a: 'COD available in select Tamil Nadu areas. WhatsApp us to confirm for your location.' },
    { q: 'Can I cancel?', a: 'Orders can be cancelled before dispatch. Contact us on WhatsApp: 7200915142.' },
    { q: 'Damaged product?', a: 'We replace damaged products. Contact within 48 hours of delivery with photos.' },
    { q: 'Gift boxes?', a: 'Gift boxes from ₹450 (20 items) to ₹1200 (60 items). No discount on gift boxes.' },
    { q: 'How to order?', a: 'Add to cart → Checkout → WhatsApp order sent → We confirm and dispatch!' },
    { q: 'Contact?', a: 'WhatsApp: 7200915142, 9498138955 | Email: muthumurugan3005@gmail.com' },
  ],
  ta: [
    { q: 'டெலிவரி கிடைக்குமா?', a: 'ஆம்! இந்தியா முழுவதும் டெலிவரி. தமிழ்நாடு: 3–5 நாட்கள். மற்ற மாநிலங்கள்: 5–7 நாட்கள்.' },
    { q: 'குறைந்தபட்ச ஆர்டர்?', a: 'குறைந்தபட்ச ஆர்டர் ₹500. கிஃப்ட் பாக்ஸுக்கு குறைந்தபட்ச ஆர்டர் இல்லை.' },
    { q: 'பணம் செலுத்தும் முறை?', a: 'UPI, வங்கி பரிமாற்றம், சில பகுதிகளில் COD ஏற்கிறோம்.' },
    { q: 'விலை தள்ளுபடி பின்னரா?', a: 'ஆம்! அனைத்து விலைகளும் 50% தள்ளுபடி பின்னர். கிஃப்ட் பாக்ஸில் தள்ளுபடி இல்லை.' },
    { q: 'COD கிடைக்குமா?', a: 'சில தமிழ்நாடு பகுதிகளில் COD. உறுதிப்படுத்த WhatsApp செய்யுங்கள்.' },
    { q: 'ரத்து செய்யலாமா?', a: 'அனுப்பும் முன் ரத்து செய்யலாம். WhatsApp: 7200915142 தொடர்பு கொள்ளுங்கள்.' },
    { q: 'சேதமடைந்தால்?', a: 'சேதமடைந்த பொருட்களை மாற்றுவோம். 48 மணி நேரத்தில் புகைப்படத்துடன் WhatsApp செய்யுங்கள்.' },
    { q: 'கிஃப்ட் பாக்ஸ்?', a: 'கிஃப்ட் பாக்ஸ் ₹450 (20 பொருட்கள்) முதல் ₹1200 (60 பொருட்கள்). தள்ளுபடி இல்லை.' },
    { q: 'ஆர்டர் எப்படி?', a: 'கார்ட்டில் சேர் → செக்அவுட் → WhatsApp ஆர்டர் → நாங்கள் உறுதிப்படுத்துவோம்!' },
    { q: 'தொடர்பு?', a: 'WhatsApp: 7200915142, 9498138955 | மின்னஞ்சல்: muthumurugan3005@gmail.com' },
  ]
};

let chatLang = 'en';

function buildWidget() {
  const root = document.createElement('div');
  root.id = 'support-widget';
  Object.assign(root.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: '9999',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px'
  });

  // Panel
  const panel = document.createElement('div');
  panel.id = 'chat-panel';
  Object.assign(panel.style, {
    display: 'none', width: '340px', background: '#1a0a0a',
    border: '1px solid rgba(255,215,0,0.3)', borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.8)', flexDirection: 'column', overflow: 'hidden'
  });

  // Header
  const header = document.createElement('div');
  Object.assign(header.style, {
    background: 'linear-gradient(135deg,#7c2d12,#92400e)',
    padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  });

  const headerLeft = document.createElement('div');
  headerLeft.style.display = 'flex';
  headerLeft.style.alignItems = 'center';
  headerLeft.style.gap = '10px';
  const headerIcon = document.createElement('span');
  headerIcon.textContent = '💬';
  headerIcon.style.fontSize = '24px';
  const headerMeta = document.createElement('div');
  const headerTitle = document.createElement('div');
  headerTitle.id = 'sw-title';
  headerTitle.textContent = 'Customer Support';
  Object.assign(headerTitle.style, { color: '#ffd700', fontWeight: '700', fontSize: '14px' });
  const headerOnline = document.createElement('div');
  headerOnline.textContent = '🟢 Online now';
  headerOnline.style.cssText = 'color:#86efac;font-size:11px;';
  headerMeta.append(headerTitle, headerOnline);
  headerLeft.append(headerIcon, headerMeta);

  const headerRight = document.createElement('div');
  headerRight.style.cssText = 'display:flex;gap:8px;align-items:center;';

  ['en', 'ta'].forEach(lng => {
    const btn = document.createElement('button');
    btn.className = 'sw-lang';
    btn.dataset.lang = lng;
    btn.textContent = lng === 'en' ? 'EN' : 'தமிழ்';
    btn.style.cssText = 'padding:3px 8px;border-radius:6px;font-size:11px;border:1px solid rgba(255,255,255,0.3);background:transparent;color:white;cursor:pointer;';
    btn.addEventListener('click', () => switchChatLang(lng));
    headerRight.appendChild(btn);
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'background:none;border:none;color:white;font-size:20px;cursor:pointer;line-height:1;';
  closeBtn.addEventListener('click', toggleChat);
  headerRight.appendChild(closeBtn);

  header.append(headerLeft, headerRight);

  // Messages area
  const msgs = document.createElement('div');
  msgs.id = 'chat-messages';
  msgs.style.cssText = 'flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;max-height:220px;';
  const welcome = document.createElement('div');
  welcome.id = 'sw-welcome';
  welcome.style.cssText = 'background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.2);border-radius:12px 12px 12px 4px;padding:10px 14px;color:#fef9c3;font-size:13px;max-width:85%;';
  welcome.textContent = '👋 Hi! How can I help you today?';
  msgs.appendChild(welcome);

  // Quick questions
  const quickQs = document.createElement('div');
  quickQs.id = 'quick-qs';
  quickQs.style.cssText = 'padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(255,215,0,0.1);';

  // Input row
  const inputRow = document.createElement('div');
  inputRow.style.cssText = 'padding:10px 12px;border-top:1px solid rgba(255,215,0,0.1);display:flex;gap:8px;';
  const chatInput = document.createElement('input');
  chatInput.id = 'chat-input';
  chatInput.placeholder = 'Type your question...';
  chatInput.style.cssText = 'flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,215,0,0.2);border-radius:8px;padding:8px 12px;color:white;font-size:13px;outline:none;';
  chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  const sendBtn = document.createElement('button');
  sendBtn.textContent = '➤';
  sendBtn.style.cssText = 'background:#92400e;border:none;border-radius:8px;padding:8px 14px;color:#ffd700;cursor:pointer;font-size:16px;';
  sendBtn.addEventListener('click', sendMessage);
  inputRow.append(chatInput, sendBtn);

  // WhatsApp CTA
  const waRow = document.createElement('div');
  waRow.style.cssText = 'padding:8px 12px 12px;text-align:center;';
  const waLink = document.createElement('a');
  waLink.href = 'https://wa.me/917200915142';
  waLink.target = '_blank';
  waLink.rel = 'noopener';
  waLink.style.cssText = 'display:inline-flex;align-items:center;gap:6px;background:#25d366;color:white;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;text-decoration:none;';
  const waIcon = document.createElement('span');
  waIcon.textContent = '💬';
  const waText = document.createElement('span');
  waText.id = 'sw-wa-text';
  waText.textContent = 'Chat on WhatsApp';
  waLink.append(waIcon, waText);
  waRow.appendChild(waLink);

  panel.append(header, msgs, quickQs, inputRow, waRow);

  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'chat-toggle';
  toggleBtn.textContent = '💬';
  toggleBtn.style.cssText = 'width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#92400e,#7c2d12);border:2px solid #ffd700;box-shadow:0 4px 20px rgba(255,165,0,0.4);cursor:pointer;font-size:28px;transition:transform 0.2s;';
  toggleBtn.addEventListener('click', toggleChat);
  toggleBtn.addEventListener('mouseover', () => { toggleBtn.style.transform = 'scale(1.1)'; });
  toggleBtn.addEventListener('mouseout', () => { toggleBtn.style.transform = 'scale(1)'; });

  root.append(panel, toggleBtn);
  document.body.appendChild(root);
  renderQuickQs();
}

function toggleChat() {
  const panel = document.getElementById('chat-panel');
  const isOpen = panel.style.display === 'flex';
  panel.style.display = isOpen ? 'none' : 'flex';
  panel.style.flexDirection = 'column';
}

function renderQuickQs() {
  const qs = document.getElementById('quick-qs');
  if (!qs) return;
  qs.textContent = '';
  SUPPORT_FAQ[chatLang].slice(0, 4).forEach((f, idx) => {
    const btn = document.createElement('button');
    btn.textContent = f.q;
    btn.style.cssText = 'background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.25);border-radius:20px;padding:5px 12px;color:#fcd34d;font-size:11px;cursor:pointer;';
    btn.addEventListener('click', () => {
      addMessage(f.q, 'user');
      setTimeout(() => addMessage(SUPPORT_FAQ[chatLang][idx].a, 'bot'), 400);
    });
    qs.appendChild(btn);
  });
}

function switchChatLang(lng) {
  chatLang = lng;
  const welcome = document.getElementById('sw-welcome');
  if (welcome) welcome.textContent = lng === 'ta' ? '👋 வணக்கம்! நான் எப்படி உதவலாம்?' : '👋 Hi! How can I help you today?';
  const title = document.getElementById('sw-title');
  if (title) title.textContent = lng === 'ta' ? 'வாடிக்கையாளர் சேவை' : 'Customer Support';
  const waText = document.getElementById('sw-wa-text');
  if (waText) waText.textContent = lng === 'ta' ? 'WhatsApp-ல் பேசுங்கள்' : 'Chat on WhatsApp';
  const input = document.getElementById('chat-input');
  if (input) input.placeholder = lng === 'ta' ? 'கேள்வி கேளுங்கள்...' : 'Type your question...';
  renderQuickQs();
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addMessage(text, 'user');

  const query = text.toLowerCase();
  const faqs = SUPPORT_FAQ[chatLang];
  const kw = chatLang === 'ta'
    ? { 'டெலிவரி': 0, 'குறைந்தபட்ச': 1, 'பணம்': 2, 'தள்ளுபடி': 3, 'cod': 4, 'ரத்து': 5, 'சேதம்': 6, 'கிஃப்ட்': 7, 'எப்படி': 8, 'தொடர்பு': 9 }
    : { 'deliver': 0, 'ship': 0, 'minimum': 1, 'payment': 2, 'pay': 2, 'discount': 3, 'price': 3, 'cod': 4, 'cash': 4, 'cancel': 5, 'damage': 6, 'gift': 7, 'order': 8, 'how': 8, 'contact': 9 };

  let answer = null;
  for (const [k, i] of Object.entries(kw)) {
    if (query.includes(k)) { answer = faqs[i].a; break; }
  }

  setTimeout(() => {
    addMessage(answer || (chatLang === 'ta'
      ? 'அதற்கான பதிலை கண்டறிய முடியவில்லை. WhatsApp 7200915142 தொடர்பு கொள்ளுங்கள்!'
      : "I couldn't find an exact answer. Please WhatsApp us at 7200915142 for immediate help!"
    ), 'bot');
  }, 500);
}

function addMessage(text, type) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.textContent = text;
  div.style.cssText = type === 'user'
    ? 'align-self:flex-end;background:rgba(146,64,14,0.6);border:1px solid rgba(255,165,0,0.3);border-radius:12px 12px 4px 12px;padding:10px 14px;color:#fff;font-size:13px;max-width:85%;'
    : 'background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.2);border-radius:12px 12px 12px 4px;padding:10px 14px;color:#fef9c3;font-size:13px;max-width:85%;';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  chatLang = localStorage.getItem('spmc_lang') || 'en';
  buildWidget();
});
