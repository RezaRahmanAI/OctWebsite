using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfServiceItemRepository(ApplicationDbContext context) : IServiceItemRepository
{
    public async Task<IReadOnlyList<ServiceItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await context.ServiceItems
            .AsNoTracking()
            .OrderBy(item => item.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.ServiceItems.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
    }

    public async Task<ServiceItem?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await context.ServiceItems.AsNoTracking().FirstOrDefaultAsync(item => item.Slug == slug, cancellationToken);
    }

    public async Task CreateAsync(ServiceItem item, CancellationToken cancellationToken = default)
    {
        await context.ServiceItems.AddAsync(item, cancellationToken);
    }

    public Task UpdateAsync(ServiceItem item, CancellationToken cancellationToken = default)
    {
        context.ServiceItems.Update(item);
        return Task.CompletedTask;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await context.ServiceItems.FindAsync([id], cancellationToken);
        if (existing is null)
        {
            return false;
        }

        context.ServiceItems.Remove(existing);
        return true;
    }
}
