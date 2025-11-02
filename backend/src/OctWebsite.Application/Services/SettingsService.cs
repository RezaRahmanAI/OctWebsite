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

    public async Task<SiteSettingsDto> SaveAsync(
        SiteSettingsDto settings,
        CancellationToken cancellationToken = default)
    {
        var entity = settings.ToEntity();
        var saved = await repository.UpsertAsync(entity, cancellationToken);
        return saved.ToDto();
    }
}
