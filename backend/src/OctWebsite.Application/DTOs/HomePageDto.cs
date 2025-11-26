using System.Text.Json;

namespace OctWebsite.Application.DTOs;

public sealed record HomePageDto(
    Guid Id,
    JsonDocument Content);

public sealed record SaveHomePageRequest(JsonDocument Content);
