using System;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/blog-page")]
[Authorize]
public sealed class BlogPageController(IBlogPageService blogPageService, IWebHostEnvironment environment) : ControllerBase
{
    private const string MediaFolder = "uploads/blog";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<BlogPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await blogPageService.GetAsync(cancellationToken);
        return Ok(Resolve(page));
    }

    [HttpPut]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<BlogPageDto>> UpsertAsync(
        [FromForm] SaveBlogPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, form.HeroVideoFileName, cancellationToken);

        var request = new SaveBlogPageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            heroVideoFileName);

        var updated = await blogPageService.UpsertAsync(request, cancellationToken);
        return Ok(Resolve(updated));
    }

    private BlogPageDto Resolve(BlogPageDto dto)
    {
        return dto with
        {
            HeroVideo = Resolve(dto.HeroVideo)
        };
    }

    private MediaResourceDto? Resolve(MediaResourceDto? media)
    {
        if (media is null || !string.IsNullOrWhiteSpace(media.Url))
        {
            return media;
        }

        if (string.IsNullOrWhiteSpace(media.FileName))
        {
            return media;
        }

        var relative = BuildRelativePath(media.FileName, MediaFolder);
        if (Uri.TryCreate(relative, UriKind.Absolute, out var absolute))
        {
            return media with { Url = absolute.ToString() };
        }

        var url = $"{Request.Scheme}://{Request.Host}/{relative}";
        return media with { Url = url };
    }

    private static string BuildRelativePath(string fileName, string folder)
    {
        var normalized = fileName.Trim().Replace("\\", "/");
        if (Uri.TryCreate(normalized, UriKind.Absolute, out var absolute))
        {
            return absolute.ToString();
        }

        var trimmed = normalized.TrimStart('/');
        if (normalized.StartsWith("/"))
        {
            return trimmed;
        }

        if (trimmed.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return trimmed;
        }

        if (trimmed.Contains('/'))
        {
            return $"uploads/{trimmed}";
        }

        var normalizedFolder = folder.Trim('/').Replace("\\", "/");
        return $"{normalizedFolder}/{normalized}";
    }

    private async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string? existingFileName, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

        var uploadsRoot = EnsureUploadsFolder();
        var extension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(extension) ? $"{Guid.NewGuid():N}.bin" : $"{Guid.NewGuid()}{extension}";
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

        var uploads = Path.Combine(webRoot, MediaFolder.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(uploads);
        return uploads;
    }
}

public sealed class SaveBlogPageFormRequest
{
    public string? HeaderEyebrow { get; set; }

    public string? HeaderTitle { get; set; }

    public string? HeaderSubtitle { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }
}
