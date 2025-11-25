using System.Linq;
using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfAcademyTrackRepository(ApplicationDbContext dbContext) : IAcademyTrackRepository
{
    public async Task<IReadOnlyList<AcademyTrack>> GetAllAsync(CancellationToken cancellationToken = default)
        => await QueryWithDetails()
            .AsNoTracking()
            .OrderBy(track => track.Title)
            .ToListAsync(cancellationToken);

    public Task<AcademyTrack?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => QueryWithDetails()
            .AsNoTracking()
            .FirstOrDefaultAsync(track => track.Id == id, cancellationToken);

    public Task<AcademyTrack?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => QueryWithDetails()
            .AsNoTracking()
            .FirstOrDefaultAsync(track => track.Slug.ToLower() == slug.ToLower(), cancellationToken);

    public async Task<AcademyTrack> CreateAsync(AcademyTrack track, CancellationToken cancellationToken = default)
    {
        await dbContext.AcademyTracks.AddAsync(track, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return track;
    }

    public async Task<AcademyTrack?> UpdateAsync(AcademyTrack track, CancellationToken cancellationToken = default)
    {
        var existing = await QueryWithDetails().FirstOrDefaultAsync(entity => entity.Id == track.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        dbContext.Entry(existing).CurrentValues.SetValues(track);

        dbContext.AdmissionSteps.RemoveRange(existing.AdmissionSteps);
        dbContext.AcademyTrackLevels.RemoveRange(existing.Levels);

        await dbContext.AdmissionSteps.AddRangeAsync(track.AdmissionSteps, cancellationToken);
        await dbContext.AcademyTrackLevels.AddRangeAsync(track.Levels, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
        return track;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.AcademyTracks.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        dbContext.AcademyTracks.Remove(existing);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private IQueryable<AcademyTrack> QueryWithDetails()
        => dbContext.AcademyTracks
            .Include(track => track.Levels)
            .Include(track => track.AdmissionSteps);
}
