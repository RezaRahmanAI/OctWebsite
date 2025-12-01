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
[Route("api/about-page")]
[Authorize]
public sealed class AboutPageController(IAboutPageService aboutPageService, IWebHostEnvironment environment) : ControllerBase
{
    private const string GeneralFolder = "uploads/general";
    private const string ValuesFolder = "uploads/values";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<AboutPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await aboutPageService.GetAsync(cancellationToken);
        return Ok(ResolveMediaUrls(page));
    }

    
    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<AboutPageDto>> UpsertAsync(
        [FromForm] SaveAboutPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, GeneralFolder, form.HeroVideoFileName, cancellationToken);
        var missionImageFileName = await StoreMediaIfNeededAsync(form.MissionImage, GeneralFolder, form.MissionImageFileName, cancellationToken);
        var storyImageFileName = await StoreMediaIfNeededAsync(form.StoryImage, GeneralFolder, form.StoryImageFileName, cancellationToken);

        var values = new List<SaveAboutValueRequest>(form.Values?.Count ?? 0);
        foreach (var value in form.Values ?? Array.Empty<SaveAboutValueFormRequest>())
        {
            var videoFileName = await StoreMediaIfNeededAsync(value.Video, ValuesFolder, value.VideoFileName, cancellationToken);
            values.Add(new SaveAboutValueRequest(
                value.Title ?? string.Empty,
                value.Description ?? string.Empty,
                videoFileName));
        }

        var request = new SaveAboutPageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            heroVideoFileName,
            form.Intro ?? string.Empty,
            form.MissionTitle ?? string.Empty,
            form.MissionDescription ?? string.Empty,
            form.VisionTitle ?? string.Empty,
            form.VisionDescription ?? string.Empty,
            missionImageFileName,
            values,
            form.StoryTitle ?? string.Empty,
            form.StoryDescription ?? string.Empty,
            storyImageFileName,
            form.TeamTitle ?? string.Empty,
            form.TeamSubtitle ?? string.Empty,
            form.TeamNote);

        var updated = await aboutPageService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveMediaUrls(updated));
    }

    private AboutPageDto ResolveMediaUrls(AboutPageDto dto)
    {
        return dto with
        {
            HeroVideo = Resolve(dto.HeroVideo, GeneralFolder),
            MissionImage = Resolve(dto.MissionImage, GeneralFolder),
            StoryImage = Resolve(dto.StoryImage, GeneralFolder),
            Values = dto.Values
                .Select(value => value with { Video = Resolve(value.Video, ValuesFolder) })
                .ToArray()
        };
    }

    private MediaResourceDto? Resolve(MediaResourceDto? media, string folder)
    {
        if (media is null || string.IsNullOrWhiteSpace(media.FileName))
        {
            return media;
        }

        if (!string.IsNullOrWhiteSpace(media.Url))
        {
            return media;
        }

        var relativePath = BuildRelativePath(media.FileName, folder);
        var url = $"{Request.Scheme}://{Request.Host}/{relativePath}";
        return media with { Url = url };
    }

    private string BuildRelativePath(string fileName, string folder)
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

public sealed class SaveAboutValueFormRequest
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? VideoFileName { get; set; }

    public IFormFile? Video { get; set; }
}

public sealed class SaveAboutPageFormRequest
{
    public string? HeaderEyebrow { get; set; }

    public string? HeaderTitle { get; set; }

    public string? HeaderSubtitle { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }

    public string? Intro { get; set; }

    public string? MissionTitle { get; set; }

    public string? MissionDescription { get; set; }

    public string? VisionTitle { get; set; }

    public string? VisionDescription { get; set; }

    public string? MissionImageFileName { get; set; }

    public IFormFile? MissionImage { get; set; }

    public IList<SaveAboutValueFormRequest> Values { get; set; } = new List<SaveAboutValueFormRequest>();

    public string? StoryTitle { get; set; }

    public string? StoryDescription { get; set; }

    public string? StoryImageFileName { get; set; }

    public IFormFile? StoryImage { get; set; }

    public string? TeamTitle { get; set; }

    public string? TeamSubtitle { get; set; }

    public string? TeamNote { get; set; }
}
