using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/career-applications")]
public sealed class CareerApplicationsController(ICareerService careerService, IWebHostEnvironment environment) : ControllerBase
{
    [HttpPost]
    [AllowAnonymous]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<CareerApplicationDto>> SubmitAsync(
        [FromForm] Guid jobPostingId,
        [FromForm] string fullName,
        [FromForm] string email,
        [FromForm] string? phone,
        [FromForm] string? message,
        IFormFile? cv,
        CancellationToken cancellationToken)
    {
        if (cv is null || cv.Length == 0)
        {
            return BadRequest("A CV/resume file is required.");
        }

        var cvFileName = await StoreDocumentAsync(cv, cancellationToken);
        var request = new SubmitCareerApplicationRequest(jobPostingId, fullName, email, phone, message, cvFileName);

        try
        {
            var created = await careerService.SubmitApplicationAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetRecentAsync), new { }, ResolveCvUrl(created));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return ValidationProblem(new ValidationProblemDetails
            {
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<CareerApplicationDto>>> GetRecentAsync(
        [FromQuery] int take = 200,
        CancellationToken cancellationToken = default)
    {
        var applications = await careerService.GetRecentApplicationsAsync(take, cancellationToken);
        var hydrated = applications.Select(ResolveCvUrl).ToArray();
        return Ok(hydrated);
    }

    private CareerApplicationDto ResolveCvUrl(CareerApplicationDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CvFileName))
        {
            return dto;
        }

        var normalized = dto.CvFileName.TrimStart('/').Replace("\\", "/");
        var url = $"{Request.Scheme}://{Request.Host}/uploads/careers/{normalized}";
        return dto with { CvUrl = url };
    }

    private async Task<string> StoreDocumentAsync(IFormFile file, CancellationToken cancellationToken)
    {
        var uploadsRoot = EnsureUploadsRoot();
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(fileExtension)
            ? $"{Guid.NewGuid():N}.bin"
            : $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return fileName;
    }

    private string EnsureUploadsRoot()
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(webRoot);
            environment.WebRootPath = webRoot;
        }

        var uploadsRoot = Path.Combine(webRoot, "uploads", "careers");
        Directory.CreateDirectory(uploadsRoot);
        return uploadsRoot;
    }
}
