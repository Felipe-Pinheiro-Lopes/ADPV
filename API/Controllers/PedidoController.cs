using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PedidoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Pedido
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoListDto>>> GetPedidos()
        {
            var pedidos = await _context.Pedidos
                .OrderByDescending(p => p.Data)
                .Select(p => new PedidoListDto
                {
                    Id = p.Id,
                    Cliente = p.Cliente,
                    Data = p.Data,
                    ValorTotal = p.ValorTotal,
                    Status = p.Status
                })
                .ToListAsync();

            return Ok(pedidos);
        }

        // GET: api/Pedido/{id}/itens
        [HttpGet("{id}/itens")]
        public async Task<ActionResult> GetItensPedido(int id)
        {
            var itens = await _context.PedidoItems
                .Where(i => i.PedidoId == id)
                .Select(i => new {
                    ProdutoId = i.ProdutoId,
                    ProdutoNome = i.ProdutoNome,
                    Quantidade = i.Quantidade,
                    ValorUnitario = i.ValorUnitario
                })
                .ToListAsync();

            return Ok(itens);
        }

        // POST: api/Pedido
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(PedidoCreateDto pedidoDto)
        {
            try
            {
                // Valida itens primeiro ANTES de criar qualquer coisa no banco
                if (pedidoDto.Itens == null || !pedidoDto.Itens.Any())
                {
                    return BadRequest(new { message = "O pedido deve ter pelo menos um item." });
                }

                // Verifica se há produto duplicado no mesmo pedido
                var produtoIds = pedidoDto.Itens.Select(i => i.ProdutoId).ToList();
                var duplicates = produtoIds.GroupBy(x => x).Where(g => g.Count() > 1).Select(g => g.Key).ToList();
                if (duplicates.Any())
                {
                    return BadRequest(new { message = $"Produto(s) ID(s) {string.Join(", ", duplicates)} está(ão) duplicado(s) no pedido. Remova as duplicatas." });
                }

                // Verifica TODAS as quantidades disponíveis ANTES de criar o pedido
                foreach (var item in pedidoDto.Itens)
                {
                    var variacao = await _context.ProdutoVariacoes
                        .FirstOrDefaultAsync(v => v.ProdutoId == item.ProdutoId);

                    if (variacao == null)
                    {
                        return BadRequest(new { message = $"Produto ID {item.ProdutoId} não encontrado." });
                    }

                    if (variacao.Quantidade < item.Quantidade)
                    {
                        return BadRequest(new { 
                            message = $"Estoque insuficiente para '{variacao.Produto?.Nome ?? "Produto " + item.ProdutoId}'. Disponível: {variacao.Quantidade}, solicitado: {item.Quantidade}" 
                        });
                    }
                }

                // Só agora cria o pedido, pois todas as validações passaram
                var pedido = new Pedido
                {
                    Cliente = pedidoDto.Cliente,
                    ValorTotal = pedidoDto.ValorTotal,
                    Data = DateTime.UtcNow,
                    Status = "Pendente"
                };

                _context.Pedidos.Add(pedido);
                await _context.SaveChangesAsync();

                // Processa os itens
                foreach (var item in pedidoDto.Itens)
                {
                    var variacao = await _context.ProdutoVariacoes
                        .FirstOrDefaultAsync(v => v.ProdutoId == item.ProdutoId);

                    var produtoNome = variacao.Produto?.Nome ?? $"Produto {item.ProdutoId}";
                    variacao.Quantidade -= item.Quantidade;

                    var pedidoItem = new PedidoItem
                    {
                        PedidoId = pedido.Id,
                        ProdutoId = item.ProdutoId,
                        ProdutoNome = produtoNome,
                        Quantidade = item.Quantidade,
                        ValorUnitario = item.ValorUnitario
                    };
                    _context.PedidoItems.Add(pedidoItem);

                    var movimentacao = new MovimentacaoEstoque
                    {
                        ProdutoVariacaoId = variacao.Id,
                        Quantidade = item.Quantidade,
                        Tipo = "Saida",
                        Data = DateTime.UtcNow,
                        Observacao = $"Pedido #{pedido.Id}"
                    };
                    _context.MovimentacoesEstoque.Add(movimentacao);
                }
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPedidos), new { id = pedido.Id }, pedido);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao criar pedido: " + ex.Message });
            }
        }

        // PUT: api/Pedido/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Pedido>> PutPedido(int id, PedidoCreateDto pedidoDto)
        {
            try
            {
                var pedido = await _context.Pedidos.FindAsync(id);
                if (pedido == null)
                    return NotFound(new { message = "Pedido não encontrado." });

                var statusAnterior = pedido.Status;
                var novoStatus = pedidoDto.Status ?? pedido.Status;

                // Se o pedido for cancelado, restaurar todo o estoque APENAS se tiver itens salvos
                if (statusAnterior != "Cancelado" && novoStatus == "Cancelado")
                {
                    var itens = await _context.PedidoItems
                        .Where(i => i.PedidoId == id)
                        .ToListAsync();

                    // Só restaura se tiver itens salvos (ou seja, o pedido teve saída de estoque)
                    if (itens.Any())
                    {
                        foreach (var item in itens)
                        {
                            var variacao = await _context.ProdutoVariacoes
                                .FirstOrDefaultAsync(v => v.ProdutoId == item.ProdutoId);

                            if (variacao != null)
                            {
                                variacao.Quantidade += item.Quantidade;

                                var movimentacao = new MovimentacaoEstoque
                                {
                                    ProdutoVariacaoId = variacao.Id,
                                    Quantidade = item.Quantidade,
                                    Tipo = "Entrada",
                                    Data = DateTime.UtcNow,
                                    Observacao = $"Cancelamento do Pedido #{pedido.Id}"
                                };
                                _context.MovimentacoesEstoque.Add(movimentacao);
                            }
                        }
                        await _context.SaveChangesAsync();
                    }
                }
                // Se status for diferente de Cancelado e não é novo Cancelamento, ajusta o estoque
                else if (novoStatus != "Cancelado")
                {
                    // Busca itens existentes do banco
                    var itensAntigos = await _context.PedidoItems
                        .Where(i => i.PedidoId == id)
                        .ToDictionaryAsync(i => i.ProdutoId, i => i.Quantidade);

                    // Se há novos itens no PUT, processa
                    if (pedidoDto.Itens != null && pedidoDto.Itens.Any())
                    {
                        foreach (var item in pedidoDto.Itens)
                        {
                            var variacao = await _context.ProdutoVariacoes
                                .FirstOrDefaultAsync(v => v.ProdutoId == item.ProdutoId);

                            if (variacao == null)
                            {
                                return BadRequest(new { message = $"Produto ID {item.ProdutoId} não encontrado." });
                            }

                            // Calcula diferença
                            var qtdAntiga = itensAntigos.ContainsKey(item.ProdutoId) ? itensAntigos[item.ProdutoId] : 0;
                            var diferenca = item.Quantidade - qtdAntiga;

                            if (diferenca > 0)
                            {
                                // Aumentou a quantidade - precisa diminutionar do estoque
                                if (variacao.Quantidade < diferenca)
                                {
                                    return BadRequest(new { 
                                        message = $"Estoque insuficiente para '{variacao.Produto?.Nome}'. Disponível: {variacao.Quantidade}, necessário: {diferenca}" 
                                    });
                                }
                                variacao.Quantidade -= diferenca;

                                var movimentacao = new MovimentacaoEstoque
                                {
                                    ProdutoVariacaoId = variacao.Id,
                                    Quantidade = diferenca,
                                    Tipo = "Saida",
                                    Data = DateTime.UtcNow,
                                    Observacao = $"Atualização Pedido #{pedido.Id}"
                                };
                                _context.MovimentacoesEstoque.Add(movimentacao);
                            }
                            else if (diferenca < 0)
                            {
                                // Diminuiu a quantidade -devolve ao estoque
                                variacao.Quantidade += Math.Abs(diferenca);

                                var movimentacao = new MovimentacaoEstoque
                                {
                                    ProdutoVariacaoId = variacao.Id,
                                    Quantidade = Math.Abs(diferenca),
                                    Tipo = "Entrada",
                                    Data = DateTime.UtcNow,
                                    Observacao = $"Atualização Pedido #{pedido.Id}"
                                };
                                _context.MovimentacoesEstoque.Add(movimentacao);
                            }

                            // Atualiza ou cria item
                            var itemExistente = await _context.PedidoItems
                                .FirstOrDefaultAsync(i => i.PedidoId == id && i.ProdutoId == item.ProdutoId);

                            if (itemExistente != null)
                            {
                                itemExistente.Quantidade = item.Quantidade;
                                itemExistente.ValorUnitario = item.ValorUnitario;
                            }
                            else
                            {
                                var novoItem = new PedidoItem
                                {
                                    PedidoId = pedido.Id,
                                    ProdutoId = item.ProdutoId,
                                    ProdutoNome = variacao.Produto?.Nome ?? $"Produto {item.ProdutoId}",
                                    Quantidade = item.Quantidade,
                                    ValorUnitario = item.ValorUnitario
                                };
                                _context.PedidoItems.Add(novoItem);
                            }
                        }
                        await _context.SaveChangesAsync();
                    }
                }

                pedido.Cliente = pedidoDto.Cliente;
                pedido.ValorTotal = pedidoDto.ValorTotal;
                pedido.Status = novoStatus;

                await _context.SaveChangesAsync();
                return Ok(pedido);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao atualizar pedido: " + ex.Message });
            }
        }

        // DELETE: api/Pedido/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePedido(int id)
        {
            try
            {
                var pedido = await _context.Pedidos.FindAsync(id);
                if (pedido == null)
                    return NotFound(new { message = "Pedido não encontrado." });

                // Se o pedido não estava cancelado, restaurar o estoque ao excluir
                if (pedido.Status != "Cancelado")
                {
                    var itens = await _context.PedidoItems
                        .Where(i => i.PedidoId == id)
                        .ToListAsync();

                    foreach (var item in itens)
                    {
                        var variacao = await _context.ProdutoVariacoes
                            .FirstOrDefaultAsync(v => v.ProdutoId == item.ProdutoId);

                        if (variacao != null)
                        {
                            variacao.Quantidade += item.Quantidade;

                            var movimentacao = new MovimentacaoEstoque
                            {
                                ProdutoVariacaoId = variacao.Id,
                                Quantidade = item.Quantidade,
                                Tipo = "Entrada",
                                Data = DateTime.UtcNow,
                                Observacao = $"Exclusão do Pedido #{pedido.Id}"
                            };
                            _context.MovimentacoesEstoque.Add(movimentacao);
                        }
                    }
                    await _context.SaveChangesAsync();
                }

                // Remover os itens do pedido
                var pedidoItens = await _context.PedidoItems
                    .Where(i => i.PedidoId == id)
                    .ToListAsync();
                _context.PedidoItems.RemoveRange(pedidoItens);

                _context.Pedidos.Remove(pedido);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Pedido excluído com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao excluir pedido: " + ex.Message });
            }
        }
    }
}
