# Agent Instructions for ADPV Repository

## Project Structure
- `adpv-front/` - Frontend (Next.js 16 + React 19)
- `API/` - Backend (ASP.NET Core 10 + PostgreSQL)

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
dotnet run    # API at http://localhost:5000
```
Environment: appsettings.json and appsettings.Development.json

## Database
- Migrations located in `API/Migrations/`
- To apply migrations: `dotnet ef database update` (requires dotnet-ef tool)

## Notes
- Frontend uses Tailwind CSS 4; ensure PostCSS config is present.
- Backend uses JWT authentication; token service in `API/Services/TokenService.cs`.
- No test suite observed; add tests as needed.