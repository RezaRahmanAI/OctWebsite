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
}
