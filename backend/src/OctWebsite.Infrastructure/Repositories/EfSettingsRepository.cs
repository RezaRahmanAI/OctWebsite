using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfSettingsRepository(ApplicationDbContext dbContext) : ISettingsRepository
{
    public Task<SiteSettings?> GetCurrentAsync(CancellationToken cancellationToken = default)
        => dbContext.SiteSettings.AsNoTracking().SingleOrDefaultAsync(cancellationToken);
}
