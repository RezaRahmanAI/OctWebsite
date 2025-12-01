using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfProductRepository(ApplicationDbContext context) : IProductRepository
{
    public async Task<IReadOnlyList<ProductItem>> GetAllAsync(CancellationToken cancellationToken = default)
        => await context.ProductItems.AsNoTracking().OrderBy(product => product.Title).ToListAsync(cancellationToken);

    public async Task<ProductItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await context.ProductItems.AsNoTracking().FirstOrDefaultAsync(product => product.Id == id, cancellationToken);

    public async Task<ProductItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await context.ProductItems.AsNoTracking().FirstOrDefaultAsync(product => product.Slug == slug, cancellationToken);

    public async Task<ProductItem> CreateAsync(ProductItem product, CancellationToken cancellationToken = default)
    {
        await context.ProductItems.AddAsync(product, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return product;
    }

    public async Task<ProductItem?> UpdateAsync(ProductItem product, CancellationToken cancellationToken = default)
    {
        var existing = await context.ProductItems.FirstOrDefaultAsync(item => item.Id == product.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        context.Entry(existing).CurrentValues.SetValues(product);
        await context.SaveChangesAsync(cancellationToken);
        return product;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await context.ProductItems.FirstOrDefaultAsync(product => product.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        context.ProductItems.Remove(existing);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
