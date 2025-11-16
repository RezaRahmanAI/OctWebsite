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

    public Task<AcademyTrack?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.AcademyTracks.AsNoTracking().FirstOrDefaultAsync(track => track.Id == id, cancellationToken);

    public async Task<AcademyTrack> CreateAsync(AcademyTrack track, CancellationToken cancellationToken = default)
    {
        await dbContext.AcademyTracks.AddAsync(track, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return track;
    }

    public async Task<AcademyTrack?> UpdateAsync(AcademyTrack track, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.AcademyTracks.AnyAsync(item => item.Id == track.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.AcademyTracks.Update(track);
        await dbContext.SaveChangesAsync(cancellationToken);
        return track;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.AcademyTracks.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.AcademyTracks.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
