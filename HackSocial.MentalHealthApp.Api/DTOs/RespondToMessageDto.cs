namespace HackSocial.MentalHealthApp.Api.DTOs;

public class RespondToMessageDto
{
    public GetMessageDto SystemMessage { get; set; } = new GetMessageDto();
    public GetMessageDto UserMessage { get; set; } = new GetMessageDto();
}
