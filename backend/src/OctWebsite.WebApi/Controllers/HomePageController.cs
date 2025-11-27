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
[Route("api/home-page")]
[Authorize]
public sealed class HomePageController(IHomePageService homePageService, IWebHostEnvironment environment) : ControllerBase
{
    private const string HeroFolder = "uploads/home/hero";
    private const string TestimonialFolder = "uploads/home/testimonials";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HomePageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await homePageService.GetAsync(cancellationToken);
        return Ok(ResolveMedia(page));
    }

    [HttpPut]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<HomePageDto>> UpsertAsync([FromForm] SaveHomePageFormRequest form, CancellationToken cancellationToken)
    {
        var heroVideo = await StoreMediaIfNeededAsync(form.HeroVideo, HeroFolder, form.HeroVideoFileName, cancellationToken);
        var heroPoster = await StoreMediaIfNeededAsync(form.HeroPoster, HeroFolder, form.HeroPosterFileName, cancellationToken);

        var metrics = (form.HeroMetrics ?? new List<HomeMetricFormRequest>())
            .Select(metric => new HomeMetricRequest(metric.Label ?? string.Empty, metric.Value ?? string.Empty, metric.Theme ?? string.Empty))
            .ToArray();

        var testimonials = new List<HomeTestimonialRequest>();
        foreach (var testimonial in form.Testimonials ?? Array.Empty<HomeTestimonialFormRequest>())
        {
            var imageFileName = await StoreMediaIfNeededAsync(testimonial.Image, TestimonialFolder, testimonial.ImageFileName, cancellationToken);
            testimonials.Add(new HomeTestimonialRequest(
                testimonial.Quote ?? string.Empty,
                testimonial.Name ?? string.Empty,
                testimonial.Title ?? string.Empty,
                testimonial.Location ?? string.Empty,
                testimonial.Rating,
                testimonial.Type ?? string.Empty,
                imageFileName));
        }

        var request = new SaveHomePageRequest(
            new HomeHeroSectionRequest(
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
                    new HomePartnerRequest(form.PartnerLabel ?? string.Empty, form.PartnerDescription ?? string.Empty))),
            new HomeTrustSectionRequest(
                form.TrustTagline ?? string.Empty,
                (form.TrustCompanies ?? new List<string>()).ToArray(),
                (form.TrustStats ?? new List<HomeStatFormRequest>())
                    .Select(stat => new HomeStatRequest(stat.Label ?? string.Empty, stat.Value, stat.Suffix, stat.Decimals))
                    .ToArray()),
            testimonials);

        var updated = await homePageService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveMedia(updated));
    }

    private HomePageDto ResolveMedia(HomePageDto dto)
    {
        return dto with
        {
            Hero = dto.Hero with
            {
                Video = Resolve(dto.Hero.Video, HeroFolder),
                Poster = Resolve(dto.Hero.Poster, HeroFolder)
            },
            Testimonials = dto.Testimonials
                .Select(t => t with { Image = Resolve(t.Image, TestimonialFolder) })
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

    private async Task<string?> StoreMediaIfNeededAsync(IFormFile? file, string folder, string? existing, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return existing;
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

public sealed class SaveHomePageFormRequest
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

    public string? TrustTagline { get; set; }
    public IList<string> TrustCompanies { get; set; } = new List<string>();
    public IList<HomeStatFormRequest> TrustStats { get; set; } = new List<HomeStatFormRequest>();

    public IList<HomeTestimonialFormRequest> Testimonials { get; set; } = new List<HomeTestimonialFormRequest>();
}

public sealed class HomeMetricFormRequest
{
    public string? Label { get; set; }
    public string? Value { get; set; }
    public string? Theme { get; set; }
}

public sealed class HomeStatFormRequest
{
    public string? Label { get; set; }
    public decimal Value { get; set; }
    public string? Suffix { get; set; }
    public int? Decimals { get; set; }
}

public sealed class HomeTestimonialFormRequest
{
    public string? Quote { get; set; }
    public string? Name { get; set; }
    public string? Title { get; set; }
    public string? Location { get; set; }
    public int Rating { get; set; }
    public string? Type { get; set; }
    public IFormFile? Image { get; set; }
    public string? ImageFileName { get; set; }
}
