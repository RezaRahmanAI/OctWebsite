using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/services")]
[Authorize]
public sealed class ServicesController(IServiceCatalog catalog, IWebHostEnvironment environment) : ControllerBase
{
    private const string UploadFolder = "uploads/service";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<ServiceDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var services = await catalog.GetAllAsync(cancellationToken);
        return Ok(services.Select(ResolveMediaUrls));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var service = await catalog.GetByIdAsync(id, cancellationToken);
        return service is null ? NotFound() : Ok(ResolveMediaUrls(service));
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var service = await catalog.GetBySlugAsync(slug, cancellationToken);
        return service is null ? NotFound() : Ok(ResolveMediaUrls(service));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ServiceDto>> CreateAsync([FromForm] SaveServiceFormRequest form, CancellationToken cancellationToken)
    {
        var backgroundFileName = await StoreMediaIfNeededAsync(form.BackgroundImage, form.BackgroundImageFileName, cancellationToken);
        var request = BuildRequest(form, backgroundFileName);
        var created = await catalog.CreateAsync(request, cancellationToken);
        var hydrated = ResolveMediaUrls(created);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = hydrated.Id }, hydrated);
    }

    [HttpPost("{id:guid}")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ServiceDto>> UpdateAsync(Guid id, [FromForm] SaveServiceFormRequest form, CancellationToken cancellationToken)
    {
        var existing = await catalog.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        var backgroundFileName = await StoreMediaIfNeededAsync(form.BackgroundImage, form.BackgroundImageFileName ?? existing.BackgroundImage?.FileName, cancellationToken);
        var request = BuildRequest(form, backgroundFileName);
        var updated = await catalog.UpdateAsync(id, request, cancellationToken);
        if (updated is null)
        {
            return NotFound();
        }

        DeleteIfReplaced(existing.BackgroundImage?.FileName, backgroundFileName);

        return Ok(ResolveMediaUrls(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var existing = await catalog.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        var deleted = await catalog.DeleteAsync(id, cancellationToken);
        if (deleted)
        {
            DeleteFileIfExists(existing.BackgroundImage?.FileName);
        }

        return deleted ? NoContent() : NotFound();
    }

    private SaveServiceRequest BuildRequest(SaveServiceFormRequest form, string? backgroundImage)
    {
        return new SaveServiceRequest(
            form.Title ?? string.Empty,
            form.Subtitle,
            form.Slug ?? string.Empty,
            form.Summary ?? string.Empty,
            form.Description,
            form.Icon,
            backgroundImage,
            form.Features?.ToList() ?? new List<string>(),
            form.Active,
            form.Featured);
    }

    private ServiceDto ResolveMediaUrls(ServiceDto dto)
    {
        return dto with
        {
            BackgroundImage = Resolve(dto.BackgroundImage),
        };
    }

    private ServiceMediaDto? Resolve(ServiceMediaDto? media)
    {
        if (media is null || string.IsNullOrWhiteSpace(media.FileName))
        {
            return media;
        }

        if (!string.IsNullOrWhiteSpace(media.Url))
        {
            return media;
        }

        var relativePath = BuildRelativePath(media.FileName);
        var url = $"{Request.Scheme}://{Request.Host}/{relativePath}";
        return media with { Url = url };
    }

    private string BuildRelativePath(string fileName)
    {
        var normalized = fileName.Trim().Replace("\\", "/");
        if (normalized.Contains('/'))
        {
            var trimmed = normalized.TrimStart('/');
            if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
            {
                return trimmed;
            }

            return $"uploads/{trimmed}";
        }

        var normalizedFolder = UploadFolder.Trim('/').Replace("\\", "/");
        return $"{normalizedFolder}/{normalized}";
    }

    private async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string? existingFileName, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

        var uploadsRoot = EnsureUploadsFolder();
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(fileExtension)
            ? $"{Guid.NewGuid():N}.bin"
            : $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return fileName;
    }

    private string EnsureUploadsFolder()
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(webRoot);
            environment.WebRootPath = webRoot;
        }

        var uploadsFolder = Path.Combine(webRoot, UploadFolder.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(uploadsFolder);
        return uploadsFolder;
    }

    private void DeleteFileIfExists(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return;
        }

        var normalized = fileName.Replace("\\", "/");
        var path = normalized.StartsWith("uploads/") ? normalized[8..] : normalized;
        var uploadsRoot = EnsureUploadsFolder();
        var filePath = Path.Combine(uploadsRoot, Path.GetFileName(path));
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }

    private void DeleteIfReplaced(string? previousFileName, string? currentFileName)
    {
        if (string.IsNullOrWhiteSpace(previousFileName) || string.IsNullOrWhiteSpace(currentFileName))
        {
            return;
        }

        if (!string.Equals(previousFileName, currentFileName, StringComparison.OrdinalIgnoreCase))
        {
            DeleteFileIfExists(previousFileName);
        }
    }
}

public sealed class SaveServiceFormRequest
{
    public string? Title { get; set; }

    public string? Subtitle { get; set; }

    public string? Slug { get; set; }

    public string? Summary { get; set; }

    public string? Description { get; set; }

    public string? Icon { get; set; }

    public string? BackgroundImageFileName { get; set; }

    public IFormFile? BackgroundImage { get; set; }

    public IList<string> Features { get; set; } = new List<string>();

    public bool Active { get; set; } = true;

    public bool Featured { get; set; }
}
