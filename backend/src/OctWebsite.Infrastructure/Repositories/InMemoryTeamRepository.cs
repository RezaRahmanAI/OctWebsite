using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemoryTeamRepository : ITeamRepository
{
    public Task<IReadOnlyList<TeamMember>> GetAllAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<TeamMember>>(SeedData.TeamMembers);

    public Task<TeamMember?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var member = SeedData.TeamMembers.FirstOrDefault(member => member.Id == id);
        return Task.FromResult(member);
    }
}
