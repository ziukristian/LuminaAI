namespace HackSocial.MentalHealthApp.Api.Model;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public IEnumerable<UserLogEntry> UserLogEntries { get; set; } = [];
}
