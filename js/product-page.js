/* =============================================
   HELIVEX LABS - Product Page JavaScript
   ============================================= */

let currentProduct = null;
let selectedVariantIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
    initTabs();
    initQuantity();
    initWishlist();
});

function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productSlug = urlParams.get('id');

    if (!productSlug) {
        window.location.href = 'shop.html';
        return;
    }

    currentProduct = getProductBySlug(productSlug);

    if (!currentProduct) {
        window.location.href = 'shop.html';
        return;
    }

    renderProduct();
    loadRelatedProducts();
}

function renderProduct() {
    // Update page title
    document.title = `${currentProduct.name} | Helivex Labs`;

    // Breadcrumb
    document.getElementById('product-breadcrumb').textContent = currentProduct.name;

    // Badge
    const badgeEl = document.getElementById('product-badge');
    if (currentProduct.badge) {
        badgeEl.textContent = currentProduct.badge;
    }

    // Basic info
    document.getElementById('product-name').textContent = currentProduct.name;
    document.getElementById('product-category').textContent = formatCategory(currentProduct.category);
    document.getElementById('product-short-desc').textContent = currentProduct.shortDesc;
    document.getElementById('product-purity').innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${currentProduct.purity} Verified Purity</span>
    `;

    // Image handling - We keep the default icon for the product page 
    // as per user request to only show photo on shop.html
    const imageContainer = document.getElementById('product-image-container');
    if (imageContainer && currentProduct.image) {
        // If we ever want to support specific product images here
    }

    // Description
    document.getElementById('product-description').textContent = currentProduct.description;

    // Meta
    document.getElementById('product-cas').textContent = currentProduct.cas;
    document.getElementById('product-mw').textContent = currentProduct.molecularWeight;
    document.getElementById('product-appearance').textContent = currentProduct.appearance;
    document.getElementById('product-storage').textContent = currentProduct.storage;

    // Specifications
    document.getElementById('spec-cas').textContent = currentProduct.cas;
    document.getElementById('spec-sequence').textContent = currentProduct.sequence;
    document.getElementById('spec-mw').textContent = currentProduct.molecularWeight;
    document.getElementById('spec-purity').textContent = currentProduct.purity;
    document.getElementById('spec-appearance').textContent = currentProduct.appearance;
    document.getElementById('spec-solubility').textContent = currentProduct.solubility;

    // Storage info
    document.getElementById('storage-info').textContent = currentProduct.storage;

    // Render size options
    renderSizeOptions();

    // Update pricing for default variant
    updatePricing();

    // Add to cart button
    document.getElementById('add-to-cart-btn').addEventListener('click', addToCart);

    // Check wishlist status
    updateWishlistButton();
}

function renderSizeOptions() {
    const container = document.getElementById('size-options');

    container.innerHTML = currentProduct.variants.map((variant, index) => `
        <button class="size-btn ${index === 0 ? 'active' : ''}" data-variant="${index}" onclick="selectSize(${index})">
            <span class="size">${variant.size}</span>
            <span class="size-price">$${variant.price.toFixed(2)}</span>
        </button>
    `).join('');
}

window.selectSize = function(index) {
    selectedVariantIndex = index;

    // Update active state
    document.querySelectorAll('.size-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });

    // Update pricing
    updatePricing();
};

function updatePricing() {
    const variant = currentProduct.variants[selectedVariantIndex];
    const discount = Math.round((1 - variant.price / variant.originalPrice) * 100);

    document.getElementById('price-current').textContent = `$${variant.price.toFixed(2)}`;
    document.getElementById('price-original').textContent = `$${variant.originalPrice.toFixed(2)}`;
    document.getElementById('price-discount').textContent = `Save ${discount}%`;
}

function initQuantity() {
    const input = document.getElementById('quantity-input');

    input.addEventListener('change', () => {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        input.value = value;
    });
}

window.changeQuantity = function(delta) {
    const input = document.getElementById('quantity-input');
    let value = parseInt(input.value) + delta;
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    input.value = value;
};

function addToCart() {
    const quantity = parseInt(document.getElementById('quantity-input').value);
    cart.addItem(currentProduct, selectedVariantIndex, quantity);

    // Open cart sidebar
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update content
            document.querySelectorAll('.product-tabs .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`tab-${tab}`).classList.add('active');
        });
    });
}

function initWishlist() {
    document.getElementById('wishlist-btn').addEventListener('click', toggleWishlist);
}

function toggleWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('helivex_wishlist') || '[]');

    if (wishlist.includes(currentProduct.id)) {
        wishlist = wishlist.filter(id => id !== currentProduct.id);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(currentProduct.id);
        showNotification('Added to wishlist');
    }

    localStorage.setItem('helivex_wishlist', JSON.stringify(wishlist));
    updateWishlistButton();
}

function updateWishlistButton() {
    const wishlist = JSON.parse(localStorage.getItem('helivex_wishlist') || '[]');
    const btn = document.getElementById('wishlist-btn');
    const isInWishlist = wishlist.includes(currentProduct.id);

    btn.classList.toggle('active', isInWishlist);
    btn.innerHTML = `<i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>`;
}

function loadRelatedProducts() {
    const container = document.getElementById('related-products');
    const related = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (related.length === 0) {
        // Get any 4 products if no related in category
        const others = products.filter(p => p.id !== currentProduct.id).slice(0, 4);
        renderProducts(others, container);
    } else {
        renderProducts(related, container);
    }
}

function formatCategory(category) {
    const categories = {
        'metabolic': 'Metabolic Research',
        'healing': 'Tissue Repair',
        'cognitive': 'Cognitive Research',
        'longevity': 'Longevity Studies'
    };
    return categories[category] || category;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--gray-900);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(-50%) translateY(0)', 10);
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
