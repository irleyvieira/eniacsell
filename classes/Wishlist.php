<?php
require_once '../config/database.php';

class Wishlist {
    private $conn;
    private $table_name = "wishlist";
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Adicionar item aos favoritos
    public function addItem($user_id, $product_id, $product_name, $product_price, $product_image) {
        // Verificar se já existe
        if ($this->itemExists($user_id, $product_id)) {
            return false; // Item já existe
        }
        
        $query = "INSERT INTO " . $this->table_name . " 
                  SET user_id=:user_id, product_id=:product_id, 
                      product_name=:product_name, product_price=:product_price, 
                      product_image=:product_image";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->bindParam(":product_name", $product_name);
        $stmt->bindParam(":product_price", $product_price);
        $stmt->bindParam(":product_image", $product_image);
        
        return $stmt->execute();
    }
    
    // Remover item dos favoritos
    public function removeItem($user_id, $product_id) {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND product_id = :product_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":product_id", $product_id);
        
        return $stmt->execute();
    }
    
    // Verificar se item existe nos favoritos
    public function itemExists($user_id, $product_id) {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE user_id = :user_id AND product_id = :product_id LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    // Buscar todos os favoritos do usuário
    public function getUserWishlist($user_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE user_id = :user_id ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Contar itens nos favoritos
    public function getWishlistCount($user_id) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " 
                  WHERE user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'] ?? 0;
    }
}
?>