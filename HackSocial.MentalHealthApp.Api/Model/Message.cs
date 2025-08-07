namespace HackSocial.MentalHealthApp.Api.Model;

public class Message
{
    public Guid Id { get; set; }
    public Guid ChatId { get; set; }
    public Chat? Chat { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public bool IsUserMessage { get; set; } = true;

}
