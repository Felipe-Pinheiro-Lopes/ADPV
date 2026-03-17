namespace API.Models
{
    public class ProdutoVariacao
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public string Tamanho { get; set; } = string.Empty; // P, M, G, 42, etc.
        public decimal ValorCompra { get; set; }
        public decimal ValorVenda { get; set; }
        public int Quantidade { get; set; }
    }
}