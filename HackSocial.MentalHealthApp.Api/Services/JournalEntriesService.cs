using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace HackSocial.MentalHealthApp.Api.Services;

public class JournalEntriesService(AppDbContext db)
{
    private readonly AppDbContext _db = db ?? throw new ArgumentNullException(nameof(db));

    public IEnumerable<JournalEntry> GetJournalEntriesByUserId(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        return _db.Users
            .Where(u => u.Id == userId)
            .SelectMany(u => u.JournalEntries)
            .ToList();
    }

    public JournalEntryRequestDTO InsertJournalEntry(Guid userId, JournalEntryInsertDTO userLogEntryInsertDTO)
    {
        _ = _db.Users.Find(userId) ?? throw new InvalidOperationException("User not found.");

        var userLogEntry = new JournalEntry
        {
            UserId = userId,
            FeelingScore = userLogEntryInsertDTO.FeelingScore,
            Content = userLogEntryInsertDTO.Content,
            Timestamp = DateTime.UtcNow
        };
        _db.UserLogEntries.Add(userLogEntry);
        _db.SaveChanges();


        return new JournalEntryRequestDTO
        {
            UserId = userLogEntry.UserId,
            FeelingScore = userLogEntry.FeelingScore,
            Content = userLogEntry.Content,
            Timestamp = userLogEntry.Timestamp
        };

    }

    public JournalEntryRequestDTO UpdateJournalEntry(Guid userId, Guid logId, JournalEntryInsertDTO userLogEntryInsertDTO)
    {
        var userLogEntry = _db.UserLogEntries
            .FirstOrDefault(ule => ule.Id == logId && ule.UserId == userId)
            ?? throw new InvalidOperationException("User log entry not found.");
        userLogEntry.FeelingScore = userLogEntryInsertDTO.FeelingScore;
        userLogEntry.Content = userLogEntryInsertDTO.Content;
        userLogEntry.Timestamp = DateTime.UtcNow;
        _db.SaveChanges();
        return new JournalEntryRequestDTO
        {
            UserId = userLogEntry.UserId,
            FeelingScore = userLogEntry.FeelingScore,
            Content = userLogEntry.Content,
            Timestamp = userLogEntry.Timestamp
        };
    }

    public void DeleteJournalEntry(Guid userId, Guid logId)
    {
        var userLogEntry = _db.UserLogEntries
            .FirstOrDefault(ule => ule.Id == logId && ule.UserId == userId)
            ?? throw new InvalidOperationException("User log entry not found.");
        _db.UserLogEntries.Remove(userLogEntry);
        _db.SaveChanges();
    }
    public List<KeyValuePair<DateTime, int>> GetFeelingScoreHistory(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(userId));
        }

        return _db.UserLogEntries
            .Where(ule => ule.UserId == userId)
            .Select(ule => new KeyValuePair<DateTime, int>(ule.Timestamp, ule.FeelingScore))
            .ToList();
    }


}
