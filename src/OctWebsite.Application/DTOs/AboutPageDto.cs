using System.Text.Json.Serialization;

namespace OctWebsite.Application.DTOs;

public sealed record AboutValueDto(
    string Title,
    string Description,
    MediaResourceDto? Video);

public sealed record AboutPageDto(
    Guid Id,
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    MediaResourceDto? HeroVideo,
    string Intro,
    string MissionTitle,
    string MissionDescription,
    string VisionTitle,
    string VisionDescription,
    MediaResourceDto? MissionImage,
    IReadOnlyList<AboutValueDto> Values,
    string StoryTitle,
    string StoryDescription,
    MediaResourceDto? StoryImage,
    string TeamTitle,
    string TeamSubtitle,
    string? TeamNote);

public sealed record SaveAboutValueRequest(
    string Title,
    string Description,
    string? VideoFileName);

public sealed record SaveAboutPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string? HeroVideoFileName,
    string Intro,
    string MissionTitle,
    string MissionDescription,
    string VisionTitle,
    string VisionDescription,
    string? MissionImageFileName,
    IReadOnlyList<SaveAboutValueRequest> Values,
    string StoryTitle,
    string StoryDescription,
    string? StoryImageFileName,
    string TeamTitle,
    string TeamSubtitle,
    string? TeamNote);
