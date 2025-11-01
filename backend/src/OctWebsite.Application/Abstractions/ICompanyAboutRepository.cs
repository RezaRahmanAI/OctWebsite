using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ICompanyAboutRepository
{
    Task<IReadOnlyList<CompanyAbout>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<CompanyAbout?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
}
