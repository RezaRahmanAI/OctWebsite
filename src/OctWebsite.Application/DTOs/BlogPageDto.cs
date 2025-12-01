using System;

namespace OctWebsite.Application.DTOs;

public sealed record BlogPageDto(
    Guid Id,
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    MediaResourceDto? HeroVideo);

public sealed record SaveBlogPageRequest(
    string HeaderEyebrow,
    string HeaderTitle,
    string HeaderSubtitle,
    string? HeroVideoFileName);
