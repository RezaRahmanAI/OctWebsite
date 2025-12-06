using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OctWebsite.Application.Abstractions;
using OctWebsite.Infrastructure.Data;
using OctWebsite.Infrastructure.Identity;
using OctWebsite.Infrastructure.Repositories;

namespace OctWebsite.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
        services.AddScoped<ApplicationDbInitializer>();

        services.AddIdentityCore<ApplicationUser>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddScoped<ITeamRepository, EfTeamRepository>();
        services.AddScoped<ICompanyAboutRepository, EfCompanyAboutRepository>();
        services.AddScoped<IHomeHeroRepository, EfHomeHeroRepository>();
        services.AddScoped<IHomeTrustRepository, EfHomeTrustRepository>();
        services.AddScoped<IHomeTestimonialRepository, EfHomeTestimonialRepository>();
        services.AddScoped<IContactPageRepository, EfContactPageRepository>();
        services.AddScoped<ICareerPageRepository, EfCareerPageRepository>();
        services.AddScoped<IServicesPageRepository, EfServicesPageRepository>();
        services.AddScoped<IProductPageRepository, EfProductPageRepository>();
        services.AddScoped<IProductShowcaseRepository, EfProductShowcaseRepository>();
        services.AddScoped<IAcademyTrackRepository, EfAcademyTrackRepository>();
        services.AddScoped<IBlogRepository, EfBlogRepository>();
        services.AddScoped<IContactSubmissionRepository, EfContactSubmissionRepository>();
        services.AddScoped<IServiceRepository, EfServiceRepository>();
        services.AddScoped<IProductRepository, EfProductRepository>();
        services.AddScoped<IJobPostingRepository, EfJobPostingRepository>();
        services.AddScoped<ICareerApplicationRepository, EfCareerApplicationRepository>();

        return services;
    }
}
