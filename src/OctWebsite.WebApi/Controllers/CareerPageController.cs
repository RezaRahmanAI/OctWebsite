using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/career-page")]
[Authorize]
public sealed class CareerPageController(ICareerPageService careerPageService, IWebHostEnvironment environment) : ControllerBase
{
    private const string HeroFolder = "uploads/careers";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<CareerPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await careerPageService.GetAsync(cancellationToken);
        return Ok(ResolveMedia(page));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<CareerPageDto>> UpsertAsync(
        [FromForm] SaveCareerPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, HeroFolder, form.HeroVideoFileName, cancellationToken);

        var request = new SaveCareerPageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            heroVideoFileName,
            form.HeroMetaLine ?? string.Empty,
            form.PrimaryCtaLabel ?? string.Empty,
            form.PrimaryCtaLink ?? string.Empty,
            form.ResponseTime ?? string.Empty);

        var updated = await careerPageService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveMedia(updated));
    }

    private CareerPageDto ResolveMedia(CareerPageDto dto)
    {
        if (dto.HeroVideo is null || !string.IsNullOrWhiteSpace(dto.HeroVideo.Url))
        {
            return dto;
        }

        if (string.IsNullOrWhiteSpace(dto.HeroVideo.FileName))
        {
            return dto;
        }

        var relativePath = BuildRelativePath(dto.HeroVideo.FileName, HeroFolder);
        var url = $"{Request.Scheme}://{Request.Host}/{relativePath}";
        return dto with { HeroVideo = dto.HeroVideo with { Url = url } };
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
            return trimmed;
        }

        var normalizedFolder = folder.Trim('/').Replace("\\", "/");
        return $"{normalizedFolder}/{normalized}";
    }

    private async Task<string?> StoreMediaIfNeededAsync(
        IFormFile? file,
        string folder,
        string? existingFileName,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existingFileName;
        }

        var uploadsRoot = EnsureUploadsFolder(folder);
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = string.IsNullOrWhiteSpace(fileExtension)
            ? $"{Guid.NewGuid():N}.bin"
            : $"{Guid.NewGuid()}{fileExtension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return fileName;
    }

    private string EnsureUploadsFolder(string folder)
    {
        var webRoot = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(environment.ContentRootPath, "wwwroot");
            Directory.CreateDirectory(webRoot);
            environment.WebRootPath = webRoot;
        }

        var uploadsFolder = Path.Combine(webRoot, folder.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(uploadsFolder);
        return uploadsFolder;
    }
}

public sealed class SaveCareerPageFormRequest
{
    public string? HeaderEyebrow { get; set; }

    public string? HeaderTitle { get; set; }

    public string? HeaderSubtitle { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }

    public string? HeroMetaLine { get; set; }

    public string? PrimaryCtaLabel { get; set; }

    public string? PrimaryCtaLink { get; set; }

    public string? ResponseTime { get; set; }
}
