using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Produto> Produtos { get; set; }

    public DbSet<ProdutoVariacao> ProdutoVariacoes { get; set; }

    public DbSet<Tipo> Tipos { get; set; }

    public DbSet<Fornecedor> Fornecedores { get; set; }

    public DbSet<User> Users { get; set; } // Mude de Usuarios para User

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("Users");
    }
}