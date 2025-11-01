using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ITeamRepository
{
    Task<IReadOnlyList<TeamMember>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TeamMember?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
