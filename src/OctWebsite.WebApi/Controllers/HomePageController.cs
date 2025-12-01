using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OctWebsite.Application.DTOs;
using OctWebsite.Application.Services;

namespace OctWebsite.WebApi.Controllers;

[ApiController]
[Route("api/home-page")]
[AllowAnonymous]
public sealed class HomePageController(IHomePageService homePageService, IWebHostEnvironment environment)
    : HomeMediaControllerBase(environment)
{
    private const string HeroFolder = "uploads/home/hero";
    private const string TestimonialFolder = "uploads/home/testimonials";
    private const string TrustFolder = "uploads/home/trust";

    [HttpGet]
    public async Task<ActionResult<HomePageDto>> GetAsync(CancellationToken cancellationToken)
    {
        var page = await homePageService.GetAsync(cancellationToken);
        return Ok(ResolveMedia(page));
    }

    private HomePageDto ResolveMedia(HomePageDto dto)
    {
        return dto with
        {
            Hero = dto.Hero with
            {
                Video = Resolve(dto.Hero.Video, HeroFolder),
                Poster = Resolve(dto.Hero.Poster, HeroFolder)
            },
            Trust = dto.Trust with
            {
                Logos = dto.Trust.Logos.Select(logo => Resolve(logo, TrustFolder)).ToArray(),
            },
            Testimonials = dto.Testimonials
                .Select(t => t with { Image = Resolve(t.Image, TestimonialFolder) })
                .ToArray()
        };
    }
}
