/* panier.js — panier côté client, persistant via localStorage */
(() => {
  const KEY = 'cart_v1';
  const EUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  const VAT_RATE = 0.20;

  // Elements UI
  const $toggle = document.getElementById('cart-toggle');
  const $overlay = document.getElementById('cart-overlay');
  const $drawer = document.getElementById('cart-drawer');
  const $close = document.getElementById('cart-close');
  const $count = document.getElementById('cart-count');
  const $items = document.getElementById('cart-items');
  const $subtotal = document.getElementById('cart-subtotal');
  const $vat = document.getElementById('cart-vat');
  const $total = document.getElementById('cart-total');
  const $checkout = document.getElementById('checkout');

  // State
  let cart = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { items: [] }; }
    catch { return { items: [] }; }
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(cart)); }

  function findIndex(id) { return cart.items.findIndex(i => i.id === id); }

  function addItem({ id, name, price, image }) {
    const idx = findIndex(id);
    if (idx > -1) {
      cart.items[idx].qty += 1;
    } else {
      cart.items.push({ id, name, price: Number(price), image, qty: 1 });
    }
    save(); render();
  }

  function removeItem(id) {
    cart.items = cart.items.filter(i => i.id !== id);
    save(); render();
  }

  function setQty(id, qty) {
    qty = Math.max(1, Number(qty) || 1);
    const idx = findIndex(id);
    if (idx > -1) cart.items[idx].qty = qty;
    save(); render();
  }

  function inc(id) { const idx = findIndex(id); if (idx > -1) { cart.items[idx].qty++; save(); render(); } }
  function dec(id) { const idx = findIndex(id); if (idx > -1) { cart.items[idx].qty = Math.max(1, cart.items[idx].qty - 1); save(); render(); } }

  function totals() {
    const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;
    return { subtotal, vat, total };
  }

  function render() {
    // Compteur
    const count = cart.items.reduce((s, i) => s + i.qty, 0);
    $count.textContent = count;

    // Liste
    if (cart.items.length === 0) {
      $items.innerHTML = `<li class="cart-item" style="border:0">
        <div style="grid-column: 1 / -1; text-align:center; color:#666">Votre panier est vide.</div>
      </li>`;
    } else {
      $items.innerHTML = cart.items.map(i => `
        <li class="cart-item" data-id="${i.id}">
          <img src="${i.image}" alt="${i.name}">
          <div>
            <div class="title">${i.name}</div>
            <div class="price">${EUR.format(i.price)}</div>
            <div class="qty">
              <button class="qty-dec" aria-label="Diminuer la quantité">–</button>
              <input class="qty-input" type="number" min="1" value="${i.qty}" inputmode="numeric">
              <button class="qty-inc" aria-label="Augmenter la quantité">+</button>
            </div>
            <button class="remove" aria-label="Retirer l'article">Retirer</button>
          </div>
          <div style="align-self:center; font-weight:600">${EUR.format(i.price * i.qty)}</div>
        </li>
      `).join('');
    }

    // Totaux
    const t = totals();
    $subtotal.textContent = EUR.format(t.subtotal);
    $vat.textContent = EUR.format(t.vat);
    $total.textContent = EUR.format(t.total);
  }

  function openCart() {
    $overlay.hidden = false;
    $drawer.classList.add('open');
    $drawer.setAttribute('aria-hidden', 'false');
    // Focus management
    setTimeout(() => $drawer.focus(), 10);
  }
  function closeCart() {
    $drawer.classList.remove('open');
    $drawer.setAttribute('aria-hidden', 'true');
    $overlay.hidden = true;
  }

  // Écouteurs
  document.addEventListener('click', (e) => {
    const btn = e.target;

    // Ouverture / fermeture
    if (btn === $toggle) { openCart(); }
    if (btn === $close || btn === $overlay) { closeCart(); }

    // Ajouter au panier
    if (btn.classList.contains('add-to-cart')) {
      const { id, name, price, image } = btn.dataset;
      addItem({ id, name, price, image });
      // Ouvrir le panier pour feedback
      openCart();
    }

    // Délégation dans la liste du panier
    const itemEl = btn.closest('.cart-item');
    if (itemEl) {
      const id = itemEl.getAttribute('data-id');
      if (btn.classList.contains('qty-inc')) inc(id);
      if (btn.classList.contains('qty-dec')) dec(id);
      if (btn.classList.contains('remove')) removeItem(id);
    }
  });

  // Changement direct de quantité (input number)
  $items.addEventListener('input', (e) => {
    const input = e.target;
    if (!input.classList.contains('qty-input')) return;
    const itemEl = input.closest('.cart-item');
    if (!itemEl) return;
    const id = itemEl.getAttribute('data-id');
    setQty(id, input.value);
  });

  // Échap ferme le tiroir
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  // Checkout (démo)
  $checkout.addEventListener('click', () => {
    if (cart.items.length === 0) {
      alert('Votre panier est vide.');
      return;
    }
    // Ici, vous brancherez votre logique de commande (envoi au serveur / Stripe)
    const order = {
      items: cart.items,
      totals: totals(),
      createdAt: new Date().toISOString()
    };
    console.log('Commande prête à être envoyée :', order);
    alert('Merci ! La commande est prête (voir console). À connecter à votre solution de paiement.');
  });

  // Initialisation
  render();
})();
