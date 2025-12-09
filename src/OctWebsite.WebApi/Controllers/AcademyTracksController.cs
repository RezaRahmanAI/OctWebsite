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
[Route("api/academy-tracks")]
[Authorize]
public sealed class AcademyTracksController(IAcademyTrackService trackService, IWebHostEnvironment environment) : ControllerBase
{
    private const string HeroMediaFolder = "uploads/academy";
    private const string LevelMediaFolder = "uploads/academy/levels";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<AcademyTrackDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var tracks = await trackService.GetAllAsync(cancellationToken);
        return Ok(tracks.Select(ResolveMediaUrls).ToArray());
    }

    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<AcademyTrackDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var track = await trackService.GetBySlugAsync(slug, cancellationToken);
        if (track is null)
        {
            return NotFound();
        }

        return Ok(ResolveMediaUrls(track));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<AcademyTrackDto>> CreateAsync(
        [FromForm] SaveAcademyTrackFormRequest form,
        CancellationToken cancellationToken)
    {
        var request = await MapAsync(form, null, cancellationToken);
        var created = await trackService.CreateAsync(request, cancellationToken);
        var hydrated = ResolveMediaUrls(created);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, hydrated);
    }

    [HttpPost("{id:guid}")]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<AcademyTrackDto>> UpdateAsync(
        Guid id,
        [FromForm] SaveAcademyTrackFormRequest form,
        CancellationToken cancellationToken)
    {
        var existing = (await trackService.GetAllAsync(cancellationToken)).FirstOrDefault(track => track.Id == id);
        if (existing is null)
        {
            return NotFound();
        }

        var request = await MapAsync(form, existing, cancellationToken);
        var updated = await trackService.UpdateAsync(id, request, cancellationToken);
        return Ok(ResolveMediaUrls(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await trackService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private async Task<SaveAcademyTrackRequest> MapAsync(
        SaveAcademyTrackFormRequest form,
        AcademyTrackDto? existing,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(
            form.HeroVideo,
            HeroMediaFolder,
            form.HeroVideoFileName ?? existing?.HeroVideo?.FileName,
            cancellationToken);

        var heroPosterFileName = await StoreMediaIfNeededAsync(
            form.HeroPoster,
            HeroMediaFolder,
            form.HeroPosterFileName ?? existing?.HeroPoster?.FileName,
            cancellationToken);

        var levels = new List<SaveAcademyTrackLevelRequest>();
        var existingLevels = existing?.Levels ?? Array.Empty<AcademyTrackLevelDto>();
        for (var i = 0; i < (form.Levels?.Count ?? 0); i++)
        {
            var levelForm = form.Levels![i];
            var previous = existingLevels.ElementAtOrDefault(i);
            var imageFileName = await StoreMediaIfNeededAsync(
                levelForm.ImageFile,
                LevelMediaFolder,
                levelForm.ImageFileName ?? previous?.Image,
                cancellationToken);

            levels.Add(new SaveAcademyTrackLevelRequest(
                levelForm.Title ?? string.Empty,
                levelForm.Duration ?? string.Empty,
                levelForm.Description ?? string.Empty,
                levelForm.Tools?.ToArray() ?? Array.Empty<string>(),
                levelForm.Outcomes?.ToArray() ?? Array.Empty<string>(),
                levelForm.Project ?? string.Empty,
                imageFileName ?? levelForm.ImageFileName ?? previous?.Image ?? string.Empty));
        }

        var steps = form.AdmissionSteps?.Select(step => new SaveAdmissionStepRequest(
            step.Title ?? string.Empty,
            step.Description ?? string.Empty)).ToArray() ?? Array.Empty<SaveAdmissionStepRequest>();

        return new SaveAcademyTrackRequest(
            form.Title ?? string.Empty,
            form.Slug ?? string.Empty,
            form.AgeRange ?? string.Empty,
            form.Duration ?? string.Empty,
            form.PriceLabel ?? string.Empty,
            form.Audience ?? string.Empty,
            form.Format ?? string.Empty,
            form.Summary ?? string.Empty,
            heroVideoFileName,
            heroPosterFileName,
            form.Highlights?.ToArray() ?? Array.Empty<string>(),
            form.LearningOutcomes?.ToArray() ?? Array.Empty<string>(),
            levels,
            steps,
            form.CallToActionLabel ?? string.Empty,
            form.Active ?? false);
    }

    private AcademyTrackDto ResolveMediaUrls(AcademyTrackDto dto)
    {
        var resolvedLevels = dto.Levels
            .Select(level => level with { Image = ResolveImage(level.Image) })
            .ToArray();

        return dto with
        {
            HeroVideo = Resolve(dto.HeroVideo, HeroMediaFolder),
            HeroPoster = Resolve(dto.HeroPoster, HeroMediaFolder),
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

    private string ResolveImage(string? fileName)
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

        var relativePath = BuildRelativePath(normalized, LevelMediaFolder);
        return $"{Request.Scheme}://{Request.Host}/{relativePath}";
    }

    private static string BuildRelativePath(string fileName, string folder)
    {
        var normalizedFolder = folder.Trim('/').Replace("\\", "/");
        return $"{normalizedFolder}/{fileName.Trim().TrimStart('/').Replace("\\", "/")}";
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

public sealed class SaveAcademyTrackLevelFormRequest
{
    public string? Title { get; set; }

    public string? Duration { get; set; }

    public string? Description { get; set; }

    public IList<string>? Tools { get; set; }

    public IList<string>? Outcomes { get; set; }

    public string? Project { get; set; }

    public string? ImageFileName { get; set; }

    public IFormFile? ImageFile { get; set; }
}

public sealed class SaveAdmissionStepFormRequest
{
    public string? Title { get; set; }

    public string? Description { get; set; }
}

public sealed class SaveAcademyTrackFormRequest
{
    public string? Title { get; set; }

    public string? Slug { get; set; }

    public string? AgeRange { get; set; }

    public string? Duration { get; set; }

    public string? PriceLabel { get; set; }

    public string? Audience { get; set; }

    public string? Format { get; set; }

    public string? Summary { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }

    public string? HeroPosterFileName { get; set; }

    public IFormFile? HeroPoster { get; set; }

    public IList<string>? Highlights { get; set; }

    public IList<string>? LearningOutcomes { get; set; }

    public IList<SaveAcademyTrackLevelFormRequest>? Levels { get; set; }

    public IList<SaveAdmissionStepFormRequest>? AdmissionSteps { get; set; }

    public string? CallToActionLabel { get; set; }

    public bool? Active { get; set; }
}
