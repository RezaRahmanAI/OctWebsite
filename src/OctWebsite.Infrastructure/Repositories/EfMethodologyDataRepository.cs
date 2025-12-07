using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfMethodologyDataRepository(ApplicationDbContext dbContext) : IMethodologyDataRepository
{
    public Task<MethodologyData?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        var normalizedKey = key.Trim().ToLowerInvariant();
        return dbContext.MethodologyDataEntries.AsNoTracking()
            .FirstOrDefaultAsync(entry => entry.Key.ToLower() == normalizedKey, cancellationToken);
    }

    public Task<MethodologyData?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.MethodologyDataEntries.AsNoTracking().FirstOrDefaultAsync(entry => entry.Id == id, cancellationToken);

    public async Task<MethodologyData> CreateAsync(MethodologyData data, CancellationToken cancellationToken = default)
    {
        await dbContext.MethodologyDataEntries.AddAsync(data, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return data;
    }

    public async Task<MethodologyData?> UpdateAsync(MethodologyData data, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.MethodologyDataEntries.AnyAsync(entry => entry.Id == data.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.MethodologyDataEntries.Update(data);
        await dbContext.SaveChangesAsync(cancellationToken);
        return data;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.MethodologyDataEntries.FirstOrDefaultAsync(entry => entry.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.MethodologyDataEntries.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
