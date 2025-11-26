using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/services")]
[Authorize]
public sealed class ServicesController(IServiceItemService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<ServiceItemDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var items = await service.GetAllAsync(cancellationToken);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceItemDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var item = await service.GetByIdAsync(id, cancellationToken);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpGet("slug/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceItemDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var item = await service.GetBySlugAsync(slug, cancellationToken);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceItemDto>> CreateAsync([FromBody] SaveServiceItemRequest request, CancellationToken cancellationToken)
    {
        var created = await service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceItemDto>> UpdateAsync(Guid id, [FromBody] SaveServiceItemRequest request, CancellationToken cancellationToken)
    {
        var updated = await service.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await service.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
