using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/contact-submissions")]
public sealed class ContactSubmissionsController(IContactSubmissionService service) : ControllerBase
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<ContactSubmissionDto>> SubmitAsync(
        [FromBody] SubmitContactFormRequest request,
        CancellationToken cancellationToken)
    {
        var created = await service.SubmitAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetRecentAsync), new { }, created);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<ContactSubmissionDto>>> GetRecentAsync(
        [FromQuery] int take = 200,
        CancellationToken cancellationToken = default)
    {
        var submissions = await service.GetRecentAsync(take, cancellationToken);
        return Ok(submissions);
    }
}
