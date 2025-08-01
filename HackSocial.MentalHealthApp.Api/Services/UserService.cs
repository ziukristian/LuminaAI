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
}
