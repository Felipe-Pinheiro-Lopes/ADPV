namespace API.DTOs
{
    public class ProdutoListDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int FornecedorId { get; set; }
        public int TipoId { get; set; }
        public string? TipoNome { get; set; }
        public string? FornecedorNome { get; set; }
        public List<VariacaoListDto> Variacoes { get; set; } = new();
    }

    public class VariacaoListDto
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public string Tamanho { get; set; } = string.Empty;
        public decimal ValorCompra { get; set; }
        public decimal ValorVenda { get; set; }
        public int Quantidade { get; set; }
    }
}
