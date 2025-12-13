namespace OctWebsite.Domain.Entities;

public sealed record Faq(
    Guid Id,
    string Question,
    string Answer,
    int DisplayOrder);
