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
}
