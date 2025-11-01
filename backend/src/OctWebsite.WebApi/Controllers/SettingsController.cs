using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/settings")]
public sealed class SettingsController(ISettingsService settingsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<SiteSettingsDto>> GetAsync(CancellationToken cancellationToken)
    {
        var settings = await settingsService.GetCurrentAsync(cancellationToken);
        return settings is null ? NotFound() : Ok(settings);
    }
}
