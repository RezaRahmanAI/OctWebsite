using System;

namespace OctWebsite.Application.DTOs;

public sealed record CareerPageDto(
    Guid Id,
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    MediaResourceDto? HeroVideo,
    string HeroMetaLine,
    string PrimaryCtaLabel,
    string PrimaryCtaLink,
    string ResponseTime);

public sealed record SaveCareerPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string? HeroVideoFileName,
    string HeroMetaLine,
    string PrimaryCtaLabel,
    string PrimaryCtaLink,
    string ResponseTime);
