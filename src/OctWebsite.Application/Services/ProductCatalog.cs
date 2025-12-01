using System.Text.RegularExpressions;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ProductCatalog(IProductRepository repository) : IProductCatalog
{
    public async Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await repository.GetAllAsync(cancellationToken);
        return products.Select(product => product.ToDto()).ToArray();
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await repository.GetByIdAsync(id, cancellationToken);
        return product?.ToDto();
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalized = NormalizeSlug(slug);
        var product = await repository.GetBySlugAsync(normalized, cancellationToken);
        return product?.ToDto();
    }

    public async Task<ProductDto> CreateAsync(SaveProductRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var product = Map(Guid.NewGuid(), request);
        var created = await repository.CreateAsync(product, cancellationToken);
        return created.ToDto();
    }

    public async Task<ProductDto?> UpdateAsync(Guid id, SaveProductRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = Map(id, request);
        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static ProductItem Map(Guid id, SaveProductRequest request)
    {
        var features = request.Features ?? Array.Empty<string>();

        return new ProductItem(
            id,
            request.Title.Trim(),
            NormalizeSlug(request.Slug),
            request.Summary.Trim(),
            request.Icon.Trim(),
            features.Where(feature => !string.IsNullOrWhiteSpace(feature)).Select(feature => feature.Trim()).ToArray(),
            request.Active);
    }

    private static void Validate(SaveProductRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Icon);
    }

    private static string NormalizeSlug(string slug)
    {
        var normalized = slug.Trim().ToLowerInvariant();
        normalized = Regex.Replace(normalized, "[^a-z0-9-]", "-");
        normalized = Regex.Replace(normalized, "-+", "-");
        return normalized.Trim('-');
    }
}
