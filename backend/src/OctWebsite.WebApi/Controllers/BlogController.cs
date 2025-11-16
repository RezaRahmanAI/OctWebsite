using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/blog")]
public sealed class BlogController(IBlogService blogService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BlogPostDto>>> GetAllAsync(CancellationToken cancellationToken)
    {
        var posts = await blogService.GetAllAsync(cancellationToken);
        return Ok(posts);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<BlogPostDto>> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var post = await blogService.GetBySlugAsync(slug, cancellationToken);
        return post is null ? NotFound() : Ok(post);
    }

    [HttpPost]
    public async Task<ActionResult<BlogPostDto>> CreateAsync([FromBody] SaveBlogPostRequest request, CancellationToken cancellationToken)
    {
        var created = await blogService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetBySlugAsync), new { slug = created.Slug }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BlogPostDto>> UpdateAsync(Guid id, [FromBody] SaveBlogPostRequest request, CancellationToken cancellationToken)
    {
        var updated = await blogService.UpdateAsync(id, request, cancellationToken);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await blogService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
