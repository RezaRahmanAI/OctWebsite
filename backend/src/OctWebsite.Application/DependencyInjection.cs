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
        services.AddScoped<IAcademyTrackService, AcademyTrackService>();
        services.AddScoped<IAcademyPageService, AcademyPageService>();
        return services;
    }
}
