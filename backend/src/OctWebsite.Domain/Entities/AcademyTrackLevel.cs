namespace OctWebsite.Domain.Entities;

public sealed record AcademyTrackLevel(
    string Name,
    IReadOnlyList<string> Tools,
    IReadOnlyList<string> Outcomes
);
