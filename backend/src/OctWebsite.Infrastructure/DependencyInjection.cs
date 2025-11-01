using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application.Abstractions;
using OctWebsite.Infrastructure.Repositories;

namespace OctWebsite.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<ITeamRepository, InMemoryTeamRepository>();
        services.AddSingleton<ICompanyAboutRepository, InMemoryCompanyAboutRepository>();
        services.AddSingleton<IServiceRepository, InMemoryServiceRepository>();
        services.AddSingleton<IProductRepository, InMemoryProductRepository>();
        services.AddSingleton<IAcademyRepository, InMemoryAcademyRepository>();
        services.AddSingleton<IBlogRepository, InMemoryBlogRepository>();
        services.AddSingleton<ISettingsRepository, InMemorySettingsRepository>();
        services.AddSingleton<ILeadRepository, InMemoryLeadRepository>();
        return services;
    }
}
