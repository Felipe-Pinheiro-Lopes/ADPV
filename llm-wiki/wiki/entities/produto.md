---
type: entity
relevance: high
confidence: EXTRACTED
evidence: Based on Produto.cs model and ProdutoController.cs implementation
---

# Produto (Product)

## Overview
The Produto entity represents products in the inventory system. Products have variations (sizes, prices) and are linked to suppliers and categories. Product management includes automatic stock movement tracking.

## Table Structure
**Table:** `tbproduto`

### Fields:
- `prod_id` (int, primary key)
- `prod_nm` (string, product name)
- `frn_id` (int, foreign key to Fornecedor)
- `tipo_id` (int, foreign key to Tipo)
- `prod_dh_cadastro` (datetime, registration date)

### Model Properties:
```csharp
[Table("tbproduto")]
public class Produto
{
    [Key]
    [Column("prod_id")]
    public int Id { get; set; }
    
    [Required]
    [Column("prod_nm")]
    public string Nome { get; set; } = string.Empty;
    
    [Column("frn_id")]
    public int FornecedorId { get; set; }
    
    [Column("tipo_id")]
    public int TipoId { get; set; }
    
    [Column("prod_dh_cadastro")]
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    [ForeignKey("TipoId")]
    public virtual Tipo? Tipo { get; set; }
    
    [ForeignKey("FornecedorId")]
    public virtual Fornecedor? Fornecedor { get; set; }

    public List<ProdutoVariacao> Variacoes { get; set; } = new();
}
```

## CRUD Operations

### Create (Cadastrar)
- **Endpoint:** `POST /api/Produto/cadastrar`
- **DTO:** `ProdutoCreateDto`
- **Authorization:** Admin only
- **Process:**
  1. Create product
  2. Create product variations
  3. Record stock movements for each variation
- **Returns:** Success message

### Read (Listar)
- **Endpoint:** `GET /api/Produto/listar`
- **DTO:** `ProdutoListDto` (includes variations, supplier, category names)
- **Includes:** All variations, supplier name, category name
- **Authorization:** Authenticated users

### Update
- **Endpoint:** `PUT /api/Produto/{id}`
- **DTO:** `ProdutoCreateDto`
- **Authorization:** Not specified (seems open)
- **Process:**
  1. Update product basic info
  2. Remove unused variations (not in orders)
  3. Add new variations
  4. Record stock movements
- **Safety:** Preserves variations used in existing orders

### Delete
- **Endpoint:** `DELETE /api/Produto/{id}`
- **Authorization:** Admin only
- **Process:** Remove all variations and product
- **Cascade:** Automatically removes associated variations

## Relationships
- **Many-to-One:** Produto → Fornecedor (supplier)
- **Many-to-One:** Produto → Tipo (category)
- **One-to-Many:** Produto → ProdutoVariacao (variations)
- **One-to-Many:** Produto → PedidoItem (through variations)

## Product Variations
Each product can have multiple variations with:
- Size (Tamanho)
- Purchase price (ValorCompra)
- Sale price (ValorVenda)
- Quantity in stock (Quantidade)

## Stock Management
- **Automatic tracking:** Every variation creation/update generates MovimentacaoEstoque records
- **Types:** "Entrada" (entry) for additions
- **Linked to variations:** Each stock movement references ProdutoVariacaoId

## Validation Rules
- Nome: Required
- FornecedorId: Must exist
- TipoId: Must exist
- Variations: At least one required
- Variation fields: All required (size, prices, quantity)

## DTOs Used
- `ProdutoCreateDto`: For create/update (name, supplier, category, variations)
- `ProdutoListDto`: For listing (includes nested variation and name data)
- `VariacaoListDto`: Nested in product list

## Neo4j Integration
- Graph relationships:
  - `(:Produto)-[:FORNECIDO_POR]->(:Fornecedor)`
  - `(:Produto)-[:DO_TIPO]->(:Tipo)`
  - `(:Produto)-[:TEM_VARIACAO]->(:ProdutoVariacao)`

## Related Entities
- [[produto-variacao|ProdutoVariacao (Product Variation)]]
- [[fornecedor|Fornecedor (Supplier)]]
- [[tipo|Tipo (Category)]]
- [[movimentacao-estoque|MovimentacaoEstoque (Stock Movement)]]
- [[pedido-item|PedidoItem (Order Item)]]

## Implementation Notes
- Complex update logic protects order integrity
- Automatic stock movement recording
- Nested DTOs for efficient data transfer
- Admin restrictions on delete operations