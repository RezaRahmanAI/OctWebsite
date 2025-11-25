namespace OctWebsite.Infrastructure.Identity;

public sealed class AdminUserOptions
{
    public string Username { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string? Email { get; set; }
}
