using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/faqs")]
[Authorize]
public sealed class FaqsController(IFaqService faqService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<FaqDto>>> GetAsync(CancellationToken cancellationToken)
    {
        var faqs = await faqService.GetAllAsync(cancellationToken);
        return Ok(faqs);
    }

    [HttpPost]
    public async Task<ActionResult<FaqDto>> CreateAsync([FromBody] SaveFaqRequest request, CancellationToken cancellationToken)
    {
        var created = await faqService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetAsync), new { id = created.Id }, created);
    }

    [HttpPost("{id:guid}")]
    public async Task<ActionResult<FaqDto>> UpdateAsync(Guid id, [FromBody] SaveFaqRequest request, CancellationToken cancellationToken)
    {
        var updated = await faqService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await faqService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
