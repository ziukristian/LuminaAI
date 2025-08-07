using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HackSocial.MentalHealthApp.Api.Controllers;

[ApiController]
[Route("api/chats")]
public class ChatsController(ChatService chatService) : ControllerBase
{
    private readonly ChatService _chatService = chatService ?? throw new ArgumentNullException(nameof(chatService));

    // Fixed userId for demonstration purposes
    private readonly Guid userId = Guid.Parse("00000000-0000-0000-0000-000000000001");
    
    [HttpGet]
    [Route("")]
    public ActionResult<IEnumerable<GetChatDto>> GetUserChats()
    {
        if (userId == Guid.Empty)
        {
            return BadRequest("Invalid user ID.");
        }
        var chats = _chatService.GetChatsByUserId(userId);
        return Ok(chats);
    }

    [HttpPost]
    [Route("")]
    public ActionResult<GetChatDto> CreateChat([FromBody] CreateChatDto newChat)
    {
        if (userId == Guid.Empty || string.IsNullOrWhiteSpace(newChat.Name))
        {
            return BadRequest("Invalid user ID or chat name.");
        }
        var chatDto = _chatService.CreateChat(userId, newChat.Name);
        return CreatedAtAction(nameof(GetUserChats), new { userId }, chatDto);
    }

    [HttpDelete]
    [Route("{chatId}")]
    public IActionResult DeleteChat(Guid chatId)
    {
        if (userId == Guid.Empty || chatId == Guid.Empty)
        {
            return BadRequest("Invalid user ID or chat ID.");
        }
        _chatService.DeleteChat(chatId);
        return NoContent();
    }

    [HttpGet]
    [Route("{chatId}/messages")]
    public ActionResult<IEnumerable<GetMessageDto>> GetChatMessages(Guid chatId)
    {
        if (userId == Guid.Empty || chatId == Guid.Empty)
        {
            return BadRequest("Invalid user ID or chat ID.");
        }
        var messages = _chatService.GetMessagesByChatId(chatId);
        return Ok(messages);
    }

    [HttpPost]
    [Route("{chatId}/messages")]
    public ActionResult<RespondToMessageDto> SendMessage(Guid chatId, [FromBody] CreateMessageDto message)
    {
        if (userId == Guid.Empty || chatId == Guid.Empty || message == null || string.IsNullOrWhiteSpace(message.Content))
        {
            return BadRequest("Invalid user ID, chat ID, or message content.");
        }

        if (!_chatService.DoesUserOwnChat(userId, chatId))
        {
            return Unauthorized("You do not own this chat.");
        }

        message.IsUserMessage = true;

        var sentMessage = _chatService.InsertMessage(chatId, message);

        // TODO: Call LLM with messages to generate a response
        var systemMessage = new CreateMessageDto
        {
            Content = "I'm a system message!",
            IsUserMessage = false
        };

        var outputMessage = _chatService.InsertMessage(chatId, systemMessage);

        var responseMessage = new RespondToMessageDto
        {
            UserMessage = sentMessage,
            SystemMessage = outputMessage
        };

        return Ok(responseMessage);
    }
}
