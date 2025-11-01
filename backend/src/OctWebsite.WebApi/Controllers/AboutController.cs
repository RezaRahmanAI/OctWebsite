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
}
