/* =============================================
   HELIVEX LABS - Checkout JavaScript
   Multi-step checkout with crypto payment
   ============================================= */

let currentStep = 1;
let shippingCost = 9.99;
let cryptoDiscount = 0;
let couponDiscount = 0;
let selectedCrypto = 'btc';

// Crypto addresses (demo - in production, generate unique addresses per order)
const cryptoAddresses = {
    btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    eth: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    usdt: 'TN4xJWfQRfFJvRMKkLqgrp1XhZPzBNaGpN',
    ltc: 'ltc1qnkr3hswlsj8y7u6m7k5hd4h7xlvs4m6q9gy8pc'
};

// Crypto conversion rates (demo - in production, fetch real-time rates)
const cryptoRates = {
    btc: 0.000024,
    eth: 0.00042,
    usdt: 1,
    ltc: 0.012
};

document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
    renderOrderSummary();
    initPaymentMethods();
    initCryptoSelection();
    initForms();
});

function initCheckout() {
    // Check if cart is empty
    if (cart.isEmpty()) {
        window.location.href = 'shop.html';
        return;
    }

    updateTotals();
}

function renderOrderSummary() {
    const container = document.getElementById('summary-items');
    if (!container) return;

    const items = cart.getItems();

    container.innerHTML = items.map(item => `
        <div class="summary-item">
            <div class="item-image">
                <i class="fas fa-flask"></i>
                <span class="item-quantity">${item.quantity}</span>
            </div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-variant">${item.variant}</div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
}

function updateTotals() {
    const subtotal = cart.getTotal();
    const paymentMethod = 'crypto'; // Always crypto now

    // Calculate crypto discount
    cryptoDiscount = subtotal * 0.10;

    const total = subtotal - cryptoDiscount - couponDiscount + shippingCost;

    // Update display
    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-shipping').textContent = `$${shippingCost.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;

    // Crypto discount row
    const cryptoRow = document.getElementById('crypto-discount-row');
    if (cryptoRow) {
        if (cryptoDiscount > 0) {
            cryptoRow.style.display = 'flex';
            document.getElementById('crypto-discount').textContent = `-$${cryptoDiscount.toFixed(2)}`;
        } else {
            cryptoRow.style.display = 'none';
        }
    }

    // Update crypto amount
    updateCryptoAmount(total);
}

function updateCryptoAmount(usdAmount) {
    const rate = cryptoRates[selectedCrypto];
    const cryptoAmount = (usdAmount * rate).toFixed(selectedCrypto === 'usdt' ? 2 : 6);
    const symbol = selectedCrypto.toUpperCase();

    const amountEl = document.getElementById('crypto-amount');
    if (amountEl) {
        amountEl.textContent = `${cryptoAmount} ${symbol}`;
    }
}

function initPaymentMethods() {
    // Payment method logic simplified as only crypto is available
    const cryptoDetails = document.getElementById('crypto-details');
    if (cryptoDetails) {
        cryptoDetails.classList.add('active');
    }
    updateTotals();
}

function initCryptoSelection() {
    const cryptoBtns = document.querySelectorAll('.crypto-btn');

    cryptoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cryptoBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            selectedCrypto = btn.dataset.crypto;
            document.getElementById('crypto-address').value = cryptoAddresses[selectedCrypto];

            updateTotals();
        });
    });
}

function initForms() {
    // Info form
    const infoForm = document.getElementById('info-form');
    if (infoForm) {
        infoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(infoForm)) {
                goToStep(2);
            }
        });
    }

    // Shipping form
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(shippingForm)) {
                goToStep(3);
            }
        });

        // Shipping method selection
        const shippingOptions = shippingForm.querySelectorAll('input[name="shipping"]');
        shippingOptions.forEach(option => {
            option.addEventListener('change', () => {
                document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('active'));
                option.closest('.shipping-option').classList.add('active');

                switch (option.value) {
                    case 'standard':
                        shippingCost = 9.99;
                        break;
                    case 'express':
                        shippingCost = 19.99;
                        break;
                    case 'overnight':
                        shippingCost = 39.99;
                        break;
                }
                updateTotals();
            });
        });
    }

    // Payment form
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(paymentForm)) {
                processOrder();
            }
        });
    }
}

function validateForm(form) {
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error)';
            valid = false;
        } else {
            field.style.borderColor = '';
        }
    });

    if (!valid) {
        showNotification('Please fill in all required fields', 'error');
    }

    return valid;
}

window.goToStep = function(step) {
    currentStep = step;

    // Update step indicators
    document.querySelectorAll('.checkout-steps .step').forEach((s, i) => {
        s.classList.remove('active', 'completed');
        if (i + 1 < step) {
            s.classList.add('completed');
        } else if (i + 1 === step) {
            s.classList.add('active');
        }
    });

    // Show correct step content
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`)?.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function processOrder() {
    const btn = document.querySelector('#payment-form button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    // Simulate order processing
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'HLX-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        // Get email
        const email = document.getElementById('email').value;

        // Show confirmation modal
        const modal = document.getElementById('confirmation-modal');
        document.getElementById('order-number').textContent = orderNumber;
        document.getElementById('confirm-email').textContent = email;

        // Update crypto payment info
        const cryptoModal = document.getElementById('crypto-payment-modal');

        cryptoModal.style.display = 'block';
        const total = cart.getTotal() - cryptoDiscount - couponDiscount + shippingCost;
        const rate = cryptoRates[selectedCrypto];
        const cryptoAmount = (total * rate).toFixed(selectedCrypto === 'usdt' ? 2 : 6);

        document.getElementById('modal-crypto-amount').textContent = `${cryptoAmount} ${selectedCrypto.toUpperCase()}`;
        document.getElementById('modal-address').textContent = cryptoAddresses[selectedCrypto];

        // Generate QR Code
        generateQRCode('modal-qr', cryptoAddresses[selectedCrypto]);

        // Start payment timer
        startPaymentTimer();

        modal.style.display = 'flex';

        // Save order to localStorage
        saveOrder(orderNumber, email);

        // Clear cart
        cart.clear();

        btn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
        btn.disabled = false;

    }, 2000);
}

function saveOrder(orderNumber, email) {
    const order = {
        orderNumber,
        email,
        items: cart.getItems(),
        subtotal: cart.getTotal(),
        shipping: shippingCost,
        cryptoDiscount,
        couponDiscount,
        total: cart.getTotal() - cryptoDiscount - couponDiscount + shippingCost,
        paymentMethod: 'crypto',
        crypto: selectedCrypto,
        status: 'pending_payment',
        date: new Date().toISOString(),
        shippingInfo: {
            name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value
        }
    };

    // Get existing orders
    let orders = JSON.parse(localStorage.getItem('helivex_orders') || '[]');
    orders.push(order);
    localStorage.setItem('helivex_orders', JSON.stringify(orders));
}

function startPaymentTimer() {
    let timeLeft = 30 * 60; // 30 minutes
    const timerEl = document.getElementById('payment-timer');

    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerEl.textContent = 'EXPIRED';
        }

        timeLeft--;
    }, 1000);
}

window.applyCoupon = function() {
    const input = document.getElementById('coupon-input');
    const code = input.value.trim();

    if (!code) {
        showNotification('Please enter a coupon code', 'error');
        return;
    }

    const result = cart.applyCoupon(code);

    if (result.success) {
        couponDiscount = cart.getTotal() * (result.coupon.value / 100);

        document.getElementById('coupon-applied').style.display = 'flex';
        document.querySelector('.coupon-code').textContent = result.coupon.code;
        document.querySelector('.coupon-form').style.display = 'none';

        document.getElementById('discount-row').style.display = 'flex';
        document.getElementById('summary-discount').textContent = `-$${couponDiscount.toFixed(2)}`;

        updateTotals();
        showNotification(`Coupon applied: ${result.coupon.value}% off!`, 'success');
    } else {
        showNotification(result.message, 'error');
    }
};

window.removeCoupon = function() {
    cart.removeCoupon();
    couponDiscount = 0;

    document.getElementById('coupon-applied').style.display = 'none';
    document.querySelector('.coupon-form').style.display = 'flex';
    document.getElementById('coupon-input').value = '';
    document.getElementById('discount-row').style.display = 'none';

    updateTotals();
};

window.copyAddress = function() {
    const address = document.getElementById('crypto-address').value;
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Address copied to clipboard', 'success');
    });
};

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

function generateQRCode(elementId, text) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Clear existing content (including placeholder SVG)
    element.innerHTML = '';

    // Generate new QR code
    try {
        new QRCode(element, {
            text: text,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    } catch (e) {
        console.error('QR Code generation failed:', e);
        element.innerHTML = '<p class="error">Failed to generate QR code</p>';
    }
}
