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

        var users = _db.Users.ToList();
        return Ok(users);
    }
}
