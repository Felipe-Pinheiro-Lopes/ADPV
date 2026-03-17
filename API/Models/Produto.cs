namespace API.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int FornecedorId { get; set; }
        public int TipoId { get; set; }

        // Relacionamento: Um produto tem muitas variações
        public List<ProdutoVariacao> Variacoes { get; set; } = new();
    }
}