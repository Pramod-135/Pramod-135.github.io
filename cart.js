// cart.js - Maestro Cafe

let cart = [];

/* ── Persistence ── */
function loadCart() {
    const savedCart = localStorage.getItem('maestroCart');
    if (savedCart) cart = JSON.parse(savedCart);
}

function saveCart() {
    localStorage.setItem('maestroCart', JSON.stringify(cart));
}

/* ── Add to cart ── */
function addToCart(name, price, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price: Number(price), image, quantity: 1 });
    }
    saveCart();
    showToast(name + ' added to cart!');
}

/* ── Toast notification (bottom pill, no alert) ── */
function showToast(message) {
    // Use the persistent toast-bar if on cart page, else create a floating one
    const bar = document.getElementById('toastBar');
    if (bar) {
        bar.textContent = message;
        bar.className = 'toast-bar show success';
        setTimeout(() => bar.classList.remove('show'), 2800);
    } else {
        // Fallback for menu/other pages
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%;
            transform: translateX(-50%);
            background: #5c4033; color: white;
            padding: 13px 26px; border-radius: 30px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
            z-index: 2000; font-family: Poppins, sans-serif;
            font-size: 0.95rem; font-weight: 500;
            white-space: nowrap; opacity: 0;
            transition: opacity 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }
}

/* ── Quantity controls ── */
function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    renderCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        renderCart();
    } else {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    const name = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    showToast(name + ' removed from cart.');
}

/* ── Render cart page ── */
function renderCart() {
    const cartItems  = document.getElementById('cart-items');
    const emptyCart  = document.getElementById('empty-cart');
    const summary    = document.getElementById('cart-summary');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl    = document.getElementById('total');
    const countEl    = document.getElementById('cart-count');

    if (!cartItems) return;

    if (cart.length === 0) {
        emptyCart.style.display  = 'block';
        cartItems.style.display  = 'none';
        if (summary) summary.style.display = 'none';
        if (countEl) countEl.textContent = '0 items';
        return;
    }

    emptyCart.style.display = 'none';
    cartItems.style.display = 'flex';
    if (summary) summary.style.display = 'block';

    let subtotal = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>₹${item.price} each</p>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
            </div>
            <div class="cart-item-total">₹${itemTotal}</div>
            <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove">
                <span class="material-symbols-outlined">delete</span>
            </button>
        `;
        cartItems.appendChild(div);
    });

    if (subtotalEl) subtotalEl.textContent = '₹' + subtotal;
    if (totalEl)    totalEl.textContent    = '₹' + (subtotal + 30);
    if (countEl)    countEl.textContent    = cart.length + ' item' + (cart.length !== 1 ? 's' : '');
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function () {
    loadCart();

    // Attach Add to Cart buttons (menu page)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            const name  = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const image = this.getAttribute('data-image');
            if (name && price && image) addToCart(name, price, image);
        });
    });

    // Render cart if on cart page
    if (document.getElementById('cart-items')) renderCart();
});