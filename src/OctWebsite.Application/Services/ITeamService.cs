using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface ITeamService
{
    Task<IReadOnlyList<TeamMemberDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TeamMemberDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TeamMemberDto> CreateAsync(SaveTeamMemberRequest request, CancellationToken cancellationToken = default);
    Task<TeamMemberDto?> UpdateAsync(Guid id, SaveTeamMemberRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record SaveTeamMemberRequest(
    string Name,
    string Role,
    string? PhotoFileName,
    string Bio,
    string Email,
    bool Active);
