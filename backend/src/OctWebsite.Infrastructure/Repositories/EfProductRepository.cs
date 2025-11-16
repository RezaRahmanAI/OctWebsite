using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfProductRepository(ApplicationDbContext dbContext) : IProductRepository
{
    public async Task<IReadOnlyList<ProductItem>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.ProductItems.AsNoTracking().ToListAsync(cancellationToken);

    public Task<ProductItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        return dbContext.ProductItems.AsNoTracking()
            .FirstOrDefaultAsync(product => product.Slug.ToLower() == normalizedSlug, cancellationToken);
    }

    public Task<ProductItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.ProductItems.AsNoTracking().FirstOrDefaultAsync(product => product.Id == id, cancellationToken);

    public async Task<ProductItem> CreateAsync(ProductItem product, CancellationToken cancellationToken = default)
    {
        await dbContext.ProductItems.AddAsync(product, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return product;
    }

    public async Task<ProductItem?> UpdateAsync(ProductItem product, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.ProductItems.AnyAsync(item => item.Id == product.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.ProductItems.Update(product);
        await dbContext.SaveChangesAsync(cancellationToken);
        return product;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.ProductItems.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.ProductItems.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
