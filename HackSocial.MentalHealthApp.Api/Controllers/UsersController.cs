using HackSocial.MentalHealthApp.Api.DTOs;
using HackSocial.MentalHealthApp.Api.Model;
using HackSocial.MentalHealthApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HackSocial.MentalHealthApp.Api.Controllers;

[Route("api/users")]
public class UsersController(UserService userService) : ControllerBase
{
    private readonly UserService _userService = userService ?? throw new ArgumentNullException(nameof(userService));

    [HttpGet]
    [Route("{userId}/logs")]
    public IActionResult GetUserLogs(Guid userId)
    {
        if (userId == Guid.Empty)
        {
            return BadRequest("Invalid user ID.");
        }

        var users = _userService.GetUserLogsById(userId);
        return Ok(users);
    }

    [HttpPost]
    [Route("{userId}/logs")]
    public IActionResult InsertUserLog(Guid userId, [FromBody] UserLogEntryInsertDTO userLogEntryInsertDTO)
    {
        if (userId == Guid.Empty || userLogEntryInsertDTO == null)
        {
            return BadRequest("Invalid user ID or log entry data.");
        }
        var userLogEntry = _userService.InsertUserLog(userId, userLogEntryInsertDTO);
        return CreatedAtAction(nameof(GetUserLogs), new { userId }, userLogEntry);
    }

    [HttpPut]
    [Route("{userId}/logs/{logId}")]
    public IActionResult UpdateUserLog(Guid userId, Guid logId, [FromBody] UserLogEntryInsertDTO userLogEntryInsertDTO)
    {
        if (userId == Guid.Empty || logId == Guid.Empty || userLogEntryInsertDTO == null)
        {
            return BadRequest("Invalid user ID, log ID, or log entry data.");
        }
        var updatedLog = _userService.UpdateUserLog(userId, logId, userLogEntryInsertDTO);
        return Ok(updatedLog);
    }

    [HttpDelete]
    [Route("{userId}/logs/{logId}")]
    public IActionResult DeleteUserLog(Guid userId, Guid logId)
    {
        if (userId == Guid.Empty || logId == Guid.Empty)
        {
            return BadRequest("Invalid user ID or log ID.");
        }
        _userService.DeleteUserLog(userId, logId);
        return NoContent();
    }


}
