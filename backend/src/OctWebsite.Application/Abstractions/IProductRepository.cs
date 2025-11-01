using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IProductRepository
{
    Task<IReadOnlyList<ProductItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
