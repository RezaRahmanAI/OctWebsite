using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfProductPageRepository(ApplicationDbContext dbContext) : IProductPageRepository
{
    public Task<ProductPage?> GetAsync(CancellationToken cancellationToken = default)
        => dbContext.ProductPages.AsNoTracking().FirstOrDefaultAsync(cancellationToken);

    public async Task<ProductPage> UpsertAsync(ProductPage page, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.ProductPages.FirstOrDefaultAsync(cancellationToken);
        if (existing is null)
        {
            await dbContext.ProductPages.AddAsync(page, cancellationToken);
        }
        else
        {
            existing.HeaderEyebrow = page.HeaderEyebrow;
            existing.HeaderTitle = page.HeaderTitle;
            existing.HeaderSubtitle = page.HeaderSubtitle;
            existing.HeroVideoFileName = page.HeroVideoFileName;
            dbContext.ProductPages.Update(existing);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return existing ?? page;
    }
}
