namespace OctWebsite.Domain.Entities;

public sealed record JobPosting(
    Guid Id,
    string Title,
    string Location,
    string EmploymentType,
    string Summary,
    bool Active,
    DateTimeOffset PublishedAt
);
