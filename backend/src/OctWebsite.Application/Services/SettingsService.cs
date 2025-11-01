using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class SettingsService(ISettingsRepository repository) : ISettingsService
{
    public async Task<SiteSettingsDto?> GetCurrentAsync(CancellationToken cancellationToken = default)
    {
        var settings = await repository.GetCurrentAsync(cancellationToken);
        return settings?.ToDto();
    }
}
