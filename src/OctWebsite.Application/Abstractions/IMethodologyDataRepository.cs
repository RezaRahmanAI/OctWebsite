using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IMethodologyDataRepository
{
    Task<MethodologyData?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<MethodologyData?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<MethodologyData> CreateAsync(MethodologyData data, CancellationToken cancellationToken = default);
    Task<MethodologyData?> UpdateAsync(MethodologyData data, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
