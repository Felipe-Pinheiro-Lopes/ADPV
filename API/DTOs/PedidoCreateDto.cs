namespace API.DTOs
{
    public class PedidoItemCreateDto
    {
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
        public decimal ValorUnitario { get; set; }
    }

    public class PedidoCreateDto
    {
        public string Cliente { get; set; } = string.Empty;
        public decimal ValorTotal { get; set; }
        public List<PedidoItemCreateDto> Itens { get; set; } = new();
        public string? Status { get; set; }
    }
}
