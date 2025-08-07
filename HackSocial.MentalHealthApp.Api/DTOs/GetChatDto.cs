namespace HackSocial.MentalHealthApp.Api.DTOs;

public class GetChatDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
