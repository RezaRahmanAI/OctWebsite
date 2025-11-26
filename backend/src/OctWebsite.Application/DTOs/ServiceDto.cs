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
    ServiceMediaDto? HeaderVideo,
    IReadOnlyList<ServiceMediaDto> Gallery,
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
    string? HeaderVideoFileName,
    IReadOnlyList<string> AdditionalImageFileNames,
    IReadOnlyList<string> Features,
    bool Active,
    bool Featured);
