using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("tbpedido_item")]
    public class PedidoItem
    {
        [Key]
        [Column("item_id")]
        public int Id { get; set; }

        [Column("ped_id")]
        public int PedidoId { get; set; }

        [Column("prod_id")]
        public int ProdutoId { get; set; }

        [Column("var_id")]
        public int? TamanhoId { get; set; }

        [Column("item_nm_produto")]
        public string ProdutoNome { get; set; } = string.Empty;

        [Column("item_nr_quantidade")]
        public int Quantidade { get; set; }

        [Column("item_vl_unitario")]
        public decimal ValorUnitario { get; set; }

        [ForeignKey("PedidoId")]
        public virtual Pedido? Pedido { get; set; }
    }
}
