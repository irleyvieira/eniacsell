<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

require_once '../config/database.php';
require_once '../classes/User.php';
require_once '../classes/Cart.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$cart = new Cart($db);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $user->nome = $data['nome'] ?? '';
            $user->email = $data['email'] ?? '';
            $user->senha = $data['senha'] ?? '';
            $user->telefone = $data['telefone'] ?? '';
            $user->data_nascimento = $data['data_nascimento'] ?? null;
            $user->endereco = $data['endereco'] ?? '';
            $user->cidade = $data['cidade'] ?? '';
            $user->estado = $data['estado'] ?? '';
            $user->cep = $data['cep'] ?? '';
            
            // Validações básicas
            if (empty($user->nome) || empty($user->email) || empty($user->senha)) {
                echo json_encode(['success' => false, 'message' => 'Nome, email e senha são obrigatórios']);
                exit;
            }
            
            if (!filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Email inválido']);
                exit;
            }
            
            if (strlen($user->senha) < 6) {
                echo json_encode(['success' => false, 'message' => 'Senha deve ter pelo menos 6 caracteres']);
                exit;
            }
            
            // Verificar se email já existe
            if ($user->emailExists()) {
                echo json_encode(['success' => false, 'message' => 'Este email já está cadastrado']);
                exit;
            }
            
            // Registrar usuário
            if ($user->register()) {
                $_SESSION['user_id'] = $user->id;
                $_SESSION['user_name'] = $user->nome;
                $_SESSION['user_email'] = $user->email;
                
                // Migrar carrinho da sessão para o usuário
                if (isset($_SESSION['session_id'])) {
                    $cart->migrateSessionCart($_SESSION['session_id'], $user->id);
                }
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Usuário registrado com sucesso',
                    'user' => [
                        'id' => $user->id,
                        'nome' => $user->nome,
                        'email' => $user->email
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao registrar usuário']);
            }
        }
        break;
        
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $email = $data['email'] ?? '';
            $senha = $data['senha'] ?? '';
            
            if (empty($email) || empty($senha)) {
                echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
                exit;
            }
            
            if ($user->login($email, $senha)) {
                $_SESSION['user_id'] = $user->id;
                $_SESSION['user_name'] = $user->nome;
                $_SESSION['user_email'] = $user->email;
                
                // Migrar carrinho da sessão para o usuário
                if (isset($_SESSION['session_id'])) {
                    $cart->migrateSessionCart($_SESSION['session_id'], $user->id);
                }
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Login realizado com sucesso',
                    'user' => [
                        'id' => $user->id,
                        'nome' => $user->nome,
                        'email' => $user->email
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos']);
            }
        }
        break;
        
    case 'logout':
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logout realizado com sucesso']);
        break;
        
    case 'check':
        if (isset($_SESSION['user_id'])) {
            echo json_encode([
                'success' => true,
                'logged_in' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'nome' => $_SESSION['user_name'],
                    'email' => $_SESSION['user_email']
                ]
            ]);
        } else {
            echo json_encode(['success' => true, 'logged_in' => false]);
        }
        break;
        
    case 'profile':
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
            exit;
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if ($user->findById($_SESSION['user_id'])) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user->id,
                        'nome' => $user->nome,
                        'email' => $user->email,
                        'telefone' => $user->telefone,
                        'data_nascimento' => $user->data_nascimento,
                        'endereco' => $user->endereco,
                        'cidade' => $user->cidade,
                        'estado' => $user->estado,
                        'cep' => $user->cep
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
            }
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $user->id = $_SESSION['user_id'];
            $user->nome = $data['nome'] ?? '';
            $user->telefone = $data['telefone'] ?? '';
            $user->data_nascimento = $data['data_nascimento'] ?? null;
            $user->endereco = $data['endereco'] ?? '';
            $user->cidade = $data['cidade'] ?? '';
            $user->estado = $data['estado'] ?? '';
            $user->cep = $data['cep'] ?? '';
            
            if ($user->updateProfile()) {
                $_SESSION['user_name'] = $user->nome;
                echo json_encode(['success' => true, 'message' => 'Perfil atualizado com sucesso']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao atualizar perfil']);
            }
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Ação não encontrada']);
        break;
}
?>