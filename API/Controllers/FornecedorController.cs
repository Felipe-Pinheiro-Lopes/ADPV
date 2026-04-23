using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Exige login para acessar
    public class FornecedorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FornecedorController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Fornecedor
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var fornecedores = await _context.Fornecedores.ToListAsync();
            return Ok(fornecedores);
        }

        // POST: api/Fornecedor
        [HttpPost]
        [Authorize(Roles = "Admin")] // Apenas Admins podem cadastrar novos parceiros
        public async Task<IActionResult> Criar([FromBody] Fornecedor novoFornecedor)
        {
            if (string.IsNullOrEmpty(novoFornecedor.Nome))
            {
                return BadRequest(new { message = "O nome da empresa é obrigatório." });
            }

            try 
            {
                _context.Fornecedores.Add(novoFornecedor);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Fornecedor cadastrado com sucesso!", data = novoFornecedor });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao salvar: " + ex.Message });
            }
        }

        [HttpPut("variacao/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditarVariacao(int id, [FromBody] ProdutoVariacao variacaoEditada)
        {
            var v = await _context.ProdutoVariacoes.FindAsync(id);
            if (v == null) return NotFound();

            // Atualiza apenas os campos permitidos
            v.Tamanho = variacaoEditada.Tamanho;
            v.Quantidade = variacaoEditada.Quantidade;
            v.ValorCompra = variacaoEditada.ValorCompra;
            v.ValorVenda = variacaoEditada.ValorVenda;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Variação atualizada com sucesso!" });
        }

        // DELETE: api/Fornecedor/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Deletar(int id)
        {
            var fornecedor = await _context.Fornecedores.FindAsync(id);
            if (fornecedor == null) return NotFound();

            _context.Fornecedores.Remove(fornecedor);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Fornecedor removido com sucesso!" });
        }

        // PUT: api/Fornecedor/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] Fornecedor fornecedorAtualizado)
        {
            if (id != fornecedorAtualizado.Id)
            {
                return BadRequest(new { message = "ID não corresponde ao fornecedor." });
            }

            var fornecedorExistente = await _context.Fornecedores.FindAsync(id);
            if (fornecedorExistente == null)
            {
                return NotFound();
            }

            // Atualiza os campos
            fornecedorExistente.Nome = fornecedorAtualizado.Nome;
            fornecedorExistente.Cnpj = fornecedorAtualizado.Cnpj;
            fornecedorExistente.Contato = fornecedorAtualizado.Contato;
            fornecedorExistente.Telefone = fornecedorAtualizado.Telefone;
            fornecedorExistente.Email = fornecedorAtualizado.Email;
            fornecedorExistente.Endereco = fornecedorAtualizado.Endereco;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Fornecedor atualizado com sucesso!", data = fornecedorExistente });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Erro ao atualizar: " + ex.Message });
            }
        }
    }
}