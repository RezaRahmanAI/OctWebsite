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
}
