using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfHomePageRepository(ApplicationDbContext dbContext) : IHomePageRepository
{
    public async Task<HomePage?> GetAsync(CancellationToken cancellationToken = default)
        => await dbContext.HomePages.AsNoTracking().FirstOrDefaultAsync(cancellationToken);

    public async Task<HomePage> CreateAsync(HomePage page, CancellationToken cancellationToken = default)
    {
        await dbContext.HomePages.AddAsync(page, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return page;
    }

    public async Task<HomePage?> UpdateAsync(HomePage page, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.HomePages.AnyAsync(p => p.Id == page.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.HomePages.Update(page);
        await dbContext.SaveChangesAsync(cancellationToken);
        return page;
    }
}
