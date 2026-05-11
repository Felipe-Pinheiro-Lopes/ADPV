---
type: entity
relevance: high
confidence: EXTRACTED
evidence: Based on Pedido.cs model and PedidoController.cs implementation
---

# Pedido (Order)

## Overview
The Pedido entity represents customer orders in the system. Orders manage the sale process, including inventory deduction, status tracking, and financial calculations. Orders are complex transactions involving multiple products and automatic stock management.

## Table Structure
**Table:** `tbpedido`

### Fields:
- `ped_id` (int, primary key)
- `ped_nm_cliente` (string, client name - to be migrated to client relationship)
- `ped_dh_pedido` (datetime, order date)
- `ped_vl_total` (decimal, total value)
- `ped_st_pedido` (string, order status)

### Model Properties:
```csharp
[Table("tbpedido")]
public class Pedido
{
    [Key]
    [Column("ped_id")]
    public int Id { get; set; }

    [Required]
    [Column("ped_nm_cliente")]
    public string Cliente { get; set; } = string.Empty;

    [Column("ped_dh_pedido")]
    public DateTime Data { get; set; } = DateTime.Now;

    [Required]
    [Column("ped_vl_total")]
    public decimal ValorTotal { get; set; }

    [Column("ped_st_pedido")]
    public string Status { get; set; } = "Pendente";
}
```

## CRUD Operations

### Create
- **Endpoint:** `POST /api/Pedido`
- **DTO:** `PedidoCreateDto`
- **Process:**
  1. Validate order has items
  2. Check for duplicate items
  3. Verify stock availability for all items
  4. Create order
  5. Create order items
  6. Deduct stock quantities
  7. Record stock movements ("Saida")
- **Status:** Defaults to "Pendente"
- **Returns:** Created order

### Read (List)
- **Endpoint:** `GET /api/Pedido`
- **DTO:** `PedidoListDto`
- **Order:** By date descending
- **Includes:** Id, Cliente, Data, ValorTotal, Status

### Read (Items)
- **Endpoint:** `GET /api/Pedido/{id}/itens`
- **Returns:** Order items with product details

### Update
- **Endpoint:** `PUT /api/Pedido/{id}`
- **DTO:** `PedidoCreateDto`
- **Special Logic:**
  - Status changes: "Pendente" → "Cancelado" restores stock
  - Other status changes don't affect stock
- **Stock Restoration:** When canceling, adds back quantities and records "Entrada" movements

## Order Status Flow
- **Pendente:** Initial state
- **Cancelado:** Order canceled, stock restored
- Other statuses may be added for fulfillment tracking

## Order Items (PedidoItem)
Each order contains multiple items:
- PedidoId (foreign key)
- ProdutoId (product reference)
- TamanhoId (variation reference, nullable)
- ProdutoNome (cached product name)
- Quantidade (ordered quantity)
- ValorUnitario (unit price)

## Stock Management Integration
- **Automatic Deduction:** Order creation reduces product variation quantities
- **Stock Movements:** Every order item generates "Saida" (exit) movement
- **Cancellation Recovery:** Canceling order restores stock with "Entrada" (entry) movements
- **Stock Validation:** Pre-checks ensure sufficient inventory before order creation

## Business Rules
- Orders must have at least one item
- No duplicate items (same product + size) in same order
- Stock validation prevents overselling
- Total value calculation required
- Status changes affect inventory

## Relationships
- **One-to-Many:** Pedido → PedidoItem (order items)
- **Future:** Pedido → Cliente (planned migration)
- **Many-to-One:** PedidoItem → Produto (through ProdutoId)
- **Many-to-One:** PedidoItem → ProdutoVariacao (through TamanhoId)

## Validation Rules
- Itens: Required, at least one
- No duplicates: Same product/size combinations
- Stock: Sufficient quantity for all items
- ValorTotal: Must be provided

## DTOs Used
- `PedidoCreateDto`: For create/update (cliente, valorTotal, status, itens)
- `PedidoListDto`: For listing (simplified fields)
- `PedidoItemCreateDto`: Nested in order items

## Neo4j Integration
- Graph relationships: `(:Cliente)-[:REALIZOU]->(:Pedido)`
- Order nodes include transaction details
- Connected to product variations through order items

## Related Entities
- [[pedido-item|PedidoItem (Order Item)]]
- [[produto-variacao|ProdutoVariacao (Product Variation)]]
- [[movimentacao-estoque|MovimentacaoEstoque (Stock Movement)]]
- [[cliente|Cliente (Client - planned)]]

## Implementation Notes
- Complex validation logic for stock management
- Transactional integrity critical
- Status changes have inventory implications
- Cached product names in order items for historical accuracy