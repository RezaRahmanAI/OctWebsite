namespace OctWebsite.Application.DTOs;

public sealed record ContactSubmissionDto(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string? Interest,
    string Message,
    DateTimeOffset CreatedAt
);

public sealed record SubmitContactFormRequest(
    string Name,
    string Email,
    string? Phone,
    string? Interest,
    string Message
);
