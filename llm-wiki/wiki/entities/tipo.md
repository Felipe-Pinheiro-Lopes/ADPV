---
type: entity
relevance: high
confidence: EXTRACTED
evidence: Based on Tipo.cs model and TipoController.cs implementation
---

# Tipo (Category)

## Overview
The Tipo entity represents product categories in the system. Categories are used to classify products and provide hierarchical organization for inventory management.

## Table Structure
**Table:** `tbtipo`

### Fields:
- `tipo_id` (int, primary key)
- `tipo_nm` (string, category name)
- `tipo_cd` (string, category code)
- `tipo_ds` (string, category description)

### Model Properties:
```csharp
[Table("tbtipo")]
public class Tipo
{
    [Key]
    [Column("tipo_id")]
    public int Id { get; set; }
    
    [Required]
    [Column("tipo_nm")]
    public string Nome { get; set; } = string.Empty;
    
    [Required]
    [Column("tipo_cd")]
    public string Codigo { get; set; } = string.Empty;
    
    [Required]
    [Column("tipo_ds")]
    public string Descricao { get; set; } = string.Empty;
}
```

## CRUD Operations

### Create
- **Endpoint:** `POST /api/Tipo`
- **Authorization:** Admin only
- **Validation:** Nome is required
- **Returns:** Created Tipo object

### Read (List)
- **Endpoint:** `GET /api/Tipo`
- **Authorization:** Authenticated users
- **Returns:** All Tipo records

### Update
- **Endpoint:** `PUT /api/Tipo/{id}`
- **Authorization:** Admin only
- **Validation:** ID consistency check
- **Fields:** Nome, Codigo, Descricao

### Delete
- **Endpoint:** `DELETE /api/Tipo/{id}`
- **Authorization:** Admin only
- **Returns:** Success message

## Relationships
- **One-to-Many:** Tipo → Produto (one category can have multiple products)
- Foreign key in Produto table: `tipo_id`

## Validation Rules
- Nome: Required, not empty
- Codigo: Required, unique identifier
- Descricao: Required, detailed description

## Usage in System
- Product classification
- Inventory organization
- Reporting by category
- Frontend dropdowns and filters

## Neo4j Integration
- Graph relationships: `(:Produto)-[:DO_TIPO]->(:Tipo)`
- Node properties: id, nome, codigo, descricao

## Related Entities
- [[produto|Produto (Product)]]
- [[category-frontend|Category Frontend Component]]

## Implementation Notes
- All operations require authentication
- Admin role required for create/update/delete
- Used in product management screens
- Critical for inventory categorization