# ADPV - Sistema de Gestão

Sistema de gestão para controle de estoque, pedidos, fornecedores e muito mais.

## Estrutura do Projeto

```
ADPV/
├── adpv-front/      # Frontend (Next.js 16 + React 19)
└── API/             # Backend (ASP.NET Core 10 + PostgreSQL)
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
- PostgreSQL
- JWT Authentication
- BCrypt para criptografia de senhas

## Como Executar

### Frontend
```bash
cd adpv-front
npm install
npm run dev
```
Acesse: http://localhost:3000

### Backend
```bash
cd API
dotnet restore
dotnet run
```
API disponível em: http://localhost:5000

## Funcionalidades

- Dashboard com gráficos e métricas
- Gestão de produtos e estoque
- Gestão de pedidos
- Gestão de fornecedores
- Gestão de categorias (tipos)
- Gestão de usuários
- Relatórios
- Autenticação JWT

## Licença

MIT