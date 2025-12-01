using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IHomeTrustRepository
{
    Task<HomeTrustSection?> GetAsync(CancellationToken cancellationToken = default);
    Task<HomeTrustSection> CreateAsync(HomeTrustSection trust, CancellationToken cancellationToken = default);
    Task<HomeTrustSection?> UpdateAsync(HomeTrustSection trust, CancellationToken cancellationToken = default);
}
