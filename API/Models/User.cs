using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

[Table("tbusuario")]
public class User
{
    [Key]
    [Column("usu_id")]
    public int Id { get; set; }
    
    [Column("usu_nm")]
    public string Nome { get; set; } = null!;
    
    [Column("usu_ds_senha")]
    public string Senha { get; set; } = null!;
    
    [Column("usu_ds_email")]
    public string Email { get; set; } = null!;
    
    [Column("usu_dh_nascto")]
    public DateTime Data_Nasc { get; set; }
    
    [Column("usu_nr_telefone")]
    public long? Telefone { get; set; }
    
    [Column("usu_tp_role")]
    public string Role { get; set; } = "User";
}