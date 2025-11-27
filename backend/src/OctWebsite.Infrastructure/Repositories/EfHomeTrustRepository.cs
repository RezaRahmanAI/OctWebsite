using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfHomeTrustRepository(ApplicationDbContext dbContext) : IHomeTrustRepository
{
    public async Task<HomeTrustSection?> GetAsync(CancellationToken cancellationToken = default)
        => await dbContext.HomeTrustSections.AsNoTracking().FirstOrDefaultAsync(cancellationToken);

    public async Task<HomeTrustSection> CreateAsync(HomeTrustSection trust, CancellationToken cancellationToken = default)
    {
        await dbContext.HomeTrustSections.AddAsync(trust, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return trust;
    }

    public async Task<HomeTrustSection?> UpdateAsync(HomeTrustSection trust, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.HomeTrustSections.AnyAsync(t => t.Id == trust.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.HomeTrustSections.Update(trust);
        await dbContext.SaveChangesAsync(cancellationToken);
        return trust;
    }
}
