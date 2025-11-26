using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IServicesPageService
{
    Task<ServicesPageDto> GetAsync(CancellationToken cancellationToken = default);

    Task<ServicesPageDto> UpsertAsync(SaveServicesPageRequest request, CancellationToken cancellationToken = default);
}
