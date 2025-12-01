namespace OctWebsite.Domain.Entities;

public sealed record HomeTestimonial(
    Guid Id,
    string Quote,
    string Name,
    string Title,
    string Location,
    int Rating,
    string Type,
    string? ImageFileName
);
