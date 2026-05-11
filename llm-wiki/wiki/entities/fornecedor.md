---
type: entity
relevance: high
confidence: EXTRACTED
evidence: Based on Fornecedor.cs model and FornecedorController.cs implementation
---

# Fornecedor (Supplier)

## Overview
The Fornecedor entity represents suppliers/vendors in the system. Suppliers provide products and are essential for inventory management and procurement tracking.

## Table Structure
**Table:** `tbfornecedor`

### Fields:
- `frn_id` (int, primary key)
- `frn_nm` (string, supplier name)
- `frn_nr_cnpj` (string, CNPJ number)
- `frn_nm_contato` (string, contact person)
- `frn_nr_telefone` (string, phone number)
- `frn_ds_email` (string, email address)
- `frn_ds_ender` (string, address)

### Model Properties:
```csharp
[Table("tbfornecedor")]
public class Fornecedor
{
    [Key]
    [Column("frn_id")]
    public int Id { get; set; }
    
    [Required]
    [Column("frn_nm")]
    public string Nome { get; set; } = string.Empty;
    
    [Column("frn_nr_cnpj")]
    public string Cnpj { get; set; } = string.Empty;
    
    [Column("frn_nm_contato")]
    public string Contato { get; set; } = string.Empty;
    
    [Column("frn_nr_telefone")]
    public string Telefone { get; set; } = string.Empty;
    
    [Column("frn_ds_email")]
    public string Email { get; set; } = string.Empty;
    
    [Column("frn_ds_ender")]
    public string Endereco { get; set; } = string.Empty;
}
```

## CRUD Operations

### Create
- **Endpoint:** `POST /api/Fornecedor`
- **Authorization:** Admin only
- **Validation:** Nome is required
- **Returns:** Created Fornecedor object

### Read (List)
- **Endpoint:** `GET /api/Fornecedor`
- **Authorization:** Authenticated users
- **Returns:** All Fornecedor records

### Update
- **Endpoint:** `PUT /api/Fornecedor/{id}`
- **Authorization:** Admin only
- **Validation:** ID consistency check
- **Fields:** Nome, Cnpj, Contato, Telefone, Email, Endereco
- **Returns:** Updated object with success message

### Delete
- **Endpoint:** `DELETE /api/Fornecedor/{id}`
- **Authorization:** Admin only
- **Returns:** Success message

## Relationships
- **One-to-Many:** Fornecedor → Produto (one supplier can provide multiple products)
- Foreign key in Produto table: `frn_id`

## Validation Rules
- Nome: Required for creation
- CNPJ: Brazilian company registration number
- Email: Standard email format (implied)
- Other fields: Optional but recommended

## Business Rules
- Admin-only operations for supplier management
- Suppliers are critical for product sourcing
- Used in procurement and inventory decisions

## Neo4j Integration
- Graph relationships: `(:Produto)-[:FORNECIDO_POR]->(:Fornecedor)`
- Node properties: id, nome, cnpj, contato, telefone, email, endereco

## Related Entities
- [[produto|Produto (Product)]]
- [[supplier-frontend|Supplier Frontend Component]]

## Implementation Notes
- Follows same pattern as other admin-managed entities
- CNPJ field for Brazilian business identification
- Contact information essential for procurement
- Used in product registration and supplier selection