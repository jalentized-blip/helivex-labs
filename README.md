# Helivex Labs - Research Peptides E-Commerce Website

A modern, flowing e-commerce website for Helivex Labs, specializing in research-grade peptides. Features automated cryptocurrency checkout and a comprehensive customer dashboard.

## Features

- **Modern Design**: Clean, flowing design with smooth animations and a professional crimson/wine color scheme
- **Responsive**: Fully responsive across all devices (mobile, tablet, desktop)
- **E-Commerce Functionality**:
  - Product catalog with filtering and sorting
  - Shopping cart with localStorage persistence
  - Product variants (different sizes/dosages)
  - Wishlist functionality
- **Cryptocurrency Checkout**:
  - Support for Bitcoin, Ethereum, USDT, and Litecoin
  - 10% automatic discount for crypto payments
  - QR code generation for payments
  - Payment timer and address copying
- **Customer Dashboard**:
  - Order history and tracking
  - Wishlist management
  - Saved addresses
  - Account settings
  - Referral program
- **Additional Pages**:
  - FAQ with search and filtering
  - COA (Certificate of Analysis) Library
  - Contact form
  - Product detail pages

## File Structure

```
Website code/
├── index.html              # Homepage
├── shop.html               # Product catalog
├── product.html            # Product detail page
├── checkout.html           # Checkout with crypto payment
├── dashboard.html          # Customer dashboard
├── faq.html                # FAQ page
├── coa.html                # COA Library
├── contact.html            # Contact page
├── README.md               # This file
├── css/
│   ├── style.css           # Main styles
│   ├── animations.css      # Animation effects
│   ├── shop.css            # Shop page styles
│   ├── product.css         # Product page styles
│   ├── checkout.css        # Checkout styles
│   ├── dashboard.css       # Dashboard styles
│   └── pages.css           # FAQ, COA, Contact styles
├── js/
│   ├── products.js         # Product data
│   ├── cart.js             # Shopping cart functionality
│   ├── main.js             # Core functionality
│   ├── shop.js             # Shop page scripts
│   ├── checkout.js         # Checkout functionality
│   ├── dashboard.js        # Dashboard scripts
│   └── product-page.js     # Product detail scripts
└── images/                 # Image assets (add your own)
```

## Deployment to GitHub Pages

1. Create a new GitHub repository
2. Push all files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Helivex Labs website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. Go to repository Settings > Pages
4. Select "main" branch as source
5. Your site will be available at `https://YOUR-USERNAME.github.io/YOUR-REPO/`

## WooCommerce Integration

This is a static HTML/CSS/JS website. To integrate with WooCommerce:

### Option 1: Use as WooCommerce Theme
1. Convert HTML templates to PHP
2. Use WooCommerce hooks and template overrides
3. Replace static product data with WooCommerce products

### Option 2: Headless WooCommerce
1. Set up WordPress + WooCommerce as backend
2. Use WooCommerce REST API to fetch products
3. Modify `products.js` to fetch from API:
   ```javascript
   // Example API fetch
   async function fetchProducts() {
       const response = await fetch('https://your-store.com/wp-json/wc/v3/products', {
           headers: {
               'Authorization': 'Basic ' + btoa('consumer_key:consumer_secret')
           }
       });
       return await response.json();
   }
   ```

### Option 3: Keep Static with Payment Gateway
1. Host static site on GitHub Pages or Netlify
2. Integrate a third-party payment processor:
   - **Crypto**: BTCPay Server, CoinGate, or NOWPayments
   - **Cards**: Stripe Checkout, Square, or PayPal
3. Use webhooks to process orders

## Cryptocurrency Payment Integration

For production use, integrate a real crypto payment processor:

### BTCPay Server (Self-hosted, recommended)
```javascript
// Example BTCPay integration
const createInvoice = async (orderId, amount) => {
    const response = await fetch('https://your-btcpay-server.com/api/v1/stores/{storeId}/invoices', {
        method: 'POST',
        headers: {
            'Authorization': 'token YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amount,
            currency: 'USD',
            metadata: { orderId }
        })
    });
    return await response.json();
};
```

### CoinGate
```javascript
// Example CoinGate integration
const createOrder = async (orderId, amount) => {
    const response = await fetch('https://api.coingate.com/v2/orders', {
        method: 'POST',
        headers: {
            'Authorization': 'Token YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order_id: orderId,
            price_amount: amount,
            price_currency: 'USD',
            receive_currency: 'BTC',
            callback_url: 'https://your-site.com/webhook',
            success_url: 'https://your-site.com/success',
            cancel_url: 'https://your-site.com/cancel'
        })
    });
    return await response.json();
};
```

## Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-500: #C41E3A;  /* Main brand color */
    --primary-600: #A91D45;  /* Darker shade */
    /* etc. */
}
```

### Products
Edit product data in `js/products.js`:
```javascript
const products = [
    {
        id: 1,
        name: "Your Product",
        slug: "your-product",
        category: "metabolic",
        description: "Product description...",
        variants: [
            { size: "5mg", price: 59.99, originalPrice: 79.99 }
        ],
        // etc.
    }
];
```

### Logo
Replace the SVG helix logo in HTML files or add your own image logo.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

External CDN resources:
- Google Fonts (Inter, Space Grotesk)
- Font Awesome 6.4.0

No npm/build process required - pure HTML/CSS/JS.

## License

This is a custom website template. Modify for your own use.

## Support

For questions about this template, please open an issue on GitHub.

---

**Disclaimer**: This website template is for research purposes only. Ensure compliance with all applicable laws and regulations for your specific use case.
