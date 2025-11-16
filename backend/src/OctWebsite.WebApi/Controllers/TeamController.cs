using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.Services;
using OctWebsite.Application.DTOs;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/team")]
public sealed class TeamController(ITeamService teamService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TeamMemberDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var members = await teamService.GetAllAsync(cancellationToken);
        return Ok(members);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TeamMemberDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var member = await teamService.GetByIdAsync(id, cancellationToken);
        return member is null ? NotFound() : Ok(member);
    }

    [HttpPost]
    public async Task<ActionResult<TeamMemberDto>> CreateAsync([FromBody] SaveTeamMemberRequest request, CancellationToken cancellationToken)
    {
        var created = await teamService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TeamMemberDto>> UpdateAsync(Guid id, [FromBody] SaveTeamMemberRequest request, CancellationToken cancellationToken)
    {
        var updated = await teamService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await teamService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
