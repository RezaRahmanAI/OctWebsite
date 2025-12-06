namespace OctWebsite.Application.DTOs;

public sealed record JobPostingDto(
    Guid Id,
    string Title,
    string Location,
    string EmploymentType,
    string Summary,
    bool Active,
    DateTimeOffset PublishedAt
);

public sealed record SaveJobPostingRequest(
    string Title,
    string Location,
    string EmploymentType,
    string Summary,
    bool Active
);

public sealed record CareerApplicationDto(
    Guid Id,
    Guid JobPostingId,
    string JobTitle,
    string FullName,
    string Email,
    string? Phone,
    string? Message,
    string? CvFileName,
    string? CvUrl,
    DateTimeOffset CreatedAt
);

public sealed record SubmitCareerApplicationRequest(
    Guid JobPostingId,
    string FullName,
    string Email,
    string? Phone,
    string? Message,
    string? CvFileName
);
