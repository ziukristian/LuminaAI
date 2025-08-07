using HackSocial.MentalHealthApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HackSocial.MentalHealthApp.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class MentalHealthReportsController(MentalHealthReportsService reportsService) : ControllerBase
{
    private readonly MentalHealthReportsService _reportsService = reportsService ?? throw new ArgumentNullException(nameof(reportsService));

    // Fixed userId for demonstration purposes
    private readonly Guid userId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    [HttpGet]
    [Route("")]
    public IActionResult GetMentalHealthReports()
    {
        if (userId == Guid.Empty)
        {
            return BadRequest("Invalid user ID.");
        }
        var reports = _reportsService.GetMentalHealthReportsByUserId(userId);
        return Ok(reports);
    }

    [HttpPost]
    [Route("generate")]
    public IActionResult GenerateMentalHealthReport()
    {
        if (userId == Guid.Empty)
        {
            return BadRequest("Invalid user ID.");
        }
        var report = _reportsService.GenerateMentalHealthReport(userId);
        return Ok(report);
    }
}
