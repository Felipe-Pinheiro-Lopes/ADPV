using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;

namespace API.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context) { _context = context; }

        [HttpGet("resumo")]
        public async Task<IActionResult> GetResumo() {
            // Usa 'Produtos' e 'ProdutoVariacoes' conforme seu AppDbContext.cs
            var total = await _context.Produtos.CountAsync();
            
            // Soma o patrimônio usando a tabela correta: ProdutoVariacoes
            var patrimonioCusto = await _context.ProdutoVariacoes.SumAsync(v => (decimal?)v.ValorCompra * v.Quantidade) ?? 0;
            var previsaoVenda = await _context.ProdutoVariacoes.SumAsync(v => (decimal?)v.ValorVenda * v.Quantidade) ?? 0;
            
            var critico = await _context.ProdutoVariacoes.CountAsync(v => v.Quantidade < 10);

            var porCategoria = await _context.Produtos
                .Include(p => p.Tipo)
                .GroupBy(p => p.Tipo.Nome)
                .Select(g => new { name = g.Key, value = g.Count() }).ToListAsync();

            return Ok(new {
                totalProdutos = total,
                estoqueCritico = critico,
                patrimonio = patrimonioCusto,
                previsao = previsaoVenda,
                porCategoria = porCategoria,
                porFornecedor = new List<object>(), // Mock por enquanto
                movimentacao = new List<object>()   // Mock por enquanto
            });
        }
    }
}