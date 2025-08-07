using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;

namespace HackSocial.MentalHealthApp.Api.Services;

public class MentalHealthReportService(AppDbContext db)
{
    private readonly AppDbContext _db = db ?? throw new ArgumentNullException(nameof(db));
    public IEnumerable<GetMentalHealthreportDto> GetMentalHealthReportsByUserId(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        return _db.MentalHealthReports
            .Where(mhr => mhr.UserId == userId)
            .Select(mhr => new GetMentalHealthreportDto
            {
                Id = mhr.Id,
                Content = mhr.Content,
                Timestamp = mhr.Timestamp
            })
            .ToList();
    }

    public GetMentalHealthreportDto GenerateMentalHealthReport(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

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

        return new GetMentalHealthreportDto
        {
            Id = mentalHealthReport.Id,
            Content = mentalHealthReport.Content,
            Timestamp = mentalHealthReport.Timestamp
        };
    }
}
