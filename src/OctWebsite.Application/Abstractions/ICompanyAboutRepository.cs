using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ICompanyAboutRepository
{
    Task<IReadOnlyList<CompanyAbout>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<CompanyAbout?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<CompanyAbout?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CompanyAbout> CreateAsync(CompanyAbout about, CancellationToken cancellationToken = default);
    Task<CompanyAbout?> UpdateAsync(CompanyAbout about, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
