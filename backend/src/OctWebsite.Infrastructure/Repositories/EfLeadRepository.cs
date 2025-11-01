using System.Linq;
using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfLeadRepository(ApplicationDbContext dbContext) : ILeadRepository
{
    public async Task<IReadOnlyList<Lead>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.Leads.AsNoTracking().OrderByDescending(lead => lead.CreatedAt).ToListAsync(cancellationToken);

    public Task<Lead?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.Leads.AsNoTracking().FirstOrDefaultAsync(lead => lead.Id == id, cancellationToken);

    public async Task<Lead> CreateAsync(Lead lead, CancellationToken cancellationToken = default)
    {
        await dbContext.Leads.AddAsync(lead, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return lead;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.Leads.FirstOrDefaultAsync(lead => lead.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        dbContext.Leads.Remove(existing);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
