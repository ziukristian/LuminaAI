using System.ComponentModel.DataAnnotations;

namespace HackSocial.MentalHealthApp.Api.Model;

public class JournalEntry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public int FeelingScore { get; set; } = 5;
    [MaxLength(300)]
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

}
