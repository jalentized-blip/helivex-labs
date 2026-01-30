/* =============================================
   HELIVEX LABS - Dashboard JavaScript
   Customer dashboard functionality
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initTabs();
    initOrders();
    initWishlist();
    initAddresses();
    initSettings();
    initReferrals();
});

function initDashboard() {
    // Load user data from localStorage (demo)
    const userData = JSON.parse(localStorage.getItem('helivex_user') || '{}');

    // Update user info display
    if (userData.name) {
        document.getElementById('user-name').textContent = userData.name;
    }
    if (userData.email) {
        document.getElementById('user-email').textContent = userData.email;
    }

    // Update stats
    updateStats();
}

function updateStats() {
    const orders = JSON.parse(localStorage.getItem('helivex_orders') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('helivex_wishlist') || '[]');

    document.getElementById('stat-orders').textContent = orders.length;
    document.getElementById('stat-pending').textContent = orders.filter(o => o.status === 'pending_payment').length;
    document.getElementById('stat-wishlist').textContent = wishlist.length;
    document.getElementById('stat-rewards').textContent = '$0'; // Demo value
}

function initTabs() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });

    // Check URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
        switchTab(hash);
    }
}

window.switchTab = function(tabId) {
    // Update nav
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tabId);
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });

    // Update URL
    window.location.hash = tabId;
};

function initOrders() {
    const orders = JSON.parse(localStorage.getItem('helivex_orders') || '[]');

    // Recent orders on overview
    renderRecentOrders(orders.slice(-3).reverse());

    // Full orders list
    renderOrdersList(orders.reverse());

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            const filteredOrders = filter === 'all'
                ? orders
                : orders.filter(o => o.status.includes(filter));

            renderOrdersList(filteredOrders);
        });
    });
}

function renderRecentOrders(orders) {
    const container = document.getElementById('recent-orders-table');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No orders yet</h3>
                <p>Start exploring our research peptides catalog</p>
                <a href="shop.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-row">
            <span class="order-number">${order.orderNumber}</span>
            <div class="order-items">
                <span>${order.items.map(i => i.name).join(', ')}</span>
                <span class="item-count">${order.items.length} item(s)</span>
            </div>
            <span class="order-date">${formatDate(order.date)}</span>
            <span class="order-total">$${order.total.toFixed(2)}</span>
            <span class="order-status ${getStatusClass(order.status)}">
                ${formatStatus(order.status)}
            </span>
        </div>
    `).join('');
}

function renderOrdersList(orders) {
    const container = document.getElementById('orders-list');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="orders-table">
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>No orders found</h3>
                    <p>No orders match your filter criteria</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-card-header">
                <div>
                    <span class="order-id">${order.orderNumber}</span>
                    <span class="order-status ${getStatusClass(order.status)}">
                        ${formatStatus(order.status)}
                    </span>
                </div>
                <div class="order-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(order.date)}</span>
                    <span><i class="fas fa-${order.paymentMethod === 'crypto' ? 'bitcoin' : 'credit-card'}"></i> ${order.paymentMethod === 'crypto' ? order.crypto.toUpperCase() : 'Card'}</span>
                </div>
            </div>
            <div class="order-card-body">
                <div class="order-products">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <div class="product-thumb">
                                <i class="fas fa-flask"></i>
                            </div>
                            <div class="product-details">
                                <h4>${item.name}</h4>
                                <p>${item.variant} x ${item.quantity}</p>
                            </div>
                            <div class="product-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="order-card-footer">
                <div class="order-total-amount">
                    Total: $${order.total.toFixed(2)}
                </div>
                <div class="order-actions">
                    <button class="btn btn-sm btn-secondary" onclick="viewOrderDetails('${order.orderNumber}')">
                        View Details
                    </button>
                    ${order.status === 'delivered' ? `
                        <button class="btn btn-sm btn-primary" onclick="reorder('${order.orderNumber}')">
                            Reorder
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function initWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('helivex_wishlist') || '[]');
    const container = document.getElementById('wishlist-grid');

    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Save products you're interested in for later</p>
                <a href="shop.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    container.innerHTML = wishlist.map(productId => {
        const product = getProductById(productId);
        if (!product) return '';

        return `
            <div class="wishlist-item">
                <div class="wishlist-item-image">
                    <i class="fas fa-flask"></i>
                </div>
                <div class="wishlist-item-info">
                    <h4>${product.name}</h4>
                    <div class="price">From $${product.variants[0].price.toFixed(2)}</div>
                    <button class="btn btn-primary btn-sm" onclick="addWishlistToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="removeFromWishlist(${product.id})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.addWishlistToCart = function(productId) {
    const product = getProductById(productId);
    if (product) {
        cart.addItem(product, 0, 1);
    }
};

window.removeFromWishlist = function(productId) {
    let wishlist = JSON.parse(localStorage.getItem('helivex_wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('helivex_wishlist', JSON.stringify(wishlist));
    initWishlist();
    updateStats();
};

function initAddresses() {
    const addresses = JSON.parse(localStorage.getItem('helivex_addresses') || '[]');
    const container = document.getElementById('addresses-grid');

    if (!container) return;

    let html = `
        <div class="add-address-card" onclick="showAddAddressModal()">
            <i class="fas fa-plus"></i>
            <span>Add New Address</span>
        </div>
    `;

    html += addresses.map((addr, index) => `
        <div class="address-card ${addr.default ? 'default' : ''}">
            ${addr.default ? '<span class="address-badge">Default</span>' : ''}
            <h4>${addr.name}</h4>
            <p>
                ${addr.address}<br>
                ${addr.city}, ${addr.state} ${addr.zip}<br>
                ${addr.country}
            </p>
            <div class="address-actions">
                <button onclick="editAddress(${index})">Edit</button>
                <button onclick="deleteAddress(${index})">Delete</button>
                ${!addr.default ? `<button onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

window.showAddAddressModal = function() {
    // For demo, add a sample address
    const addresses = JSON.parse(localStorage.getItem('helivex_addresses') || '[]');
    addresses.push({
        name: 'New Address',
        address: '123 Research Ave',
        city: 'Science City',
        state: 'CA',
        zip: '90210',
        country: 'United States',
        default: addresses.length === 0
    });
    localStorage.setItem('helivex_addresses', JSON.stringify(addresses));
    initAddresses();
};

window.deleteAddress = function(index) {
    const addresses = JSON.parse(localStorage.getItem('helivex_addresses') || '[]');
    addresses.splice(index, 1);
    localStorage.setItem('helivex_addresses', JSON.stringify(addresses));
    initAddresses();
};

window.setDefaultAddress = function(index) {
    const addresses = JSON.parse(localStorage.getItem('helivex_addresses') || '[]');
    addresses.forEach((addr, i) => addr.default = i === index);
    localStorage.setItem('helivex_addresses', JSON.stringify(addresses));
    initAddresses();
};

function initSettings() {
    const personalForm = document.getElementById('personal-info-form');
    const passwordForm = document.getElementById('password-form');

    if (personalForm) {
        personalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                name: `${document.getElementById('settings-first-name').value} ${document.getElementById('settings-last-name').value}`.trim(),
                email: document.getElementById('settings-email').value,
                phone: document.getElementById('settings-phone').value,
                company: document.getElementById('settings-company').value
            };
            localStorage.setItem('helivex_user', JSON.stringify(userData));
            showNotification('Settings saved successfully!', 'success');
            initDashboard();
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            // Demo - just show success
            showNotification('Password updated successfully!', 'success');
            passwordForm.reset();
        });
    }
}

function initReferrals() {
    // Generate referral code if not exists
    let referralCode = localStorage.getItem('helivex_referral_code');
    if (!referralCode) {
        referralCode = 'HELIVEX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        localStorage.setItem('helivex_referral_code', referralCode);
    }

    document.getElementById('referral-code').textContent = referralCode;
}

window.copyReferralCode = function() {
    const code = document.getElementById('referral-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Referral code copied!', 'success');
    });
};

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatStatus(status) {
    const statusMap = {
        'pending_payment': 'Pending Payment',
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'pending_payment': 'pending',
        'processing': 'processing',
        'shipped': 'shipped',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
    };
    return classMap[status] || 'pending';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = type === 'success' ? 'check-circle' :
                 type === 'error' ? 'exclamation-circle' : 'info-circle';

    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'error' ? 'var(--error)' : type === 'success' ? 'var(--success)' : 'var(--gray-900)'};
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

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('helivex_user');
    window.location.href = 'index.html';
});
