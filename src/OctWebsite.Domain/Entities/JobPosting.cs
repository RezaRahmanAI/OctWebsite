namespace OctWebsite.Domain.Entities;

public sealed record JobPosting(
    Guid Id,
    string Title,
    string Location,
    string EmploymentType,
    string Summary,
    string? DetailsUrl,
    bool Active,
    DateTimeOffset PublishedAt
);
