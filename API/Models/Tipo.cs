using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("tbtipo")]
    public class Tipo {
        [Key]
        [Column("tipo_id")]
        public int Id { get; set; }
        
        [Column("tipo_nm")]
        public string Nome { get; set; } = string.Empty;
        
        [Column("tipo_cd")]
        public string Codigo { get; set; } = string.Empty;
        
        [Column("tipo_ds")]
        public string Descricao { get; set; } = string.Empty;
    }
}