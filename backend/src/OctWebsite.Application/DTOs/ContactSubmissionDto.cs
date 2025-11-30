using System.ComponentModel.DataAnnotations;

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
    [Required, MinLength(2)] string Name,
    [Required, EmailAddress] string Email,
    string? Phone,
    string? Interest,
    [Required, MinLength(10)] string Message
);
