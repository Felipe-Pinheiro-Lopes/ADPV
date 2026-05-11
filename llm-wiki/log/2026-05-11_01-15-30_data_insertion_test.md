# Data Insertion Test - 30 Sample Records

## Overview
This document demonstrates the insertion of 30 different data records across all major entities in the ADPV system, guided by the LLM wiki knowledge base. Each insertion follows the documented API patterns, validation rules, and business logic.

## Test Setup
- API running on http://localhost:5145
- PostgreSQL on port 5490
- Neo4j on ports 7474/7687
- Authentication: JWT tokens required for protected endpoints

## 1-5: User Registrations (5 records)

### 1. Admin User Registration
```http
POST /api/User/register
Content-Type: application/json

{
  "nome": "Administrador Sistema",
  "email": "admin@adpv.com",
  "senha": "Admin123!",
  "telefone": 11999999999,
  "data_Nasc": "1985-01-01T00:00:00Z",
  "role": "Admin"
}
```
**Expected:** 200 OK with success message

### 2. Regular User Registration
```http
POST /api/User/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "senha": "User123!",
  "telefone": 11888888888,
  "data_Nasc": "1990-05-15T00:00:00Z",
  "role": "User"
}
```
**Expected:** 200 OK with success message

### 3. Sales User Registration
```http
POST /api/User/register
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria.santos@adpv.com",
  "senha": "Sales123!",
  "telefone": 11777777777,
  "data_Nasc": "1988-03-20T00:00:00Z",
  "role": "User"
}
```

### 4. Inventory Manager Registration
```http
POST /api/User/register
Content-Type: application/json

{
  "nome": "Carlos Oliveira",
  "email": "carlos.oliveira@adpv.com",
  "senha": "Stock123!",
  "telefone": 11666666666,
  "data_Nasc": "1982-11-10T00:00:00Z",
  "role": "User"
}
```

### 5. Customer Service User Registration
```http
POST /api/User/register
Content-Type: application/json

{
  "nome": "Ana Costa",
  "email": "ana.costa@adpv.com",
  "senha": "Support123!",
  "telefone": 11555555555,
  "data_Nasc": "1992-07-25T00:00:00Z",
  "role": "User"
}
```

## 6-10: Product Categories (5 records)

### Authentication Required
First, login as admin to get JWT token:
```http
POST /api/User/login
Content-Type: application/json

{
  "email": "admin@adpv.com",
  "senha": "Admin123!"
}
```
**Expected:** JWT token in response

### 6. Electronics Category
```http
POST /api/Tipo
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Eletrônicos",
  "codigo": "ELEC",
  "descricao": "Produtos eletrônicos e gadgets"
}
```

### 7. Clothing Category
```http
POST /api/Tipo
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Vestuário",
  "codigo": "VEST",
  "descricao": "Roupas e acessórios"
}
```

### 8. Home & Garden Category
```http
POST /api/Tipo
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Casa e Jardim",
  "codigo": "CASA",
  "descricao": "Produtos para casa e jardim"
}
```

### 9. Sports Category
```http
POST /api/Tipo
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Esportes",
  "codigo": "ESPO",
  "descricao": "Equipamentos esportivos"
}
```

### 10. Books Category
```http
POST /api/Tipo
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Livros",
  "codigo": "LIVR",
  "descricao": "Livros e materiais didáticos"
}
```

## 11-15: Suppliers (5 records)

### 11. Tech Supplier
```http
POST /api/Fornecedor
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Tech Solutions Ltda",
  "cnpj": "12.345.678/0001-90",
  "contato": "Roberto Lima",
  "telefone": "1133334444",
  "email": "contato@techsolutions.com.br",
  "endereco": "Rua das Tecnologias, 123, São Paulo - SP"
}
```

### 12. Fashion Supplier
```http
POST /api/Fornecedor
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Moda Express S.A.",
  "cnpj": "98.765.432/0001-10",
  "contato": "Carla Mendes",
  "telefone": "1144445555",
  "email": "vendas@modaexpress.com.br",
  "endereco": "Av. da Moda, 456, Rio de Janeiro - RJ"
}
```

### 13. Home Goods Supplier
```http
POST /api/Fornecedor
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Lar Confortável Ltda",
  "cnpj": "45.678.901/0001-23",
  "contato": "Pedro Santos",
  "telefone": "1155556666",
  "email": "pedidos@larconfortavel.com.br",
  "endereco": "Rua do Conforto, 789, Belo Horizonte - MG"
}
```

### 14. Sports Supplier
```http
POST /api/Fornecedor
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Esportes Total Ltda",
  "cnpj": "67.890.123/0001-45",
  "contato": "Lucas Ferreira",
  "telefone": "1166667777",
  "email": "lucase@esportestotal.com.br",
  "endereco": "Av. Esportiva, 321, Porto Alegre - RS"
}
```

### 15. Book Supplier
```http
POST /api/Fornecedor
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Literatura Nacional S.A.",
  "cnpj": "89.012.345/0001-67",
  "contato": "Mariana Costa",
  "telefone": "1177778888",
  "email": "mariana@literaturanacional.com.br",
  "endereco": "Rua dos Livros, 654, Salvador - BA"
}
```

## 16-25: Products (10 records)

### 16. Smartphone Product
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Smartphone Galaxy S23",
  "fornecedorId": 1,
  "tipoId": 1,
  "variacoes": [
    {
      "tamanho": "128GB",
      "valorCompra": 2500.00,
      "valorVenda": 3200.00,
      "quantidade": 50
    },
    {
      "tamanho": "256GB",
      "valorCompra": 2800.00,
      "valorVenda": 3600.00,
      "quantidade": 30
    }
  ]
}
```

### 17. Laptop Product
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Notebook Dell Inspiron",
  "fornecedorId": 1,
  "tipoId": 1,
  "variacoes": [
    {
      "tamanho": "8GB RAM",
      "valorCompra": 3500.00,
      "valorVenda": 4500.00,
      "quantidade": 20
    }
  ]
}
```

### 18. T-Shirt Product
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Camiseta Básica",
  "fornecedorId": 2,
  "tipoId": 2,
  "variacoes": [
    {
      "tamanho": "P",
      "valorCompra": 15.00,
      "valorVenda": 35.00,
      "quantidade": 100
    },
    {
      "tamanho": "M",
      "valorCompra": 15.00,
      "valorVenda": 35.00,
      "quantidade": 100
    },
    {
      "tamanho": "G",
      "valorCompra": 15.00,
      "valorVenda": 35.00,
      "quantidade": 100
    }
  ]
}
```

### 19. Garden Hose Product
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Mangueira de Jardim 50m",
  "fornecedorId": 3,
  "tipoId": 3,
  "variacoes": [
    {
      "tamanho": "Verde",
      "valorCompra": 45.00,
      "valorVenda": 89.90,
      "quantidade": 25
    }
  ]
}
```

### 20. Soccer Ball Product
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Bola de Futebol Oficial",
  "fornecedorId": 4,
  "tipoId": 4,
  "variacoes": [
    {
      "tamanho": "Nº 5",
      "valorCompra": 35.00,
      "valorVenda": 79.90,
      "quantidade": 40
    }
  ]
}
```

### 21. Programming Book
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "fornecedorId": 5,
  "tipoId": 5,
  "variacoes": [
    {
      "tamanho": "Capa Dura",
      "valorCompra": 45.00,
      "valorVenda": 89.90,
      "quantidade": 15
    }
  ]
}
```

### 22. Wireless Headphones
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Fones de Ouvido Bluetooth",
  "fornecedorId": 1,
  "tipoId": 1,
  "variacoes": [
    {
      "tamanho": "Preto",
      "valorCompra": 120.00,
      "valorVenda": 199.90,
      "quantidade": 35
    },
    {
      "tamanho": "Branco",
      "valorCompra": 120.00,
      "valorVenda": 199.90,
      "quantidade": 35
    }
  ]
}
```

### 23. Running Shoes
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Tênis de Corrida Nike",
  "fornecedorId": 4,
  "tipoId": 4,
  "variacoes": [
    {
      "tamanho": "42",
      "valorCompra": 180.00,
      "valorVenda": 299.90,
      "quantidade": 20
    },
    {
      "tamanho": "43",
      "valorCompra": 180.00,
      "valorVenda": 299.90,
      "quantidade": 20
    }
  ]
}
```

### 24. Coffee Table Book
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Fotografia de Natureza",
  "fornecedorId": 5,
  "tipoId": 5,
  "variacoes": [
    {
      "tamanho": "Grande",
      "valorCompra": 25.00,
      "valorVenda": 49.90,
      "quantidade": 10
    }
  ]
}
```

### 25. Garden Tools Set
```http
POST /api/Produto/cadastrar
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "nome": "Kit de Ferramentas de Jardim",
  "fornecedorId": 3,
  "tipoId": 3,
  "variacoes": [
    {
      "tamanho": "Básico",
      "valorCompra": 85.00,
      "valorVenda": 149.90,
      "quantidade": 15
    }
  ]
}
```

## 26-30: Orders (5 records)

### 26. Electronics Order
```http
POST /api/Pedido
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "cliente": "Empresa ABC Ltda",
  "valorTotal": 5199.90,
  "itens": [
    {
      "produtoId": 1,
      "tamanhoId": 1,
      "quantidade": 1,
      "valorUnitario": 3200.00
    },
    {
      "produtoId": 7,
      "tamanhoId": 7,
      "quantidade": 1,
      "valorUnitario": 199.90
    }
  ]
}
```

### 27. Clothing Order
```http
POST /api/Pedido
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "cliente": "Loja de Roupas XYZ",
  "valorTotal": 105.00,
  "itens": [
    {
      "produtoId": 3,
      "tamanhoId": 2,
      "quantidade": 1,
      "valorUnitario": 35.00
    },
    {
      "produtoId": 3,
      "tamanhoId": 3,
      "quantidade": 2,
      "valorUnitario": 35.00
    }
  ]
}
```

### 28. Sports Order
```http
POST /api/Pedido
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "cliente": "Academia FitLife",
  "valorTotal": 379.80,
  "itens": [
    {
      "produtoId": 5,
      "tamanhoId": 5,
      "quantidade": 1,
      "valorUnitario": 79.90
    },
    {
      "produtoId": 8,
      "tamanhoId": 8,
      "quantidade": 1,
      "valorUnitario": 299.90
    }
  ]
}
```

### 29. Book Order
```http
POST /api/Pedido
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "cliente": "Biblioteca Municipal",
  "valorTotal": 139.80,
  "itens": [
    {
      "produtoId": 6,
      "tamanhoId": 6,
      "quantidade": 1,
      "valorUnitario": 89.90
    },
    {
      "produtoId": 9,
      "tamanhoId": 9,
      "quantidade": 1,
      "valorUnitario": 49.90
    }
  ]
}
```

### 30. Home Goods Order
```http
POST /api/Pedido
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "cliente": "Construtora Moderna",
  "valorTotal": 239.80,
  "itens": [
    {
      "produtoId": 4,
      "tamanhoId": 4,
      "quantidade": 1,
      "valorUnitario": 89.90
    },
    {
      "produtoId": 10,
      "tamanhoId": 10,
      "quantidade": 1,
      "valorUnitario": 149.90
    }
  ]
}
```

## Test Validation

### Expected Results
1. All user registrations should succeed
2. All category creations should succeed (admin auth)
3. All supplier creations should succeed (admin auth)
4. All product creations should succeed with stock movements
5. All order creations should succeed with inventory deductions

### Database Verification
- Check PostgreSQL tables for correct data insertion
- Verify Neo4j graph relationships creation
- Confirm stock movements are recorded
- Validate referential integrity

### Wiki Knowledge Applied
- Used documented API endpoints and DTO structures
- Followed authentication requirements
- Applied business rules (stock validation, admin restrictions)
- Included required fields based on entity definitions
- Used proper naming conventions from wiki documentation