using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/home-page")]
[Authorize]
public sealed class HomePageController(IHomePageService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HomePageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await service.GetAsync(cancellationToken);
        return Ok(page);
    }

    [HttpPut]
    public async Task<ActionResult<HomePageDto>> UpsertAsync([FromBody] JsonElement content, CancellationToken cancellationToken)
    {
        var document = JsonDocument.Parse(content.GetRawText());
        var request = new SaveHomePageRequest(document);
        var updated = await service.UpsertAsync(request, cancellationToken);
        return Ok(updated);
    }
}
