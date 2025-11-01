namespace OctWebsite.Domain.Entities;

public sealed record BlogPost(
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
