using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemoryAcademyRepository : IAcademyRepository
{
    public Task<IReadOnlyList<AcademyTrack>> GetAllAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<AcademyTrack>>(SeedData.AcademyTracks);

    public Task<AcademyTrack?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        var track = SeedData.AcademyTracks.FirstOrDefault(track => track.Slug.Equals(normalizedSlug, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(track);
    }
}
