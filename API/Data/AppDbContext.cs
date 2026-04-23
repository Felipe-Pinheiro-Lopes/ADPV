using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<ProdutoVariacao> ProdutoVariacoes => Set<ProdutoVariacao>();
    public DbSet<Tipo> Tipos => Set<Tipo>();
    public DbSet<Fornecedor> Fornecedores => Set<Fornecedor>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<User> Users => Set<User>();
    public DbSet<MovimentacaoEstoque> MovimentacoesEstoque => Set<MovimentacaoEstoque>();
    public DbSet<PedidoItem> PedidoItems => Set<PedidoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("tbusuario");
        modelBuilder.Entity<Produto>().ToTable("tbproduto");
        modelBuilder.Entity<ProdutoVariacao>().ToTable("tbproduto_variacao");
        modelBuilder.Entity<Tipo>().ToTable("tbtipo");
        modelBuilder.Entity<Fornecedor>().ToTable("tbfornecedor");
        modelBuilder.Entity<Pedido>().ToTable("tbpedido");
        modelBuilder.Entity<MovimentacaoEstoque>().ToTable("tbmovimentacao_estoque");

        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().Property(u => u.Id).HasColumnName("usu_id");
        modelBuilder.Entity<User>().Property(u => u.Nome).HasColumnName("usu_nm");
        modelBuilder.Entity<User>().Property(u => u.Email).HasColumnName("usu_ds_email");
        modelBuilder.Entity<User>().Property(u => u.Senha).HasColumnName("usu_ds_senha");
        modelBuilder.Entity<User>().Property(u => u.Data_Nasc).HasColumnName("usu_dh_nascto");
        modelBuilder.Entity<User>().Property(u => u.Telefone).HasColumnName("usu_nr_telefone");
        modelBuilder.Entity<User>().Property(u => u.Role).HasColumnName("usu_tp_role");

        modelBuilder.Entity<Produto>().HasKey(p => p.Id);
        modelBuilder.Entity<Produto>().Property(p => p.Id).HasColumnName("prod_id");
        modelBuilder.Entity<Produto>().Property(p => p.Nome).HasColumnName("prod_nm");
        modelBuilder.Entity<Produto>().Property(p => p.FornecedorId).HasColumnName("frn_id");
        modelBuilder.Entity<Produto>().Property(p => p.TipoId).HasColumnName("tipo_id");
        modelBuilder.Entity<Produto>().Property(p => p.DataCadastro).HasColumnName("prod_dh_cadastro");

        modelBuilder.Entity<ProdutoVariacao>().HasKey(v => v.Id);
        modelBuilder.Entity<ProdutoVariacao>().Property(v => v.Id).HasColumnName("var_id");
        modelBuilder.Entity<ProdutoVariacao>().Property(v => v.ProdutoId).HasColumnName("prod_id");
        modelBuilder.Entity<ProdutoVariacao>().Property(v => v.Tamanho).HasColumnName("var_nm_tamanho");
        modelBuilder.Entity<ProdutoVariacao>().Property(v => v.ValorCompra).HasColumnName("var_vl_compra");
        modelBuilder.Entity<ProdutoVariacao>().Property(v => v.ValorVenda).HasColumnName("var_vl_venda");
        modelBuilder.Entity<ProdutoVariacao>().Property(v => v.Quantidade).HasColumnName("var_nr_quantidade");
        modelBuilder.Entity<ProdutoVariacao>().Property(v => v.DataCadastro).HasColumnName("var_dh_cadastro");

        modelBuilder.Entity<Tipo>().HasKey(t => t.Id);
        modelBuilder.Entity<Tipo>().Property(t => t.Id).HasColumnName("tipo_id");
        modelBuilder.Entity<Tipo>().Property(t => t.Nome).HasColumnName("tipo_nm");
        modelBuilder.Entity<Tipo>().Property(t => t.Codigo).HasColumnName("tipo_cd");
        modelBuilder.Entity<Tipo>().Property(t => t.Descricao).HasColumnName("tipo_ds");

        modelBuilder.Entity<Fornecedor>().HasKey(f => f.Id);
        modelBuilder.Entity<Fornecedor>().Property(f => f.Id).HasColumnName("frn_id");
        modelBuilder.Entity<Fornecedor>().Property(f => f.Nome).HasColumnName("frn_nm");
        modelBuilder.Entity<Fornecedor>().Property(f => f.Cnpj).HasColumnName("frn_nr_cnpj");
        modelBuilder.Entity<Fornecedor>().Property(f => f.Contato).HasColumnName("frn_nm_contato");
        modelBuilder.Entity<Fornecedor>().Property(f => f.Telefone).HasColumnName("frn_nr_telefone");
        modelBuilder.Entity<Fornecedor>().Property(f => f.Email).HasColumnName("frn_ds_email");
        modelBuilder.Entity<Fornecedor>().Property(f => f.Endereco).HasColumnName("frn_ds_ender");

        modelBuilder.Entity<Pedido>().HasKey(p => p.Id);
        modelBuilder.Entity<Pedido>().Property(p => p.Id).HasColumnName("ped_id");
        modelBuilder.Entity<Pedido>().Property(p => p.Cliente).HasColumnName("ped_nm_cliente");
        modelBuilder.Entity<Pedido>().Property(p => p.Data).HasColumnName("ped_dh_pedido");
        modelBuilder.Entity<Pedido>().Property(p => p.ValorTotal).HasColumnName("ped_vl_total");
        modelBuilder.Entity<Pedido>().Property(p => p.Status).HasColumnName("ped_st_pedido");

        modelBuilder.Entity<MovimentacaoEstoque>().HasKey(m => m.Id);
        modelBuilder.Entity<MovimentacaoEstoque>().Property(m => m.Id).HasColumnName("mov_id");
        modelBuilder.Entity<MovimentacaoEstoque>().Property(m => m.ProdutoVariacaoId).HasColumnName("var_id");
        modelBuilder.Entity<MovimentacaoEstoque>().Property(m => m.Quantidade).HasColumnName("mov_nr_quantidade");
        modelBuilder.Entity<MovimentacaoEstoque>().Property(m => m.Tipo).HasColumnName("mov_tp_tipo");
        modelBuilder.Entity<MovimentacaoEstoque>().Property(m => m.Data).HasColumnName("mov_dh_data");
        modelBuilder.Entity<MovimentacaoEstoque>().Property(m => m.Observacao).HasColumnName("mov_ds_observacao");

        modelBuilder.Entity<PedidoItem>().ToTable("tbpedido_item");
        modelBuilder.Entity<PedidoItem>().HasKey(i => i.Id);
        modelBuilder.Entity<PedidoItem>().Property(i => i.Id).HasColumnName("item_id");
        modelBuilder.Entity<PedidoItem>().Property(i => i.PedidoId).HasColumnName("ped_id");
        modelBuilder.Entity<PedidoItem>().Property(i => i.ProdutoId).HasColumnName("prod_id");
        modelBuilder.Entity<PedidoItem>().Property(i => i.ProdutoNome).HasColumnName("item_nm_produto");
        modelBuilder.Entity<PedidoItem>().Property(i => i.Quantidade).HasColumnName("item_nr_quantidade");
        modelBuilder.Entity<PedidoItem>().Property(i => i.ValorUnitario).HasColumnName("item_vl_unitario");
    }
}
