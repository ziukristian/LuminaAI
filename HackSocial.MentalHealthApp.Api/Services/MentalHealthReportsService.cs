using HackSocial.MentalHealthApp.Api.Model;

namespace HackSocial.MentalHealthApp.Api.Services;

public class MentalHealthReportsService(AppDbContext db)
{
    private readonly AppDbContext _db = db ?? throw new ArgumentNullException(nameof(db));
    public IEnumerable<MentalHealthReport> GetMentalHealthReportsByUserId(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        return _db.Users
            .Where(u => u.Id == userId)
            .SelectMany(u => u.MentalHealthReports)
            .ToList();
    }

    public MentalHealthReport GenerateMentalHealthReport(Guid userId)
    {
        _ = _db.Users.Find(userId) ?? throw new InvalidOperationException("User not found.");

        var journalEntries = _db.Users
            .Where(u => u.Id == userId)
            .SelectMany(u => u.JournalEntries)
            .ToList();

        // Merge entries into a single string (with their scores) for the llm
        var journalContent = string.Join("\n", journalEntries.Select(je => $"{je.Timestamp}: {je.Content} (Feeling Score: {je.FeelingScore})"));

        // TODO: Call LLM with journalContent to generate a report

        var mentalHealthReport = new MentalHealthReport
        {
            UserId = userId,
            Content = "HEY! I'm a placeholder mental health report!",
            Timestamp = DateTime.UtcNow
        };

        _db.MentalHealthReports.Add(mentalHealthReport);
        _db.SaveChanges();

        return mentalHealthReport;
    }
}
