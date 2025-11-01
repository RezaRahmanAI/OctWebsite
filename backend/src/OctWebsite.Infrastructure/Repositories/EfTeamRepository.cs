using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfTeamRepository(ApplicationDbContext dbContext) : ITeamRepository
{
    public async Task<IReadOnlyList<TeamMember>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.TeamMembers.AsNoTracking().ToListAsync(cancellationToken);

    public Task<TeamMember?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.TeamMembers.AsNoTracking().FirstOrDefaultAsync(member => member.Id == id, cancellationToken);
}
