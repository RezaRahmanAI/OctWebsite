namespace OctWebsite.WebApi.Contracts;

public sealed record LoginResponse(string Token, DateTime ExpiresAt);
