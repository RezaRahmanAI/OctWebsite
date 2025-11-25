namespace OctWebsite.Domain.Entities;

public sealed class AcademyTrack
{
    public Guid Id { get; init; }

    public string Title { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string AgeRange { get; set; } = string.Empty;

    public string Duration { get; set; } = string.Empty;

    public string PriceLabel { get; set; } = string.Empty;

    public string Audience { get; set; } = string.Empty;

    public string Format { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;

    public string? HeroVideoFileName { get; set; }

    public string? HeroPosterFileName { get; set; }

    public string CallToActionLabel { get; set; } = string.Empty;

    public bool Active { get; set; }

    public List<string> Highlights { get; set; } = [];

    public List<string> LearningOutcomes { get; set; } = [];

    public List<AdmissionStep> AdmissionSteps { get; set; } = [];

    public List<AcademyTrackLevel> Levels { get; set; } = [];
}
