namespace OctWebsite.Domain.Entities;

public sealed record BlogPost(
    Guid Id,
    string Title,
    string Slug,
    string Excerpt,
    string Content,
    string? ThumbnailFileName,
    string? HeaderVideoFileName,
    IReadOnlyList<string> Tags,
    bool Published,
    DateTimeOffset? PublishedAt,
    string? Author,
    string? AuthorTitle,
    string? ReadTime,
    string? HeroQuote,
    IReadOnlyList<string> KeyPoints,
    IReadOnlyList<BlogStat> Stats,
    DateTimeOffset CreatedDate,
    DateTimeOffset? UpdatedDate
);

public sealed record BlogStat(string Label, string Value);
