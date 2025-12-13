using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IProfilePageService
{
    Task<ProfilePageDto> GetAsync(CancellationToken cancellationToken = default);

    Task<ProfilePageDto> UpsertAsync(SaveProfilePageRequest request, CancellationToken cancellationToken = default);
}
