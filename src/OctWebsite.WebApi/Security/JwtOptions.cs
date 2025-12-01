namespace OctWebsite.WebApi.Security;

using System.ComponentModel.DataAnnotations;

public sealed class JwtOptions
{
    [Required]
    public string Issuer { get; set; } = string.Empty;

    [Required]
    public string Audience { get; set; } = string.Empty;

    [Required]
    [MinLength(32, ErrorMessage = "SigningKey must be at least 32 characters long.")]
    public string SigningKey { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "AccessTokenLifetimeMinutes must be greater than zero.")]
    public int AccessTokenLifetimeMinutes { get; set; } = 60;
}
