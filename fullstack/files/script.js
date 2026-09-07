// Nocturne & Co. — shared interactions (in-memory cart, resets on page load by design)

const cart = [];

function iconFor(type){
  const icons = {
    candle: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M24 6c3 4 4.5 6.6 4.5 9 0 2.4-2 4-4.5 4s-4.5-1.6-4.5-4c0-2.4 1.5-5 4.5-9z"/><rect x="14" y="20" width="20" height="20" rx="1"/><line x1="14" y1="26" x2="34" y2="26"/></svg>`,
    diffuser: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M17 20h14l-2 20H19l-2-20z"/><path d="M19 20V13a5 5 0 0 1 10 0v7"/><line x1="22" y1="6" x2="20" y2="14"/><line x1="26" y1="6" x2="28" y2="14"/></svg>`,
    mist: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="17" y="16" width="12" height="24" rx="1"/><rect x="19" y="10" width="8" height="6"/><path d="M27 9h6M29 6h6M31 12h4"/></svg>`,
    incense: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M16 40h16"/><path d="M20 40V18M24 40V14M28 40V18"/><path d="M24 10c1.5 2 1.5 3-.4 3M20 14c1.5 2 1.5 3-.4 3M28 14c1.5 2 1.5 3-.4 3"/></svg>`,
    tool: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 12l24 24M28 8l4 4-16 16-4-4z"/><path d="M14 34l-4 4 4 4 4-4"/></svg>`,
    snuffer: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M14 22a10 6 0 0 1 20 0z"/><line x1="24" y1="22" x2="24" y2="10"/><line x1="14" y1="22" x2="34" y2="22"/></svg>`,
    box: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 16l16-7 16 7-16 7z"/><path d="M8 16v16l16 7 16-7V16"/><path d="M24 23v17"/></svg>`
  };
  return icons[type] || icons.candle;
}

function money(n){ return '$' + n.toFixed(2); }

function addToCart(id, name, price, type){
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, name, price, type, qty: 1 });
  renderCart();
  showToast(name + ' added to your basket');
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else renderCart();
}

function removeFromCart(id){
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) cart.splice(idx, 1);
  renderCart();
}

function renderCart(){
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal-amount');
  if (!itemsEl) return;

  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;

  if (cart.length === 0){
    itemsEl.innerHTML = '<div class="cart-empty">Your basket is empty.<br>Light something new.</div>';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="icon">${iconFor(item.type)}</div>
        <div class="cart-item-info">
          <div class="name">${item.name}</div>
          <div class="meta">${money(item.price)} each</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">&minus;</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  if (subtotalEl) subtotalEl.textContent = money(subtotal);
}

function openCart(){
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
}
function closeCart(){
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
}

let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function toggleMobileNav(){
  document.querySelector('nav.links')?.classList.toggle('mobile-open');
}

document.addEventListener('DOMContentLoaded', renderCart);
