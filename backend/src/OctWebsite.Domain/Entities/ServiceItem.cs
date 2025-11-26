namespace OctWebsite.Domain.Entities;

public sealed record ServiceItem(
    Guid Id,
    string Title,
    string? Subtitle,
    string Slug,
    string Summary,
    string? Description,
    string? Icon,
    string? BackgroundImageFileName,
    string? HeaderVideoFileName,
    IReadOnlyList<string> AdditionalImageFileNames,
    IReadOnlyList<string> Features,
    bool Active,
    bool Featured
);
