namespace OctWebsite.Domain.Entities;

public sealed class ProfilePage
{
    public Guid Id { get; set; }

    public string HeaderEyebrow { get; set; } = string.Empty;

    public string HeaderTitle { get; set; } = string.Empty;

    public string HeaderSubtitle { get; set; } = string.Empty;

    public string HeroTagline { get; set; } = string.Empty;

    public string OverviewTitle { get; set; } = string.Empty;

    public string OverviewDescription { get; set; } = string.Empty;

    public List<ProfileStat> Stats { get; set; } = new();

    public List<ProfilePillar> Pillars { get; set; } = new();

    public string SpotlightTitle { get; set; } = string.Empty;

    public string SpotlightDescription { get; set; } = string.Empty;

    public string SpotlightBadge { get; set; } = string.Empty;

    public string DownloadLabel { get; set; } = string.Empty;

    public string? DownloadFileName { get; set; }

    public string? DownloadUrl { get; set; }

    public string? HeroImageFileName { get; set; }
}

public sealed class ProfileStat
{
    public string Label { get; set; } = string.Empty;

    public string Value { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}

public sealed class ProfilePillar
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Accent { get; set; } = string.Empty;
}
