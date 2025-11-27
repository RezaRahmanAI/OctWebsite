using System.Collections.Generic;

namespace OctWebsite.Application.DTOs;

public sealed record HomePageDto(
    Guid Id,
    HomeHeroDto Hero,
    HomeTrustDto Trust,
    IReadOnlyList<HomeTestimonialDto> Testimonials
);

public sealed record HomeHeroDto(
    Guid Id,
    string Badge,
    string Title,
    string Description,
    CtaLinkDto PrimaryCta,
    CtaLinkDto SecondaryCta,
    HomeHighlightDto HighlightCard,
    IReadOnlyList<string> HighlightList,
    MediaResourceDto? Video,
    MediaResourceDto? Poster,
    HomeFeaturePanelDto FeaturePanel
);

public sealed record HomeHighlightDto(
    string Title,
    string Description
);

public sealed record HomeFeaturePanelDto(
    string Eyebrow,
    string Title,
    string Description,
    IReadOnlyList<HomeMetricDto> Metrics,
    HomePartnerDto Partner
);

public sealed record HomeMetricDto(
    string Label,
    string Value,
    string Theme
);

public sealed record HomePartnerDto(
    string Label,
    string Description
);

public sealed record HomeTrustDto(
    Guid Id,
    string Tagline,
    IReadOnlyList<MediaResourceDto?> Logos,
    IReadOnlyList<HomeStatDto> Stats
);

public sealed record HomeStatDto(
    string Label,
    decimal Value,
    string? Suffix,
    int? Decimals
);

public sealed record HomeTestimonialDto(
    Guid Id,
    string Quote,
    string Name,
    string Title,
    string Location,
    int Rating,
    string Type,
    MediaResourceDto? Image
);

public sealed record HomeHeroSectionRequest(
    string Badge,
    string Title,
    string Description,
    CtaLinkRequest PrimaryCta,
    CtaLinkRequest SecondaryCta,
    HomeHighlightRequest HighlightCard,
    IReadOnlyList<string> HighlightList,
    string? VideoFileName,
    string? PosterFileName,
    HomeFeaturePanelRequest FeaturePanel
);

public sealed record HomeHighlightRequest(
    string Title,
    string Description
);

public sealed record HomeFeaturePanelRequest(
    string Eyebrow,
    string Title,
    string Description,
    IReadOnlyList<HomeMetricRequest> Metrics,
    HomePartnerRequest Partner
);

public sealed record HomeMetricRequest(
    string Label,
    string Value,
    string Theme
);

public sealed record HomePartnerRequest(
    string Label,
    string Description
);

public sealed record HomeTrustSectionRequest(
    string Tagline,
    IReadOnlyList<HomeTrustLogoRequest> Logos,
    IReadOnlyList<HomeStatRequest> Stats
);

public sealed record HomeTrustLogoRequest(string? LogoFileName);

public sealed record HomeStatRequest(
    string Label,
    decimal Value,
    string? Suffix,
    int? Decimals
);

public sealed record HomeTestimonialRequest(
    string Quote,
    string Name,
    string Title,
    string Location,
    int Rating,
    string Type,
    string? ImageFileName
);

public sealed record CtaLinkDto(
    string Label,
    string? RouterLink,
    string? Fragment,
    string? ExternalUrl,
    string? Style
);

public sealed record CtaLinkRequest(
    string Label,
    string? RouterLink,
    string? Fragment,
    string? ExternalUrl,
    string? Style
);
