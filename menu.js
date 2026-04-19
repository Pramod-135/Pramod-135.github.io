let cart = [];

/* ── Cart persistence ── */
function loadCart() {
    const savedCart = localStorage.getItem('maestroCart');
    if (savedCart) cart = JSON.parse(savedCart);
}

function saveCart() {
    localStorage.setItem('maestroCart', JSON.stringify(cart));
}

/* ── Cart operations ── */
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseInt(price), image, quantity: 1 });
    }
    saveCart();
    showToast(`${name} added to cart!`);
}

function removeFromCart(index) {
    if (confirm("Remove this item from cart?")) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }
}

/* ── Toast ── */
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #5c4033;
        color: white;
        padding: 14px 28px;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        z-index: 2000;
        font-family: 'Poppins', sans-serif;
        font-size: 1.05rem;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.opacity = '1', 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

/* ── Search / Filter ── */
function initSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');
    const noResults = document.getElementById('no-results');
    const querySpan = document.getElementById('search-query');

    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();

        // Toggle clear button
        if (query.length > 0) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }

        filterMenu(query, noResults, querySpan);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('visible');
        filterMenu('', noResults, querySpan);
        input.focus();
    });
}

function filterMenu(query, noResults, querySpan) {
    const sections = document.querySelectorAll('.menu-section');
    let totalVisible = 0;

    sections.forEach(section => {
        const items = section.querySelectorAll('.menu-item');
        let sectionVisible = 0;

        items.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const desc = item.querySelector('.description').textContent.toLowerCase();

            if (!query || name.includes(query) || desc.includes(query)) {
                item.classList.remove('hidden');
                sectionVisible++;
                totalVisible++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Hide entire section (including heading) if no items match
        section.style.display = sectionVisible === 0 ? 'none' : '';
    });

    // Show "no results" banner
    if (noResults) {
        if (totalVisible === 0 && query.length > 0) {
            querySpan.textContent = query;
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
}

/* ── Cart page renderer ── */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const summary = document.getElementById('cart-summary');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const cartCountEl = document.getElementById('cart-count');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        if (summary) summary.style.display = 'none';
        if (cartCountEl) cartCountEl.textContent = '0 items';
        return;
    }

    emptyCart.style.display = 'none';
    if (summary) summary.style.display = 'block';

    let subtotal = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price} × ${item.quantity}</p>
            </div>
            <div class="cart-item-total">₹${itemTotal}</div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <span class="material-symbols-outlined">delete</span>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (totalEl) totalEl.textContent = `₹${subtotal + 30}`;
    if (cartCountEl) cartCountEl.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;
}

/* ── Checkout ── */
function proceedToCheckout() {
    if (cart.length === 0) return;
    alert(`🎉 Thank you for ordering at Maestro!\n\n` +
          `Your order has been placed successfully.\n` +
          `Total: ₹${cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 30}\n\n` +
          `This is a static demo project.`);
    cart = [];
    saveCart();
    renderCart();
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initSearch();

    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const image = button.getAttribute('data-image');
            if (name && price && image) addToCart(name, price, image);
        });
    });

    if (document.getElementById('cart-items')) renderCart();
});

    /* ── Category Carousel ── */
    const track    = document.getElementById('carouselTrack');
    const slides   = track.querySelectorAll('.carousel-slide');
    const dotsEl   = document.getElementById('carouselDots');
    const prevBtn  = document.getElementById('carouselPrev');
    const nextBtn  = document.getElementById('carouselNext');

    const visibleCount = () => window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
    let current = 0;
    const total = slides.length;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    });

    function goTo(index) {
      current = (index + total) % total;
      const slideWidth = slides[0].offsetWidth + 20; // gap
      track.style.transform = `translateX(-${current * slideWidth}px)`;
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) =>
        d.classList.toggle('active', i === current));
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-play every 3s
    setInterval(() => goTo(current + 1), 3000);

    // Scroll to section smoothly
    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Recalculate on resize
    window.addEventListener('resize', () => goTo(current));