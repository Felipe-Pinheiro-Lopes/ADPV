using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("tbproduto")]
    public class Produto
    {
        [Key]
        [Column("prod_id")]
        public int Id { get; set; }
        
        [Column("prod_nm")]
        public string Nome { get; set; } = string.Empty;
        
        [Column("frn_id")]
        public int FornecedorId { get; set; }
        
        [Column("tipo_id")]
        public int TipoId { get; set; }

        [Column("prod_dh_cadastro")]
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

        [ForeignKey("TipoId")]
        public virtual Tipo? Tipo { get; set; } 
        
        [ForeignKey("FornecedorId")]
        public virtual Fornecedor? Fornecedor { get; set; } 

        public List<ProdutoVariacao> Variacoes { get; set; } = new();
    }
}