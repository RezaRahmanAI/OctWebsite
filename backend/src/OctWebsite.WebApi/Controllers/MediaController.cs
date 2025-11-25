using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.WebApi.Contracts;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/media")]
[Authorize]
public sealed class MediaController(IWebHostEnvironment environment) : ControllerBase
{
    private static readonly HashSet<string> AllowedVideoContentTypes =
    [
        "video/mp4",
        "video/webm",
        "video/ogg"
    ];

    private static readonly HashSet<string> AllowedImageContentTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    [HttpPost("upload")]
    [RequestFormLimits(MultipartBodyLengthLimit = 524_288_000)]
    public async Task<ActionResult<MediaUploadResponse>> UploadAsync(
        [FromForm] IFormFile file,
        [FromQuery] string category = "general",
        CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest("No file was uploaded.");
        }

        if (!IsAllowedContentType(file.ContentType))
        {
            return BadRequest("Only common image (jpg, png, webp, gif) or video (mp4, webm, ogg) formats are supported.");
        }

        var uploadsRoot = EnsureUploadsRoot();
        var sanitizedCategory = string.IsNullOrWhiteSpace(category)
            ? "general"
            : category.Trim().ToLowerInvariant();

        var targetDirectory = Path.Combine(uploadsRoot, sanitizedCategory);
        Directory.CreateDirectory(targetDirectory);

        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(targetDirectory, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var relativePath = $"uploads/{sanitizedCategory}/{fileName}".Replace("\\", "/");
        var fileUrl = $"{Request.Scheme}://{Request.Host}/{relativePath}";

        return Ok(new MediaUploadResponse(fileUrl, fileName));
    }

    private bool IsAllowedContentType(string contentType)
        => AllowedVideoContentTypes.Contains(contentType) || AllowedImageContentTypes.Contains(contentType);

    private string EnsureUploadsRoot()
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(webRoot);
            environment.WebRootPath = webRoot;
        }

        var uploadsRoot = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsRoot);
        return uploadsRoot;
    }
}
