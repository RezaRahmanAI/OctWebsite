using Microsoft.AspNetCore.Mvc;
using OctWebsite.WebApi.Contracts;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/media")]
public sealed class MediaController(IWebHostEnvironment environment) : ControllerBase
{
    private static readonly HashSet<string> AllowedVideoContentTypes =
    [
        "video/mp4",
        "video/webm",
        "video/ogg"
    ];

    [HttpPost("upload")]
    [RequestFormLimits(MultipartBodyLengthLimit = 524_288_000)]
    public async Task<ActionResult<MediaUploadResponse>> UploadAsync(
        [FromForm] IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }

        if (!AllowedVideoContentTypes.Contains(file.ContentType))
        {
            return BadRequest("Only MP4, WebM, or OGG video files are supported.");
        }

        var uploadsRoot = Path.Combine(environment.ContentRootPath, "uploads", "videos");
        Directory.CreateDirectory(uploadsRoot);

        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/videos/{fileName}";

        return Ok(new MediaUploadResponse(fileUrl));
    }
}
