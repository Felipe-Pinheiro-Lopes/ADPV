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

        [HttpGet("listar")]
        [Authorize]
        public async Task<IActionResult> Listar()
        {
            // O .Include traz as variações junto com o produto (Eager Loading)
            var produtos = await _context.Produtos
                .Include(p => p.Variacoes)
                .ToListAsync();

            return Ok(produtos);
        }
    }
}