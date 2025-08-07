namespace HackSocial.MentalHealthApp.Api.DTOs;

public class JournalEntryRequestDTO
{
    public Guid UserId { get; set; }
    public int FeelingScore { get; set; } = 5;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
