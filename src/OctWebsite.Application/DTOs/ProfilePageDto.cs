using System.Text.Json.Serialization;

namespace OctWebsite.Application.DTOs;

public sealed record ProfileStatDto(string Label, string Value, string Description);

public sealed record ProfilePillarDto(string Title, string Description, string Accent);

public sealed record ProfilePageDto(
    Guid Id,
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string HeroTagline,
    MediaResourceDto? HeroVideo,
    MediaResourceDto? HeroImage,
    string DownloadLabel,
    MediaResourceDto? Download,
    string OverviewTitle,
    string OverviewDescription,
    IReadOnlyList<ProfileStatDto> Stats,
    IReadOnlyList<ProfilePillarDto> Pillars,
    string SpotlightTitle,
    string SpotlightDescription,
    string SpotlightBadge);

public sealed record SaveProfileStatRequest(string Label, string Value, string Description);

public sealed record SaveProfilePillarRequest(string Title, string Description, string Accent);

public sealed record SaveProfilePageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string HeroTagline,
    string? HeroImageFileName,
    string? HeroVideoFileName,
    string DownloadLabel,
    string? DownloadFileName,
    string? DownloadUrl,
    string OverviewTitle,
    string OverviewDescription,
    IReadOnlyList<SaveProfileStatRequest> Stats,
    IReadOnlyList<SaveProfilePillarRequest> Pillars,
    string SpotlightTitle,
    string SpotlightDescription,
    string SpotlightBadge);
