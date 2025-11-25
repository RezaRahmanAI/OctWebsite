using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/academy-page")]
[Authorize]
public sealed class AcademyPageController(IAcademyPageService academyPageService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<AcademyPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await academyPageService.GetAsync(cancellationToken);
        return Ok(page);
    }

    [HttpPut]
    public async Task<ActionResult<AcademyPageDto>> UpsertAsync([FromBody] SaveAcademyPageRequest request, CancellationToken cancellationToken)
    {
        var saved = await academyPageService.UpsertAsync(request, cancellationToken);
        return Ok(saved);
    }
}
