using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;
using HackSocial.MentalHealthApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HackSocial.MentalHealthApp.Api.Controllers;

[ApiController]
[Route("api/journalEntries")]
public class JournalEntriesController(JournalService userService) : ControllerBase
{
    private readonly JournalService _userService = userService ?? throw new ArgumentNullException(nameof(userService));

    // Fixed userId for demonstration purposes
    private readonly Guid userId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    [HttpGet]
    [Route("")]
    public ActionResult<IEnumerable<GetJournalEntryDto>> GetUserJournalEntries()
    {
        if (userId == Guid.Empty)
        {
            return BadRequest("Invalid user ID.");
        }

        var users = _userService.GetJournalEntriesByUserId(userId);
        return Ok(users);
    }

    [HttpPost]
    [Route("")]
    public ActionResult<GetJournalEntryDto> InsertUserJournalEntries(Guid userId, [FromBody] CreateJournalEntryDto journalEntryInsertDTO)
    {
        if (userId == Guid.Empty || journalEntryInsertDTO == null)
        {
            return BadRequest("Invalid user ID or log entry data.");
        }
        var userJournalEntry = _userService.InsertJournalEntry(userId, journalEntryInsertDTO);
        return Ok(userJournalEntry);
    }

    [HttpPut]
    [Route("{journalId}")]
    public ActionResult<GetJournalEntryDto> UpdateUserJournalEntries(Guid userId, Guid journalId, [FromBody] CreateJournalEntryDto journalEntryInsertDTO)
    {
        if (userId == Guid.Empty || journalId == Guid.Empty || journalEntryInsertDTO == null)
        {
            return BadRequest("Invalid user ID, log ID, or log entry data.");
        }
        var updatedLog = _userService.UpdateJournalEntry(userId, journalId, journalEntryInsertDTO);
        return Ok(updatedLog);
    }

    [HttpDelete]
    [Route("{journalId}")]
    public IActionResult DeleteUserJournalEntries(Guid userId, Guid journalId)
    {
        if (userId == Guid.Empty || journalId == Guid.Empty)
        {
            return BadRequest("Invalid user ID or log ID.");
        }
        _userService.DeleteJournalEntry(userId, journalId);
        return NoContent();
    }

    [HttpGet]
    [Route("/scoreHistory")]
    public ActionResult<KeyValuePair<DateTime,int>> GetUserJournalEntriesScores()
    {
        if (userId == Guid.Empty)
        {
            return BadRequest("Invalid user ID.");
        }
        var scores = _userService.GetFeelingScoreHistory(userId);
        return Ok(scores);
    }


}
