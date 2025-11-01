using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemoryProductRepository : IProductRepository
{
    public Task<IReadOnlyList<ProductItem>> GetAllAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<ProductItem>>(SeedData.Products);

    public Task<ProductItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        var product = SeedData.Products.FirstOrDefault(product => product.Slug.Equals(normalizedSlug, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(product);
    }
}
