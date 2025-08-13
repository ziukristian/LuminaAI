using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;

namespace HackSocial.MentalHealthApp.Api.Services;

public class OpenAIService
{
    private const string EnvVarName = "OPENAI_API_KEY";

    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly bool _hasApiKey;

    public OpenAIService(IConfiguration configuration, HttpClient? httpClient = null)
    {
        _configuration = configuration;
        _httpClient = httpClient ?? new HttpClient();

        var apiKey = Environment.GetEnvironmentVariable(EnvVarName);

        _hasApiKey = !string.IsNullOrWhiteSpace(apiKey);

        if (_hasApiKey)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        }

        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<string> GenerateCompletionAsync(string prompt, string systemPrompt, int maxTokens = 1000)
    {
        // If no API key, short-circuit with a placeholder
        if (!_hasApiKey)
        {
            return "NO KEY, PLACEHOLDER MESSAGE";
        }

        var model = _configuration["OpenAI:Model"] ?? "gpt-4o-mini";

        var requestBody = new
        {
            model,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = prompt }
            },
            max_tokens = maxTokens
        };

        var jsonContent = JsonSerializer.Serialize(requestBody);
        using var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var completionResponse = JsonSerializer.Deserialize<CompletionResponse>(responseBody);

            return completionResponse?.Choices?[0]?.Message?.Content?.Trim()
                   ?? "PLACEHOLDER MESSAGE";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating completion: {ex.Message}");
            return "I'm sorry, I encountered an issue processing your request.";
        }
    }

    private class CompletionResponse
    {
        [JsonPropertyName("choices")]
        public List<Choice> Choices { get; set; } = new();

        public class Choice
        {
            [JsonPropertyName("message")]
            public Message Message { get; set; } = new();
        }

        public class Message
        {
            [JsonPropertyName("content")]
            public string Content { get; set; } = string.Empty;
        }
    }
}
