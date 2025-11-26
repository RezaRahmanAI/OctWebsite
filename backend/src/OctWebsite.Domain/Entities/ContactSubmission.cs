namespace OctWebsite.Domain.Entities;

public sealed record ContactSubmission(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string? Interest,
    string Message,
    DateTimeOffset CreatedAt
);
