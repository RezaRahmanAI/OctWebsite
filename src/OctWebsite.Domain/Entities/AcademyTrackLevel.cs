namespace OctWebsite.Domain.Entities;

public sealed class AcademyTrackLevel
{
    public Guid Id { get; init; }

    public Guid TrackId { get; init; }

    public string Title { get; set; } = string.Empty;

    public string Duration { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Project { get; set; } = string.Empty;

    public string Image { get; set; } = string.Empty;

    public int Order { get; set; }

    public List<string> Tools { get; set; } = [];

    public List<string> Outcomes { get; set; } = [];

    public AcademyTrack Track { get; set; } = null!;
}
