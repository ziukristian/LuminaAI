using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace HackSocial.MentalHealthApp.Api.Services;

public class UserService(AppDbContext db)
{
    private readonly AppDbContext _db = db ?? throw new ArgumentNullException(nameof(db));

    public IEnumerable<UserLogEntry> GetUserLogsById(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Invalid user ID.", nameof(id));
        }

        return _db.Users
            .Where(u => u.Id == id)
            .SelectMany(u => u.UserLogEntries)
            .ToList();
    }

    public UserLogEntryRequestDTO InsertUserLog(Guid userId, UserLogEntryInsertDTO userLogEntryInsertDTO)
    {
        _ = _db.Users.Find(userId) ?? throw new InvalidOperationException("User not found.");

        var userLogEntry = new UserLogEntry
        {
            UserId = userId,
            FeelingScore = userLogEntryInsertDTO.FeelingScore,
            Content = userLogEntryInsertDTO.Content,
            Timestamp = DateTime.UtcNow
        };
        _db.UserLogEntries.Add(userLogEntry);
        _db.SaveChanges();
        return new UserLogEntryRequestDTO
        {
            UserId = userLogEntry.UserId,
            FeelingScore = userLogEntry.FeelingScore,
            Content = userLogEntry.Content,
            Timestamp = userLogEntry.Timestamp
        };

    }

    public UserLogEntryRequestDTO UpdateUserLog(Guid userId, Guid logId, UserLogEntryInsertDTO userLogEntryInsertDTO)
    {
        var userLogEntry = _db.UserLogEntries
            .FirstOrDefault(ule => ule.Id == logId && ule.UserId == userId)
            ?? throw new InvalidOperationException("User log entry not found.");
        userLogEntry.FeelingScore = userLogEntryInsertDTO.FeelingScore;
        userLogEntry.Content = userLogEntryInsertDTO.Content;
        userLogEntry.Timestamp = DateTime.UtcNow;
        _db.SaveChanges();
        return new UserLogEntryRequestDTO
        {
            UserId = userLogEntry.UserId,
            FeelingScore = userLogEntry.FeelingScore,
            Content = userLogEntry.Content,
            Timestamp = userLogEntry.Timestamp
        };
    }

    public void DeleteUserLog(Guid userId, Guid logId)
    {
        var userLogEntry = _db.UserLogEntries
            .FirstOrDefault(ule => ule.Id == logId && ule.UserId == userId)
            ?? throw new InvalidOperationException("User log entry not found.");
        _db.UserLogEntries.Remove(userLogEntry);
        _db.SaveChanges();
    }

}
