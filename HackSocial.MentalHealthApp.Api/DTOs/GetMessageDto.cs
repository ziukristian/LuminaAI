namespace HackSocial.MentalHealthApp.Api.DTOs;

public class GetMessageDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public bool IsUserMessage { get; set; } = true;
}
