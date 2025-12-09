using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/home-trust")]
[Authorize]
public sealed class HomeTrustController(IHomeTrustService trustService, IWebHostEnvironment environment)
    : HomeMediaControllerBase(environment)
{
    private const string TrustFolder = "uploads/home/trust";

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HomeTrustDto>> GetAsync(CancellationToken cancellationToken)
    {
        var trust = await trustService.GetAsync(cancellationToken);
        return Ok(ResolveTrust(trust));
    }

    [HttpPost]
    [RequestFormLimits(MultipartBodyLengthLimit = 104_857_600)]
    public async Task<ActionResult<HomeTrustDto>> UpsertAsync([FromForm] SaveHomeTrustFormRequest form, CancellationToken cancellationToken)
    {
        var logos = new List<HomeTrustLogoRequest>();
        foreach (var logo in form.TrustLogos ?? Array.Empty<HomeTrustLogoFormRequest>())
        {
            if (logo.Logo is null && string.IsNullOrWhiteSpace(logo.LogoFileName))
            {
                continue;
            }

            var logoFileName = await StoreMediaIfNeededAsync(logo.Logo, TrustFolder, logo.LogoFileName, cancellationToken);
            logos.Add(new HomeTrustLogoRequest(logoFileName));
        }

        var request = new HomeTrustSectionRequest(
            form.TrustTagline ?? string.Empty,
            logos,
            (form.TrustStats ?? new List<HomeStatFormRequest>())
                .Select(stat => new HomeStatRequest(stat.Label ?? string.Empty, stat.Value, stat.Suffix, stat.Decimals))
                .ToArray());

        var updated = await trustService.UpsertAsync(request, cancellationToken);
        return Ok(ResolveTrust(updated));
    }

    private HomeTrustDto ResolveTrust(HomeTrustDto dto)
    {
        return dto with
        {
            Logos = dto.Logos.Select(logo => Resolve(logo, TrustFolder)).ToArray(),
        };
    }
}

public sealed class SaveHomeTrustFormRequest
{
    public string? TrustTagline { get; set; }
    public IList<HomeTrustLogoFormRequest> TrustLogos { get; set; } = new List<HomeTrustLogoFormRequest>();
    public IList<HomeStatFormRequest> TrustStats { get; set; } = new List<HomeStatFormRequest>();
}
