using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class TeamService(ITeamRepository repository) : ITeamService
{
    public async Task<IReadOnlyList<TeamMemberDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var members = await repository.GetAllAsync(cancellationToken);
        return members.Select(member => member.ToDto()).ToArray();
    }

    public async Task<TeamMemberDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var member = await repository.GetByIdAsync(id, cancellationToken);
        return member?.ToDto();
    }
}
