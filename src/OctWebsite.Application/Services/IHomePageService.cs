using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IHomePageService
{
    Task<HomePageDto> GetAsync(CancellationToken cancellationToken = default);
}
