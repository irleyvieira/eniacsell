// Integração do Carrinho com PHP
class CartIntegration {
    constructor() {
        this.init();
    }

    init() {
        this.loadCartFromServer();
        this.setupCartSync();
    }

    // Carregar carrinho do servidor
    async loadCartFromServer() {
        try {
            const response = await fetch('api/cart.php?action=get');
            const data = await response.json();
            
            if (data.success) {
                this.updateLocalCart(data.items);
                this.updateCartUI(data.count, data.total);
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
        }
    }

    // Adicionar item ao carrinho
    async addToCart(productId, quantity = 1, options = null) {
        // Buscar dados do produto (simulado - em produção viria de uma API)
        const product = this.getProductData(productId);
        
        if (!product) {
            this.showNotification('Produto não encontrado', 'error');
            return false;
        }

        try {
            const response = await fetch('api/cart.php?action=add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    product_name: product.name,
                    product_price: product.price,
                    product_image: product.image,
                    quantity: quantity,
                    options: options
                })
            });

            const result = await response.json();

            if (result.success) {
                this.loadCartFromServer(); // Recarregar carrinho
                this.showNotification(result.message, 'success');
                return true;
            } else {
                this.showNotification(result.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            this.showNotification('Erro ao adicionar produto ao carrinho', 'error');
            return false;
        }
    }

    // Atualizar quantidade no carrinho
    async updateCartQuantity(cartId, quantity) {
        try {
            const response = await fetch('api/cart.php?action=update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: cartId,
                    quantity: quantity
                })
            });

            const result = await response.json();

            if (result.success) {
                this.loadCartFromServer(); // Recarregar carrinho
                return true;
            } else {
                this.showNotification(result.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            return false;
        }
    }

    // Remover item do carrinho
    async removeFromCart(cartId) {
        try {
            const response = await fetch('api/cart.php?action=remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_id: cartId
                })
            });

            const result = await response.json();

            if (result.success) {
                this.loadCartFromServer(); // Recarregar carrinho
                this.showNotification(result.message, 'success');
                return true;
            } else {
                this.showNotification(result.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            return false;
        }
    }

    // Limpar carrinho
    async clearCart() {
        try {
            const response = await fetch('api/cart.php?action=clear');
            const result = await response.json();

            if (result.success) {
                this.loadCartFromServer(); // Recarregar carrinho
                this.showNotification(result.message, 'success');
                return true;
            } else {
                this.showNotification(result.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            return false;
        }
    }

    // Atualizar carrinho local (para sincronização com o JavaScript existente)
    updateLocalCart(items) {
        if (window.techStore) {
            // Converter formato do servidor para formato local
            const localItems = items.map(item => ({
                id: item.product_id,
                name: item.product_name,
                price: parseFloat(item.product_price),
                image: item.product_image,
                quantity: parseInt(item.quantity),
                options: item.options ? JSON.parse(item.options) : null,
                cart_id: item.id // ID do item no carrinho
            }));
            
            window.techStore.cart = localItems;
        }
    }

    // Atualizar UI do carrinho
    updateCartUI(count, total) {
        const cartCount = document.querySelector('.cart-count');
        const cartTotal = document.querySelector('#cart-total');
        
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(total);
        }
        
        this.renderCartItems();
    }

    // Renderizar itens do carrinho
    renderCartItems() {
        const cartItems = document.querySelector('#cart-items');
        if (!cartItems || !window.techStore) return;
        
        if (window.techStore.cart.length === 0) {
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
        
        window.techStore.cart.forEach(item => {
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
                        <button class="quantity-btn" onclick="cartIntegration.updateCartQuantity(${item.cart_id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartIntegration.updateCartQuantity(${item.cart_id}, ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="cartIntegration.removeFromCart(${item.cart_id})" style="margin-left: auto; color: var(--danger-color);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Configurar sincronização do carrinho
    setupCartSync() {
        // Sobrescrever métodos do TechStore para usar integração PHP
        if (window.techStore) {
            const originalAddToCart = window.techStore.addToCart.bind(window.techStore);
            
            window.techStore.addToCart = async (productId, quantity = 1) => {
                return await this.addToCart(productId, quantity);
            };
            
            window.techStore.updateCartQuantity = async (cartId, quantity) => {
                return await this.updateCartQuantity(cartId, quantity);
            };
            
            window.techStore.removeFromCart = async (cartId) => {
                return await this.removeFromCart(cartId);
            };
        }
    }

    // Obter dados do produto (simulado)
    getProductData(productId) {
        // Em produção, isso viria de uma API ou base de dados
        const products = {
            1: {
                name: 'MacBook Pro M3 14"',
                price: 12999.00,
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop'
            },
            2: {
                name: 'iPhone 15 Pro Max',
                price: 8999.00,
                image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop'
            },
            3: {
                name: 'AirPods Pro 2ª Geração',
                price: 1899.00,
                image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop'
            },
            4: {
                name: 'PlayStation 5',
                price: 3999.00,
                image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=300&fit=crop'
            },
            5: {
                name: 'Dell XPS 13',
                price: 7999.00,
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop'
            },
            6: {
                name: 'Samsung Galaxy S24 Ultra',
                price: 6999.00,
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
            },
            7: {
                name: 'Sony WH-1000XM5',
                price: 1599.00,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
            },
            8: {
                name: 'Nintendo Switch OLED',
                price: 2299.00,
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'
            }
        };
        
        return products[productId] || null;
    }

    // Formatar preço
    formatPrice(price) {
        return parseFloat(price).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        if (window.techStore && window.techStore.showNotification) {
            window.techStore.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Inicializar integração do carrinho
document.addEventListener('DOMContentLoaded', () => {
    window.cartIntegration = new CartIntegration();
});