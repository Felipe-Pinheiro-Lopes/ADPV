using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context) { _context = context; }

        [HttpGet("resumo")]
        public async Task<IActionResult> GetResumo()
        {
            var total = await _context.Produtos.CountAsync();
            
            var patrimonioCusto = await _context.ProdutoVariacoes.SumAsync(v => (decimal?)v.ValorCompra * v.Quantidade) ?? 0;
            var previsaoVenda = await _context.ProdutoVariacoes.SumAsync(v => (decimal?)v.ValorVenda * v.Quantidade) ?? 0;
            
            var estoqueBaixo = await _context.ProdutoVariacoes.CountAsync(v => v.Quantidade < 10);

            var pedidosPendentes = await _context.Pedidos.CountAsync(p => p.Status == "Pendente");

            var porCategoria = await _context.Produtos
                .Include(p => p.Tipo)
                .Where(p => p.Tipo != null)
                .GroupBy(p => p.Tipo.Nome)
                .Select(g => new { name = g.Key, value = g.Count() }).ToListAsync();

            var porFornecedor = await _context.Produtos
                .Include(p => p.Fornecedor)
                .Where(p => p.Fornecedor != null)
                .GroupBy(p => p.Fornecedor.Nome)
                .Select(g => new { name = g.Key, value = g.Count() }).ToListAsync();

            // Movimentações da semana atual (segunda a domingo)
            var hoje = DateTime.UtcNow.Date;
            int daysSinceMonday = (int)hoje.DayOfWeek - 1;
            if (hoje.DayOfWeek == DayOfWeek.Sunday) daysSinceMonday = 6;
            var segunda = hoje.AddDays(-daysSinceMonday);

            var labels = new[] { "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom" };

            var movimentacoesBD = await _context.MovimentacoesEstoque
                .Where(m => m.Data >= segunda && m.Data < segunda.AddDays(7))
                .ToListAsync();

            var movimentacao = new List<object>();
            for (int i = 0; i < 7; i++)
            {
                var data = segunda.AddDays(i);
                var entradas = movimentacoesBD.Where(m => m.Tipo == "Entrada" && m.Data.Date == data).Sum(m => (int?)m.Quantidade) ?? 0;
                var saidas = movimentacoesBD.Where(m => m.Tipo == "Saida" && m.Data.Date == data).Sum(m => (int?)m.Quantidade) ?? 0;
                movimentacao.Add(new { name = labels[i], entradas, saidas });
            }

            var atividadesRecentes = await _context.Pedidos
                .OrderByDescending(p => p.Data)
                .Take(10)
                .Select(p => new
                {
                    id = p.Id,
                    item = p.Cliente,
                    type = "Saída",
                    qty = 1,
                    status = p.Status == "Pendente" ? "Pendente" : "Concluído",
                    date = p.Data.ToString("dd/MM/yyyy HH:mm")
                }).ToListAsync();

            return Ok(new
            {
                totalProdutos = total,
                estoqueBaixo = estoqueBaixo,
                pedidosPendentes = pedidosPendentes,
                patrimonio = patrimonioCusto,
                previsao = previsaoVenda,
                categorias = porCategoria,
                porFornecedor = porFornecedor,
                movimentacoes = movimentacao,
                atividadesRecentes = atividadesRecentes
            });
        }
    }
}
