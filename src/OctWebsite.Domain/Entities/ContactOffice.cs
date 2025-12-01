namespace OctWebsite.Domain.Entities;

public sealed record ContactOffice(
    string Name,
    string Headline,
    string Address,
    string ImageUrl);
