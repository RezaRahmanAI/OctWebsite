using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IHomeHeroService
{
    Task<HomeHeroDto> GetAsync(CancellationToken cancellationToken = default);
    Task<HomeHeroDto> UpsertAsync(HomeHeroSectionRequest request, CancellationToken cancellationToken = default);
}
