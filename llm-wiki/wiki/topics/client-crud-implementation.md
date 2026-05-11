---
type: topic
importance: high
---

# Client CRUD Implementation Plan

## Overview
Complete implementation plan for client management CRUD operations in the ADPV system, following project conventions and KaBe methodology.

## Current State Analysis
- No dedicated Client entity exists
- Client information stored as string in Pedido table
- Frontend has no client management interface
- Backend lacks client controller and business logic

## Required Changes

### 1. Database Layer

#### New Table: `tbcliente`
```sql
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
```

#### Migration Script
- Create Cliente table
- Add foreign key to Pedido table (cli_id)
- Data migration for existing client names (create Client records and update Pedido references)

### 2. Backend Changes

#### Model: `Cliente.cs`
- Follow Fornecedor.cs pattern
- Include all required fields with proper annotations
- Add to AppDbContext

#### Controller: `ClienteController.cs`
- Implement standard CRUD endpoints:
  - `GET /api/Cliente` - List clients
  - `POST /api/Cliente` - Create client (Admin only)
  - `PUT /api/Cliente/{id}` - Update client (Admin only)
  - `DELETE /api/Cliente/{id}` - Delete client (Admin only)
- Include validation and error handling
- Follow FornecedorController pattern

#### Business Logic: `ClienteCaseBusiness.cs` (New)
- Validation logic for CPF/CNPJ
- Business rules for client creation/updates
- Integration with Neo4j sync service

#### Stored Procedures
```sql
-- SP_CLIENTE_INSERIR
-- SP_CLIENTE_ATUALIZAR
-- SP_CLIENTE_DELETAR
-- SP_CLIENTE_LISTAR
-- SP_CLIENTE_BUSCAR_POR_ID
```

### 3. Frontend Changes

#### New Page: `clientes/page.tsx`
- Client listing with search/filter
- CRUD operations via modal forms
- Follow existing patterns (fornecedores, produtos)

#### Components
- `ModalCliente.tsx` - Client form modal
- Client list table component
- Integration with API endpoints

### 4. Neo4j Integration

#### Graph Relationships
```
(:Cliente)-[:REALIZOU]->(:Pedido)
(:Cliente)-[:DO_TIPO]->(:PessoaFisica|:PessoaJuridica)
```

#### Sync Service Updates
- Include Cliente in Neo4jSyncService
- Create client nodes and relationships
- Update sync endpoint to handle clients

## Test Plan

### Unit Tests
- Cliente model validation
- Controller endpoints
- Business logic rules

### Integration Tests
- Full CRUD workflow
- Database constraints
- Neo4j synchronization

### E2E Tests
- Frontend-backend integration
- User authentication and authorization

## Implementation Steps

### Phase 1: Database and Backend
1. Create Cliente model and migration
2. Update AppDbContext
3. Create ClienteController
4. Implement stored procedures
5. Update Pedido model to reference Cliente

### Phase 2: Business Logic
1. Create ClienteCaseBusiness class
2. Implement validation rules
3. Add Neo4j sync support

### Phase 3: Frontend
1. Create clientes page
2. Implement modal components
3. Add navigation and routing

### Phase 4: Testing and Integration
1. Write comprehensive tests
2. Update Neo4j sync service
3. Data migration and validation

## Naming Conventions Followed
- Table: `tbcliente`
- Fields: `cli_{prefix}` (id, nm, nr, ds, dh)
- Model: `Cliente`
- Controller: `ClienteController`
- Procedures: `SP_CLIENTE_{OPERATION}`

## Estimated Timeline
- Phase 1: 2-3 days
- Phase 2: 1-2 days
- Phase 3: 2-3 days
- Phase 4: 2-3 days
- Total: 7-11 days

## Related Pages
- [[client|Client Entity]]
- [[database-schema|Database Schema]]
- [[frontend-implementation|Frontend Implementation]]
- [[backend-implementation|Backend Implementation]]
- [[testing-strategy|Testing Strategy]]