namespace OctWebsite.Domain.Entities;

public sealed class AdmissionStep
{
    public Guid Id { get; init; }

    public Guid TrackId { get; init; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int Order { get; set; }

    public AcademyTrack Track { get; set; } = null!;
}
