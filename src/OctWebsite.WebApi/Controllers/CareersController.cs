using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/careers")]
public sealed class CareersController(ICareerService careerService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IReadOnlyList<JobPostingDto>>> GetOpenAsync(CancellationToken cancellationToken)
    {
        var postings = await careerService.GetOpenAsync(cancellationToken);
        return Ok(postings);
    }

    [HttpGet("manage")]
    [Authorize]
    public async Task<ActionResult<IReadOnlyList<JobPostingDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var postings = await careerService.GetAllAsync(cancellationToken);
        return Ok(postings);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<JobPostingDto>> CreateAsync([FromBody] SaveJobPostingRequest request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return BadRequest("Request body is required.");
        }

        var created = await careerService.CreatePostingAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetAllAsync), new { }, created);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<ActionResult<JobPostingDto>> UpdateAsync(Guid id, [FromBody] SaveJobPostingRequest request, CancellationToken cancellationToken)
    {
        if (request is null)
        {
            return BadRequest("Request body is required.");
        }

        var updated = await careerService.UpdatePostingAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await careerService.DeletePostingAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
