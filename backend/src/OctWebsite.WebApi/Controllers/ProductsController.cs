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
}
