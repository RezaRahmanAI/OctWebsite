using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.Defaults;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class HomeTrustService(IHomeTrustRepository repository) : IHomeTrustService
{
    public async Task<HomeTrustDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetAsync(cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return Deserialize(stored);
    }

    public async Task<HomeTrustDto> UpsertAsync(HomeTrustSectionRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var serialized = Serialize(request);
        var existing = await repository.GetAsync(cancellationToken);

        HomeTrustSection trust;
        if (existing is null)
        {
            trust = new HomeTrustSection(Guid.NewGuid(), serialized);
            trust = await repository.CreateAsync(trust, cancellationToken);
        }
        else
        {
            trust = existing with { Content = serialized };
            trust = (await repository.UpdateAsync(trust, cancellationToken))!;
        }

        return Deserialize(trust);
    }

    private async Task<HomeTrustDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var serialized = Serialize(HomePageDefaults.DefaultTrust);
        var created = await repository.CreateAsync(new HomeTrustSection(Guid.NewGuid(), serialized), cancellationToken);
        return Deserialize(created);
    }

    private static void Validate(HomeTrustSectionRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Tagline))
        {
            throw new ArgumentException("Trust tagline is required", nameof(request));
        }
    }

    private static string Serialize(HomeTrustSectionRequest request)
    {
        return JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false,
        });
    }

    private static HomeTrustDto Deserialize(HomeTrustSection trust)
    {
        var stored = JsonSerializer.Deserialize<HomeTrustSectionRequest>(trust.Content, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        });

        if (stored is null)
        {
            throw new InvalidOperationException("Failed to deserialize home trust content");
        }

        return new HomeTrustDto(
            trust.Id,
            stored.Tagline,
            stored.Logos.Select(logo => CreateMedia(logo.LogoFileName)).ToArray(),
            stored.Stats.Select(stat => new HomeStatDto(stat.Label, stat.Value, stat.Suffix, stat.Decimals)).ToArray());
    }

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }
}
