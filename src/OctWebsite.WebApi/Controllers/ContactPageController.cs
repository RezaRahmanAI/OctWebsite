using System;
using System.Collections.Generic;
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
public sealed class ContactPageController(
    IContactPageService contactPageService,
    IWebHostEnvironment environment) : HomeMediaControllerBase(environment)
{
    private const string HeroFolder = "uploads/contact";
    private const string OfficesFolder = "uploads/contact/offices";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ContactPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await contactPageService.GetAsync(cancellationToken);
        return Ok(ResolveMedia(page));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ContactPageDto>> UpsertAsync(
        [FromForm] SaveContactPageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroVideoFileName = await StoreMediaIfNeededAsync(form.HeroVideo, HeroFolder, form.HeroVideoFileName, cancellationToken);

        var offices = await ApplyOfficeImagesAsync(
            ParseOffices(form.OfficesJson),
            form.OfficeImages,
            form.OfficeImageFileNames,
            cancellationToken);

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
            offices,
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
        var heroVideo = Resolve(dto.HeroVideo, HeroFolder);
        var offices = dto.Offices.Select(ResolveOfficeMedia).ToArray();

        return dto with
        {
            HeroVideo = heroVideo,
            Offices = offices,
        };
    }

    private ContactOfficeDto ResolveOfficeMedia(ContactOfficeDto office)
    {
        if (string.IsNullOrWhiteSpace(office.ImageUrl))
        {
            return office;
        }

        var url = BuildAbsoluteUrl(office.ImageUrl, OfficesFolder);
        return office with { ImageUrl = url };
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

    private async Task<IReadOnlyList<ContactOfficeDto>> ApplyOfficeImagesAsync(
        IReadOnlyList<ContactOfficeDto> offices,
        IList<IFormFile>? officeImages,
        IList<string>? officeImageFileNames,
        CancellationToken cancellationToken)
    {
        if (offices.Count == 0)
        {
            return offices;
        }

        var files = officeImages ?? Array.Empty<IFormFile>();
        var existingFileNames = officeImageFileNames ?? Array.Empty<string>();
        var resolved = new List<ContactOfficeDto>(offices.Count);

        for (var i = 0; i < offices.Count; i++)
        {
            var file = i < files.Count ? files[i] : null;
            var existingName = i < existingFileNames.Count ? existingFileNames[i] : offices[i].ImageUrl;
            var storedFileName = await StoreMediaIfNeededAsync(file, OfficesFolder, existingName, cancellationToken);
            var finalImage = NormalizeOfficeImagePath(storedFileName ?? existingName ?? string.Empty);
            resolved.Add(offices[i] with { ImageUrl = finalImage });
        }

        return resolved;
    }

    private string NormalizeOfficeImagePath(string imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
        {
            return string.Empty;
        }

        if (Uri.TryCreate(imagePath, UriKind.Absolute, out var uri))
        {
            return NormalizeFinalOfficePath(uri.AbsolutePath);
        }

        return NormalizeFinalOfficePath(imagePath);
    }

    private string NormalizeFinalOfficePath(string path)
    {
        var relative = BuildRelativePath(path, OfficesFolder);
        return relative.StartsWith("images/", StringComparison.OrdinalIgnoreCase)
            ? $"/{relative.TrimStart('/')}"
            : relative;
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

    public IList<IFormFile>? OfficeImages { get; set; }

    public IList<string>? OfficeImageFileNames { get; set; }

    public string? MapEmbedUrl { get; set; }

    public string? MapTitle { get; set; }

    public string? Headquarters { get; set; }

    public IList<string>? BusinessHours { get; set; }

    public string? ProfileDownloadLabel { get; set; }

    public string? ProfileDownloadUrl { get; set; }
}
