# Agent Instructions for ADPV Repository

## Project Structure
- `adpv-front/` - Frontend (Next.js 16 + React 19)
- `API/` - Backend (ASP.NET Core 10 + PostgreSQL + Neo4j)

## Development Setup

### Frontend
```bash
cd adpv-front
npm install
npm run dev   # starts at http://localhost:3000
```
Lint: `npm run lint`

### Backend
```bash
cd API
dotnet restore
dotnet run    # API at http://localhost:5145
```
Environment: appsettings.json and appsettings.Development.json

## Database
- **PostgreSQL/pgvector**: Migrations in `API/Migrations/`, apply with `dotnet ef database update`
- **Neo4j**: Graph database for relationships, access at http://localhost:7474 (bolt://localhost:7687)
- **Neo4j Cypher**: Secondary Neo4j instance at http://localhost:7476 (bolt://localhost:7689)

## Docker Services (API/docker-compose.yml)
| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| pgvector | pgvector/pgvector:pg17 | 5490→5432 | PostgreSQL with vector extension |
| neo4j | neo4j:5 | 7474→7474, 7687→7687 | Graph database |
| neo4j-cypher | neo4j:5 | 7476→7474, 7689→7687 | Secondary graph DB |
| pgadmin | dpage/pgadmin4 | 8080→80 | Database management |
| api | local build | 5145→80 | ASP.NET Core API |

## Neo4j Configuration
- Connection settings in `API/appsettings.json` under `Neo4j` section
- Services: `INeo4jService` and `INeo4jSyncService` in `API/Services/`
- Sync endpoint: `POST /api/user/sync-neo4j` (Admin only)
- Graph relationships created:
  - `(Produto)-[:FORNECIDO_POR]->(Fornecedor)`
  - `(Produto)-[:DO_TIPO]->(Tipo)`
  - `(Produto)-[:TEM_VARIACAO]->(ProdutoVariacao)`

## Notes
- Frontend uses Tailwind CSS 4; ensure PostCSS config is present.
- Backend uses JWT authentication; token service in `API/Services/TokenService.cs`.
- Default admin user: `felipe.lopes@2rpnet.com` / `Felipe121102&`
- No test suite observed; add tests as needed.