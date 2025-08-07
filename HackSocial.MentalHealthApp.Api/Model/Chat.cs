namespace HackSocial.MentalHealthApp.Api.Model;
public class Chat
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public List<Message> Messages { get; set; } = [];
}
