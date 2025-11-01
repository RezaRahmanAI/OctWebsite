namespace OctWebsite.Domain.Entities;

public sealed record ServiceItem(
    Guid Id,
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active
);
