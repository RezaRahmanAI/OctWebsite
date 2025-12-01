namespace OctWebsite.Application.DTOs;

public sealed record ServicesPageDto(
    Guid Id,
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    MediaResourceDto? HeroVideo);

public sealed record SaveServicesPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string? HeroVideoFileName);
