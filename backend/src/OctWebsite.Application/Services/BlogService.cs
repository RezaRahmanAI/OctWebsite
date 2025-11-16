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

    public async Task<BlogPostDto> CreateAsync(SaveBlogPostRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var post = new BlogPost(
            Guid.NewGuid(),
            request.Title.Trim(),
            request.Slug.Trim().ToLowerInvariant(),
            request.Excerpt.Trim(),
            request.CoverUrl.Trim(),
            request.Content,
            request.Tags?.ToArray() ?? Array.Empty<string>(),
            request.Published,
            request.PublishedAt ?? DateTimeOffset.UtcNow);

        var created = await repository.CreateAsync(post, cancellationToken);
        return created.ToDto();
    }

    public async Task<BlogPostDto?> UpdateAsync(Guid id, SaveBlogPostRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Excerpt = request.Excerpt.Trim(),
            CoverUrl = request.CoverUrl.Trim(),
            Content = request.Content,
            Tags = request.Tags?.ToArray() ?? Array.Empty<string>(),
            Published = request.Published,
            PublishedAt = request.PublishedAt ?? existing.PublishedAt
        };

        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveBlogPostRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Excerpt);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.CoverUrl);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Content);
    }
}
