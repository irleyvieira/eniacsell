<?php
require_once '../config/database.php';

class User {
    private $conn;
    private $table_name = "users";
    
    public $id;
    public $nome;
    public $email;
    public $senha;
    public $telefone;
    public $data_nascimento;
    public $endereco;
    public $cidade;
    public $estado;
    public $cep;
    public $status;
    public $created_at;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Registrar novo usuário
    public function register() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET nome=:nome, email=:email, senha=:senha, telefone=:telefone, 
                      data_nascimento=:data_nascimento, endereco=:endereco, 
                      cidade=:cidade, estado=:estado, cep=:cep";
        
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar dados
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->telefone = htmlspecialchars(strip_tags($this->telefone));
        $this->endereco = htmlspecialchars(strip_tags($this->endereco));
        $this->cidade = htmlspecialchars(strip_tags($this->cidade));
        $this->estado = htmlspecialchars(strip_tags($this->estado));
        $this->cep = htmlspecialchars(strip_tags($this->cep));
        
        // Hash da senha
        $password_hash = password_hash($this->senha, PASSWORD_DEFAULT);
        
        // Bind dos parâmetros
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":senha", $password_hash);
        $stmt->bindParam(":telefone", $this->telefone);
        $stmt->bindParam(":data_nascimento", $this->data_nascimento);
        $stmt->bindParam(":endereco", $this->endereco);
        $stmt->bindParam(":cidade", $this->cidade);
        $stmt->bindParam(":estado", $this->estado);
        $stmt->bindParam(":cep", $this->cep);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }
    
    // Login do usuário
    public function login($email, $senha) {
        $query = "SELECT id, nome, email, senha, status FROM " . $this->table_name . " 
                  WHERE email = :email AND status = 'ativo' LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($senha, $row['senha'])) {
                $this->id = $row['id'];
                $this->nome = $row['nome'];
                $this->email = $row['email'];
                $this->status = $row['status'];
                return true;
            }
        }
        
        return false;
    }
    
    // Verificar se email já existe
    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
    
    // Buscar usuário por ID
    public function findById($id) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->nome = $row['nome'];
            $this->email = $row['email'];
            $this->telefone = $row['telefone'];
            $this->data_nascimento = $row['data_nascimento'];
            $this->endereco = $row['endereco'];
            $this->cidade = $row['cidade'];
            $this->estado = $row['estado'];
            $this->cep = $row['cep'];
            $this->status = $row['status'];
            $this->created_at = $row['created_at'];
            return true;
        }
        
        return false;
    }
    
    // Atualizar perfil do usuário
    public function updateProfile() {
        $query = "UPDATE " . $this->table_name . " 
                  SET nome=:nome, telefone=:telefone, data_nascimento=:data_nascimento, 
                      endereco=:endereco, cidade=:cidade, estado=:estado, cep=:cep 
                  WHERE id=:id";
        
        $stmt = $this->conn->prepare($query);
        
        // Sanitizar dados
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->telefone = htmlspecialchars(strip_tags($this->telefone));
        $this->endereco = htmlspecialchars(strip_tags($this->endereco));
        $this->cidade = htmlspecialchars(strip_tags($this->cidade));
        $this->estado = htmlspecialchars(strip_tags($this->estado));
        $this->cep = htmlspecialchars(strip_tags($this->cep));
        
        // Bind dos parâmetros
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":telefone", $this->telefone);
        $stmt->bindParam(":data_nascimento", $this->data_nascimento);
        $stmt->bindParam(":endereco", $this->endereco);
        $stmt->bindParam(":cidade", $this->cidade);
        $stmt->bindParam(":estado", $this->estado);
        $stmt->bindParam(":cep", $this->cep);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }
    
    // Alterar senha
    public function changePassword($nova_senha) {
        $query = "UPDATE " . $this->table_name . " SET senha=:senha WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        
        $password_hash = password_hash($nova_senha, PASSWORD_DEFAULT);
        
        $stmt->bindParam(":senha", $password_hash);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }
}
?>