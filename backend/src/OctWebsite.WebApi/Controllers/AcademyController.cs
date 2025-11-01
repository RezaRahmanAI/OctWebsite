using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/academy/tracks")]
public sealed class AcademyController(IAcademyService academyService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AcademyTrackDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var tracks = await academyService.GetAllAsync(cancellationToken);
        return Ok(tracks);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<AcademyTrackDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var track = await academyService.GetBySlugAsync(slug, cancellationToken);
        return track is null ? NotFound() : Ok(track);
    }
}
