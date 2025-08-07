using System.ComponentModel.DataAnnotations;

namespace HackSocial.MentalHealthApp.Api.DTOs;

public class CreateJournalEntryDto
{
    [Required]
    public int FeelingScore { get; set; } = 5;
    [Required]
    public string Content { get; set; } = string.Empty;
}
