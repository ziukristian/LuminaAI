using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;

namespace HackSocial.MentalHealthApp.Api.Services;

public class JournalService(AppDbContext db)
{
    private readonly AppDbContext _db = db ?? throw new ArgumentNullException(nameof(db));

    public IEnumerable<GetJournalEntryDto> GetJournalEntriesByUserId(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        return _db.JournalEntries
            .Where(je => je.UserId == userId)
            .Select(je => new GetJournalEntryDto
            {
                Id = je.Id,
                FeelingScore = je.FeelingScore,
                Content = je.Content,
                Timestamp = je.Timestamp
            })
            .ToList();
    }

    public GetJournalEntryDto InsertJournalEntry(Guid userId, CreateJournalEntryDto userJournalEntryInsertDTO)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        var userJournalEntry = new JournalEntry
        {
            UserId = userId,
            FeelingScore = userJournalEntryInsertDTO.FeelingScore,
            Content = userJournalEntryInsertDTO.Content,
            Timestamp = DateTime.UtcNow
        };
        _db.JournalEntries.Add(userJournalEntry);
        _db.SaveChanges();


        return new GetJournalEntryDto
        {
            Id = userJournalEntry.Id,
            FeelingScore = userJournalEntry.FeelingScore,
            Content = userJournalEntry.Content,
            Timestamp = userJournalEntry.Timestamp
        };

    }

    public GetJournalEntryDto UpdateJournalEntry(Guid userId, Guid journalId, CreateJournalEntryDto userLogEntryInsertDTO)
    {
        if (userId == Guid.Empty || journalId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID or journal ID.", nameof(userId));
        }

        var userLogEntry = _db.JournalEntries
            .FirstOrDefault(ule => ule.Id == journalId && ule.UserId == userId)
            ?? throw new InvalidOperationException("User log entry not found.");
        userLogEntry.FeelingScore = userLogEntryInsertDTO.FeelingScore;
        userLogEntry.Content = userLogEntryInsertDTO.Content;
        userLogEntry.Timestamp = DateTime.UtcNow;
        _db.SaveChanges();
        return new GetJournalEntryDto
        {
            Id = userLogEntry.Id,
            FeelingScore = userLogEntry.FeelingScore,
            Content = userLogEntry.Content,
            Timestamp = userLogEntry.Timestamp
        };
    }

    public void DeleteJournalEntry(Guid userId, Guid journalId)
    {
        if (userId == Guid.Empty || journalId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID or journal ID.", nameof(userId));
        }

        var userLogEntry = _db.JournalEntries
            .FirstOrDefault(ule => ule.Id == journalId && ule.UserId == userId)
            ?? throw new InvalidOperationException("User log entry not found.");
        _db.JournalEntries.Remove(userLogEntry);
        _db.SaveChanges();
    }

    public IEnumerable<KeyValuePair<DateTime, int>> GetFeelingScoreHistory(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        return _db.JournalEntries
            .Where(ule => ule.UserId == userId)
            .Select(ule => new KeyValuePair<DateTime, int>(ule.Timestamp, ule.FeelingScore))
            .ToList();
    }


}
