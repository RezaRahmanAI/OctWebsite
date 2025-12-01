using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/contact-page")]
[Authorize]
public sealed class ContactPageController(IContactPageService contactPageService, IWebHostEnvironment environment) : ControllerBase
{
    private const string HeroFolder = "uploads/contact";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ContactPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await contactPageService.GetAsync(cancellationToken);
        return Ok(ResolveMedia(page));
    }

    [HttpPut]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ContactPageDto>> UpsertAsync(
        [FromForm] SaveContactPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, HeroFolder, form.HeroVideoFileName, cancellationToken);

        var request = new SaveContactPageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            heroVideoFileName,
            form.HeroMetaLine ?? string.Empty,
            form.PrimaryCtaLabel ?? string.Empty,
            form.PrimaryCtaLink ?? string.Empty,
            form.ConsultationOptions ?? string.Empty,
            form.RegionalSupport ?? string.Empty,
            form.Emails?.Where(e => !string.IsNullOrWhiteSpace(e)).Select(e => e.Trim()).ToArray() ?? Array.Empty<string>(),
            form.FormOptions?.Where(e => !string.IsNullOrWhiteSpace(e)).Select(e => e.Trim()).ToArray() ?? Array.Empty<string>(),
            form.NdaLabel ?? string.Empty,
            form.ResponseTime ?? string.Empty,
            form.OfficesEyebrow ?? string.Empty,
            form.OfficesTitle ?? string.Empty,
            form.OfficesDescription ?? string.Empty,
            ParseOffices(form.OfficesJson),
            form.MapEmbedUrl ?? string.Empty,
            form.MapTitle ?? string.Empty,
            form.Headquarters ?? string.Empty,
            form.BusinessHours?.Where(e => !string.IsNullOrWhiteSpace(e)).Select(e => e.Trim()).ToArray() ?? Array.Empty<string>(),
            form.ProfileDownloadLabel ?? string.Empty,
            form.ProfileDownloadUrl ?? string.Empty);

        var updated = await contactPageService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveMedia(updated));
    }

    private ContactPageDto ResolveMedia(ContactPageDto dto)
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

    private static IReadOnlyList<ContactOfficeDto> ParseOffices(string? officesJson)
    {
        if (string.IsNullOrWhiteSpace(officesJson))
        {
            return Array.Empty<ContactOfficeDto>();
        }

        var parsed = JsonSerializer.Deserialize<IReadOnlyList<ContactOfficeDto>>(officesJson, JsonOptions);
        return parsed ?? Array.Empty<ContactOfficeDto>();
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

public sealed class SaveContactPageFormRequest
{
    public string? HeaderEyebrow { get; set; }

    public string? HeaderTitle { get; set; }

    public string? HeaderSubtitle { get; set; }

    public string? HeroVideoFileName { get; set; }

    public IFormFile? HeroVideo { get; set; }

    public string? HeroMetaLine { get; set; }

    public string? PrimaryCtaLabel { get; set; }

    public string? PrimaryCtaLink { get; set; }

    public string? ConsultationOptions { get; set; }

    public string? RegionalSupport { get; set; }

    public IList<string>? Emails { get; set; }

    public IList<string>? FormOptions { get; set; }

    public string? NdaLabel { get; set; }

    public string? ResponseTime { get; set; }

    public string? OfficesEyebrow { get; set; }

    public string? OfficesTitle { get; set; }

    public string? OfficesDescription { get; set; }

    public string? OfficesJson { get; set; }

    public string? MapEmbedUrl { get; set; }

    public string? MapTitle { get; set; }

    public string? Headquarters { get; set; }

    public IList<string>? BusinessHours { get; set; }

    public string? ProfileDownloadLabel { get; set; }

    public string? ProfileDownloadUrl { get; set; }
}
