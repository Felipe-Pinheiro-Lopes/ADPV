using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("tbproduto_variacao")]
    public class ProdutoVariacao
    {
        [Key]
        [Column("var_id")]
        public int Id { get; set; }
        
        [Column("prod_id")]
        public int ProdutoId { get; set; }
        
        [Column("var_nm_tamanho")]
        public string Tamanho { get; set; } = string.Empty;
        
        [Column("var_vl_compra")]
        public decimal ValorCompra { get; set; }
        
        [Column("var_vl_venda")]
        public decimal ValorVenda { get; set; }
        
        [Column("var_nr_quantidade")]
        public int Quantidade { get; set; }
        
        [Column("var_dh_cadastro")]
        public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("ProdutoId")]
        public virtual Produto? Produto { get; set; }
    }
}