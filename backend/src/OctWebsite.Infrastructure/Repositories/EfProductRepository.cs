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
}
