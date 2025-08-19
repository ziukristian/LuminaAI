using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;
using QuestPDF.Fluent;

namespace HackSocial.MentalHealthApp.Api.Services;

public class MentalHealthReportService
{
    private readonly AppDbContext _db;
    private readonly OpenAIService _openAiService;
    private readonly IConfiguration _configuration;

    public MentalHealthReportService(AppDbContext db, OpenAIService openAiService, IConfiguration configuration)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _openAiService = openAiService ?? throw new ArgumentNullException(nameof(openAiService));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

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

    public async Task<GetMentalHealthreportDto> GenerateMentalHealthReport(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        var journalEntries = _db.Users
            .Where(u => u.Id == userId)
            .SelectMany(u => u.JournalEntries)
            .OrderByDescending(je => je.Timestamp)
            .Take(10)
            .ToList();

        if (!journalEntries.Any())
        {
            throw new InvalidOperationException("No journal entries found for this user.");
        }

        var journalContent = string.Join("\n\n", journalEntries.Select(je => 
            $"Date: {je.Timestamp.ToLocalTime():yyyy-MM-dd HH:mm}\n" +
            $"Feeling Score: {je.FeelingScore}/10\n" +
            $"Entry: {je.Content}"));

        var prompt = $"Based on the following journal entries, please provide a comprehensive mental health analysis. " +
            $"Focus on identifying patterns, mood trends, and potential areas of concern or improvement. " +
            $"Here are the journal entries (most recent first):\n\n{journalContent}";

        var systemPrompt = _configuration["OpenAI:MentalHealthSystem"] ?? 
            "You are a mental health assistant. Based on user's journal entries, provide compassionate insights and suggestions for improving their mental wellbeing.";

        // Call OpenAI to generate the report
        var reportContent = await _openAiService.GenerateCompletionAsync(prompt, systemPrompt);

        if (string.IsNullOrWhiteSpace(reportContent))
        {
            throw new InvalidOperationException("Failed to generate a meaningful report from the journal entries.");
        }

        var mentalHealthReport = new MentalHealthReport
        {
            UserId = userId,
            Content = reportContent,
            Timestamp = DateTime.UtcNow,
            FileData = null,
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

    public async Task<byte[]> DownloadHealthReportFileByReportId(Guid reportId)
    {
        if (reportId == Guid.Empty)
        {
            throw new ArgumentException("Invalid report ID.", nameof(reportId));
        }

        var report = _db.MentalHealthReports.Find(reportId) ?? throw new InvalidOperationException("Report not found.");

        if (report.FileData == null)
        {
            report.FileData = await GenerateMentalHealthReportFile(report.Content);
            _db.SaveChanges();
        }

        return await Task.FromResult(report.FileData);
    }

    public async Task<byte[]> GenerateMentalHealthReportFile(string reportContent)
    {
        var pdfBytes = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(50);

                page.Header()
                    .Text("Mental Health Report")
                    .FontSize(20)
                    .Bold()
                    .AlignCenter();

                page.Content()
                    .PaddingVertical(20)
                    .Text(reportContent)
                    .FontSize(12);

                page.Footer()
                    .AlignCenter()
                    .Text($"Generated on: {DateTime.Now:yyyy-MM-dd HH:mm}");
            });
        }).GeneratePdf();

        return await Task.FromResult(pdfBytes);
    }
}
