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

    public async Task<TeamMember> CreateAsync(TeamMember member, CancellationToken cancellationToken = default)
    {
        await dbContext.TeamMembers.AddAsync(member, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return member;
    }

    public async Task<TeamMember?> UpdateAsync(TeamMember member, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.TeamMembers.AnyAsync(m => m.Id == member.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.TeamMembers.Update(member);
        await dbContext.SaveChangesAsync(cancellationToken);
        return member;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.TeamMembers.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.TeamMembers.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
