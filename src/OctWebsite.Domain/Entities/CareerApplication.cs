namespace OctWebsite.Domain.Entities;

public sealed record CareerApplication(
    Guid Id,
    Guid JobPostingId,
    string FullName,
    string Email,
    string? Phone,
    string? Message,
    string? CvFileName,
    DateTimeOffset CreatedAt
)
{
    public JobPosting? JobPosting { get; init; }
}
