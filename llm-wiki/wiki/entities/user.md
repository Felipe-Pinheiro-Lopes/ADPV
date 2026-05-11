---
type: entity
relevance: high
confidence: EXTRACTED
evidence: Based on User.cs model and UserController.cs implementation
---

# User

## Overview
The User entity represents system users with authentication and authorization capabilities. Users can have different roles (Admin/User) and are managed through JWT-based authentication.

## Table Structure
**Table:** `tbusuario`

### Fields:
- `usu_id` (int, primary key)
- `usu_nm` (string, user name)
- `usu_ds_senha` (string, hashed password using BCrypt)
- `usu_ds_email` (string, email address)
- `usu_dh_nascto` (datetime, birth date)
- `usu_nr_telefone` (long, phone number, nullable)
- `usu_tp_role` (string, role: "Admin" or "User", default "User")

### Model Properties:
```csharp
[Table("tbusuario")]
public class User
{
    [Key]
    [Column("usu_id")]
    public int Id { get; set; }
    
    [Required]
    [Column("usu_nm")]
    public string Nome { get; set; } = null!;
    
    [Required]
    [Column("usu_ds_senha")]
    public string Senha { get; set; } = null!;
    
    [Required]
    [Column("usu_ds_email")]
    public string Email { get; set; } = null!;
    
    [Column("usu_dh_nascto")]
    public DateTime Data_Nasc { get; set; }
    
    [Column("usu_nr_telefone")]
    public long? Telefone { get; set; }
    
    [Column("usu_tp_role")]
    public string Role { get; set; } = "User";
}
```

## CRUD Operations

### Create (Register)
- **Endpoint:** `POST /api/User/register`
- **DTO:** `UserUpdateDto`
- **Validation:** Required fields (Nome, Email, Senha)
- **Security:** Password hashed with BCrypt
- **Authorization:** Open (no auth required for registration)

### Read (List/Get)
- **List:** `GET /api/User/listar` (Admin only)
- **Get by ID:** `GET /api/User/{id}` (Authenticated users)
- **Returns:** Id, Nome, Email, Telefone, Role (password excluded)

### Update
- **Endpoint:** `PUT /api/User/{id}` (Admin only)
- **DTO:** `UserUpdateDto`
- **Fields:** Nome, Email, Telefone, Data_Nasc, Role
- **Password:** Optional update (commented in code)

### Delete
- **Endpoint:** `DELETE /api/User/{id}` (Admin only)

### Authentication
- **Login:** `POST /api/User/login`
- **Returns:** JWT token with user claims
- **Validation:** Email + BCrypt password verification

## Security Features
- **Password Hashing:** BCrypt.Net.BCrypt
- **JWT Authentication:** TokenService.GenerateToken()
- **Role-Based Authorization:** Admin/User roles
- **Protected Endpoints:** Admin operations require Admin role

## Validation Rules
- Nome: Required, not null
- Email: Required, unique (implied by login logic)
- Senha: Required, hashed before storage
- Role: Default "User", can be "Admin"

## Neo4j Integration
- Sync endpoint: `POST /api/User/sync-neo4j` (Admin only)
- Uses `INeo4jSyncService.SyncAllData()`
- Synchronizes all user data to graph database

## DTOs Used
- `UserUpdateDto`: For registration and updates
- `UserLoginRequestDto`: For login (email + password)
- `UserLoginDto`: For login response (user + token)

## Related Entities
- [[token-service|Token Service]]
- [[neo4j-sync-service|Neo4j Sync Service]]
- [[authentication|Authentication System]]

## Implementation Notes
- Default admin user: felipe.lopes@2rpnet.com / Felipe121102& (from AGENTS.md)
- Password updates are commented out in Update method
- Role field is crucial for frontend role management
- Phone number is nullable long type