using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IServicesPageRepository
{
    Task<ServicesPage?> GetAsync(CancellationToken cancellationToken = default);

    Task<ServicesPage> UpsertAsync(ServicesPage page, CancellationToken cancellationToken = default);
}
