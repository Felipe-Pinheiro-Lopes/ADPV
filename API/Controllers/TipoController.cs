using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Protege todas as rotas de categoria
    public class TipoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TipoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tipo>>> GetTipos()
        {
            // Verifique se o contexto está retornando a lista corretamente
            return await _context.Tipos.ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Apenas admin cadastra categoria
        public async Task<IActionResult> Criar([FromBody] Tipo novoTipo)
        {
            if (string.IsNullOrEmpty(novoTipo.Nome))
                return BadRequest("O nome é obrigatório.");

            _context.Tipos.Add(novoTipo);
            await _context.SaveChangesAsync();
            return Ok(novoTipo);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Deletar(int id)
        {
            var tipo = await _context.Tipos.FindAsync(id);
            if (tipo == null) return NotFound();

            _context.Tipos.Remove(tipo);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Removido com sucesso" });
        }
    }
}