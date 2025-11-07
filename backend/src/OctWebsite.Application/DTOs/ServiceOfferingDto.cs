namespace OctWebsite.Application.DTOs;

public enum ServiceOfferingType
{
    Service,
    Product
}

public sealed record ServiceOfferingDto(
    Guid Id,
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active,
    ServiceOfferingType Type
);
