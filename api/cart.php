<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

require_once '../config/database.php';
require_once '../classes/Cart.php';

$database = new Database();
$db = $database->getConnection();

$cart = new Cart($db);

// Gerar session_id se não existir
if (!isset($_SESSION['session_id'])) {
    $_SESSION['session_id'] = session_id();
}

$user_id = $_SESSION['user_id'] ?? null;
$session_id = $_SESSION['session_id'];

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'add':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $product_id = $data['product_id'] ?? 0;
            $product_name = $data['product_name'] ?? '';
            $product_price = $data['product_price'] ?? 0;
            $product_image = $data['product_image'] ?? '';
            $quantity = $data['quantity'] ?? 1;
            $options = $data['options'] ?? null;
            
            if (empty($product_id) || empty($product_name) || $product_price <= 0) {
                echo json_encode(['success' => false, 'message' => 'Dados do produto inválidos']);
                exit;
            }
            
            if ($cart->addItem($user_id, $session_id, $product_id, $product_name, $product_price, $product_image, $quantity, $options)) {
                echo json_encode(['success' => true, 'message' => 'Produto adicionado ao carrinho']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao adicionar produto ao carrinho']);
            }
        }
        break;
        
    case 'get':
        $items = $cart->getCartItems($user_id, $session_id);
        $total = $cart->getCartTotal($user_id, $session_id);
        
        echo json_encode([
            'success' => true,
            'items' => $items,
            'total' => $total,
            'count' => count($items)
        ]);
        break;
        
    case 'update':
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $cart_id = $data['cart_id'] ?? 0;
            $quantity = $data['quantity'] ?? 0;
            
            if ($cart->updateQuantity($cart_id, $quantity)) {
                echo json_encode(['success' => true, 'message' => 'Quantidade atualizada']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao atualizar quantidade']);
            }
        }
        break;
        
    case 'remove':
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $cart_id = $data['cart_id'] ?? 0;
            
            if ($cart->removeItem($cart_id)) {
                echo json_encode(['success' => true, 'message' => 'Item removido do carrinho']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao remover item do carrinho']);
            }
        }
        break;
        
    case 'clear':
        if ($cart->clearCart($user_id, $session_id)) {
            echo json_encode(['success' => true, 'message' => 'Carrinho limpo']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao limpar carrinho']);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Ação não encontrada']);
        break;
}
?>