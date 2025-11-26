using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IServiceItemRepository
{
    Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task CreateAsync(ServiceItem item, CancellationToken cancellationToken = default);

    Task UpdateAsync(ServiceItem item, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
