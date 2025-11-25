using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OctWebsite.Infrastructure.Identity;

namespace OctWebsite.Infrastructure.Data;

public sealed class ApplicationDbInitializer(
    ApplicationDbContext context,
    UserManager<ApplicationUser> userManager,
    IOptions<AdminUserOptions> adminOptions)
{
    private readonly AdminUserOptions adminUser = adminOptions.Value;

    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        await context.Database.MigrateAsync(cancellationToken);

        await SeedCollectionAsync(context.TeamMembers, SeedData.TeamMembers, cancellationToken);
        await SeedCollectionAsync(context.CompanyAboutEntries, SeedData.CompanyAboutEntries, cancellationToken);

        await EnsureAdminUserAsync(cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureAdminUserAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(adminUser.Username) || string.IsNullOrWhiteSpace(adminUser.Password))
        {
            return;
        }

        var existing = await userManager.FindByNameAsync(adminUser.Username);
        if (existing is not null)
        {
            return;
        }

        var email = string.IsNullOrWhiteSpace(adminUser.Email)
            ? $"{adminUser.Username}@example.com"
            : adminUser.Email;

        var user = new ApplicationUser
        {
            UserName = adminUser.Username,
            Email = email
        };

        var result = await userManager.CreateAsync(user, adminUser.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(error => error.Description));
            throw new InvalidOperationException($"Failed to create the default admin user: {errors}");
        }
    }

    private static async Task SeedCollectionAsync<TEntity>(DbSet<TEntity> set, IEnumerable<TEntity> data, CancellationToken cancellationToken)
        where TEntity : class
    {
        if (await set.AnyAsync(cancellationToken))
        {
            return;
        }

        await set.AddRangeAsync(data, cancellationToken);
    }
}
