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
        services.AddScoped<IContactPageService, ContactPageService>();
        services.AddScoped<IContactChannelsService, ContactChannelsService>();
        services.AddScoped<IContactSubmissionService, ContactSubmissionService>();
        services.AddScoped<IAcademyTrackService, AcademyTrackService>();
        services.AddScoped<IAcademyPageService, AcademyPageService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<IBlogPageService, BlogPageService>();
        services.AddScoped<IServiceItemService, ServiceItemService>();
        services.AddScoped<IHomePageService, HomePageService>();
        return services;
    }
}
