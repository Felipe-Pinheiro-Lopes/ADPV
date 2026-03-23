namespace API.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int FornecedorId { get; set; }
        public int TipoId { get; set; }

        // ADICIONE ESTAS LINHAS ABAIXO:
        public virtual Tipo? Tipo { get; set; } 
        public virtual Fornecedor? Fornecedor { get; set; }

        public List<ProdutoVariacao> Variacoes { get; set; } = new();
    }
}