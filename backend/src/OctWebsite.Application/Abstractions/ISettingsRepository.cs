using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ISettingsRepository
{
    Task<SiteSettings?> GetCurrentAsync(CancellationToken cancellationToken = default);
    Task<SiteSettings> UpsertAsync(SiteSettings settings, CancellationToken cancellationToken = default);
}
