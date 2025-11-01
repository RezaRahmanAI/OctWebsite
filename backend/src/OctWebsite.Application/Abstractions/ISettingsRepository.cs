using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface ISettingsRepository
{
    Task<SiteSettings?> GetCurrentAsync(CancellationToken cancellationToken = default);
}
