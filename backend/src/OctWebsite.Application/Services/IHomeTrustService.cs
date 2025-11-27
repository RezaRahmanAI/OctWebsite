using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IHomeTrustService
{
    Task<HomeTrustDto> GetAsync(CancellationToken cancellationToken = default);
    Task<HomeTrustDto> UpsertAsync(HomeTrustSectionRequest request, CancellationToken cancellationToken = default);
}
