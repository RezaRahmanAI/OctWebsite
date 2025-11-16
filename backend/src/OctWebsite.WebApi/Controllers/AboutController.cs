using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/about")]
public sealed class AboutController(IAboutService aboutService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CompanyAboutDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var sections = await aboutService.GetAllAsync(cancellationToken);
        return Ok(sections);
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<CompanyAboutDto>> GetByKeyAsync(string key, CancellationToken cancellationToken)
    {
        var section = await aboutService.GetByKeyAsync(key, cancellationToken);
        return section is null ? NotFound() : Ok(section);
    }

    [HttpPost]
    public async Task<ActionResult<CompanyAboutDto>> CreateAsync([FromBody] SaveCompanyAboutRequest request, CancellationToken cancellationToken)
    {
        var created = await aboutService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByKeyAsync), new { key = created.Key }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CompanyAboutDto>> UpdateAsync(Guid id, [FromBody] SaveCompanyAboutRequest request, CancellationToken cancellationToken)
    {
        var updated = await aboutService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await aboutService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
