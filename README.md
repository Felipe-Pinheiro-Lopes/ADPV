# ADPV - Sistema de Gestão

Sistema de gestão para controle de estoque, pedidos, fornecedores e muito mais.

## Estrutura do Projeto

```
ADPV/
├── adpv-front/      # Frontend (Next.js 16 + React 19)
└── API/             # Backend (ASP.NET Core 10 + PostgreSQL + Neo4j)
```

## Tecnologias

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts (gráficos)
- React Grid Layout

### Backend
- ASP.NET Core 10
- Entity Framework Core 9
- PostgreSQL com extensão pgvector
- Neo4j (banco de grafos)
- JWT Authentication
- BCrypt para criptografia de senhas

## Pré-requisitos

- Docker e Docker Compose
- .NET 10 SDK
- Node.js 18+

## Como Executar

### Usando Docker (Recomendado)

```bash
cd API
docker-compose up -d
```

Isso iniciará os seguintes serviços:
- **pgvector**: PostgreSQL com pgvector (porta 5490)
- **neo4j**: Banco de grafos (portas 7474/7687)
- **neo4j-cypher**: Instância secundária Neo4j (portas 7476/7689)
- **pgadmin**: Gerenciamento PostgreSQL (porta 8080)
- **api**: API ASP.NET Core (porta 5145)

### Frontend
```bash
cd adpv-front
npm install
npm run dev
```
Acesse: http://localhost:3000

### Backend (Desenvolvimento)
```bash
cd API
dotnet restore
dotnet run
```
API disponível em: http://localhost:5145
Swagger: http://localhost:5145/swagger

## Configuração do Banco de Dados

### PostgreSQL/pgvector
- Migrations em `API/Migrations/`
- Aplicar: `dotnet ef database update`
- Extensão pgvector ativada automaticamente via migration

### Neo4j
- Acesse: http://localhost:7474 (neo4j principal)
- Acesse: http://localhost:7476 (neo4j-cypher)
- Credenciais: `neo4j` / `admin123`
- Relacionamentos criados:
  - `(Produto)-[:FORNECIDO_POR]->(Fornecedor)`
  - `(Produto)-[:DO_TIPO]->(Tipo)`
  - `(Produto)-[:TEM_VARIACAO]->(ProdutoVariacao)`

### Sincronização Neo4j
Para sincronizar dados do PostgreSQL para Neo4j:
```bash
POST /api/user/sync-neo4j
```
Requer role `Admin`.

## Funcionalidades

- Dashboard com gráficos e métricas
- Gestão de produtos e estoque
- Gestão de pedidos
- Gestão de fornecedores
- Gestão de categorias (tipos)
- Gestão de usuários
- Relatórios
- Autenticação JWT

## Usuário Padrão

- **Email**: `felipe.lopes@2rpnet.com`
- **Senha**: `Felipe121102&`
- **Role**: Admin

## Licença

MIT