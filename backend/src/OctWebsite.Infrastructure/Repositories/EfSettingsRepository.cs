using System;
using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfSettingsRepository(ApplicationDbContext dbContext) : ISettingsRepository
{
    public Task<SiteSettings?> GetCurrentAsync(CancellationToken cancellationToken = default)
        => dbContext.SiteSettings.AsNoTracking().SingleOrDefaultAsync(cancellationToken);

    public async Task<SiteSettings> UpsertAsync(
        SiteSettings settings,
        CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.SiteSettings.SingleOrDefaultAsync(cancellationToken);

        if (existing is null)
        {
            if (settings.Id == Guid.Empty)
            {
                settings = settings with { Id = Guid.NewGuid() };
            }

            await dbContext.SiteSettings.AddAsync(settings, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
            return settings;
        }

        var updated = settings with { Id = existing.Id };
        dbContext.Entry(existing).CurrentValues.SetValues(updated);
        await dbContext.SaveChangesAsync(cancellationToken);
        return existing;
    }
}
