using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ILeadRepository
{
    Task<IReadOnlyList<Lead>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Lead?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Lead> CreateAsync(Lead lead, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
