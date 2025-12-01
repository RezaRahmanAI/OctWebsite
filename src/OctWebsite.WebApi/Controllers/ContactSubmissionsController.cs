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
        if (request is null)
        {
            ModelState.AddModelError(string.Empty, "Request body is required.");
            return ValidationProblem(ModelState);
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            ModelState.AddModelError(nameof(request.Email), "Email is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            ModelState.AddModelError(nameof(request.Message), "Message is required.");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

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
