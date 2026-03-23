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
                // 1. Criar o objeto principal do Produto
                var novoProduto = new Produto
                {
                    Nome = dto.Nome,
                    FornecedorId = dto.FornecedorId,
                    TipoId = dto.TipoId
                };

                _context.Produtos.Add(novoProduto);
                await _context.SaveChangesAsync(); // Salva para gerar o ID do produto

                // 2. Criar as variações vinculadas ao ID gerado
                foreach (var v in dto.Variacoes)
                {
                    var variacao = new ProdutoVariacao
                    {
                        ProdutoId = novoProduto.Id, // Vínculo crucial
                        Tamanho = v.Tamanho,
                        ValorCompra = v.ValorCompra,
                        ValorVenda = v.ValorVenda,
                        Quantidade = v.Quantidade
                    };
                    _context.ProdutoVariacoes.Add(variacao);
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] ProdutoCreateDto dto)
        {
            try
            {
                // 1. Busca o produto incluindo as variações atuais
                var produtoExistente = await _context.Produtos
                    .Include(p => p.Variacoes)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (produtoExistente == null)
                    return NotFound(new { message = "Produto não encontrado." });

                // 2. Atualiza dados básicos do Produto
                produtoExistente.Nome = dto.Nome;
                produtoExistente.FornecedorId = dto.FornecedorId;
                produtoExistente.TipoId = dto.TipoId;

                // 3. Sincroniza as Variações: Remove as antigas do banco
                _context.ProdutoVariacoes.RemoveRange(produtoExistente.Variacoes);

                // 4. Adiciona a nova grade enviada pelo Front-end
                foreach (var v in dto.Variacoes)
                {
                    var novaVariacao = new ProdutoVariacao
                    {
                        ProdutoId = id,
                        Tamanho = v.Tamanho,
                        ValorCompra = v.ValorCompra,
                        ValorVenda = v.ValorVenda,
                        Quantidade = v.Quantidade
                    };
                    _context.ProdutoVariacoes.Add(novaVariacao);
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

                // Remove as variações primeiro (caso o Cascade Delete não esteja no banco)
                _context.ProdutoVariacoes.RemoveRange(produto.Variacoes);
                
                // Remove o produto
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
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await _context.Produtos
                .Include(p => p.Variacoes)
                .Include(p => p.Tipo) 
                .ToListAsync();
        } //
    }
}
