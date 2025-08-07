using System.ComponentModel.DataAnnotations;

namespace HackSocial.MentalHealthApp.Api.DTOs;

public class JournalEntryInsertDTO
{
    [Required]
    public int FeelingScore { get; set; } = 5;
    [Required]
    public string Content { get; set; } = string.Empty;
}
