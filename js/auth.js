// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthModals();
        this.setupAuthForms();
    }

    // Verificar status de autenticação
    async checkAuthStatus() {
        try {
            const response = await fetch('api/auth.php?action=check');
            const data = await response.json();
            
            if (data.success && data.logged_in) {
                this.currentUser = data.user;
                this.updateUIForLoggedUser();
            } else {
                this.updateUIForGuestUser();
            }
        } catch (error) {
            console.error('Erro ao verificar status de autenticação:', error);
        }
    }

    // Configurar modais de autenticação
    setupAuthModals() {
        // Criar modal de login/registro
        const authModal = document.createElement('div');
        authModal.id = 'auth-modal';
        authModal.className = 'auth-modal';
        authModal.innerHTML = `
            <div class="auth-modal-overlay">
                <div class="auth-modal-content">
                    <button class="auth-modal-close">&times;</button>
                    
                    <!-- Tabs -->
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Entrar</button>
                        <button class="auth-tab" data-tab="register">Cadastrar</button>
                    </div>
                    
                    <!-- Login Form -->
                    <div class="auth-form-container" id="login-form-container">
                        <h2>Entrar na sua conta</h2>
                        <form id="login-form">
                            <div class="form-group">
                                <label for="login-email">E-mail</label>
                                <input type="email" id="login-email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="login-password">Senha</label>
                                <input type="password" id="login-password" name="senha" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Entrar</button>
                        </form>
                    </div>
                    
                    <!-- Register Form -->
                    <div class="auth-form-container" id="register-form-container" style="display: none;">
                        <h2>Criar nova conta</h2>
                        <form id="register-form">
                            <div class="form-group">
                                <label for="register-name">Nome completo</label>
                                <input type="text" id="register-name" name="nome" required>
                            </div>
                            <div class="form-group">
                                <label for="register-email">E-mail</label>
                                <input type="email" id="register-email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="register-password">Senha</label>
                                <input type="password" id="register-password" name="senha" required minlength="6">
                            </div>
                            <div class="form-group">
                                <label for="register-phone">Telefone</label>
                                <input type="tel" id="register-phone" name="telefone">
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">Cadastrar</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(authModal);
        
        // Adicionar estilos do modal
        this.addAuthModalStyles();
        
        // Configurar eventos do modal
        this.setupModalEvents();
    }

    // Adicionar estilos do modal
    addAuthModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
            }
            
            .auth-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal-content {
                background: white;
                border-radius: var(--radius-xl);
                padding: 2rem;
                width: 90%;
                max-width: 400px;
                position: relative;
                box-shadow: var(--shadow-xl);
            }
            
            .auth-modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
            }
            
            .auth-tabs {
                display: flex;
                margin-bottom: 2rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .auth-tab {
                flex: 1;
                padding: 1rem;
                background: none;
                border: none;
                cursor: pointer;
                font-weight: 500;
                color: var(--text-secondary);
                border-bottom: 2px solid transparent;
                transition: var(--transition);
            }
            
            .auth-tab.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
            }
            
            .auth-form-container h2 {
                margin-bottom: 1.5rem;
                text-align: center;
                color: var(--text-primary);
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: var(--text-primary);
            }
            
            .form-group input {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                font-size: 1rem;
                transition: var(--transition);
            }
            
            .form-group input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
        `;
        
        document.head.appendChild(style);
    }

    // Configurar eventos do modal
    setupModalEvents() {
        const modal = document.getElementById('auth-modal');
        const closeBtn = modal.querySelector('.auth-modal-close');
        const overlay = modal.querySelector('.auth-modal-overlay');
        const tabs = modal.querySelectorAll('.auth-tab');
        
        // Fechar modal
        closeBtn.addEventListener('click', () => this.closeAuthModal());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeAuthModal();
        });
        
        // Trocar tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchAuthTab(tabName);
            });
        });
    }

    // Configurar formulários de autenticação
    setupAuthForms() {
        // Botão de usuário
        const userBtn = document.querySelector('.user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                if (this.currentUser) {
                    this.showUserMenu();
                } else {
                    this.openAuthModal();
                }
            });
        }
        
        // Formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Formulário de registro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    // Abrir modal de autenticação
    openAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Fechar modal de autenticação
    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Trocar tab do modal
    switchAuthTab(tabName) {
        const tabs = document.querySelectorAll('.auth-tab');
        const containers = document.querySelectorAll('.auth-form-container');
        
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        containers.forEach(container => {
            container.style.display = container.id === `${tabName}-form-container` ? 'block' : 'none';
        });
    }

    // Processar login
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('api/auth.php?action=login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUIForLoggedUser();
                this.closeAuthModal();
                this.showNotification('Login realizado com sucesso!', 'success');
                
                // Recarregar carrinho
                if (window.techStore) {
                    window.techStore.updateCartUI();
                }
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showNotification('Erro ao fazer login. Tente novamente.', 'error');
        }
    }

    // Processar registro
    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('api/auth.php?action=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUIForLoggedUser();
                this.closeAuthModal();
                this.showNotification('Conta criada com sucesso!', 'success');
                
                // Recarregar carrinho
                if (window.techStore) {
                    window.techStore.updateCartUI();
                }
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            this.showNotification('Erro ao criar conta. Tente novamente.', 'error');
        }
    }

    // Fazer logout
    async logout() {
        try {
            const response = await fetch('api/auth.php?action=logout');
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = null;
                this.updateUIForGuestUser();
                this.showNotification('Logout realizado com sucesso!', 'success');
                
                // Recarregar carrinho
                if (window.techStore) {
                    window.techStore.updateCartUI();
                }
            }
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    }

    // Atualizar UI para usuário logado
    updateUIForLoggedUser() {
        const userBtn = document.querySelector('.user-btn');
        if (userBtn) {
            userBtn.innerHTML = `<i class="fas fa-user-circle"></i>`;
            userBtn.title = `Olá, ${this.currentUser.nome}`;
        }
    }

    // Atualizar UI para usuário visitante
    updateUIForGuestUser() {
        const userBtn = document.querySelector('.user-btn');
        if (userBtn) {
            userBtn.innerHTML = `<i class="fas fa-user"></i>`;
            userBtn.title = 'Entrar ou Cadastrar';
        }
    }

    // Mostrar menu do usuário
    showUserMenu() {
        // Criar menu dropdown
        const existingMenu = document.querySelector('.user-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.innerHTML = `
            <div class="user-menu-content">
                <div class="user-info">
                    <strong>${this.currentUser.nome}</strong>
                    <span>${this.currentUser.email}</span>
                </div>
                <hr>
                <button class="user-menu-item" onclick="authSystem.showProfile()">
                    <i class="fas fa-user"></i> Meu Perfil
                </button>
                <button class="user-menu-item" onclick="authSystem.showOrders()">
                    <i class="fas fa-shopping-bag"></i> Meus Pedidos
                </button>
                <button class="user-menu-item" onclick="authSystem.showWishlist()">
                    <i class="fas fa-heart"></i> Favoritos
                </button>
                <hr>
                <button class="user-menu-item" onclick="authSystem.logout()">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
        `;
        
        // Adicionar estilos do menu
        const style = document.createElement('style');
        style.textContent = `
            .user-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                min-width: 200px;
                margin-top: 0.5rem;
            }
            
            .user-menu-content {
                padding: 1rem;
            }
            
            .user-info {
                display: flex;
                flex-direction: column;
                margin-bottom: 0.5rem;
            }
            
            .user-info strong {
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            
            .user-info span {
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            
            .user-menu-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                padding: 0.5rem;
                background: none;
                border: none;
                text-align: left;
                cursor: pointer;
                border-radius: var(--radius-sm);
                transition: var(--transition);
                color: var(--text-secondary);
            }
            
            .user-menu-item:hover {
                background-color: var(--bg-secondary);
                color: var(--text-primary);
            }
            
            .user-menu hr {
                border: none;
                border-top: 1px solid var(--border-light);
                margin: 0.5rem 0;
            }
        `;
        
        if (!document.querySelector('style[data-user-menu]')) {
            style.setAttribute('data-user-menu', 'true');
            document.head.appendChild(style);
        }
        
        // Posicionar menu
        const userBtn = document.querySelector('.user-btn');
        const userBtnRect = userBtn.getBoundingClientRect();
        userBtn.style.position = 'relative';
        userBtn.appendChild(menu);
        
        // Fechar menu ao clicar fora
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!userBtn.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    // Mostrar perfil (placeholder)
    showProfile() {
        this.showNotification('Funcionalidade de perfil em desenvolvimento', 'info');
    }

    // Mostrar pedidos (placeholder)
    showOrders() {
        this.showNotification('Funcionalidade de pedidos em desenvolvimento', 'info');
    }

    // Mostrar favoritos (placeholder)
    showWishlist() {
        this.showNotification('Funcionalidade de favoritos em desenvolvimento', 'info');
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        if (window.techStore && window.techStore.showNotification) {
            window.techStore.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});