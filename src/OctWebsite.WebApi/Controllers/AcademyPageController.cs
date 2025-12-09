using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/academy-page")]
[Authorize]
public sealed class AcademyPageController(IAcademyPageService academyPageService, IWebHostEnvironment environment)
    : ControllerBase
{
    private const string AcademyMediaFolder = "uploads/academy";
    private const string AcademyLevelsFolder = "uploads/academy/levels";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<AcademyPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await academyPageService.GetAsync(cancellationToken);
        return Ok(ResolveMediaUrls(page));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<AcademyPageDto>> UpsertAsync(
        [FromForm] SaveAcademyPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, AcademyMediaFolder, form.HeroVideoFileName, cancellationToken);

        var request = new SaveAcademyPageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            form.Intro ?? string.Empty,
            heroVideoFileName,
            form.KidsFeatures?.Select(feature => new AcademyFeatureDto(
                feature.Title ?? string.Empty,
                feature.Description ?? string.Empty,
                feature.Icon ?? string.Empty)).ToArray() ?? Array.Empty<AcademyFeatureDto>(),
            form.FreelancingCourses?.Select(course => new FreelancingCourseDto(
                course.Title ?? string.Empty,
                course.Description ?? string.Empty,
                course.Icon ?? string.Empty)).ToArray() ?? Array.Empty<FreelancingCourseDto>());

        var saved = await academyPageService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveMediaUrls(saved));
    }

    private AcademyPageDto ResolveMediaUrls(AcademyPageDto dto)
    {
        return dto with
        {
            HeroVideo = Resolve(dto.HeroVideo, AcademyMediaFolder),
            Tracks = dto.Tracks.Select(ResolveTrackMedia).ToArray()
        };
    }

    private AcademyTrackDto ResolveTrackMedia(AcademyTrackDto track)
    {
        var resolvedLevels = track.Levels
            .Select(level => level with { Image = ResolveImage(level.Image, AcademyLevelsFolder) })
            .ToArray();

        return track with
        {
            HeroVideo = Resolve(track.HeroVideo, AcademyMediaFolder),
            HeroPoster = Resolve(track.HeroPoster, AcademyMediaFolder),
            Levels = resolvedLevels
        };
    }

    private MediaResourceDto? Resolve(MediaResourceDto? media, string folder)
    {
        if (media is null || string.IsNullOrWhiteSpace(media.FileName) || !string.IsNullOrWhiteSpace(media.Url))
        {
            return media;
        }

        var relativePath = BuildRelativePath(media.FileName, folder);
        var url = $"{Request.Scheme}://{Request.Host}/{relativePath}";
        return media with { Url = url };
    }

    private string ResolveImage(string? fileName, string folder)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return string.Empty;
        }

        var normalized = fileName.Trim();
        if (normalized.Contains("://"))
        {
            return normalized;
        }

        if (normalized.StartsWith("/"))
        {
            normalized = normalized.TrimStart('/');
        }

        if (normalized.StartsWith("uploads/", StringComparison.OrdinalIgnoreCase))
        {
            return $"{Request.Scheme}://{Request.Host}/{normalized}";
        }

        var relativePath = BuildRelativePath(normalized, folder);
        return $"{Request.Scheme}://{Request.Host}/{relativePath}";
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

public sealed class SaveAcademyFeatureFormRequest
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? Icon { get; set; }
}

public sealed class SaveFreelancingCourseFormRequest
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? Icon { get; set; }
}

public sealed class SaveAcademyPageFormRequest
{
    public string? HeaderEyebrow { get; set; }

    public string? HeaderTitle { get; set; }

    public string? HeaderSubtitle { get; set; }

    public string? Intro { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }

    public IList<SaveAcademyFeatureFormRequest>? KidsFeatures { get; set; }

    public IList<SaveFreelancingCourseFormRequest>? FreelancingCourses { get; set; }
}
