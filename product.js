// Product Page Specific JavaScript
class ProductPage {
    constructor() {
        this.currentProduct = null;
        this.selectedOptions = {
            configuration: '8gb-512gb',
            color: 'space-gray',
            quantity: 1
        };
        
        this.init();
    }

    init() {
        this.loadProductData();
        this.setupImageGallery();
        this.setupProductOptions();
        this.setupQuantitySelector();
        this.setupTabs();
        this.setupProductActions();
        this.loadRelatedProducts();
    }

    loadProductData() {
        // In a real application, this would fetch data based on URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || '1';
        
        // Sample product data (in real app, this would come from API)
        this.currentProduct = {
            id: 1,
            name: 'MacBook Pro 14" com chip M3',
            price: 12999.00,
            originalPrice: 14999.00,
            configurations: {
                '8gb-512gb': { price: 12999.00, name: '8GB RAM + 512GB SSD' },
                '16gb-1tb': { price: 15999.00, name: '16GB RAM + 1TB SSD' },
                '32gb-2tb': { price: 21999.00, name: '32GB RAM + 2TB SSD' }
            },
            colors: {
                'space-gray': { name: 'Cinza Espacial', hex: '#5a5a5a' },
                'silver': { name: 'Prateado', hex: '#e8e8e8' },
                'space-black': { name: 'Preto Espacial', hex: '#1a1a1a' }
            },
            images: [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
                'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
                'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&h=600&fit=crop'
            ]
        };
        
        this.updateProductPrice();
    }

    setupImageGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.querySelector('#main-product-image');
        
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                thumbnail.classList.add('active');
                
                // Update main image
                if (mainImage && this.currentProduct.images[index]) {
                    mainImage.src = this.currentProduct.images[index];
                }
            });
        });

        // Add zoom functionality
        if (mainImage) {
            mainImage.addEventListener('click', () => {
                this.openImageZoom(mainImage.src);
            });
        }
    }

    setupProductOptions() {
        // Configuration options
        const configButtons = document.querySelectorAll('[data-option]');
        configButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all config buttons
                configButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update selected configuration
                this.selectedOptions.configuration = button.dataset.option;
                this.updateProductPrice();
            });
        });

        // Color options
        const colorButtons = document.querySelectorAll('[data-color]');
        colorButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all color buttons
                colorButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update selected color
                this.selectedOptions.color = button.dataset.color;
            });
        });
    }

    setupQuantitySelector() {
        const quantityInput = document.querySelector('#product-quantity');
        const decreaseBtn = document.querySelector('#decrease-qty');
        const increaseBtn = document.querySelector('#increase-qty');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                const currentQty = parseInt(quantityInput.value);
                if (currentQty > 1) {
                    quantityInput.value = currentQty - 1;
                    this.selectedOptions.quantity = currentQty - 1;
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                const currentQty = parseInt(quantityInput.value);
                if (currentQty < 10) {
                    quantityInput.value = currentQty + 1;
                    this.selectedOptions.quantity = currentQty + 1;
                }
            });
        }

        if (quantityInput) {
            quantityInput.addEventListener('change', () => {
                let value = parseInt(quantityInput.value);
                if (isNaN(value) || value < 1) value = 1;
                if (value > 10) value = 10;
                quantityInput.value = value;
                this.selectedOptions.quantity = value;
            });
        }
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Remove active class from all tabs and panels
                tabButtons.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                button.classList.add('active');
                const targetPanel = document.querySelector(`#${targetTab}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    setupProductActions() {
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        const buyNowBtn = document.querySelector('.buy-now-btn');
        const wishlistBtn = document.querySelector('.btn-wishlist-large');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addToCart();
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                this.buyNow();
            });
        }

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                this.toggleWishlist(wishlistBtn);
            });
        }
    }

    updateProductPrice() {
        const priceElements = document.querySelectorAll('.price-current');
        const config = this.currentProduct.configurations[this.selectedOptions.configuration];
        
        if (config && priceElements.length > 0) {
            priceElements.forEach(element => {
                element.textContent = `R$ ${this.formatPrice(config.price)}`;
            });
        }
    }

    addToCart() {
        const config = this.currentProduct.configurations[this.selectedOptions.configuration];
        const color = this.currentProduct.colors[this.selectedOptions.color];
        
        const productToAdd = {
            id: this.currentProduct.id,
            name: `${this.currentProduct.name} - ${config.name} - ${color.name}`,
            price: config.price,
            image: this.currentProduct.images[0],
            quantity: this.selectedOptions.quantity,
            options: { ...this.selectedOptions }
        };

        // Use the global cart functionality if available
        if (window.techStore) {
            window.techStore.addToCart(this.currentProduct.id, this.selectedOptions.quantity);
        } else {
            // Fallback cart functionality
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => 
                item.id === productToAdd.id && 
                JSON.stringify(item.options) === JSON.stringify(productToAdd.options)
            );
            
            if (existingItem) {
                existingItem.quantity += productToAdd.quantity;
            } else {
                cart.push(productToAdd);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            this.showNotification('Produto adicionado ao carrinho!', 'success');
        }
    }

    buyNow() {
        this.addToCart();
        // Redirect to checkout (in a real app)
        this.showNotification('Redirecionando para o checkout...', 'info');
        setTimeout(() => {
            // window.location.href = 'checkout.html';
        }, 1000);
    }

    toggleWishlist(button) {
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

    openImageZoom(imageSrc) {
        // Create zoom modal
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
        modal.innerHTML = `
            <div class="zoom-overlay">
                <div class="zoom-container">
                    <img src="${imageSrc}" alt="Produto ampliado">
                    <button class="zoom-close">&times;</button>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const zoomContainer = modal.querySelector('.zoom-container');
        zoomContainer.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;
        
        const zoomImage = modal.querySelector('img');
        zoomImage.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        `;
        
        const closeBtn = modal.querySelector('.zoom-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close functionality
        const closeZoom = () => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeZoom);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeZoom();
        });
        
        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeZoom();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    loadRelatedProducts() {
        // Sample related products
        const relatedProducts = [
            {
                id: 2,
                name: 'MacBook Air M2',
                price: 9999.00,
                originalPrice: 11999.00,
                image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop'
            },
            {
                id: 3,
                name: 'iPad Pro M2',
                price: 7999.00,
                originalPrice: 8999.00,
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop'
            },
            {
                id: 4,
                name: 'Magic Keyboard',
                price: 1299.00,
                originalPrice: 1499.00,
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop'
            },
            {
                id: 5,
                name: 'Magic Mouse',
                price: 699.00,
                originalPrice: 799.00,
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'
            }
        ];

        const relatedGrid = document.querySelector('.related-products .products-grid');
        if (relatedGrid) {
            relatedGrid.innerHTML = '';
            
            relatedProducts.forEach(product => {
                const productCard = this.createRelatedProductCard(product);
                relatedGrid.appendChild(productCard);
            });
        }
    }

    createRelatedProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
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
        
        // Add event listeners
        const addToCartBtn = card.querySelector('.btn-add-cart');
        const wishlistBtn = card.querySelector('.btn-wishlist');
        
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.techStore) {
                window.techStore.addToCart(product.id);
            }
        });
        
        wishlistBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.techStore) {
                window.techStore.toggleWishlist(product.id, wishlistBtn);
            }
        });
        
        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });
        
        return card;
    }

    formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    showNotification(message, type = 'info') {
        // Use the global notification system if available
        if (window.techStore && window.techStore.showNotification) {
            window.techStore.showNotification(message, type);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize product page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.product-details')) {
        window.productPage = new ProductPage();
    }
});

