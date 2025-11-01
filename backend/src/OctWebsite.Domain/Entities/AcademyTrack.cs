namespace OctWebsite.Domain.Entities;

public sealed record AcademyTrack(
    Guid Id,
    string Title,
    string Slug,
    string? AgeRange,
    string Duration,
    string PriceLabel,
    IReadOnlyList<AcademyTrackLevel> Levels,
    bool Active
);
