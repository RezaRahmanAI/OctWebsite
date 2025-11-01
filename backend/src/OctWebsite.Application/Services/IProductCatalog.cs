using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IProductCatalog
{
    Task<IReadOnlyList<ProductItemDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
