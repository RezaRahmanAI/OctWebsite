namespace OctWebsite.Application.DTOs;

public sealed record FaqDto(
    Guid Id,
    string Question,
    string Answer,
    int DisplayOrder);

public sealed record SaveFaqRequest(
    string Question,
    string Answer,
    int DisplayOrder);
