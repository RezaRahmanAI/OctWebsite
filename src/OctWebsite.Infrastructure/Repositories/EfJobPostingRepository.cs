using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfJobPostingRepository(ApplicationDbContext dbContext) : IJobPostingRepository
{
    public async Task<IReadOnlyList<JobPosting>> GetOpenAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.JobPostings
            .Where(posting => posting.Active)
            .OrderByDescending(posting => posting.PublishedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<JobPosting>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.JobPostings
            .OrderByDescending(posting => posting.PublishedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<JobPosting?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.JobPostings.FirstOrDefaultAsync(posting => posting.Id == id, cancellationToken);

    public async Task<JobPosting> CreateAsync(JobPosting posting, CancellationToken cancellationToken = default)
    {
        await dbContext.JobPostings.AddAsync(posting, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return posting;
    }

    public async Task<JobPosting?> UpdateAsync(JobPosting posting, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.JobPostings.FirstOrDefaultAsync(p => p.Id == posting.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        dbContext.Entry(existing).CurrentValues.SetValues(posting);
        await dbContext.SaveChangesAsync(cancellationToken);
        return posting;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.JobPostings.FirstOrDefaultAsync(posting => posting.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        dbContext.JobPostings.Remove(existing);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
