namespace OctWebsite.Domain.Entities;

public sealed class ServicesPage
{
    public Guid Id { get; set; }

    public string HeaderEyebrow { get; set; } = string.Empty;

    public string HeaderTitle { get; set; } = string.Empty;

    public string HeaderSubtitle { get; set; } = string.Empty;

    public string? HeroVideoFileName { get; set; }
}
