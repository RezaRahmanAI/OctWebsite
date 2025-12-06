namespace OctWebsite.Application.DTOs;

public sealed record ProductShowcaseDto(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    string ImageUrl,
    string BackgroundColor,
    string ProjectScreenshotUrl,
    IReadOnlyList<string> Highlights
);

public sealed record SaveProductShowcaseRequest(
    string Name,
    string Slug,
    string Description,
    string ImageUrl,
    string BackgroundColor,
    string ProjectScreenshotUrl,
    IReadOnlyList<string> Highlights
);
