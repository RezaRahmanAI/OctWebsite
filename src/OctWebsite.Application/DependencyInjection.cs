using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application.Services;

namespace OctWebsite.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ITeamService, TeamService>();
        services.AddScoped<IAboutService, AboutService>();
        services.AddScoped<IAboutPageService, AboutPageService>();
        services.AddScoped<IHomeHeroService, HomeHeroService>();
        services.AddScoped<IHomeTrustService, HomeTrustService>();
        services.AddScoped<IHomeTestimonialService, HomeTestimonialService>();
        services.AddScoped<IHomePageService, HomePageService>();
        services.AddScoped<IContactPageService, ContactPageService>();
        services.AddScoped<ICareerPageService, CareerPageService>();
        services.AddScoped<IContactChannelsService, ContactChannelsService>();
        services.AddScoped<IContactSubmissionService, ContactSubmissionService>();
        services.AddScoped<IAcademyTrackService, AcademyTrackService>();
        services.AddScoped<IAcademyPageService, AcademyPageService>();
        services.AddScoped<IMethodologyPageService, MethodologyPageService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<IBlogPageService, BlogPageService>();
        services.AddScoped<IServicesPageService, ServicesPageService>();
        services.AddScoped<IProductPageService, ProductPageService>();
        services.AddScoped<IServiceCatalog, ServiceCatalog>();
        services.AddScoped<IProductCatalog, ProductCatalog>();
        services.AddScoped<IProductShowcaseService, ProductShowcaseService>();
        services.AddScoped<ICareerService, CareerService>();
        services.AddScoped<IFaqService, FaqService>();
        services.AddScoped<IProfilePageService, ProfilePageService>();
        return services;
    }
}
