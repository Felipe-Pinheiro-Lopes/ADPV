namespace API.DTOs;

public class UserUpdateDto
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? Telefone { get; set; }
    public DateTime Data_Nasc { get; set; }
}