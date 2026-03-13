namespace API.DTOs;
public class UserLoginDto {
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public long? Telefone { get; set; }
    public DateTime Data_Nasc { get; set; }
}