using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.Defaults;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class HomeHeroService(IHomeHeroRepository repository) : IHomeHeroService
{
    public async Task<HomeHeroDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetAsync(cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return Deserialize(stored);
    }

    public async Task<HomeHeroDto> UpsertAsync(HomeHeroSectionRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var serialized = Serialize(request);
        var existing = await repository.GetAsync(cancellationToken);

        HomeHeroSection hero;
        if (existing is null)
        {
            hero = new HomeHeroSection(Guid.NewGuid(), serialized);
            hero = await repository.CreateAsync(hero, cancellationToken);
        }
        else
        {
            hero = existing with { Content = serialized };
            hero = (await repository.UpdateAsync(hero, cancellationToken))!;
        }

        return Deserialize(hero);
    }

    private async Task<HomeHeroDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var serialized = Serialize(HomePageDefaults.DefaultHero);
        var created = await repository.CreateAsync(new HomeHeroSection(Guid.NewGuid(), serialized), cancellationToken);
        return Deserialize(created);
    }

    private static void Validate(HomeHeroSectionRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
        {
            throw new ArgumentException("Hero title and description are required", nameof(request));
        }
    }

    private static string Serialize(HomeHeroSectionRequest request)
    {
        return JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false,
        });
    }

    private static HomeHeroDto Deserialize(HomeHeroSection hero)
    {
        var stored = JsonSerializer.Deserialize<HomeHeroSectionRequest>(hero.Content, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });

        if (stored is null)
        {
            throw new InvalidOperationException("Failed to deserialize home hero content");
        }

        return new HomeHeroDto(
            hero.Id,
            stored.Badge,
            stored.Title,
            stored.Description,
            ToDto(stored.PrimaryCta),
            ToDto(stored.SecondaryCta),
            new HomeHighlightDto(stored.HighlightCard.Title, stored.HighlightCard.Description),
            stored.HighlightList,
            CreateMedia(stored.VideoFileName),
            CreateMedia(stored.PosterFileName),
            new HomeFeaturePanelDto(
                stored.FeaturePanel.Eyebrow,
                stored.FeaturePanel.Title,
                stored.FeaturePanel.Description,
                stored.FeaturePanel.Metrics.Select(metric => new HomeMetricDto(metric.Label, metric.Value, metric.Theme)).ToArray(),
                new HomePartnerDto(stored.FeaturePanel.Partner.Label, stored.FeaturePanel.Partner.Description)));
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
