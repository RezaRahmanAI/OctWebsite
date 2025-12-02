namespace OctWebsite.Application.DTOs;

public sealed record ServiceMediaDto(string? FileName, string? Url);

public sealed record ServiceDto(
    Guid Id,
    string Title,
    string? Subtitle,
    string Slug,
    string Summary,
    string? Description,
    string? Icon,
    ServiceMediaDto? BackgroundImage,
    IReadOnlyList<string> Features,
    bool Active,
    bool Featured);

public sealed record SaveServiceRequest(
    string Title,
    string? Subtitle,
    string Slug,
    string Summary,
    string? Description,
    string? Icon,
    string? BackgroundImageFileName,
    IReadOnlyList<string> Features,
    bool Active,
    bool Featured);
