using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface ITeamService
{
    Task<IReadOnlyList<TeamMemberDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TeamMemberDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
