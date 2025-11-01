using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application.Services;

namespace OctWebsite.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ITeamService, TeamService>();
        services.AddScoped<IAboutService, AboutService>();
        services.AddScoped<IServiceCatalog, ServiceCatalog>();
        services.AddScoped<IProductCatalog, ProductCatalog>();
        services.AddScoped<IAcademyService, AcademyService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<ISettingsService, SettingsService>();
        services.AddScoped<ILeadService, LeadService>();
        return services;
    }
}
