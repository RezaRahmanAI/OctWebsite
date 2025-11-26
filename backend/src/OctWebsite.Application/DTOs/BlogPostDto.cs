namespace OctWebsite.Application.DTOs;

public sealed record BlogStatDto(string Label, string Value);

public sealed record BlogPostDto(
    Guid Id,
    string Title,
    string Slug,
    string Excerpt,
    string Content,
    string? ThumbnailFileName,
    string? ThumbnailUrl,
    MediaResourceDto? HeaderVideo,
    IReadOnlyList<string> Tags,
    bool Published,
    DateTimeOffset? PublishedAt,
    string? Author,
    string? AuthorTitle,
    string? ReadTime,
    string? HeroQuote,
    IReadOnlyList<string> KeyPoints,
    IReadOnlyList<BlogStatDto> Stats,
    DateTimeOffset CreatedDate,
    DateTimeOffset? UpdatedDate);

public sealed record SaveBlogStatRequest(string Label, string Value);

public sealed record SaveBlogPostRequest(
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
    IReadOnlyList<SaveBlogStatRequest> Stats);
