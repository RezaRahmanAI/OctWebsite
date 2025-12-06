namespace OctWebsite.Domain.Entities;

public sealed record ProductShowcaseItem(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    string ImageUrl,
    string BackgroundColor,
    string ProjectScreenshotUrl,
    IReadOnlyList<string> Highlights
);
