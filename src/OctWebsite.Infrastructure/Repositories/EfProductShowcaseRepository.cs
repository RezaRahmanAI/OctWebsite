using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfProductShowcaseRepository(ApplicationDbContext context) : IProductShowcaseRepository
{
    public async Task<IReadOnlyList<ProductShowcaseItem>> GetAllAsync(CancellationToken cancellationToken = default)
        => await context.ProductShowcaseItems.AsNoTracking().OrderBy(item => item.Name).ToListAsync(cancellationToken);

    public async Task<ProductShowcaseItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await context.ProductShowcaseItems.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

    public async Task<ProductShowcaseItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await context.ProductShowcaseItems.AsNoTracking().FirstOrDefaultAsync(item => item.Slug == slug, cancellationToken);

    public async Task<ProductShowcaseItem> CreateAsync(ProductShowcaseItem item, CancellationToken cancellationToken = default)
    {
        await context.ProductShowcaseItems.AddAsync(item, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return item;
    }

    public async Task<ProductShowcaseItem?> UpdateAsync(ProductShowcaseItem item, CancellationToken cancellationToken = default)
    {
        var existing = await context.ProductShowcaseItems.FirstOrDefaultAsync(entity => entity.Id == item.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        context.Entry(existing).CurrentValues.SetValues(item);
        await context.SaveChangesAsync(cancellationToken);
        return item;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await context.ProductShowcaseItems.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        context.ProductShowcaseItems.Remove(existing);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
