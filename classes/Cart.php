<?php
require_once '../config/database.php';

class Cart {
    private $conn;
    private $table_name = "cart";
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Adicionar item ao carrinho
    public function addItem($user_id, $session_id, $product_id, $product_name, $product_price, $product_image, $quantity = 1, $options = null) {
        // Verificar se item já existe
        $existing_item = $this->getItem($user_id, $session_id, $product_id, $options);
        
        if ($existing_item) {
            // Atualizar quantidade
            return $this->updateQuantity($existing_item['id'], $existing_item['quantity'] + $quantity);
        } else {
            // Adicionar novo item
            $query = "INSERT INTO " . $this->table_name . " 
                      SET user_id=:user_id, session_id=:session_id, product_id=:product_id, 
                          product_name=:product_name, product_price=:product_price, 
                          product_image=:product_image, quantity=:quantity, options=:options";
            
            $stmt = $this->conn->prepare($query);
            
            $options_json = $options ? json_encode($options) : null;
            
            $stmt->bindParam(":user_id", $user_id);
            $stmt->bindParam(":session_id", $session_id);
            $stmt->bindParam(":product_id", $product_id);
            $stmt->bindParam(":product_name", $product_name);
            $stmt->bindParam(":product_price", $product_price);
            $stmt->bindParam(":product_image", $product_image);
            $stmt->bindParam(":quantity", $quantity);
            $stmt->bindParam(":options", $options_json);
            
            return $stmt->execute();
        }
    }
    
    // Buscar item específico
    private function getItem($user_id, $session_id, $product_id, $options) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE product_id = :product_id AND options = :options";
        
        if ($user_id) {
            $query .= " AND user_id = :user_id";
        } else {
            $query .= " AND session_id = :session_id";
        }
        
        $query .= " LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        
        $options_json = $options ? json_encode($options) : null;
        
        $stmt->bindParam(":product_id", $product_id);
        $stmt->bindParam(":options", $options_json);
        
        if ($user_id) {
            $stmt->bindParam(":user_id", $user_id);
        } else {
            $stmt->bindParam(":session_id", $session_id);
        }
        
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        
        return false;
    }
    
    // Buscar todos os itens do carrinho
    public function getCartItems($user_id, $session_id) {
        $query = "SELECT * FROM " . $this->table_name;
        
        if ($user_id) {
            $query .= " WHERE user_id = :user_id";
        } else {
            $query .= " WHERE session_id = :session_id";
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        
        if ($user_id) {
            $stmt->bindParam(":user_id", $user_id);
        } else {
            $stmt->bindParam(":session_id", $session_id);
        }
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Atualizar quantidade
    public function updateQuantity($cart_id, $quantity) {
        if ($quantity <= 0) {
            return $this->removeItem($cart_id);
        }
        
        $query = "UPDATE " . $this->table_name . " SET quantity = :quantity WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":id", $cart_id);
        
        return $stmt->execute();
    }
    
    // Remover item do carrinho
    public function removeItem($cart_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $cart_id);
        
        return $stmt->execute();
    }
    
    // Limpar carrinho
    public function clearCart($user_id, $session_id) {
        $query = "DELETE FROM " . $this->table_name;
        
        if ($user_id) {
            $query .= " WHERE user_id = :user_id";
        } else {
            $query .= " WHERE session_id = :session_id";
        }
        
        $stmt = $this->conn->prepare($query);
        
        if ($user_id) {
            $stmt->bindParam(":user_id", $user_id);
        } else {
            $stmt->bindParam(":session_id", $session_id);
        }
        
        return $stmt->execute();
    }
    
    // Calcular total do carrinho
    public function getCartTotal($user_id, $session_id) {
        $query = "SELECT SUM(product_price * quantity) as total FROM " . $this->table_name;
        
        if ($user_id) {
            $query .= " WHERE user_id = :user_id";
        } else {
            $query .= " WHERE session_id = :session_id";
        }
        
        $stmt = $this->conn->prepare($query);
        
        if ($user_id) {
            $stmt->bindParam(":user_id", $user_id);
        } else {
            $stmt->bindParam(":session_id", $session_id);
        }
        
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $result['total'] ?? 0;
    }
    
    // Migrar carrinho de sessão para usuário logado
    public function migrateSessionCart($session_id, $user_id) {
        $query = "UPDATE " . $this->table_name . " 
                  SET user_id = :user_id, session_id = NULL 
                  WHERE session_id = :session_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":session_id", $session_id);
        
        return $stmt->execute();
    }
}
?>