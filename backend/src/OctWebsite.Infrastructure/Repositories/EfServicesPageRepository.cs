using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfServicesPageRepository(ApplicationDbContext dbContext) : IServicesPageRepository
{
    public Task<ServicesPage?> GetAsync(CancellationToken cancellationToken = default)
    {
        return dbContext.ServicesPages.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<ServicesPage> UpsertAsync(ServicesPage page, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.ServicesPages.FirstOrDefaultAsync(cancellationToken);
        if (existing is null)
        {
            await dbContext.ServicesPages.AddAsync(page, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            return page;
        }

        existing.HeaderEyebrow = page.HeaderEyebrow;
        existing.HeaderTitle = page.HeaderTitle;
        existing.HeaderSubtitle = page.HeaderSubtitle;
        existing.HeroVideoFileName = page.HeroVideoFileName;

        dbContext.ServicesPages.Update(existing);
        await dbContext.SaveChangesAsync(cancellationToken);
        return existing;
    }
}
