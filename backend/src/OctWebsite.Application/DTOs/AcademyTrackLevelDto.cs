namespace OctWebsite.Application.DTOs;

public sealed record AcademyTrackLevelDto(
    string Name,
    IReadOnlyList<string> Tools,
    IReadOnlyList<string> Outcomes
);
