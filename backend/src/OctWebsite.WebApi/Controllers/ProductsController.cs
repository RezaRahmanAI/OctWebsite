using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController(IProductCatalog productCatalog) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductItemDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var products = await productCatalog.GetAllAsync(cancellationToken);
        return Ok(products);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProductItemDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var product = await productCatalog.GetBySlugAsync(slug, cancellationToken);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductItemDto>> CreateAsync([FromBody] SaveProductItemRequest request, CancellationToken cancellationToken)
    {
        var created = await productCatalog.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductItemDto>> UpdateAsync(Guid id, [FromBody] SaveProductItemRequest request, CancellationToken cancellationToken)
    {
        var updated = await productCatalog.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await productCatalog.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
