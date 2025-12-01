namespace OctWebsite.Application.DTOs;

public sealed record CompanyAboutDto(
    Guid Id,
    string Key,
    string Content
);
