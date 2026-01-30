/* =============================================
   HELIVEX LABS - Main JavaScript
   Core functionality and interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initAgeVerification();
    initHeader();
    initMobileMenu();
    initSearch();
    initCartSidebar();
    initProductsGrid();
    initProductFilters();
    initAnimations();
    initCounters();
    initTestimonialSlider();
    initNewsletter();
    initBackToTop();
    initParticles();
});

/* Age Verification */
function initAgeVerification() {
    const modal = document.getElementById('age-modal');
    if (!modal) return;

    const verified = localStorage.getItem('helivex_age_verified');
    if (verified === 'true') {
        modal.classList.add('hidden');
    }
}

window.verifyAge = function(isAdult) {
    const modal = document.getElementById('age-modal');
    if (isAdult) {
        localStorage.setItem('helivex_age_verified', 'true');
        modal.classList.add('hidden');
    } else {
        window.location.href = 'https://www.google.com';
    }
};

/* Header Scroll Effect */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* Mobile Menu */
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav-main');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Handle dropdown on mobile
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

/* Search Functionality */
function initSearch() {
    const toggle = document.getElementById('search-toggle');
    const searchBar = document.getElementById('search-bar');
    const closeBtn = document.getElementById('search-close');
    const input = document.getElementById('search-input');

    if (!toggle || !searchBar) return;

    toggle.addEventListener('click', () => {
        searchBar.classList.add('active');
        input.focus();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            searchBar.classList.remove('active');
        });
    }

    // Search functionality
    if (input) {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchBar.classList.contains('active')) {
            searchBar.classList.remove('active');
        }
    });
}

/* Cart Sidebar */
function initCartSidebar() {
    const toggle = document.getElementById('cart-toggle');
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('cart-close');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Initial render
    renderCartSidebar();
}

/* Products Grid */
function initProductsGrid() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    // Check for featured products on homepage
    const isFeatured = grid.closest('.featured-products');
    let productsToShow = isFeatured ? getFeaturedProducts() : products;

    // Check for URL params
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');

    if (category && category !== 'all') {
        productsToShow = getProductsByCategory(category);
    }

    if (search) {
        productsToShow = searchProducts(search);
    }

    renderProducts(productsToShow, grid);
}

function renderProducts(productList, container) {
    if (!container) return;

    container.innerHTML = productList.map((product, index) => {
        const variant = product.variants[0];
        const discount = Math.round((1 - variant.price / variant.originalPrice) * 100);

        return `
            <div class="product-card stagger-item" data-category="${product.category}" style="animation-delay: ${index * 0.1}s">
                <div class="product-image">
                    <i class="fas fa-flask peptide-icon"></i>
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-actions">
                        <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">
                        <a href="product.html?id=${product.slug}">${product.name}</a>
                    </h3>
                    <span class="product-purity">
                        <i class="fas fa-check-circle"></i>
                        ${product.purity} Purity
                    </span>
                    <div class="product-price">
                        <span class="price-current">$${variant.price.toFixed(2)}</span>
                        <span class="price-original">$${variant.originalPrice.toFixed(2)}</span>
                    </div>
                    <div class="product-variants">
                        ${product.variants.map((v, i) => `
                            <button class="variant-btn ${i === 0 ? 'active' : ''}"
                                    data-product="${product.id}"
                                    data-variant="${i}"
                                    onclick="selectVariant(this, ${product.id}, ${i})">
                                ${v.size}
                            </button>
                        `).join('')}
                    </div>
                    <button class="btn btn-primary add-to-cart" onclick="addProductToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Trigger animation
    setTimeout(() => {
        container.querySelectorAll('.stagger-item').forEach(item => {
            item.classList.add('visible');
        });
    }, 100);
}

// Select variant
window.selectVariant = function(btn, productId, variantIndex) {
    const card = btn.closest('.product-card');
    const product = getProductById(productId);
    const variant = product.variants[variantIndex];

    // Update active state
    card.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update price
    card.querySelector('.price-current').textContent = `$${variant.price.toFixed(2)}`;
    card.querySelector('.price-original').textContent = `$${variant.originalPrice.toFixed(2)}`;

    // Store selected variant
    card.dataset.selectedVariant = variantIndex;
};

// Add product to cart
window.addProductToCart = function(productId) {
    const product = getProductById(productId);
    const card = document.querySelector(`.product-card[data-category] button[data-product="${productId}"]`)?.closest('.product-card');
    const variantIndex = card ? parseInt(card.dataset.selectedVariant || 0) : 0;

    cart.addItem(product, variantIndex, 1);

    // Open cart sidebar
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
};

// Quick view
window.quickView = function(productId) {
    const product = getProductById(productId);
    // Redirect to product page for now
    window.location.href = `product.html?id=${product.slug}`;
};

// Add to wishlist
window.addToWishlist = function(productId) {
    let wishlist = JSON.parse(localStorage.getItem('helivex_wishlist') || '[]');
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('helivex_wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist');
    } else {
        showNotification('Already in wishlist');
    }
};

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
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

/* Product Filters */
function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const grid = document.getElementById('products-grid');

    if (!filterBtns.length || !grid) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter products
            const filter = btn.dataset.filter;
            const filteredProducts = filter === 'all' ? products : getProductsByCategory(filter);
            renderProducts(filteredProducts, grid);
        });
    });
}

/* Scroll Animations */
function initAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/* Counter Animation */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    };

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/* Testimonial Slider */
function initTestimonialSlider() {
    const slider = document.getElementById('testimonials-slider');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!slider) return;

    // For now, testimonials are displayed in a grid
    // This could be enhanced with actual slider functionality
}

/* Newsletter Form */
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        // Simulate subscription
        const btn = form.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            form.querySelector('input').value = '';

            setTimeout(() => {
                btn.innerHTML = 'Subscribe <i class="fas fa-paper-plane"></i>';
                btn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

/* Back to Top */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* Particle Animation */
function initParticles() {
    const field = document.getElementById('particle-field');
    if (!field) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        field.appendChild(particle);
    }
}

/* Utility Functions */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        debounce
    };
}
