/* =============================================
   HELIVEX LABS - Shopping Cart System
   Full cart functionality with localStorage
   ============================================= */

class ShoppingCart {
    constructor() {
        this.items = [];
        this.listeners = [];
        this.init();
    }

    init() {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('helivex_cart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
            } catch (e) {
                this.items = [];
            }
        }
        this.notifyListeners();
    }

    // Add item to cart
    addItem(product, variantIndex = 0, quantity = 1) {
        const variant = product.variants[variantIndex];
        const itemId = `${product.id}-${variant.size}`;

        const existingItem = this.items.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: itemId,
                productId: product.id,
                name: product.name,
                slug: product.slug,
                variant: variant.size,
                price: variant.price,
                originalPrice: variant.originalPrice,
                purity: product.purity,
                quantity: quantity,
                image: product.image
            });
        }

        this.save();
        this.notifyListeners();
        this.showNotification(`${product.name} (${variant.size}) added to cart`);
        return true;
    }

    // Remove item from cart
    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index > -1) {
            const item = this.items[index];
            this.items.splice(index, 1);
            this.save();
            this.notifyListeners();
            this.showNotification(`${item.name} removed from cart`);
        }
    }

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.save();
                this.notifyListeners();
            }
        }
    }

    // Increase quantity
    increaseQuantity(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity++;
            this.save();
            this.notifyListeners();
        }
    }

    // Decrease quantity
    decreaseQuantity(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
                this.save();
                this.notifyListeners();
            } else {
                this.removeItem(itemId);
            }
        }
    }

    // Clear cart
    clear() {
        this.items = [];
        this.save();
        this.notifyListeners();
        this.showNotification('Cart cleared');
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get original total (before discounts)
    getOriginalTotal() {
        return this.items.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
    }

    // Get total savings
    getSavings() {
        return this.getOriginalTotal() - this.getTotal();
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Save to localStorage
    save() {
        localStorage.setItem('helivex_cart', JSON.stringify(this.items));
    }

    // Add change listener
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(callback => callback(this));
    }

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        // Add styles
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

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Get cart items
    getItems() {
        return this.items;
    }

    // Apply coupon code
    applyCoupon(code) {
        const coupons = {
            'HELIVEX10': { type: 'percent', value: 10 },
            'RESEARCH15': { type: 'percent', value: 15 },
            'CRYPTO20': { type: 'percent', value: 20 },
            'FIRST25': { type: 'percent', value: 25 }
        };

        const coupon = coupons[code.toUpperCase()];
        if (coupon) {
            this.appliedCoupon = {
                code: code.toUpperCase(),
                ...coupon
            };
            this.save();
            this.notifyListeners();
            return { success: true, coupon: this.appliedCoupon };
        }
        return { success: false, message: 'Invalid coupon code' };
    }

    // Remove coupon
    removeCoupon() {
        this.appliedCoupon = null;
        this.save();
        this.notifyListeners();
    }

    // Get final total (after coupon)
    getFinalTotal() {
        let total = this.getTotal();
        if (this.appliedCoupon) {
            if (this.appliedCoupon.type === 'percent') {
                total = total * (1 - this.appliedCoupon.value / 100);
            } else if (this.appliedCoupon.type === 'fixed') {
                total = Math.max(0, total - this.appliedCoupon.value);
            }
        }
        return total;
    }
}

// Initialize global cart
const cart = new ShoppingCart();

// Render cart sidebar
function renderCartSidebar() {
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCount = document.getElementById('cart-count');

    if (!cartItems) return;

    if (cart.isEmpty()) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.getItems().map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <i class="fas fa-flask"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-variant">${item.variant} | ${item.purity} Purity</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="cart.decreaseQuantity('${item.id}')">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.increaseQuantity('${item.id}')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="cart.removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = `$${cart.getTotal().toFixed(2)}`;
    }

    if (cartCount) {
        const count = cart.getItemCount();
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Add cart listener
cart.addListener(renderCartSidebar);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, cart, renderCartSidebar };
}
