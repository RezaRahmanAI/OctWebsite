using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/methodology-page")]
public sealed class MethodologyController(IMethodologyPageService service) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(MethodologyPageDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MethodologyPageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await service.GetAsync(cancellationToken);
        return Ok(page with { Offerings = page.Offerings.Where(offering => offering.Active).ToArray() });
    }

    [HttpPut]
    [ProducesResponseType(typeof(MethodologyPageDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MethodologyPageDto>> UpsertAsync(
        [FromBody] SaveMethodologyPageRequest request,
        CancellationToken cancellationToken)
    {
        var page = await service.UpsertPageAsync(request, cancellationToken);
        return Ok(page);
    }
}

[ApiController]
[Route("api/methodology-offerings")]
public sealed class MethodologyOfferingsController(IMethodologyPageService service) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<MethodologyOfferingDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MethodologyOfferingDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var offerings = await service.GetOfferingsAsync(cancellationToken);
        return Ok(offerings);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(MethodologyOfferingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MethodologyOfferingDto>> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken)
    {
        var offering = await service.GetBySlugAsync(slug, cancellationToken);
        return offering is null ? NotFound() : Ok(offering);
    }

    [HttpPost]
    [ProducesResponseType(typeof(MethodologyOfferingDto), StatusCodes.Status201Created)]
    public async Task<ActionResult<MethodologyOfferingDto>> CreateAsync(
        [FromBody] SaveMethodologyOfferingRequest request,
        CancellationToken cancellationToken)
    {
        var created = await service.CreateOfferingAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, created);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(MethodologyOfferingDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MethodologyOfferingDto>> UpdateAsync(
        Guid id,
        [FromBody] SaveMethodologyOfferingRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await service.UpdateOfferingAsync(id, request, cancellationToken);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        await service.DeleteOfferingAsync(id, cancellationToken);
        return NoContent();
    }
}
