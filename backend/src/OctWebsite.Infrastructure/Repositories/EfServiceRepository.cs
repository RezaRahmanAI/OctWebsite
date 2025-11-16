using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfServiceRepository(ApplicationDbContext dbContext) : IServiceRepository
{
    public async Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.ServiceItems.AsNoTracking().ToListAsync(cancellationToken);

    public Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        return dbContext.ServiceItems.AsNoTracking()
            .FirstOrDefaultAsync(service => service.Slug.ToLower() == normalizedSlug, cancellationToken);
    }

    public Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.ServiceItems.AsNoTracking().FirstOrDefaultAsync(service => service.Id == id, cancellationToken);

    public async Task<ServiceItem> CreateAsync(ServiceItem service, CancellationToken cancellationToken = default)
    {
        await dbContext.ServiceItems.AddAsync(service, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return service;
    }

    public async Task<ServiceItem?> UpdateAsync(ServiceItem service, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.ServiceItems.AnyAsync(item => item.Id == service.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.ServiceItems.Update(service);
        await dbContext.SaveChangesAsync(cancellationToken);
        return service;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.ServiceItems.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.ServiceItems.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
