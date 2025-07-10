// E-commerce JavaScript Functionality
class TechStore {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.filteredProducts = [];
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.updateCartUI();
        this.renderProducts();
    }

    // Sample products data
    loadProducts() {
        this.products = [
            {
                id: 1,
                name: 'MacBook Pro M3 14"',
                description: 'Notebook profissional com chip M3 e tela Liquid Retina XDR',
                price: 12999.00,
                originalPrice: 14999.00,
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
                category: 'laptops',
                badge: 'Oferta',
                rating: 4.9,
                reviews: 127
            },
            {
                id: 2,
                name: 'iPhone 15 Pro Max',
                description: 'Smartphone premium com chip A17 Pro e câmera de 48MP',
                price: 8999.00,
                originalPrice: 9999.00,
                image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
                category: 'smartphones',
                badge: 'Novo',
                rating: 4.8,
                reviews: 89
            },
            {
                id: 3,
                name: 'AirPods Pro 2ª Geração',
                description: 'Fones de ouvido sem fio com cancelamento ativo de ruído',
                price: 1899.00,
                originalPrice: 2199.00,
                image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
                category: 'audio',
                badge: 'Bestseller',
                rating: 4.7,
                reviews: 156
            },
            {
                id: 4,
                name: 'PlayStation 5',
                description: 'Console de videogame de nova geração com SSD ultra-rápido',
                price: 3999.00,
                originalPrice: 4499.00,
                image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=300&fit=crop',
                category: 'gaming',
                badge: 'Oferta',
                rating: 4.9,
                reviews: 203
            },
            {
                id: 5,
                name: 'Dell XPS 13',
                description: 'Ultrabook premium com tela InfinityEdge e processador Intel',
                price: 7999.00,
                originalPrice: 8999.00,
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
                category: 'laptops',
                badge: 'Novo',
                rating: 4.6,
                reviews: 78
            },
            {
                id: 6,
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Smartphone Android premium com S Pen e câmera de 200MP',
                price: 6999.00,
                originalPrice: 7999.00,
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
                category: 'smartphones',
                badge: 'Oferta',
                rating: 4.7,
                reviews: 134
            },
            {
                id: 7,
                name: 'Sony WH-1000XM5',
                description: 'Headphone over-ear com cancelamento de ruído líder da indústria',
                price: 1599.00,
                originalPrice: 1899.00,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
                category: 'audio',
                badge: 'Bestseller',
                rating: 4.8,
                reviews: 92
            },
            {
                id: 8,
                name: 'Nintendo Switch OLED',
                description: 'Console portátil com tela OLED vibrante e controles Joy-Con',
                price: 2299.00,
                originalPrice: 2599.00,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
                category: 'gaming',
                badge: 'Novo',
                rating: 4.6,
                reviews: 167
            }
        ];
        
        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
        }

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });

        // Cart functionality
        const cartBtn = document.querySelector('.cart-btn');
        const cartClose = document.querySelector('.cart-close');
        const overlay = document.querySelector('#overlay');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.toggleCart();
            });
        }
        
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                this.closeCart();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryName = e.currentTarget.querySelector('h3').textContent.toLowerCase();
                this.handleCategoryClick(categoryName);
            });
        });

        // Hero buttons
        const exploreBtn = document.querySelector('.hero-buttons .btn-primary');
        const offersBtn = document.querySelector('.hero-buttons .btn-secondary');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.scrollToSection('products');
            });
        }
        
        if (offersBtn) {
            offersBtn.addEventListener('click', () => {
                this.handleFilter('all');
                this.scrollToSection('products');
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSignup();
            });
        }

        // Load more products
        const loadMoreBtn = document.querySelector('.load-more .btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    handleNavigation(link) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Scroll to section if it exists
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            this.scrollToSection(href.substring(1));
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.renderProducts();
    }

    handleFilter(filter) {
        this.currentFilter = filter;
        
        // Update filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Filter products
        if (filter === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => 
                product.category === filter
            );
        }
        
        this.renderProducts();
    }

    handleCategoryClick(categoryName) {
        const categoryMap = {
            'laptops': 'laptops',
            'smartphones': 'smartphones',
            'audio': 'audio',
            'gaming': 'gaming',
            'câmeras': 'cameras',
            'smart tv': 'tv'
        };
        
        const filter = categoryMap[categoryName] || 'all';
        this.handleFilter(filter);
        this.scrollToSection('products');
    }

    renderProducts() {
        const productsGrid = document.querySelector('#products-grid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '';
        
        this.filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">
                        ${this.generateStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">R$ ${this.formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="price-original">R$ ${this.formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Adicionar ao Carrinho
                    </button>
                    <button class="btn-wishlist" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners to product card buttons
        const addToCartBtn = card.querySelector('.btn-add-cart');
        const wishlistBtn = card.querySelector('.btn-wishlist');
        
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.addToCart(product.id);
        });
        
        wishlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleWishlist(product.id, wishlistBtn);
        });
        
        // Make card clickable to go to product page
        card.addEventListener('click', () => {
            this.goToProduct(product.id);
        });
        
        return card;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} adicionado ao carrinho!`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateCartQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
                this.renderCartItems();
            }
        }
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('#cart-total');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(totalPrice);
        }
        
        this.renderCartItems();
    }

    renderCartItems() {
        const cartItems = document.querySelector('#cart-items');
        if (!cartItems) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <button class="btn btn-primary" onclick="techStore.closeCart()">Continuar Comprando</button>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = '';
        
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R$ ${this.formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="techStore.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="techStore.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="techStore.removeFromCart(${item.id})" style="margin-left: auto; color: var(--danger-color);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    toggleCart() {
        const cartSidebar = document.querySelector('#cart-sidebar');
        const overlay = document.querySelector('#overlay');
        
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        const cartSidebar = document.querySelector('#cart-sidebar');
        const overlay = document.querySelector('#overlay');
        
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleWishlist(productId, button) {
        const icon = button.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.style.color = 'var(--danger-color)';
            this.showNotification('Produto adicionado aos favoritos!', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.style.color = '';
            this.showNotification('Produto removido dos favoritos!', 'info');
        }
    }

    goToProduct(productId) {
        // In a real application, this would navigate to the product page
        window.location.href = `product.html?id=${productId}`;
    }

    scrollToSection(sectionId) {
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleNewsletterSignup() {
        const emailInput = document.querySelector('.newsletter-input');
        const email = emailInput.value.trim();
        
        if (!email) {
            this.showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simulate newsletter signup
        emailInput.value = '';
        this.showNotification('Obrigado! Você foi inscrito em nossa newsletter.', 'success');
    }

    loadMoreProducts() {
        // Simulate loading more products
        this.showNotification('Carregando mais produtos...', 'info');
        
        setTimeout(() => {
            this.showNotification('Todos os produtos foram carregados!', 'success');
        }, 1000);
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.nav');
        nav.classList.toggle('mobile-open');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: var(--transition);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 3000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.techStore = new TechStore();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to header
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.category-card, .product-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

