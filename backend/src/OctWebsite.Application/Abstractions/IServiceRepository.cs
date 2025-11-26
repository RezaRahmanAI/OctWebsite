using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IServiceRepository
{
    Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<ServiceItem> CreateAsync(ServiceItem service, CancellationToken cancellationToken = default);

    Task<ServiceItem?> UpdateAsync(ServiceItem service, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
