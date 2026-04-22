using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("tbmovimentacao_estoque")]
    public class MovimentacaoEstoque
    {
        [Key]
        [Column("mov_id")]
        public int Id { get; set; }

        [Column("var_id")]
        public int ProdutoVariacaoId { get; set; }

        [Column("mov_nr_quantidade")]
        public int Quantidade { get; set; }

        [Column("mov_tp_tipo")]
        public string Tipo { get; set; } = string.Empty; // "Entrada" ou "Saida"

        [Column("mov_dh_data")]
        public DateTime Data { get; set; } = DateTime.UtcNow;

        [Column("mov_ds_observacao")]
        public string? Observacao { get; set; }
    }
}
