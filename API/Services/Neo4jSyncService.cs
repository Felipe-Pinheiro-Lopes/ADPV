using Neo4j.Driver;
using API.Data;
using API.Models;
using Microsoft.Extensions.Configuration;

namespace API.Services;

public interface INeo4jSyncService
{
    Task SyncAllData();
    Task CreateFornecedorNode(Fornecedor fornecedor);
    Task CreateProdutoNode(Produto produto);
    Task CreateTipoNode(Tipo tipo);
    Task CreatePedidoNode(Pedido pedido);
    Task CreateProdutoVariacaoNode(ProdutoVariacao variacao);
    Task CreateUserNode(User user);
    Task CreateRelationships();
}

public class Neo4jSyncService : INeo4jSyncService
{
    private readonly IDriver _driver;
    private readonly AppDbContext _context;
    
    public Neo4jSyncService(INeo4jService neo4jService, AppDbContext context)
    {
        _driver = neo4jService.Driver;
        _context = context;
    }
    
    public async Task SyncAllData()
    {
        // Limpar dados existentes
        await ClearAllData();
        
        // Criar nós
        var fornecedores = _context.Fornecedores.ToList();
        foreach (var f in fornecedores)
            await CreateFornecedorNode(f);
            
        var tipos = _context.Tipos.ToList();
        foreach (var t in tipos)
            await CreateTipoNode(t);
            
        var produtos = _context.Produtos.ToList();
        foreach (var p in produtos)
            await CreateProdutoNode(p);
            
        var variacoes = _context.ProdutoVariacoes.ToList();
        foreach (var v in variacoes)
            await CreateProdutoVariacaoNode(v);
            
        var pedidos = _context.Pedidos.ToList();
        foreach (var p in pedidos)
            await CreatePedidoNode(p);
            
        var users = _context.Users.ToList();
        foreach (var u in users)
            await CreateUserNode(u);
            
        // Criar relacionamentos
        await CreateRelationships();
    }
    
    public async Task CreateFornecedorNode(Fornecedor fornecedor)
    {
        var query = @"
            CREATE (f:Fornecedor {
                id: $id,
                nome: $nome,
                cnpj: $cnpj,
                contato: $contato,
                telefone: $telefone,
                email: $email,
                endereco: $endereco
            })";
            
        await ExecuteWrite(query, new
        {
            id = fornecedor.Id,
            nome = fornecedor.Nome,
            cnpj = fornecedor.Cnpj,
            contato = fornecedor.Contato,
            telefone = fornecedor.Telefone,
            email = fornecedor.Email,
            endereco = fornecedor.Endereco
        });
    }
    
    public async Task CreateProdutoNode(Produto produto)
    {
        var query = @"
            CREATE (p:Produto {
                id: $id,
                nome: $nome,
                fornecedorId: $fornecedorId,
                tipoId: $tipoId,
                dataCadastro: $dataCadastro
            })";
            
        await ExecuteWrite(query, new
        {
            id = produto.Id,
            nome = produto.Nome,
            fornecedorId = produto.FornecedorId,
            tipoId = produto.TipoId,
            dataCadastro = produto.DataCadastro.ToString("o")
        });
    }
    
    public async Task CreateTipoNode(Tipo tipo)
    {
        var query = @"
            CREATE (t:Tipo {
                id: $id,
                nome: $nome,
                codigo: $codigo,
                descricao: $descricao
            })";
            
        await ExecuteWrite(query, new
        {
            id = tipo.Id,
            nome = tipo.Nome,
            codigo = tipo.Codigo,
            descricao = tipo.Descricao
        });
    }
    
    public async Task CreatePedidoNode(Pedido pedido)
    {
        var query = @"
            CREATE (p:Pedido {
                id: $id,
                cliente: $cliente,
                data: $data,
                valorTotal: $valorTotal,
                status: $status
            })";
            
        await ExecuteWrite(query, new
        {
            id = pedido.Id,
            cliente = pedido.Cliente,
            data = pedido.Data.ToString("o"),
            valorTotal = pedido.ValorTotal,
            status = pedido.Status
        });
    }
    
    public async Task CreateProdutoVariacaoNode(ProdutoVariacao variacao)
    {
        var query = @"
            CREATE (v:ProdutoVariacao {
                id: $id,
                produtoId: $produtoId,
                tamanho: $tamanho,
                valorCompra: $valorCompra,
                valorVenda: $valorVenda,
                quantidade: $quantidade,
                dataCadastro: $dataCadastro
            })";
            
        await ExecuteWrite(query, new
        {
            id = variacao.Id,
            produtoId = variacao.ProdutoId,
            tamanho = variacao.Tamanho,
            valorCompra = variacao.ValorCompra,
            valorVenda = variacao.ValorVenda,
            quantidade = variacao.Quantidade,
            dataCadastro = variacao.DataCadastro.ToString("o")
        });
    }
    
    public async Task CreateUserNode(User user)
    {
        var query = @"
            CREATE (u:User {
                id: $id,
                nome: $nome,
                email: $email,
                dataNasc: $dataNasc,
                telefone: $telefone,
                role: $role
            })";
            
        await ExecuteWrite(query, new
        {
            id = user.Id,
            nome = user.Nome,
            email = user.Email,
            dataNasc = user.Data_Nasc.ToString("o"),
            telefone = user.Telefone,
            role = user.Role
        });
    }
    
    public async Task CreateRelationships()
    {
        // Produto -> Fornecedor
        var query1 = @"
            MATCH (p:Produto), (f:Fornecedor)
            WHERE p.fornecedorId = f.id
            CREATE (p)-[:FORNECIDO_POR]->(f)";
        await ExecuteWrite(query1);
        
        // Produto -> Tipo
        var query2 = @"
            MATCH (p:Produto), (t:Tipo)
            WHERE p.tipoId = t.id
            CREATE (p)-[:DO_TIPO]->(t)";
        await ExecuteWrite(query2);
        
        // Produto -> ProdutoVariacao
        var query3 = @"
            MATCH (p:Produto), (v:ProdutoVariacao)
            WHERE v.produtoId = p.id
            CREATE (p)-[:TEM_VARIACAO]->(v)";
        await ExecuteWrite(query3);
    }
    
    private async Task ClearAllData()
    {
        var query = "MATCH (n) DETACH DELETE n";
        await ExecuteWrite(query);
    }
    
    private async Task ExecuteWrite(string query, object parameters = null)
    {
        await using var session = _driver.AsyncSession();
        await session.RunAsync(query, parameters);
    }
}
