using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemorySettingsRepository : ISettingsRepository
{
    public Task<SiteSettings?> GetCurrentAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<SiteSettings?>(SeedData.SiteSettings);
}
