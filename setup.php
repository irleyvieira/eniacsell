<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup do Banco de Dados - TechStore</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .step {
            margin: 2rem 0;
            padding: 1rem;
            border-left: 4px solid #007cba;
            background-color: #f8f9fa;
        }
        .success {
            color: #28a745;
            background-color: #d4edda;
            border-color: #28a745;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
        }
        .error {
            color: #dc3545;
            background-color: #f8d7da;
            border-color: #dc3545;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
        }
        .btn {
            background-color: #007cba;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
        }
        .btn:hover {
            background-color: #005a87;
        }
        code {
            background-color: #f1f1f1;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Setup do Sistema TechStore</h1>
        
        <div class="step">
            <h3>📋 Pré-requisitos</h3>
            <ul>
                <li>PHP 7.4 ou superior</li>
                <li>MySQL 5.7 ou superior</li>
                <li>Extensão PDO habilitada</li>
                <li>Servidor web (Apache/Nginx)</li>
            </ul>
        </div>

        <div class="step">
            <h3>⚙️ Configuração do Banco de Dados</h3>
            <p>1. Edite o arquivo <code>config/database.php</code> com suas credenciais:</p>
            <ul>
                <li><strong>Host:</strong> localhost (ou seu servidor MySQL)</li>
                <li><strong>Database:</strong> techstore_db</li>
                <li><strong>Username:</strong> seu usuário MySQL</li>
                <li><strong>Password:</strong> sua senha MySQL</li>
            </ul>
            
            <p>2. Crie o banco de dados:</p>
            <code>CREATE DATABASE techstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;</code>
        </div>

        <div class="step">
            <h3>🗄️ Inicialização das Tabelas</h3>
            <p>Clique no botão abaixo para criar as tabelas necessárias:</p>
            
            <?php
            if (isset($_POST['init_db'])) {
                try {
                    require_once 'config/init_db.php';
                    initializeDatabase();
                    echo '<div class="success">✅ Banco de dados inicializado com sucesso!</div>';
                } catch (Exception $e) {
                    echo '<div class="error">❌ Erro: ' . $e->getMessage() . '</div>';
                }
            }
            ?>
            
            <form method="post">
                <button type="submit" name="init_db" class="btn">Inicializar Banco de Dados</button>
            </form>
        </div>

        <div class="step">
            <h3>🔧 Integração com o Site</h3>
            <p>Para integrar o sistema PHP com seu site HTML/JavaScript:</p>
            <ol>
                <li>Adicione os scripts JavaScript ao seu HTML:
                    <ul>
                        <li><code>&lt;script src="js/auth.js"&gt;&lt;/script&gt;</code></li>
                        <li><code>&lt;script src="js/cart-integration.js"&gt;&lt;/script&gt;</code></li>
                    </ul>
                </li>
                <li>Certifique-se de que os arquivos PHP estão acessíveis via web</li>
                <li>Configure as permissões adequadas para os diretórios</li>
            </ol>
        </div>

        <div class="step">
            <h3>🧪 Teste do Sistema</h3>
            <p>Após a configuração, teste as seguintes funcionalidades:</p>
            <ul>
                <li>Registro de novos usuários</li>
                <li>Login e logout</li>
                <li>Adicionar produtos ao carrinho</li>
                <li>Gerenciar itens do carrinho</li>
                <li>Lista de favoritos (para usuários logados)</li>
            </ul>
        </div>

        <div class="step">
            <h3>📁 Estrutura de Arquivos</h3>
            <pre>
projeto/
├── config/
│   ├── database.php      # Configuração do banco
│   └── init_db.php       # Inicialização das tabelas
├── classes/
│   ├── User.php          # Classe de usuário
│   ├── Cart.php          # Classe do carrinho
│   └── Wishlist.php      # Classe de favoritos
├── api/
│   ├── auth.php          # API de autenticação
│   ├── cart.php          # API do carrinho
│   └── wishlist.php      # API de favoritos
├── js/
│   ├── auth.js           # Sistema de autenticação frontend
│   └── cart-integration.js # Integração do carrinho
└── setup.php             # Este arquivo de setup
            </pre>
        </div>

        <div class="step">
            <h3>🔒 Segurança</h3>
            <p>Recomendações importantes:</p>
            <ul>
                <li>Altere as credenciais padrão do banco de dados</li>
                <li>Use HTTPS em produção</li>
                <li>Configure adequadamente as permissões de arquivo</li>
                <li>Mantenha o PHP e MySQL atualizados</li>
                <li>Considere usar variáveis de ambiente para credenciais</li>
            </ul>
        </div>
    </div>
</body>
</html>