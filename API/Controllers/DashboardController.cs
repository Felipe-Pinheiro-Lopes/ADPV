using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using ClosedXML.Excel;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context) { _context = context; }

        [HttpGet("resumo")]
        public async Task<IActionResult> GetResumo([FromQuery] DateTime? dataInicio = null, [FromQuery] DateTime? dataFim = null)
        {
            // Define período padrão (últimos 7 dias) se não informado
            var hoje = DateTime.UtcNow.Date;
            DateTime inicio;
            DateTime fim;

            if (dataInicio.HasValue && dataFim.HasValue)
            {
                inicio = dataInicio.Value.Date;
                fim = dataFim.Value.Date.AddDays(1); // Inclui o dia final
            }
            else
            {
                // Padrão: últimos 7 dias
                int daysSinceMonday = (int)hoje.DayOfWeek - 1;
                if (hoje.DayOfWeek == DayOfWeek.Sunday) daysSinceMonday = 6;
                inicio = hoje.AddDays(-daysSinceMonday); // Segunda da semana atual
                fim = inicio.AddDays(7); // Próxima segunda
            }

            // Consultas básicas (não afetadas por período)
            var total = await _context.Produtos.CountAsync();
            var estoqueBaixo = await _context.ProdutoVariacoes.CountAsync(v => v.Quantidade < 10);
            var pedidosPendentes = await _context.Pedidos.CountAsync(p => p.Status == "Pendente");
            var patrimonioCusto = await _context.ProdutoVariacoes.SumAsync(v => (decimal?)v.ValorCompra * v.Quantidade) ?? 0;
            var previsaoVenda = await _context.ProdutoVariacoes.SumAsync(v => (decimal?)v.ValorVenda * v.Quantidade) ?? 0;

            // Categorias e fornecedores (não afetados por período)
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

            // Movimentações no período selecionado
            var movimentacoesBD = await _context.MovimentacoesEstoque
                .Where(m => m.Data >= inicio && m.Data < fim)
                .ToListAsync();

            var labels = new[] { "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom" };
            var diasPeriodo = (fim - inicio).Days;
            var movimentacao = new List<object>();

            // Se o período for maior que 7 dias, divide em intervalos de 7 dias
            if (diasPeriodo > 7)
            {
                // Para períodos longos, agrupa por semana
                int semanas = (int)Math.Ceiling(diasPeriodo / 7.0);
                for (int i = 0; i < semanas; i++)
                {
                    var semanaInicio = inicio.AddDays(i * 7);
                    var semanaFim = semanaInicio.AddDays(7);
                    var entradas = movimentacoesBD.Where(m => m.Tipo == "Entrada" && m.Data >= semanaInicio && m.Data < semanaFim).Sum(m => (int?)m.Quantidade) ?? 0;
                    var saidas = movimentacoesBD.Where(m => m.Tipo == "Saida" && m.Data >= semanaInicio && m.Data < semanaFim).Sum(m => (int?)m.Quantidade) ?? 0;
                    movimentacao.Add(new { name = $"Sem {i + 1}", entradas, saidas });
                }
            }
            else
            {
                // Para períodos de até 7 dias, mostra por dia da semana
                for (int i = 0; i < 7; i++)
                {
                    var data = inicio.AddDays(i);
                    if (data >= fim) break;
                    var entradas = movimentacoesBD.Where(m => m.Tipo == "Entrada" && m.Data.Date == data).Sum(m => (int?)m.Quantidade) ?? 0;
                    var saidas = movimentacoesBD.Where(m => m.Tipo == "Saida" && m.Data.Date == data).Sum(m => (int?)m.Quantidade) ?? 0;
                    movimentacao.Add(new { name = labels[i], entradas, saidas });
                }
            }

            // Atividades recentes no período
            var atividadesRecentes = await _context.Pedidos
                .Where(p => p.Data >= inicio && p.Data < fim)
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

        // GET: api/Dashboard/exportar/estoque?formato=csv|xlsx
        [HttpGet("exportar/estoque")]
        public async Task<IActionResult> ExportarEstoque([FromQuery] string formato = "xlsx")
        {
            try
            {
                var produtos = await _context.Produtos
                    .Include(p => p.Variacoes)
                    .Include(p => p.Tipo)
                    .Include(p => p.Fornecedor)
                    .ToListAsync();

                if (formato?.ToLower() == "csv")
                {
                    var csv = new System.Text.StringBuilder();
                    csv.AppendLine("ID,Produto,Categoria,Fornecedor,Quantidade Total,Valor Compra Total,Valor Venda Total");

                    foreach (var p in produtos)
                    {
                        var qtdTotal = p.Variacoes.Sum(v => v.Quantidade);
                        var valorCompraTotal = p.Variacoes.Sum(v => v.ValorCompra * v.Quantidade);
                        var valorVendaTotal = p.Variacoes.Sum(v => v.ValorVenda * v.Quantidade);
                        
                        csv.AppendLine($"{p.Id},{p.Nome},{p.Tipo?.Nome ?? "N/A"},{p.Fornecedor?.Nome ?? "N/A"},{qtdTotal},{valorCompraTotal.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)},{valorVendaTotal.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)}");
                    }

                    var byteArray = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
                    return File(byteArray, "text/csv", $"relatorio_estoque_{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else
                {
                    // Excel (XLSX) - ClosedXML
                    using (var workbook = new XLWorkbook())
                    {
                        var worksheet = workbook.Worksheets.Add("Estoque");

                        // Cabeçalhos
                        worksheet.Cell(1, 1).Value = "ID";
                        worksheet.Cell(1, 2).Value = "Produto";
                        worksheet.Cell(1, 3).Value = "Categoria";
                        worksheet.Cell(1, 4).Value = "Fornecedor";
                        worksheet.Cell(1, 5).Value = "Quantidade Total";
                        worksheet.Cell(1, 6).Value = "Valor Compra Total";
                        worksheet.Cell(1, 7).Value = "Valor Venda Total";

                        // Estilo do cabeçalho
                        var headerRange = worksheet.Range("A1:G1");
                        headerRange.Style.Font.Bold = true;
                        headerRange.Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent1);
                        headerRange.Style.Font.FontColor = XLColor.White;

                        int row = 2;
                        foreach (var p in produtos)
                        {
                            var qtdTotal = p.Variacoes.Sum(v => v.Quantidade);
                            var valorCompraTotal = p.Variacoes.Sum(v => v.ValorCompra * v.Quantidade);
                            var valorVendaTotal = p.Variacoes.Sum(v => v.ValorVenda * v.Quantidade);

                            worksheet.Cell(row, 1).Value = p.Id;
                            worksheet.Cell(row, 2).Value = p.Nome;
                            worksheet.Cell(row, 3).Value = p.Tipo?.Nome ?? "N/A";
                            worksheet.Cell(row, 4).Value = p.Fornecedor?.Nome ?? "N/A";
                            worksheet.Cell(row, 5).Value = qtdTotal;
                            worksheet.Cell(row, 6).Value = valorCompraTotal;
                            worksheet.Cell(row, 7).Value = valorVendaTotal;
                            row++;
                        }

                        // Formatação numérica
                        worksheet.Column(6).Style.NumberFormat.Format = "#,##0.00";
                        worksheet.Column(7).Style.NumberFormat.Format = "#,##0.00";

                        // Autoajustar colunas
                        worksheet.Columns().AdjustToContents();

                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"relatorio_estoque_{DateTime.UtcNow:yyyyMMdd}.xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao gerar relatório: " + ex.Message });
            }
        }

        // GET: api/Dashboard/exportar/vendas?formato=csv|xlsx
        [HttpGet("exportar/vendas")]
        public async Task<IActionResult> ExportarVendas([FromQuery] string formato = "xlsx")
        {
            try
            {
                var pedidos = await _context.Pedidos
                    .OrderByDescending(p => p.Data)
                    .Select(p => new
                    {
                        p.Id,
                        p.Cliente,
                        Data = p.Data.ToString("yyyy-MM-dd"),
                        p.ValorTotal,
                        p.Status
                    })
                    .ToListAsync();

                if (formato?.ToLower() == "csv")
                {
                    var csv = new System.Text.StringBuilder();
                    csv.AppendLine("ID,Cliente,Data,Valor Total,Status");

                    foreach (var p in pedidos)
                    {
                        csv.AppendLine($"{p.Id},{p.Cliente},{p.Data},{p.ValorTotal.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)},{p.Status}");
                    }

                    var byteArray = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
                    return File(byteArray, "text/csv", $"relatorio_vendas_{DateTime.UtcNow:yyyyMMdd}.csv");
                }
                else
                {
                    // Excel (XLSX) - ClosedXML
                    using (var workbook = new XLWorkbook())
                    {
                        var worksheet = workbook.Worksheets.Add("Vendas");

                        // Cabeçalhos
                        worksheet.Cell(1, 1).Value = "ID";
                        worksheet.Cell(1, 2).Value = "Cliente";
                        worksheet.Cell(1, 3).Value = "Data";
                        worksheet.Cell(1, 4).Value = "Valor Total";
                        worksheet.Cell(1, 5).Value = "Status";

                        // Estilo do cabeçalho
                        var headerRange = worksheet.Range("A1:E1");
                        headerRange.Style.Font.Bold = true;
                        headerRange.Style.Fill.BackgroundColor = XLColor.FromTheme(XLThemeColor.Accent2);
                        headerRange.Style.Font.FontColor = XLColor.White;

                        int row = 2;
                        foreach (var p in pedidos)
                        {
                            worksheet.Cell(row, 1).Value = p.Id;
                            worksheet.Cell(row, 2).Value = p.Cliente;
                            worksheet.Cell(row, 3).Value = p.Data;
                            worksheet.Cell(row, 4).Value = p.ValorTotal;
                            worksheet.Cell(row, 5).Value = p.Status;
                            row++;
                        }

                        // Formatação numérica
                        worksheet.Column(4).Style.NumberFormat.Format = "#,##0.00";

                        // Autoajustar colunas
                        worksheet.Columns().AdjustToContents();

                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();
                            return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"relatorio_vendas_{DateTime.UtcNow:yyyyMMdd}.xlsx");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao gerar relatório: " + ex.Message });
            }
        }

        // GET: api/Dashboard/produtos-mais-vendidos
        [HttpGet("produtos-mais-vendidos")]
        public async Task<IActionResult> GetProdutosMaisVendidos([FromQuery] int limite = 10)
        {
            try
            {
                var produtosMaisVendidos = await _context.PedidoItems
                    .GroupBy(pi => new { pi.ProdutoId, pi.ProdutoNome })
                    .Select(g => new
                    {
                        ProdutoId = g.Key.ProdutoId,
                        ProdutoNome = g.Key.ProdutoNome,
                        QuantidadeVendida = g.Sum(pi => pi.Quantidade),
                        ValorTotal = g.Sum(pi => pi.Quantidade * pi.ValorUnitario)
                    })
                    .OrderByDescending(p => p.QuantidadeVendida)
                    .Take(limite)
                    .ToListAsync();

                return Ok(produtosMaisVendidos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao buscar produtos mais vendidos: " + ex.Message });
            }
        }
    }
}
