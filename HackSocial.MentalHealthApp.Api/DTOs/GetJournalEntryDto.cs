namespace HackSocial.MentalHealthApp.Api.DTOs;

public class GetJournalEntryDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int FeelingScore { get; set; } = 5;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
