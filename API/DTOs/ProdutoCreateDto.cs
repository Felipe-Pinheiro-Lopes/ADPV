namespace API.DTOs
{
    public class ProdutoCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public int FornecedorId { get; set; }
        public int TipoId { get; set; }
        public List<VariacaoDto> Variacoes { get; set; } = new();
    }

    public class VariacaoDto
    {
        public string Tamanho { get; set; } = string.Empty;
        public decimal ValorCompra { get; set; }
        public decimal ValorVenda { get; set; }
        public int Quantidade { get; set; }
    }
}