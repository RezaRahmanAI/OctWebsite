using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Infrastructure.Identity;
using OctWebsite.WebApi.Contracts;
using OctWebsite.WebApi.Security;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> userManager;
    private readonly JwtTokenGenerator tokenGenerator;

    public AuthController(UserManager<ApplicationUser> userManager, JwtTokenGenerator tokenGenerator)
    {
        this.userManager = userManager;
        this.tokenGenerator = tokenGenerator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var user = await userManager.FindByNameAsync(request.Username);
        if (user is null)
        {
            return Unauthorized();
        }

        var isValid = await userManager.CheckPasswordAsync(user, request.Password);
        if (!isValid)
        {
            return Unauthorized();
        }

        var token = tokenGenerator.Generate(user);
        return Ok(new LoginResponse(token.Token, token.ExpiresAt));
    }
}
