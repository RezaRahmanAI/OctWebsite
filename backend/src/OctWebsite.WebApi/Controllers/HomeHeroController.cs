using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/home-hero")]
[Authorize]
public sealed class HomeHeroController(IHomeHeroService heroService, IWebHostEnvironment environment)
    : HomeMediaControllerBase(environment)
{
    private const string HeroFolder = "uploads/home/hero";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HomeHeroDto>> GetAsync(CancellationToken cancellationToken)
    {
        var hero = await heroService.GetAsync(cancellationToken);
        return Ok(ResolveHero(hero));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<HomeHeroDto>> UpsertAsync([FromForm] SaveHomeHeroFormRequest form, CancellationToken cancellationToken)
    {
        var heroVideo = await StoreMediaIfNeededAsync(form.HeroVideo, HeroFolder, form.HeroVideoFileName, cancellationToken);
        var heroPoster = await StoreMediaIfNeededAsync(form.HeroPoster, HeroFolder, form.HeroPosterFileName, cancellationToken);

        var metrics = (form.HeroMetrics ?? new List<HomeMetricFormRequest>())
            .Select(metric => new HomeMetricRequest(metric.Label ?? string.Empty, metric.Value ?? string.Empty, metric.Theme ?? string.Empty))
            .ToArray();

        var request = new HomeHeroSectionRequest(
            form.HeroBadge ?? string.Empty,
            form.HeroTitle ?? string.Empty,
            form.HeroDescription ?? string.Empty,
            new CtaLinkRequest(form.PrimaryCtaLabel ?? string.Empty, form.PrimaryCtaLink, form.PrimaryCtaFragment, form.PrimaryCtaExternalUrl, form.PrimaryCtaStyle),
            new CtaLinkRequest(form.SecondaryCtaLabel ?? string.Empty, form.SecondaryCtaLink, form.SecondaryCtaFragment, form.SecondaryCtaExternalUrl, form.SecondaryCtaStyle),
            new HomeHighlightRequest(form.HeroHighlightTitle ?? string.Empty, form.HeroHighlightDescription ?? string.Empty),
            (form.HeroHighlightList ?? new List<string>()).ToArray(),
            heroVideo,
            heroPoster,
            new HomeFeaturePanelRequest(
                form.FeatureEyebrow ?? string.Empty,
                form.FeatureTitle ?? string.Empty,
                form.FeatureDescription ?? string.Empty,
                metrics,
                new HomePartnerRequest(form.PartnerLabel ?? string.Empty, form.PartnerDescription ?? string.Empty)));

        var updated = await heroService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveHero(updated));
    }

    private HomeHeroDto ResolveHero(HomeHeroDto dto)
    {
        return dto with
        {
            Video = Resolve(dto.Video, HeroFolder),
            Poster = Resolve(dto.Poster, HeroFolder)
        };
    }
}

public sealed class SaveHomeHeroFormRequest
{
    public string? HeroBadge { get; set; }
    public string? HeroTitle { get; set; }
    public string? HeroDescription { get; set; }
    public string? PrimaryCtaLabel { get; set; }
    public string? PrimaryCtaLink { get; set; }
    public string? PrimaryCtaFragment { get; set; }
    public string? PrimaryCtaExternalUrl { get; set; }
    public string? PrimaryCtaStyle { get; set; }
    public string? SecondaryCtaLabel { get; set; }
    public string? SecondaryCtaLink { get; set; }
    public string? SecondaryCtaFragment { get; set; }
    public string? SecondaryCtaExternalUrl { get; set; }
    public string? SecondaryCtaStyle { get; set; }
    public string? HeroHighlightTitle { get; set; }
    public string? HeroHighlightDescription { get; set; }
    public IList<string> HeroHighlightList { get; set; } = new List<string>();
    public IFormFile? HeroVideo { get; set; }
    public string? HeroVideoFileName { get; set; }
    public IFormFile? HeroPoster { get; set; }
    public string? HeroPosterFileName { get; set; }
    public string? FeatureEyebrow { get; set; }
    public string? FeatureTitle { get; set; }
    public string? FeatureDescription { get; set; }
    public IList<HomeMetricFormRequest> HeroMetrics { get; set; } = new List<HomeMetricFormRequest>();
    public string? PartnerLabel { get; set; }
    public string? PartnerDescription { get; set; }
}
