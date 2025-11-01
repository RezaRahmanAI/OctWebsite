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

    [HttpGet("{slug}")]
    public async Task<ActionResult<ServiceItemDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var service = await serviceCatalog.GetBySlugAsync(slug, cancellationToken);
        return service is null ? NotFound() : Ok(service);
    }
}
