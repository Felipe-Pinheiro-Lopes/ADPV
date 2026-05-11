---
type: synthesis
derived: true
---

# Client CRUD Complete Implementation Plan

## Executive Summary
This document provides a comprehensive plan for implementing full CRUD operations for client management in the ADPV system. The implementation follows established project patterns and naming conventions, ensuring consistency with existing codebase.

## Architecture Overview

### Current State
- Client information exists only as string field in Order table
- No dedicated client management functionality
- Limited client data storage and validation

### Target State
- Dedicated Client entity with full CRUD operations
- Frontend interface for client management
- Backend API with business logic and validation
- Database procedures and Neo4j integration
- Comprehensive test coverage

## Detailed Implementation Plan

### 1. Database Schema Changes

#### New Table Structure
```sql
-- Client table following project naming conventions
CREATE TABLE tbcliente (
    cli_id SERIAL PRIMARY KEY,
    cli_nm VARCHAR(255) NOT NULL,
    cli_nr_cpf_cnpj VARCHAR(20),
    cli_nm_contato VARCHAR(255),
    cli_nr_telefone VARCHAR(20),
    cli_ds_email VARCHAR(255),
    cli_ds_ender TEXT,
    cli_dh_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update Order table to reference client
ALTER TABLE tbpedido ADD COLUMN cli_id INTEGER REFERENCES tbcliente(cli_id);
```

#### Migration Strategy
1. Create new client records from existing order client names
2. Update pedido table with client references
3. Remove old string client field after migration

### 2. Backend Implementation

#### Model Definition (`API/Models/Cliente.cs`)
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

#### Controller Implementation (`API/Controllers/ClienteController.cs`)
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClienteController : ControllerBase
{
    // GET: api/Cliente
    [HttpGet]
    public async Task<IActionResult> Listar()
    
    // POST: api/Cliente
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Criar([FromBody] Cliente novoCliente)
    
    // PUT: api/Cliente/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] Cliente clienteAtualizado)
    
    // DELETE: api/Cliente/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deletar(int id)
}
```

#### Business Logic Class (`API/Business/ClienteCaseBusiness.cs`)
```csharp
public class ClienteCaseBusiness
{
    public async Task<ValidationResult> ValidarCliente(Cliente cliente)
    {
        // CPF/CNPJ validation
        // Email format validation
        // Required field checks
        // Business rule validation
    }
    
    public async Task<Cliente> PrepararParaCriacao(Cliente cliente)
    {
        // Set creation date
        // Generate any computed fields
        // Apply business rules
    }
}
```

#### Stored Procedures
```sql
-- SP_CLIENTE_INSERIR
CREATE OR REPLACE PROCEDURE SP_CLIENTE_INSERIR(
    IN p_cli_nm VARCHAR(255),
    IN p_cli_nr_cpf_cnpj VARCHAR(20),
    IN p_cli_nm_contato VARCHAR(255),
    IN p_cli_nr_telefone VARCHAR(20),
    IN p_cli_ds_email VARCHAR(255),
    IN p_cli_ds_ender TEXT,
    OUT p_cli_id INTEGER
)
-- Implementation follows project patterns

-- SP_CLIENTE_ATUALIZAR
-- SP_CLIENTE_DELETAR  
-- SP_CLIENTE_LISTAR
-- SP_CLIENTE_BUSCAR_POR_ID
```

### 3. Frontend Implementation

#### Page Structure (`adpv-front/src/app/(auth)/clientes/page.tsx`)
```tsx
export default function ClientesPage() {
    // Client listing with search
    // CRUD operations
    // Modal integration
}
```

#### Modal Component (`adpv-front/src/components/ModalCliente.tsx`)
```tsx
interface ModalClienteProps {
    isOpen: boolean;
    onClose: () => void;
    cliente?: Cliente;
    onSave: (cliente: Cliente) => void;
}

// Form implementation with validation
```

### 4. Neo4j Integration

#### Graph Schema Updates
```
(:Cliente {
    id: cli_id,
    nome: cli_nm,
    cpfCnpj: cli_nr_cpf_cnpj,
    email: cli_ds_email
})-[:REALIZOU]->(:Pedido)

(:Cliente)-[:DO_TIPO]->(:PessoaFisica {cpf: cli_nr_cpf_cnpj})
(:Cliente)-[:DO_TIPO]->(:PessoaJuridica {cnpj: cli_nr_cpf_cnpj})
```

#### Sync Service Updates
- Add Cliente synchronization in `Neo4jSyncService`
- Create client nodes and relationships
- Update `/api/user/sync-neo4j` endpoint

## Testing Strategy

### Unit Tests
```csharp
// ClienteControllerTests.cs
[Fact]
public async Task Criar_ClienteValido_RetornaSucesso()

[Fact] 
public async Task Criar_ClienteInvalido_RetornaBadRequest()

// ClienteCaseBusinessTests.cs
[Fact]
public async Task ValidarCliente_CpfInvalido_RetornaErro()
```

### Integration Tests
```csharp
// ClienteIntegrationTests.cs
[Fact]
public async Task CrudCompleto_Cliente_CriadoLidoAtualizadoDeletado()
```

### Frontend Tests
```tsx
// ModalCliente.test.tsx
test('renders cliente form correctly', () => {
    // Test form rendering and validation
});
```

### Test Scripts
```bash
# Run backend tests
dotnet test API/API.csproj

# Run frontend tests  
npm test

# Run integration tests
dotnet test API/API.csproj --filter Category=Integration
```

## Implementation Timeline

### Phase 1: Database & Core Backend (3 days)
- Create Cliente model and migration
- Implement ClienteController basic CRUD
- Create stored procedures
- Update AppDbContext and relationships

### Phase 2: Business Logic & Validation (2 days)
- Implement ClienteCaseBusiness
- Add comprehensive validation
- Integrate with Neo4j sync

### Phase 3: Frontend Development (3 days)
- Create clientes page and components
- Implement forms and validation
- Add navigation and routing

### Phase 4: Testing & Integration (3 days)
- Write comprehensive test suite
- Perform integration testing
- Data migration and validation
- Documentation updates

**Total Estimated Time: 11 days**

## Risk Assessment
- **Data Migration**: Existing client names need careful mapping to new Client records
- **Foreign Key Constraints**: Order table updates must maintain referential integrity
- **Authentication**: Ensure proper role-based access control
- **Validation**: CPF/CNPJ and Brazilian document validation complexity

## Success Criteria
- All CRUD operations functional
- Data integrity maintained
- Comprehensive test coverage (>80%)
- Frontend-backend integration working
- Neo4j synchronization operational
- Documentation updated

## Related Documentation
- [[client|Client Entity Details]]
- [[database-schema|Database Schema Patterns]]
- [[naming-conventions|Project Naming Conventions]]
- [[testing-strategy|Testing Strategy]]
- [[neo4j-integration|Neo4j Integration Guide]]