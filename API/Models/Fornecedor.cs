namespace API.Models
{
    public class Fornecedor
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Telefone { get; set; } // Usando string conforme conversamos
        public string? Email { get; set; }
        public string? Endereco { get; set; }
    }
}