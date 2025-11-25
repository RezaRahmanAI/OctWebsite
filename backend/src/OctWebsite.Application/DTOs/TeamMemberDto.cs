namespace OctWebsite.Application.DTOs;

public sealed record TeamMemberDto(
    Guid Id,
    string Name,
    string Role,
    string? PhotoFileName,
    string? PhotoUrl,
    string Bio,
    string Email,
    bool Active
);
