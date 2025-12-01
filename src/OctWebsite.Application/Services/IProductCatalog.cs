using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IProductCatalog
{
    Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ProductDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<ProductDto> CreateAsync(SaveProductRequest request, CancellationToken cancellationToken = default);

    Task<ProductDto?> UpdateAsync(Guid id, SaveProductRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
