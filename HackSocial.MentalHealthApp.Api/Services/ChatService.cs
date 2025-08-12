using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace HackSocial.MentalHealthApp.Api.Services;

public class ChatService
{
    private readonly AppDbContext _db;
    private readonly OpenAIService _openAiService;
    private readonly IConfiguration _configuration;

    public ChatService(AppDbContext db, OpenAIService openAiService, IConfiguration configuration)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _openAiService = openAiService ?? throw new ArgumentNullException(nameof(openAiService));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }
    
    public IEnumerable<GetChatDto> GetChatsByUserId(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        return _db.Users
            .Where(u => u.Id == userId)
            .SelectMany(u => u.Chats)
            .Select(c => new GetChatDto
            {
                Id = c.Id,
                Name = c.Name,
                Timestamp = c.Timestamp
            })
            .ToList();
    }
    
    public GetChatDto CreateChat(Guid userId, string chatName)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(chatName))
        {
            throw new ArgumentException("Chat name cannot be empty.", nameof(chatName));
        }

        var user = _db.Users.Find(userId) ?? throw new InvalidOperationException("User not found.");

        if (_db.Chats.Any(c => c.UserId == userId && c.Name.ToLower() == chatName.ToLower()))
        {
            throw new InvalidOperationException("Chat with the same name already exists for this user.");
        }

        var chat = new Chat
        {
            UserId = userId,
            Name = chatName,
            Timestamp = DateTime.UtcNow
        };

        _db.Chats.Add(chat);
        _db.SaveChanges();

        var chatDto = new GetChatDto
        {
            Id = chat.Id,
            Name = chat.Name,
            Timestamp = chat.Timestamp
        };

        return chatDto;
    }
    
    public void DeleteChat(Guid chatId)
    {
        if (chatId == Guid.Empty)
        {
            throw new ArgumentException("Invalid chat ID.", nameof(chatId));
        }

        var chat = _db.Chats.Find(chatId) ?? throw new InvalidOperationException("Chat not found.");

        _db.Chats.Remove(chat);
        _db.SaveChanges();
    }
    
    public bool DoesUserOwnChat(Guid userId, Guid chatId)
    {
        if (userId == Guid.Empty || chatId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID or chat ID.");
        }
        return _db.Chats.Any(c => c.Id == chatId && c.UserId == userId);
    }
    
    public IEnumerable<GetMessageDto> GetMessagesByChatId(Guid chatId)
    {
        if (chatId == Guid.Empty)
        {
            throw new ArgumentException("Invalid chat ID.", nameof(chatId));
        }

        return _db.Chats
            .Where(c => c.Id == chatId)
            .SelectMany(c => c.Messages)
            .Select(m => new GetMessageDto
            {
                Id = m.Id,
                Content = m.Content,
                Timestamp = m.Timestamp,
                IsUserMessage = m.IsUserMessage
            })
            .ToList();
    }
    
    public GetMessageDto InsertMessage(Guid chatId, CreateMessageDto messageInsertDTO)
    {
        if (chatId == Guid.Empty)
        {
            throw new ArgumentException("Invalid chat ID.", nameof(chatId));
        }

        if (string.IsNullOrWhiteSpace(messageInsertDTO.Content))
        {
            throw new ArgumentException("Message content cannot be empty.", nameof(messageInsertDTO.Content));
        }

        var chat = _db.Chats.Find(chatId) ?? throw new InvalidOperationException("Chat not found.");

        var message = new Message
        {
            ChatId = chatId,
            Content = messageInsertDTO.Content,
            Timestamp = DateTime.UtcNow,
            IsUserMessage = messageInsertDTO.IsUserMessage
        };
        _db.Messages.Add(message);
        _db.SaveChanges();
        return new GetMessageDto
        {
            Id = message.Id,
            Content = message.Content,
            Timestamp = message.Timestamp,
            IsUserMessage = message.IsUserMessage
        };
    }

    public async Task<GetMessageDto> GenerateAIResponse(Guid chatId, GetMessageDto userMessage)
    {
        if (chatId == Guid.Empty)
        {
            throw new ArgumentException("Invalid chat ID.", nameof(chatId));
        }

        if (userMessage == null)
        {
            throw new ArgumentNullException(nameof(userMessage));
        }

        // Get the chat history to provide context
        var chatHistory = GetMessagesByChatId(chatId)
            .OrderBy(m => m.Timestamp)
            .TakeLast(10) // Limit to the most recent 10 messages to avoid token limit issues
            .ToList();

        // Build the conversation history for context
        var conversationBuilder = new StringBuilder();
        foreach (var message in chatHistory)
        {
            conversationBuilder.AppendLine(message.IsUserMessage ? 
                $"User: {message.Content}" : 
                $"Assistant: {message.Content}");
        }
        
        // Add the latest user message
        conversationBuilder.AppendLine($"User: {userMessage.Content}");

        // Get system prompt from configuration
        var systemPrompt = _configuration["OpenAI:ChatSystem"] ?? 
            "You are a supportive mental health chat assistant. Provide kind, empathetic responses to help users process their thoughts and feelings. Never give harmful advice and always encourage professional help for serious issues.";

        // Generate the AI response
        var aiResponseContent = await _openAiService.GenerateCompletionAsync(
            conversationBuilder.ToString(), 
            systemPrompt);

        // Create a message DTO for the AI response
        var responseMessage = new CreateMessageDto
        {
            Content = aiResponseContent,
            IsUserMessage = false
        };

        // Insert the AI response into the chat
        return InsertMessage(chatId, responseMessage);
    }
}
