using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class BlogService(IBlogRepository repository) : IBlogService
{
    public async Task<IReadOnlyList<BlogPostDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var posts = await repository.GetAllAsync(cancellationToken);
        return posts.Select(post => post.ToDto()).ToArray();
    }

    public async Task<BlogPostDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ArgumentException("Slug is required", nameof(slug));
        }

        var post = await repository.GetBySlugAsync(slug, cancellationToken);
        return post?.ToDto();
    }
}
