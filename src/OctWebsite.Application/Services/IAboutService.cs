using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IAboutService
{
    Task<IReadOnlyList<CompanyAboutDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<CompanyAboutDto?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<CompanyAboutDto> CreateAsync(SaveCompanyAboutRequest request, CancellationToken cancellationToken = default);
    Task<CompanyAboutDto?> UpdateAsync(Guid id, SaveCompanyAboutRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record SaveCompanyAboutRequest(
    string Key,
    string Content);
