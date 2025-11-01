using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class ProductCatalog(IProductRepository repository) : IProductCatalog
{
    public async Task<IReadOnlyList<ProductItemDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await repository.GetAllAsync(cancellationToken);
        return products.Select(product => product.ToDto()).ToArray();
    }

    public async Task<ProductItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ArgumentException("Slug is required", nameof(slug));
        }

        var product = await repository.GetBySlugAsync(slug, cancellationToken);
        return product?.ToDto();
    }
}
