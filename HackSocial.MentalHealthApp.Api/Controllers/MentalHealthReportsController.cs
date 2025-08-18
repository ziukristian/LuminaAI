using HackSocial.MentalHealthApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HackSocial.MentalHealthApp.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class MentalHealthReportsController : ControllerBase
{
    private readonly MentalHealthReportService _reportsService;

    // Fixed userId for demonstration purposes
    private readonly Guid userId = Guid.Parse("00000000-0000-0000-0000-000000000001");

    public MentalHealthReportsController(MentalHealthReportService reportsService)
    {
        _reportsService = reportsService ?? throw new ArgumentNullException(nameof(reportsService));
    }

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
    public async Task<IActionResult> GenerateMentalHealthReport()
    {
        if (userId == Guid.Empty)
        {
            return BadRequest("Invalid user ID.");
        }

        try
        {
            var report = await _reportsService.GenerateMentalHealthReport(userId);
            return Ok(report);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while generating the mental health report.");
        }
    }

    [HttpGet]
    [Route("{reportId}/download")]
    public async Task<IActionResult> DownloadMentalHealthReport(Guid reportId)
    {
        if (reportId == Guid.Empty)
        {
            return BadRequest("Invalid report ID.");
        }

        var report = await _reportsService.DownloadHealthReportFileByReportId(reportId);

        if (report == null)
        {
            return NotFound("Report not found.");
        }

        return File(report, "application/pdf", $"MentalHealthReport_{reportId}.pdf");
    }
}
