namespace OctWebsite.Application.DTOs;

public sealed record AcademyTrackDto(
    Guid Id,
    string Title,
    string Slug,
    string? AgeRange,
    string Duration,
    string PriceLabel,
    IReadOnlyList<AcademyTrackLevelDto> Levels,
    bool Active
);
