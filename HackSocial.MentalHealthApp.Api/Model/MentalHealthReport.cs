namespace HackSocial.MentalHealthApp.Api.Model;

public class MentalHealthReport
{

    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public byte[]? FileData { get; set; } = null;
}
