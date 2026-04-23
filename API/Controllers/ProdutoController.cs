using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Data;
using API.Models;
using API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("cadastrar")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Cadastrar([FromBody] ProdutoCreateDto dto)
        {
            try 
            {
                var novoProduto = new Produto
                {
                    Nome = dto.Nome,
                    FornecedorId = dto.FornecedorId,
                    TipoId = dto.TipoId,
                    DataCadastro = DateTime.UtcNow
                };

                _context.Produtos.Add(novoProduto);
                await _context.SaveChangesAsync();

                foreach (var v in dto.Variacoes)
                {
                    var variacao = new ProdutoVariacao
                    {
                        ProdutoId = novoProduto.Id,
                        Tamanho = v.Tamanho,
                        ValorCompra = v.ValorCompra,
                        ValorVenda = v.ValorVenda,
                        Quantidade = v.Quantidade,
                        DataCadastro = DateTime.UtcNow
                    };
                    _context.ProdutoVariacoes.Add(variacao);
                    await _context.SaveChangesAsync();

                    // Registrar entrada no estoque
                    var movimentacao = new MovimentacaoEstoque
                    {
                        ProdutoVariacaoId = variacao.Id,
                        Quantidade = v.Quantidade,
                        Tipo = "Entrada",
                        Data = DateTime.UtcNow,
                        Observacao = $"Cadastro do produto {novoProduto.Nome}"
                    };
                    _context.MovimentacoesEstoque.Add(movimentacao);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Produto e variações cadastrados com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao cadastrar: " + ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] ProdutoCreateDto dto)
        {
            try
            {
                var produtoExistente = await _context.Produtos
                    .Include(p => p.Variacoes)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (produtoExistente == null)
                    return NotFound(new { message = "Produto não encontrado." });

                produtoExistente.Nome = dto.Nome;
                produtoExistente.FornecedorId = dto.FornecedorId;
                produtoExistente.TipoId = dto.TipoId;

                // Remove apenas variações que não estão em pedidos
                var variacoesEmUso = await _context.PedidoItems
                    .Where(p => p.TamanhoId.HasValue)
                    .Select(p => p.TamanhoId)
                    .ToListAsync();

                var variacoesParaRemover = produtoExistente.Variacoes
                    .Where(v => !variacoesEmUso.Contains(v.Id))
                    .ToList();
                
                _context.ProdutoVariacoes.RemoveRange(variacoesParaRemover);

                foreach (var v in dto.Variacoes)
                {
                    var variacao = new ProdutoVariacao
                    {
                        ProdutoId = id,
                        Tamanho = v.Tamanho,
                        ValorCompra = v.ValorCompra,
                        ValorVenda = v.ValorVenda,
                        Quantidade = v.Quantidade,
                        DataCadastro = DateTime.UtcNow
                    };
                    _context.ProdutoVariacoes.Add(variacao);
                    await _context.SaveChangesAsync();

                    var movimentacao = new MovimentacaoEstoque
                    {
                        ProdutoVariacaoId = variacao.Id,
                        Quantidade = v.Quantidade,
                        Tipo = "Entrada",
                        Data = DateTime.UtcNow,
                        Observacao = $"Atualização do produto {produtoExistente.Nome}"
                    };
                    _context.MovimentacoesEstoque.Add(movimentacao);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Produto e grade de variações atualizados com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao atualizar: " + ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Remover(int id)
        {
            try
            {
                var produto = await _context.Produtos
                    .Include(p => p.Variacoes)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (produto == null)
                    return NotFound(new { message = "Produto não encontrado." });

                _context.ProdutoVariacoes.RemoveRange(produto.Variacoes);
                _context.Produtos.Remove(produto);

                await _context.SaveChangesAsync();
                return Ok(new { message = "Produto removido com sucesso!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao excluir: " + ex.Message });
            }
        }

        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<ProdutoListDto>>> GetProdutos()
        {
            var produtos = await _context.Produtos
                .Include(p => p.Variacoes)
                .Include(p => p.Tipo) 
                .Include(p => p.Fornecedor)
                .Select(p => new ProdutoListDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    FornecedorId = p.FornecedorId,
                    TipoId = p.TipoId,
                    TipoNome = p.Tipo != null ? p.Tipo.Nome : null,
                    FornecedorNome = p.Fornecedor != null ? p.Fornecedor.Nome : null,
                    Variacoes = p.Variacoes.Select(v => new VariacaoListDto
                    {
                        Id = v.Id,
                        ProdutoId = v.ProdutoId,
                        Tamanho = v.Tamanho,
                        ValorCompra = v.ValorCompra,
                        ValorVenda = v.ValorVenda,
                        Quantidade = v.Quantidade
                    }).ToList()
                })
                .ToListAsync();

            return Ok(produtos);
        }
    }
}
