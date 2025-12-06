using System;

namespace OctWebsite.Domain.Entities;

public sealed class CareerPage
{
    public Guid Id { get; init; }

    public string HeaderEyebrow { get; set; } = string.Empty;

    public string HeaderTitle { get; set; } = string.Empty;

    public string HeaderSubtitle { get; set; } = string.Empty;

    public string? HeroVideoFileName { get; set; }

    public string HeroMetaLine { get; set; } = string.Empty;

    public string PrimaryCtaLabel { get; set; } = string.Empty;

    public string PrimaryCtaLink { get; set; } = string.Empty;

    public string ResponseTime { get; set; } = string.Empty;
}
