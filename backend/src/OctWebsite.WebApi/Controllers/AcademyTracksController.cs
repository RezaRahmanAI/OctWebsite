using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/academy-tracks")]
[Authorize]
public sealed class AcademyTracksController(IAcademyTrackService trackService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<AcademyTrackDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var tracks = await trackService.GetAllAsync(cancellationToken);
        return Ok(tracks);
    }

    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<AcademyTrackDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var track = await trackService.GetBySlugAsync(slug, cancellationToken);
        if (track is null)
        {
            return NotFound();
        }

        return Ok(track);
    }

    [HttpPost]
    public async Task<ActionResult<AcademyTrackDto>> CreateAsync([FromBody] SaveAcademyTrackRequest request, CancellationToken cancellationToken)
    {
        var created = await trackService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AcademyTrackDto>> UpdateAsync(Guid id, [FromBody] SaveAcademyTrackRequest request, CancellationToken cancellationToken)
    {
        var updated = await trackService.UpdateAsync(id, request, cancellationToken);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await trackService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
