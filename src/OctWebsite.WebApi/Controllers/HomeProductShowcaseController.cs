using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/home-showcase")]
[Authorize]
public sealed class HomeProductShowcaseController(IProductShowcaseService service, IWebHostEnvironment environment)
    : ControllerBase
{
    private const string UploadFolder = "uploads/showcase";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<ProductShowcaseDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var items = await service.GetAllAsync(cancellationToken);
        return Ok(items.Select(ResolveMediaUrls));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductShowcaseDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var item = await service.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound() : Ok(ResolveMediaUrls(item));
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductShowcaseDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var item = await service.GetBySlugAsync(slug, cancellationToken);
        return item is null ? NotFound() : Ok(ResolveMediaUrls(item));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ProductShowcaseDto>> CreateAsync(
        [FromForm] SaveProductShowcaseFormRequest form,
        IFormFile? primaryImage,
        IFormFile? projectScreenshot,
        CancellationToken cancellationToken)
    {
        var primaryImageFileName = await StoreMediaIfNeededAsync(primaryImage, form.ImageUrl, cancellationToken);
        var screenshotFileName = await StoreMediaIfNeededAsync(projectScreenshot, form.ProjectScreenshotUrl, cancellationToken);

        var request = BuildRequest(form, primaryImageFileName, screenshotFileName);
        var created = await service.CreateAsync(request, cancellationToken);
        var hydrated = ResolveMediaUrls(created);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, hydrated);
    }

    [HttpPut("{id:guid}")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ProductShowcaseDto>> UpdateAsync(
        Guid id,
        [FromForm] SaveProductShowcaseFormRequest form,
        IFormFile? primaryImage,
        IFormFile? projectScreenshot,
        CancellationToken cancellationToken)
    {
        var existing = await service.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        var primaryImageFileName = await StoreMediaIfNeededAsync(primaryImage, form.ImageUrl ?? existing.ImageFileName, cancellationToken);
        var screenshotFileName = await StoreMediaIfNeededAsync(projectScreenshot, form.ProjectScreenshotUrl ?? existing.ProjectScreenshotFileName, cancellationToken);

        var request = BuildRequest(form, primaryImageFileName, screenshotFileName);
        var updated = await service.UpdateAsync(id, request, cancellationToken);
        if (updated is null)
        {
            return NotFound();
        }

        DeleteIfReplaced(existing.ImageFileName, primaryImageFileName);
        DeleteIfReplaced(existing.ProjectScreenshotFileName, screenshotFileName);

        return Ok(ResolveMediaUrls(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var existing = await service.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        var deleted = await service.DeleteAsync(id, cancellationToken);
        if (deleted)
        {
            DeleteFileIfExists(existing.ImageFileName);
            DeleteFileIfExists(existing.ProjectScreenshotFileName);
        }

        return deleted ? NoContent() : NotFound();
    }

    private SaveProductShowcaseRequest BuildRequest(
        SaveProductShowcaseFormRequest form,
        string? primaryImageFileName,
        string? screenshotFileName)
    {
        return new SaveProductShowcaseRequest(
            form.Name ?? string.Empty,
            form.Slug ?? string.Empty,
            form.Description ?? string.Empty,
            primaryImageFileName ?? form.ImageUrl ?? string.Empty,
            form.BackgroundColor ?? string.Empty,
            screenshotFileName ?? form.ProjectScreenshotUrl ?? string.Empty,
            form.Highlights?.ToList() ?? new List<string>());
    }

    private ProductShowcaseDto ResolveMediaUrls(ProductShowcaseDto dto)
    {
        return dto with
        {
            ImageFileName = dto.ImageFileName,
            ImageUrl = Resolve(dto.ImageFileName ?? dto.ImageUrl),
            ProjectScreenshotFileName = dto.ProjectScreenshotFileName,
            ProjectScreenshotUrl = Resolve(dto.ProjectScreenshotFileName ?? dto.ProjectScreenshotUrl)
        };
    }

    private string Resolve(string? fileNameOrUrl)
    {
        if (string.IsNullOrWhiteSpace(fileNameOrUrl))
        {
            return string.Empty;
        }

        if (fileNameOrUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
            fileNameOrUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase) ||
            fileNameOrUrl.StartsWith("/uploads", StringComparison.OrdinalIgnoreCase))
        {
            return fileNameOrUrl;
        }

        var normalized = fileNameOrUrl.TrimStart('/').Replace("\\", "/");
        return $"{Request.Scheme}://{Request.Host}/{UploadFolder}/{normalized}";
    }

    private async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string? existingFileName, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

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

        var uploadsRoot = Path.Combine(webRoot, UploadFolder);
        Directory.CreateDirectory(uploadsRoot);
        return uploadsRoot;
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

    private void DeleteFileIfExists(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return;
        }

        var uploadsRoot = EnsureUploadsRoot();
        var filePath = Path.Combine(uploadsRoot, fileName);
        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }
}

public sealed class SaveProductShowcaseFormRequest
{
    public string? Name { get; set; }

    public string? Slug { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public string? BackgroundColor { get; set; }

    public string? ProjectScreenshotUrl { get; set; }

    public IList<string>? Highlights { get; set; } = new List<string>();

    public IFormFile? PrimaryImage { get; set; }

    public IFormFile? ProjectScreenshot { get; set; }
}
