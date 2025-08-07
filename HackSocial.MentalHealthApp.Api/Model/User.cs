namespace HackSocial.MentalHealthApp.Api.Model;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string UserName { get; set; } = string.Empty;
    public List<JournalEntry> JournalEntries { get; set; } = [];
    public List<MentalHealthReport> MentalHealthReports { get; set; } = [];

}



