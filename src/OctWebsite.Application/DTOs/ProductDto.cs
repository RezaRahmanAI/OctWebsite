namespace OctWebsite.Application.DTOs;

public sealed record ProductDto(
    Guid Id,
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active);

public sealed record SaveProductRequest(
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active);
