using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class AcademyService(IAcademyRepository repository) : IAcademyService
{
    public async Task<IReadOnlyList<AcademyTrackDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var tracks = await repository.GetAllAsync(cancellationToken);
        return tracks.Select(track => track.ToDto()).ToArray();
    }

    public async Task<AcademyTrackDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ArgumentException("Slug is required", nameof(slug));
        }

        var track = await repository.GetBySlugAsync(slug, cancellationToken);
        return track?.ToDto();
    }

    public async Task<AcademyTrackDto> CreateAsync(SaveAcademyTrackRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var track = new AcademyTrack(
            Guid.NewGuid(),
            request.Title.Trim(),
            request.Slug.Trim().ToLowerInvariant(),
            request.AgeRange?.Trim(),
            request.Duration.Trim(),
            request.PriceLabel.Trim(),
            request.Levels?.ToArray() ?? Array.Empty<AcademyTrackLevel>(),
            request.Active);

        var created = await repository.CreateAsync(track, cancellationToken);
        return created.ToDto();
    }

    public async Task<AcademyTrackDto?> UpdateAsync(Guid id, SaveAcademyTrackRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            AgeRange = request.AgeRange?.Trim(),
            Duration = request.Duration.Trim(),
            PriceLabel = request.PriceLabel.Trim(),
            Levels = request.Levels?.ToArray() ?? Array.Empty<AcademyTrackLevel>(),
            Active = request.Active
        };

        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveAcademyTrackRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Duration);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.PriceLabel);
    }
}
