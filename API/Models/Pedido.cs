using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("tbpedido")]
    public class Pedido
    {
        [Key]
        [Column("ped_id")]
        public int Id { get; set; }

        [Required]
        [Column("ped_nm_cliente")]
        public string Cliente { get; set; } = string.Empty;

        [Column("ped_dh_pedido")]
        public DateTime Data { get; set; } = DateTime.Now;

        [Required]
        [Column("ped_vl_total")]
        public decimal ValorTotal { get; set; }

        [Column("ped_st_pedido")]
        public string Status { get; set; } = "Pendente";
    }
}