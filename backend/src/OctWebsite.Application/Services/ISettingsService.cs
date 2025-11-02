using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface ISettingsService
{
    Task<SiteSettingsDto?> GetCurrentAsync(CancellationToken cancellationToken = default);
    Task<SiteSettingsDto> SaveAsync(SiteSettingsDto settings, CancellationToken cancellationToken = default);
}
