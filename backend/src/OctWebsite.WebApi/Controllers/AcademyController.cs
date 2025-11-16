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

    [HttpPost]
    public async Task<ActionResult<AcademyTrackDto>> CreateAsync([FromBody] SaveAcademyTrackRequest request, CancellationToken cancellationToken)
    {
        var created = await academyService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AcademyTrackDto>> UpdateAsync(Guid id, [FromBody] SaveAcademyTrackRequest request, CancellationToken cancellationToken)
    {
        var updated = await academyService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await academyService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
