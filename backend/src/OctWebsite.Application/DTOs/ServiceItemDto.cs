namespace OctWebsite.Application.DTOs;

public sealed record ServiceItemDto(
    Guid Id,
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active
);
