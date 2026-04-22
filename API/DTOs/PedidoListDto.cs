namespace API.DTOs
{
    public class PedidoListDto
    {
        public int Id { get; set; }
        public string Cliente { get; set; } = string.Empty;
        public DateTime Data { get; set; }
        public decimal ValorTotal { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
