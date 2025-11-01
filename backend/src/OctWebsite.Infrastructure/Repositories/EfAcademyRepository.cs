using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfAcademyRepository(ApplicationDbContext dbContext) : IAcademyRepository
{
    public async Task<IReadOnlyList<AcademyTrack>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.AcademyTracks.AsNoTracking().ToListAsync(cancellationToken);

    public Task<AcademyTrack?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        return dbContext.AcademyTracks.AsNoTracking()
            .FirstOrDefaultAsync(track => track.Slug.ToLower() == normalizedSlug, cancellationToken);
    }
}
