# ADPV API

Backend do sistema de gestão ADPV, desenvolvido com ASP.NET Core 10.

## Tecnologias

- ASP.NET Core 10.0
- Entity Framework Core 9.0
- PostgreSQL
- JWT Authentication
- BCrypt.Net-Next
- Swashbuckle (Swagger)

## Instalação

```bash
dotnet restore
```

## Configuração

Configure a string de conexão em `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=adpv;Username=postgres;Password=sua_senha"
  }
}
```

## Executar

```bash
dotnet run
```

A API estará disponível em: http://localhost:5000

## Migrações

Criar migração inicial:
```bash
dotnet ef migrations add InitialCreate
```

Aplicar migrações:
```bash
dotnet ef database update
```

## Estrutura

```
Controllers/     # Controladores API
Models/          # Entidades do banco
DTOs/            # Data Transfer Objects
Data/            # DbContext
Services/        # Serviços auxiliares
Migrations/      # Migrações EF Core
```

## Documentação Swagger

Acesse: http://localhost:5000/swagger