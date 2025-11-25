using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IAboutPageService
{
    Task<AboutPageDto> GetAsync(CancellationToken cancellationToken = default);
    Task<AboutPageDto> UpsertAsync(SaveAboutPageRequest request, CancellationToken cancellationToken = default);
}
