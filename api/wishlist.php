<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

require_once '../config/database.php';
require_once '../classes/Wishlist.php';

$database = new Database();
$db = $database->getConnection();

$wishlist = new Wishlist($db);

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Usuário não logado']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'add':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $product_id = $data['product_id'] ?? 0;
            $product_name = $data['product_name'] ?? '';
            $product_price = $data['product_price'] ?? 0;
            $product_image = $data['product_image'] ?? '';
            
            if (empty($product_id) || empty($product_name) || $product_price <= 0) {
                echo json_encode(['success' => false, 'message' => 'Dados do produto inválidos']);
                exit;
            }
            
            if ($wishlist->addItem($user_id, $product_id, $product_name, $product_price, $product_image)) {
                echo json_encode(['success' => true, 'message' => 'Produto adicionado aos favoritos']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Produto já está nos favoritos']);
            }
        }
        break;
        
    case 'remove':
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $data = json_decode(file_get_contents("php://input"), true);
            
            $product_id = $data['product_id'] ?? 0;
            
            if ($wishlist->removeItem($user_id, $product_id)) {
                echo json_encode(['success' => true, 'message' => 'Produto removido dos favoritos']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao remover produto dos favoritos']);
            }
        }
        break;
        
    case 'get':
        $items = $wishlist->getUserWishlist($user_id);
        $count = $wishlist->getWishlistCount($user_id);
        
        echo json_encode([
            'success' => true,
            'items' => $items,
            'count' => $count
        ]);
        break;
        
    case 'check':
        $product_id = $_GET['product_id'] ?? 0;
        $exists = $wishlist->itemExists($user_id, $product_id);
        
        echo json_encode([
            'success' => true,
            'exists' => $exists
        ]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Ação não encontrada']);
        break;
}
?>