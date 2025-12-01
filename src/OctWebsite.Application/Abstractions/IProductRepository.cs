using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IProductRepository
{
    Task<IReadOnlyList<ProductItem>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ProductItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ProductItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<ProductItem> CreateAsync(ProductItem product, CancellationToken cancellationToken = default);

    Task<ProductItem?> UpdateAsync(ProductItem product, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
