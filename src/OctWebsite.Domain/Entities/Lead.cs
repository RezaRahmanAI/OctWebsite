namespace OctWebsite.Domain.Entities;

public sealed record Lead(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string? Subject,
    string Message,
    DateTimeOffset CreatedAt
);
