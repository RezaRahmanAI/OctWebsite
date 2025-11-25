using System.Linq;
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
        return Ok(members.Select(ResolveMediaUrl));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TeamMemberDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var member = await teamService.GetByIdAsync(id, cancellationToken);
        return member is null ? NotFound() : Ok(ResolveMediaUrl(member));
    }

    [HttpPost]
    public async Task<ActionResult<TeamMemberDto>> CreateAsync([FromBody] SaveTeamMemberRequest request, CancellationToken cancellationToken)
    {
        var created = await teamService.CreateAsync(request, cancellationToken);
        var hydrated = ResolveMediaUrl(created);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, hydrated);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TeamMemberDto>> UpdateAsync(Guid id, [FromBody] SaveTeamMemberRequest request, CancellationToken cancellationToken)
    {
        var updated = await teamService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(ResolveMediaUrl(updated));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await teamService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    private TeamMemberDto ResolveMediaUrl(TeamMemberDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.PhotoUrl))
        {
            return dto;
        }

        if (Uri.TryCreate(dto.PhotoUrl, UriKind.Absolute, out _))
        {
            return dto;
        }

        var normalized = dto.PhotoUrl.TrimStart('/').Replace("\\", "/");
        var url = $"{Request.Scheme}://{Request.Host}/uploads/{normalized}";
        return dto with { PhotoUrl = url };
    }
}
