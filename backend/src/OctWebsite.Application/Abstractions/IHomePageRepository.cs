using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IHomePageRepository
{
    Task<HomePage?> GetAsync(CancellationToken cancellationToken = default);
    Task<HomePage> CreateAsync(HomePage page, CancellationToken cancellationToken = default);
    Task<HomePage?> UpdateAsync(HomePage page, CancellationToken cancellationToken = default);
}
