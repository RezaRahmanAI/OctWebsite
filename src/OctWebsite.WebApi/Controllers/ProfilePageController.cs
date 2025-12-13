using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/profile-page")]
[Authorize]
public sealed class ProfilePageController(
    IProfilePageService profilePageService,
    IWebHostEnvironment environment) : HomeMediaControllerBase(environment)
{
    private const string MediaFolder = "uploads/profile";
    private const string DownloadFolder = "uploads/profile/downloads";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ProfilePageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await profilePageService.GetAsync(cancellationToken);
        return Ok(ResolveMedia(page));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<ProfilePageDto>> UpsertAsync(
        [FromForm] SaveProfilePageFormRequest form,
        CancellationToken cancellationToken)
    {
        var heroImage = await StoreMediaIfNeededAsync(form.HeroImage, MediaFolder, form.HeroImageFileName, cancellationToken);
        var heroVideo = await StoreMediaIfNeededAsync(form.HeroVideo, MediaFolder, form.HeroVideoFileName, cancellationToken);
        var downloadFile = await StoreMediaIfNeededAsync(form.DownloadFile, DownloadFolder, form.DownloadFileName, cancellationToken);

        var stats = ParseJson<IReadOnlyList<ProfileStatDto>>(form.StatsJson) ?? Array.Empty<ProfileStatDto>();
        var pillars = ParseJson<IReadOnlyList<ProfilePillarDto>>(form.PillarsJson) ?? Array.Empty<ProfilePillarDto>();

        var request = new SaveProfilePageRequest(
            form.HeaderEyebrow ?? string.Empty,
            form.HeaderTitle ?? string.Empty,
            form.HeaderSubtitle ?? string.Empty,
            form.HeroTagline ?? string.Empty,
            heroImage ?? form.HeroImageFileName,
            heroVideo ?? form.HeroVideoFileName,
            form.DownloadLabel ?? string.Empty,
            downloadFile ?? form.DownloadFileName,
            string.IsNullOrWhiteSpace(form.DownloadUrl) ? null : form.DownloadUrl,
            form.OverviewTitle ?? string.Empty,
            form.OverviewDescription ?? string.Empty,
            stats.Select(stat => new SaveProfileStatRequest(stat.Label, stat.Value, stat.Description)).ToArray(),
            pillars.Select(pillar => new SaveProfilePillarRequest(pillar.Title, pillar.Description, pillar.Accent)).ToArray(),
            form.SpotlightTitle ?? string.Empty,
            form.SpotlightDescription ?? string.Empty,
            form.SpotlightBadge ?? string.Empty);

        var updated = await profilePageService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveMedia(updated));
    }

    private ProfilePageDto ResolveMedia(ProfilePageDto dto)
    {
        var hero = Resolve(dto.HeroImage, MediaFolder);
        var heroVideo = Resolve(dto.HeroVideo, MediaFolder);
        var download = Resolve(dto.Download, DownloadFolder);
        return dto with { HeroImage = hero, HeroVideo = heroVideo, Download = download };
    }

    private static T? ParseJson<T>(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return default;
        }

        return JsonSerializer.Deserialize<T>(raw, JsonOptions);
    }
}

public sealed class SaveProfilePageFormRequest
{
    public string? HeaderEyebrow { get; init; }

    public string? HeaderTitle { get; init; }

    public string? HeaderSubtitle { get; init; }

    public string? HeroTagline { get; init; }

    public string? OverviewTitle { get; init; }

    public string? OverviewDescription { get; init; }

    public string? SpotlightTitle { get; init; }

    public string? SpotlightDescription { get; init; }

    public string? SpotlightBadge { get; init; }

    public string? DownloadLabel { get; init; }

    public string? DownloadUrl { get; init; }

    public string? HeroImageFileName { get; init; }

    public string? HeroVideoFileName { get; init; }

    public string? DownloadFileName { get; init; }

    public IFormFile? HeroImage { get; init; }

    public IFormFile? HeroVideo { get; init; }

    public IFormFile? DownloadFile { get; init; }

    public string? StatsJson { get; init; }

    public string? PillarsJson { get; init; }
}
