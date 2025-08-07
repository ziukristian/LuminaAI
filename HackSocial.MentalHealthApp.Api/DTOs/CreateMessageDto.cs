namespace HackSocial.MentalHealthApp.Api.DTOs;
public class CreateMessageDto
{
    public string Content { get; set; } = string.Empty;
    public bool IsUserMessage { get; set; } = true;
}
