using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IProductShowcaseRepository
{
    Task<IReadOnlyList<ProductShowcaseItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductShowcaseItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductShowcaseItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<ProductShowcaseItem> CreateAsync(ProductShowcaseItem item, CancellationToken cancellationToken = default);
    Task<ProductShowcaseItem?> UpdateAsync(ProductShowcaseItem item, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
