namespace OctWebsite.Application.DTOs;

public sealed record LeadDto(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string? Subject,
    string Message,
    DateTimeOffset CreatedAt
);
