using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Suprimir warnings de migração pendente
AppContext.SetSwitch("Microsoft.EntityFrameworkCore.Migrations.PendingModelChangesWarning", true);

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração do Banco
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configuração do JWT
// IMPORTANTE: Esta chave deve ser IGUAL à do seu TokenService
var key = Encoding.ASCII.GetBytes("remember_remember_the_fifteenth_of_november");
builder.Services.AddAuthentication(x => {
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x => {
    x.RequireHttpsMetadata = false; // Facilitar teste local
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// 3. Configuração do CORS (Ajustada para ser mais flexível no desenvolvimento)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy => 
    {
        policy.WithOrigins("http://localhost:3000") // Certifique-se que o Next está nesta porta
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Permitir cookies/auth headers se necessário
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"Bearer {token}\""
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Ignorar migracao automatica - assume banco ja configurado
// using (var scope = app.Services.CreateScope())
// {
//     var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//     db.Database.Migrate();
// }

// --- 4. ORDEM DOS MIDDLEWARES (CRUCIAL) ---

// --- 4. ORDEM DOS MIDDLEWARES (CRUCIAL) ---

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// O CORS deve vir ANTES de Authentication e Authorization
app.UseCors("AllowNextJs"); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();