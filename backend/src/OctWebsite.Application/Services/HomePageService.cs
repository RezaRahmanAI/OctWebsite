using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Defaults;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class HomePageService(IHomePageRepository pageRepository, IHomeTestimonialRepository testimonialRepository) : IHomePageService
{
    public async Task<HomePageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await pageRepository.GetAsync(cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        var testimonials = await testimonialRepository.GetByHomePageIdAsync(stored.Id, cancellationToken);
        return Deserialize(stored, testimonials);
    }

    public async Task<HomePageDto> UpsertAsync(SaveHomePageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var serialized = Serialize(new HomePageContent(request.Hero, request.Trust));
        var existing = await pageRepository.GetAsync(cancellationToken);

        HomePage page;
        if (existing is null)
        {
            page = new HomePage(Guid.NewGuid(), serialized);
            page = await pageRepository.CreateAsync(page, cancellationToken);
        }
        else
        {
            page = existing with { Content = serialized };
            page = (await pageRepository.UpdateAsync(page, cancellationToken))!;
        }

        var testimonials = request.Testimonials
            .Select(testimonial => new HomeTestimonial(
                Guid.NewGuid(),
                page.Id,
                testimonial.Quote,
                testimonial.Name,
                testimonial.Title,
                testimonial.Location,
                testimonial.Rating,
                testimonial.Type,
                testimonial.ImageFileName))
            .ToArray();

        await testimonialRepository.ReplaceAsync(page.Id, testimonials, cancellationToken);
        return Deserialize(page, testimonials);
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
        var defaultRequest = HomePageDefaults.DefaultRequest;
        var serialized = Serialize(new HomePageContent(defaultRequest.Hero, defaultRequest.Trust));
        var page = new HomePage(Guid.NewGuid(), serialized);
        var stored = await pageRepository.CreateAsync(page, cancellationToken);

        var testimonials = defaultRequest.Testimonials
            .Select(testimonial => new HomeTestimonial(
                Guid.NewGuid(),
                stored.Id,
                testimonial.Quote,
                testimonial.Name,
                testimonial.Title,
                testimonial.Location,
                testimonial.Rating,
                testimonial.Type,
                testimonial.ImageFileName))
            .ToArray();

        await testimonialRepository.ReplaceAsync(stored.Id, testimonials, cancellationToken);
        return Deserialize(stored, testimonials);
    }

    private static string Serialize(HomePageContent request)
    {
        return JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false,
        });
    }

    private static HomePageDto Deserialize(HomePage page, IReadOnlyList<HomeTestimonial> testimonials)
    {
        var stored = JsonSerializer.Deserialize<HomePageContent>(page.Content, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });

        if (stored is null)
        {
            throw new InvalidOperationException("Failed to deserialize home page content");
        }

        return new HomePageDto(
            page.Id,
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
                stored.Trust.Logos.Select(logo => CreateMedia(logo.LogoFileName)).ToArray(),
                stored.Trust.Stats.Select(stat => new HomeStatDto(stat.Label, stat.Value, stat.Suffix, stat.Decimals)).ToArray()),
            testimonials
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
