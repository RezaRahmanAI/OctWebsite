namespace OctWebsite.Domain.Entities;

public sealed record SiteSettings(
    Guid Id,
    string SiteTitle,
    string Tagline,
    string HeroTitle,
    string HeroSubtitle,
    string PrimaryCtaLabel,
    string HeroImageUrl,
    string HeroImageAlt,
    string HeroVideoUrl,
    string HeroVideoPoster,
    string HeroMediaBadge,
    string HeroMediaCaption
);
