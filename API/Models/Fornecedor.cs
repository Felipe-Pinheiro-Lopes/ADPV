using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("tbfornecedor")]
    public class Fornecedor {
        [Key]
        [Column("frn_id")]
        public int Id { get; set; }
        
        [Column("frn_nm")]
        public string Nome { get; set; } = string.Empty;
        
        [Column("frn_nr_cnpj")]
        public string Cnpj { get; set; } = string.Empty;
        
        [Column("frn_nm_contato")]
        public string Contato { get; set; } = string.Empty;
        
        [Column("frn_nr_telefone")]
        public string Telefone { get; set; } = string.Empty;
        
        [Column("frn_ds_email")]
        public string Email { get; set; } = string.Empty;
        
        [Column("frn_ds_ender")]
        public string Endereco { get; set; } = string.Empty;
    }
}