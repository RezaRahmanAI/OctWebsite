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
}
