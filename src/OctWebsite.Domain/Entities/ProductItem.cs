namespace OctWebsite.Domain.Entities;

public sealed record ProductItem(
    Guid Id,
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active
);
