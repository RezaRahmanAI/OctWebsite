using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class HomePageService(
    IHomeHeroService heroService,
    IHomeTrustService trustService,
    IHomeTestimonialService testimonialService) : IHomePageService
{
    public async Task<HomePageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var hero = await heroService.GetAsync(cancellationToken);
        var trust = await trustService.GetAsync(cancellationToken);
        var testimonials = await testimonialService.GetAsync(cancellationToken);

        return new HomePageDto(hero.Id, hero, trust, testimonials);
    }
}
