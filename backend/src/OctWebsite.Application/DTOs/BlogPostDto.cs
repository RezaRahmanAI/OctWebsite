namespace OctWebsite.Application.DTOs;

public sealed record BlogPostDto(
    Guid Id,
    string Title,
    string Slug,
    string Excerpt,
    string CoverUrl,
    string Content,
    IReadOnlyList<string> Tags,
    bool Published,
    DateTimeOffset PublishedAt
);
