namespace OctWebsite.Domain.Entities;

public sealed record TeamMember(
    Guid Id,
    string Name,
    string Role,
    string PhotoUrl,
    string Bio,
    string Email,
    bool Active
);
