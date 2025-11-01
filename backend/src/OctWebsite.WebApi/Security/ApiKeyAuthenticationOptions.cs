using Microsoft.AspNetCore.Authentication;

namespace OctWebsite.WebApi.Security;

public sealed class ApiKeyAuthenticationOptions : AuthenticationSchemeOptions
{
    public string HeaderName { get; set; } = "X-Admin-ApiKey";

    public string? RequiredApiKey { get; set; }
        = "change-me";
}
