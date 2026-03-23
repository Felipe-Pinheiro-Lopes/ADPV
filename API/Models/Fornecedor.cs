namespace API.Models
{
   // Arquivo: Models/Fornecedor.cs
    public class Fornecedor {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty; // Novo
        public string Contato { get; set; } = string.Empty; // Novo
        public string Telefone { get; set; } = string.Empty; // Novo
        public string Email { get; set; } = string.Empty; // Novo
        public string Endereco { get; set; } = string.Empty; // Novo
    }
}