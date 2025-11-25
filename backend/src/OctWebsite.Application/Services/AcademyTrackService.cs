using System;
using System.Linq;
using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class AcademyTrackService(ICompanyAboutRepository repository) : IAcademyTrackService
{
    private const string StorageKey = "academy-tracks";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<IReadOnlyList<AcademyTrackDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        return stored is null
            ? Array.Empty<AcademyTrackDto>()
            : DeserializeList(stored.Content, stored.Id);
    }

    public async Task<AcademyTrackDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var tracks = await GetAllAsync(cancellationToken);
        return tracks.FirstOrDefault(track => string.Equals(track.Slug, slug, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<AcademyTrackDto> CreateAsync(SaveAcademyTrackRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (stored is null)
        {
            var created = Map(Guid.NewGuid(), request);
            var container = new CompanyAbout(Guid.NewGuid(), StorageKey, Serialize(new[] { created }));
            await repository.CreateAsync(container, cancellationToken);
            return created;
        }

        var existing = DeserializeList(stored.Content, stored.Id).ToList();

        if (existing.Any(track => string.Equals(track.Slug, request.Slug, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("A track with this slug already exists.");
        }

        var created = Map(Guid.NewGuid(), request);
        existing.Add(created);

        var updated = stored with { Content = Serialize(existing) };
        await repository.UpdateAsync(updated, cancellationToken);
        return created;
    }

    public async Task<AcademyTrackDto> UpdateAsync(Guid id, SaveAcademyTrackRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken)
            ?? throw new InvalidOperationException("Tracks have not been initialized yet.");

        var items = DeserializeList(stored.Content, stored.Id).ToList();
        var index = items.FindIndex(track => track.Id == id);
        if (index < 0)
        {
            throw new InvalidOperationException("Track not found.");
        }

        if (items.Any(track => track.Id != id && string.Equals(track.Slug, request.Slug, StringComparison.OrdinalIgnoreCase)))
        {
            throw new InvalidOperationException("Another track with this slug already exists.");
        }

        items[index] = Map(id, request);
        var updated = stored with { Content = Serialize(items) };
        await repository.UpdateAsync(updated, cancellationToken);
        return items[index];
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (stored is null)
        {
            return false;
        }

        var items = DeserializeList(stored.Content, stored.Id).ToList();
        var removed = items.RemoveAll(track => track.Id == id) > 0;
        if (!removed)
        {
            return false;
        }

        var updated = stored with { Content = Serialize(items) };
        await repository.UpdateAsync(updated, cancellationToken);
        return true;
    }

    private static void Validate(SaveAcademyTrackRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.AgeRange);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Duration);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Audience);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Format);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.CallToActionLabel);
    }

    private static IReadOnlyList<AcademyTrackDto> DeserializeList(string json, Guid? id)
    {
        var stored = JsonSerializer.Deserialize<List<AcademyTrackDto>>(json, JsonOptions);
        if (stored is null)
        {
            throw new InvalidOperationException("Unable to deserialize academy tracks.");
        }

        return stored;
    }

    private static string Serialize(IReadOnlyList<AcademyTrackDto> tracks)
        => JsonSerializer.Serialize(tracks, JsonOptions);

    private static AcademyTrackDto Map(Guid id, SaveAcademyTrackRequest request)
    {
        return new AcademyTrackDto(
            id,
            request.Title,
            request.Slug,
            request.AgeRange,
            request.Duration,
            request.PriceLabel,
            request.Audience,
            request.Format,
            request.Summary,
            CreateMedia(request.HeroVideoFileName),
            CreateMedia(request.HeroPosterFileName),
            request.Highlights.ToArray(),
            request.LearningOutcomes.ToArray(),
            request.Levels.Select(level => new AcademyTrackLevelDto(
                level.Title,
                level.Duration,
                level.Description,
                level.Tools.ToArray(),
                level.Outcomes.ToArray(),
                level.Project,
                level.Image)).ToArray(),
            request.AdmissionSteps.Select(step => new AdmissionStepDto(step.Title, step.Description)).ToArray(),
            request.CallToActionLabel,
            request.Active);
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
