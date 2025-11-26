using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfServiceRepository(ApplicationDbContext context) : IServiceRepository
{
    public async Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default)
        => await context.ServiceItems.AsNoTracking().OrderBy(service => service.Title).ToListAsync(cancellationToken);

    public async Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await context.ServiceItems.AsNoTracking().FirstOrDefaultAsync(service => service.Id == id, cancellationToken);

    public async Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await context.ServiceItems.AsNoTracking().FirstOrDefaultAsync(service => service.Slug == slug, cancellationToken);

    public async Task<ServiceItem> CreateAsync(ServiceItem service, CancellationToken cancellationToken = default)
    {
        await context.ServiceItems.AddAsync(service, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return service;
    }

    public async Task<ServiceItem?> UpdateAsync(ServiceItem service, CancellationToken cancellationToken = default)
    {
        var existing = await context.ServiceItems.FirstOrDefaultAsync(item => item.Id == service.Id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        context.Entry(existing).CurrentValues.SetValues(service);
        await context.SaveChangesAsync(cancellationToken);
        return service;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await context.ServiceItems.FirstOrDefaultAsync(service => service.Id == id, cancellationToken);
        if (existing is null)
        {
            return false;
        }

        context.ServiceItems.Remove(existing);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
