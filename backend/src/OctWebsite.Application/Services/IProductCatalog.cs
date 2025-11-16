using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IProductCatalog
{
    Task<IReadOnlyList<ProductItemDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<ProductItemDto> CreateAsync(SaveProductItemRequest request, CancellationToken cancellationToken = default);
    Task<ProductItemDto?> UpdateAsync(Guid id, SaveProductItemRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record SaveProductItemRequest(
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active);
