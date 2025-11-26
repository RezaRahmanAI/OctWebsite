using System.Text.RegularExpressions;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class BlogService(IBlogRepository repository) : IBlogService
{
    public async Task<IReadOnlyList<BlogPostDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var posts = await repository.GetAllAsync(cancellationToken);
        return posts.Select(Map).ToArray();
    }

    public async Task<BlogPostDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var post = await repository.GetByIdAsync(id, cancellationToken);
        return post is null ? null : Map(post);
    }

    public async Task<BlogPostDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var post = await repository.GetBySlugAsync(slug, cancellationToken);
        return post is null ? null : Map(post);
    }

    public async Task<BlogPostDto> CreateAsync(SaveBlogPostRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var post = new BlogPost(
            Guid.NewGuid(),
            request.Title.Trim(),
            NormalizeSlug(request.Slug),
            request.Excerpt.Trim(),
            request.Content.Trim(),
            request.ThumbnailFileName?.Trim(),
            request.HeaderVideoFileName?.Trim(),
            request.Tags.Select(tag => tag.Trim()).ToArray(),
            request.Published,
            request.PublishedAt,
            request.Author?.Trim(),
            request.AuthorTitle?.Trim(),
            request.ReadTime?.Trim(),
            request.HeroQuote?.Trim(),
            request.KeyPoints.Select(point => point.Trim()).ToArray(),
            request.Stats.Select(stat => new BlogStat(stat.Label.Trim(), stat.Value.Trim())).ToArray(),
            DateTimeOffset.UtcNow,
            null);

        var created = await repository.CreateAsync(post, cancellationToken);
        return Map(created);
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
            Slug = NormalizeSlug(request.Slug),
            Excerpt = request.Excerpt.Trim(),
            Content = request.Content.Trim(),
            ThumbnailFileName = request.ThumbnailFileName?.Trim(),
            HeaderVideoFileName = request.HeaderVideoFileName?.Trim(),
            Tags = request.Tags.Select(tag => tag.Trim()).ToArray(),
            Published = request.Published,
            PublishedAt = request.PublishedAt,
            Author = request.Author?.Trim(),
            AuthorTitle = request.AuthorTitle?.Trim(),
            ReadTime = request.ReadTime?.Trim(),
            HeroQuote = request.HeroQuote?.Trim(),
            KeyPoints = request.KeyPoints.Select(point => point.Trim()).ToArray(),
            Stats = request.Stats.Select(stat => new BlogStat(stat.Label.Trim(), stat.Value.Trim())).ToArray(),
            UpdatedDate = DateTimeOffset.UtcNow
        };

        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved is null ? null : Map(saved);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveBlogPostRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Excerpt);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Content);
    }

    private static string NormalizeSlug(string slug)
    {
        var trimmed = slug.Trim().ToLowerInvariant();
        trimmed = Regex.Replace(trimmed, "[^a-z0-9-]+", "-").Trim('-');
        return string.IsNullOrWhiteSpace(trimmed) ? Guid.NewGuid().ToString("n") : trimmed;
    }

    private static BlogPostDto Map(BlogPost post)
    {
        return new BlogPostDto(
            post.Id,
            post.Title,
            post.Slug,
            post.Excerpt,
            post.Content,
            post.ThumbnailFileName,
            null,
            CreateMedia(post.HeaderVideoFileName),
            post.Tags,
            post.Published,
            post.PublishedAt,
            post.Author,
            post.AuthorTitle,
            post.ReadTime,
            post.HeroQuote,
            post.KeyPoints,
            post.Stats.Select(stat => new BlogStatDto(stat.Label, stat.Value)).ToArray(),
            post.CreatedDate,
            post.UpdatedDate);
    }

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }
}
