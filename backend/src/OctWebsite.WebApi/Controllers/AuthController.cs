using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OctWebsite.WebApi.Contracts;
using OctWebsite.WebApi.Security;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly AdminUserOptions adminUser;
    private readonly JwtTokenGenerator tokenGenerator;

    public AuthController(IOptions<AdminUserOptions> adminOptions, JwtTokenGenerator tokenGenerator)
    {
        adminUser = adminOptions.Value;
        this.tokenGenerator = tokenGenerator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!IsValidUser(request.Username, request.Password))
        {
            return Unauthorized();
        }

        var token = tokenGenerator.Generate(request.Username);
        return Ok(new LoginResponse(token.Token, token.ExpiresAt));
    }

    private bool IsValidUser(string username, string password)
        => string.Equals(username, adminUser.Username, StringComparison.Ordinal)
            && string.Equals(password, adminUser.Password, StringComparison.Ordinal);
}
