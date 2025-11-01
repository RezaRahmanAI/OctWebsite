using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IAboutService
{
    Task<IReadOnlyList<CompanyAboutDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<CompanyAboutDto?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
}
