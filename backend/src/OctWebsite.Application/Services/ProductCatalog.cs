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

    public async Task<ProductItemDto> CreateAsync(SaveProductItemRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var product = new ProductItem(
            Guid.NewGuid(),
            request.Title.Trim(),
            request.Slug.Trim().ToLowerInvariant(),
            request.Summary.Trim(),
            request.Icon.Trim(),
            request.Features?.ToArray() ?? Array.Empty<string>(),
            request.Active);

        var created = await repository.CreateAsync(product, cancellationToken);
        return created.ToDto();
    }

    public async Task<ProductItemDto?> UpdateAsync(Guid id, SaveProductItemRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Summary = request.Summary.Trim(),
            Icon = request.Icon.Trim(),
            Features = request.Features?.ToArray() ?? Array.Empty<string>(),
            Active = request.Active
        };

        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveProductItemRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Icon);
    }
}
