/* =============================================
   HELIVEX LABS - Shop Page JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initShopFilters();
    initViewToggle();
    initSorting();
    initPriceRange();
    loadShopProducts();
});

function loadShopProducts() {
    const grid = document.getElementById('products-grid');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    const search = urlParams.get('search');

    let productsToShow = category === 'all' ? products : getProductsByCategory(category);

    if (search) {
        productsToShow = searchProducts(search);
        document.querySelector('.page-header h1').textContent = `Search: "${search}"`;
    }

    // Update active category
    document.querySelectorAll('.category-list a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === category) {
            link.classList.add('active');
        }
    });

    // Update results count
    document.getElementById('results-count').textContent = productsToShow.length;

    renderProducts(productsToShow, grid);
}

function initShopFilters() {
    const categoryLinks = document.querySelectorAll('.category-list a');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;

            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            window.history.pushState({}, '', url);

            // Reload products
            loadShopProducts();
        });
    });

    // Clear filters
    document.getElementById('clear-filters')?.addEventListener('click', () => {
        window.location.href = 'shop.html';
    });
}

function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const grid = document.getElementById('products-grid');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.dataset.view;
            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', () => {
        const grid = document.getElementById('products-grid');
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';

        let productsToSort = category === 'all' ? [...products] : getProductsByCategory(category);

        switch (sortSelect.value) {
            case 'price-low':
                productsToSort.sort((a, b) => a.variants[0].price - b.variants[0].price);
                break;
            case 'price-high':
                productsToSort.sort((a, b) => b.variants[0].price - a.variants[0].price);
                break;
            case 'name':
                productsToSort.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                productsToSort.reverse();
                break;
            case 'featured':
            default:
                productsToSort.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        renderProducts(productsToSort, grid);
    });
}

function initPriceRange() {
    const range = document.getElementById('price-range');
    const maxDisplay = document.getElementById('price-max');

    if (!range || !maxDisplay) return;

    range.addEventListener('input', () => {
        const value = range.value;
        maxDisplay.textContent = value >= 500 ? '$500+' : `$${value}`;

        // Filter products by price
        const grid = document.getElementById('products-grid');
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';

        let filteredProducts = category === 'all' ? products : getProductsByCategory(category);
        filteredProducts = filteredProducts.filter(p => p.variants[0].price <= value);

        document.getElementById('results-count').textContent = filteredProducts.length;
        renderProducts(filteredProducts, grid);
    });
}
