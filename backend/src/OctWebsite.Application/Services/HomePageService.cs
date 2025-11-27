using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class HomePageService(ICompanyAboutRepository repository) : IHomePageService
{
    private const string StorageKey = "home-page";

    public async Task<HomePageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return Deserialize(stored);
    }

    public async Task<HomePageDto> UpsertAsync(SaveHomePageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var serialized = Serialize(request);
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);

        if (existing is null)
        {
            var created = new CompanyAbout(Guid.NewGuid(), StorageKey, serialized);
            var stored = await repository.CreateAsync(created, cancellationToken);
            return Deserialize(stored);
        }

        var updated = existing with { Content = serialized };
        var result = await repository.UpdateAsync(updated, cancellationToken);
        return Deserialize(result!);
    }

    private static void Validate(SaveHomePageRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (request.Hero is null)
        {
            throw new ArgumentException("Hero section is required", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Hero.Title) || string.IsNullOrWhiteSpace(request.Hero.Description))
        {
            throw new ArgumentException("Hero title and description are required", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Trust.Tagline))
        {
            throw new ArgumentException("Trust tagline is required", nameof(request));
        }

        foreach (var testimonial in request.Testimonials)
        {
            if (testimonial.Rating is < 1 or > 5)
            {
                throw new ArgumentException("Testimonial rating must be between 1 and 5", nameof(request));
            }
        }
    }

    private async Task<HomePageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaultRequest = SeedData.HomePageRequest;
        var serialized = Serialize(defaultRequest);
        var created = new CompanyAbout(Guid.NewGuid(), StorageKey, serialized);
        var stored = await repository.CreateAsync(created, cancellationToken);
        return Deserialize(stored);
    }

    private static string Serialize(SaveHomePageRequest request)
    {
        return JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false,
        });
    }

    private static HomePageDto Deserialize(CompanyAbout about)
    {
        var stored = JsonSerializer.Deserialize<SaveHomePageRequest>(about.Content, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });

        if (stored is null)
        {
            throw new InvalidOperationException("Failed to deserialize home page content");
        }

        return new HomePageDto(
            about.Id,
            new HomeHeroDto(
                stored.Hero.Badge,
                stored.Hero.Title,
                stored.Hero.Description,
                ToDto(stored.Hero.PrimaryCta),
                ToDto(stored.Hero.SecondaryCta),
                new HomeHighlightDto(stored.Hero.HighlightCard.Title, stored.Hero.HighlightCard.Description),
                stored.Hero.HighlightList,
                CreateMedia(stored.Hero.VideoFileName),
                CreateMedia(stored.Hero.PosterFileName),
                new HomeFeaturePanelDto(
                    stored.Hero.FeaturePanel.Eyebrow,
                    stored.Hero.FeaturePanel.Title,
                    stored.Hero.FeaturePanel.Description,
                    stored.Hero.FeaturePanel.Metrics.Select(metric => new HomeMetricDto(metric.Label, metric.Value, metric.Theme)).ToArray(),
                    new HomePartnerDto(stored.Hero.FeaturePanel.Partner.Label, stored.Hero.FeaturePanel.Partner.Description))
            ),
            new HomeTrustDto(
                stored.Trust.Tagline,
                stored.Trust.Companies,
                stored.Trust.Stats.Select(stat => new HomeStatDto(stat.Label, stat.Value, stat.Suffix, stat.Decimals)).ToArray()),
            stored.Testimonials
                .Select(testimonial => new HomeTestimonialDto(
                    testimonial.Quote,
                    testimonial.Name,
                    testimonial.Title,
                    testimonial.Location,
                    testimonial.Rating,
                    testimonial.Type,
                    CreateMedia(testimonial.ImageFileName)))
                .ToArray());
    }

    private static CtaLinkDto ToDto(CtaLinkRequest request)
        => new(request.Label, request.RouterLink, request.Fragment, request.ExternalUrl, request.Style);

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }
}
