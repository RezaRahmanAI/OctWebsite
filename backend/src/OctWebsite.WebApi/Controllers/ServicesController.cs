using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/services")]
public sealed class ServicesController(IServiceCatalog serviceCatalog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ServiceItemDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var services = await serviceCatalog.GetAllAsync(cancellationToken);
        return Ok(services);
    }

    [HttpGet("catalog")]
    public async Task<ActionResult<ServiceCatalogDto>> GetUnifiedCatalogAsync(CancellationToken cancellationToken)
    {
        var catalog = await serviceCatalog.GetUnifiedCatalogAsync(cancellationToken);
        return Ok(catalog);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ServiceItemDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var service = await serviceCatalog.GetBySlugAsync(slug, cancellationToken);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceItemDto>> CreateAsync([FromBody] SaveServiceItemRequest request, CancellationToken cancellationToken)
    {
        var created = await serviceCatalog.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ServiceItemDto>> UpdateAsync(Guid id, [FromBody] SaveServiceItemRequest request, CancellationToken cancellationToken)
    {
        var updated = await serviceCatalog.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await serviceCatalog.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
