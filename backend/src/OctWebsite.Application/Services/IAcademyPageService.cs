using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IAcademyPageService
{
    Task<AcademyPageDto> GetAsync(CancellationToken cancellationToken = default);

    Task<AcademyPageDto> UpsertAsync(SaveAcademyPageRequest request, CancellationToken cancellationToken = default);
}
