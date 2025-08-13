using HackSocial.MentalHealthApp.Api.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HackSocial.MentalHealthApp.Api.Controllers;

[ApiController]
[Route("api/utilities")]
public class MvpUtilitiesController(AppDbContext db) : ControllerBase
{
    private readonly AppDbContext _db = db ?? throw new ArgumentNullException(nameof(db));

    [HttpPost("reset")]
    public IActionResult Reset()
    {
        try
        {
            _db.Database.ExecuteSqlRaw("DELETE FROM Chats");
            _db.Database.ExecuteSqlRaw("DELETE FROM Messages");
            _db.Database.ExecuteSqlRaw("DELETE FROM JournalEntries");
            _db.Database.ExecuteSqlRaw("DELETE FROM MentalHealthReports");
            return Ok("Database reset successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while resetting the database: {ex.Message}");
        }
    }
}
