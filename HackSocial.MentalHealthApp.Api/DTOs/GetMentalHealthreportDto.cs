namespace HackSocial.MentalHealthApp.Api.DTOs;

public class GetMentalHealthreportDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
