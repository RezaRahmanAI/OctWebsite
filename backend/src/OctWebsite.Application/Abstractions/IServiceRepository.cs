using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IServiceRepository
{
    Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
