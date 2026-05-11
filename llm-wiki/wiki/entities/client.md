---
type: entity
relevance: high
confidence: EXTRACTED
evidence: Based on current Pedido model using cliente as string field, and KaBe requirements for client CRUD
---

# Client

## Overview
The Client entity represents customers in the ADPV system. Currently, clients are stored as simple string names in the Pedido (Order) table, but a dedicated Client table is needed for proper CRUD operations.

## Current State
- **Storage**: Client name stored as `ped_nm_cliente` in `tbpedido` table
- **Type**: Simple string field in Pedido model
- **Limitations**: No dedicated client management, duplicate names possible, limited client information

## Proposed Structure
Based on existing patterns (Fornecedor model), the Client table should follow naming conventions:

### Table: `tbcliente`
### Fields:
- `cli_id` (int, primary key)
- `cli_nm` (string, client name)
- `cli_nr_cpf_cnpj` (string, CPF/CNPJ)
- `cli_nm_contato` (string, contact person)
- `cli_nr_telefone` (string, phone)
- `cli_ds_email` (string, email)
- `cli_ds_ender` (string, address)
- `cli_dh_cadastro` (datetime, registration date)

### Model Properties:
```csharp
[Table("tbcliente")]
public class Cliente
{
    [Key]
    [Column("cli_id")]
    public int Id { get; set; }
    
    [Required]
    [Column("cli_nm")]
    public string Nome { get; set; } = string.Empty;
    
    [Column("cli_nr_cpf_cnpj")]
    public string CpfCnpj { get; set; } = string.Empty;
    
    [Column("cli_nm_contato")]
    public string Contato { get; set; } = string.Empty;
    
    [Column("cli_nr_telefone")]
    public string Telefone { get; set; } = string.Empty;
    
    [Column("cli_ds_email")]
    public string Email { get; set; } = string.Empty;
    
    [Column("cli_ds_ender")]
    public string Endereco { get; set; } = string.Empty;
    
    [Column("cli_dh_cadastro")]
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
}
```

## Relationships
- **Orders**: One client can have multiple orders (`Pedido` table will reference `cli_id`)
- **Future extensions**: May relate to preferences, purchase history, etc.

## CRUD Operations Required
- Create new clients
- Read client details
- Update client information
- Delete clients (with cascade considerations)
- List/search clients

## Validation Rules
- Name is required
- Email format validation
- CPF/CNPJ format validation (Brazilian documents)
- Phone number format

## Related Entities
- [[pedido|Pedido (Order)]]
- [[fornecedor|Fornecedor (Supplier)]]

## Implementation Notes
- Follow existing naming patterns from Fornecedor model
- Integrate with JWT authentication (admin roles for create/update/delete)
- Update Pedido model to reference Client.Id instead of string name
- Consider data migration from existing string client names