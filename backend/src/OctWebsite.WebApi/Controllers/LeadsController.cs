using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/leads")]
public sealed class LeadsController(ILeadService leadService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<LeadDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var leads = await leadService.GetAllAsync(cancellationToken);
        return Ok(leads);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LeadDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var lead = await leadService.GetByIdAsync(id, cancellationToken);
        return lead is null ? NotFound() : Ok(lead);
    }

    [HttpPost]
    public async Task<ActionResult<LeadDto>> CreateAsync([FromBody] CreateLeadRequest request, CancellationToken cancellationToken)
    {
        var created = await leadService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, created);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await leadService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
