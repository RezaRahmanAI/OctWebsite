using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application.Abstractions;
using OctWebsite.Infrastructure.Data;
using OctWebsite.Infrastructure.Repositories;

namespace OctWebsite.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
        services.AddScoped<ApplicationDbInitializer>();

        services.AddScoped<ITeamRepository, EfTeamRepository>();
        services.AddScoped<ICompanyAboutRepository, EfCompanyAboutRepository>();
        services.AddScoped<IServiceRepository, EfServiceRepository>();
        services.AddScoped<IProductRepository, EfProductRepository>();
        services.AddScoped<IAcademyRepository, EfAcademyRepository>();
        services.AddScoped<IBlogRepository, EfBlogRepository>();
        services.AddScoped<ISettingsRepository, EfSettingsRepository>();
        services.AddScoped<ILeadRepository, EfLeadRepository>();

        return services;
    }
}
