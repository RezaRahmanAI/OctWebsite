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
        await SeedCompanyAboutEntriesAsync(cancellationToken);
        await SeedMethodologyDataEntriesAsync(cancellationToken);
        await SeedCollectionAsync(context.AcademyTracks, SeedData.AcademyTracks, cancellationToken);
        await SeedCollectionAsync(context.BlogPosts, SeedData.BlogPosts, cancellationToken);
        await SeedCollectionAsync(context.ContactPages, new[] { SeedData.ContactPage }, cancellationToken);
        await SeedCollectionAsync(context.CareerPages, new[] { SeedData.CareerPage }, cancellationToken);
        await SeedCollectionAsync(context.ServicesPages, new[] { SeedData.ServicesPage }, cancellationToken);
        await SeedCollectionAsync(context.ProductPages, new[] { SeedData.ProductPage }, cancellationToken);
        await SeedCollectionAsync(context.ServiceItems, SeedData.Services, cancellationToken);
        await SeedCollectionAsync(context.ProductItems, SeedData.Products, cancellationToken);
        await SeedCollectionAsync(context.ProductShowcaseItems, SeedData.ProductShowcaseItems, cancellationToken);

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

    private async Task SeedCompanyAboutEntriesAsync(CancellationToken cancellationToken)
    {
        var existingKeys = await context.CompanyAboutEntries.AsNoTracking()
            .Select(entry => entry.Key.ToLower())
            .ToListAsync(cancellationToken);

        var missingEntries = SeedData.CompanyAboutEntries
            .Where(entry => !existingKeys.Contains(entry.Key.ToLower()))
            .ToArray();

        if (missingEntries.Length == 0)
        {
            return;
        }

        await context.CompanyAboutEntries.AddRangeAsync(missingEntries, cancellationToken);
    }

    private async Task SeedMethodologyDataEntriesAsync(CancellationToken cancellationToken)
    {
        var existingEntries = await context.MethodologyDataEntries
            .AsNoTracking()
            .Where(entry => SeedData.MethodologyDataEntries
                .Select(seed => seed.Key.ToLower())
                .Contains(entry.Key.ToLower()))
            .ToListAsync(cancellationToken);

        var seedsByKey = SeedData.MethodologyDataEntries
            .ToDictionary(entry => entry.Key.ToLower());

        foreach (var entry in existingEntries.Where(entry => string.IsNullOrWhiteSpace(entry.Content)))
        {
            var updatedEntry = entry with
            {
                Content = seedsByKey[entry.Key.ToLower()].Content
            };

            context.MethodologyDataEntries.Update(updatedEntry);
        }

        var missingEntries = SeedData.MethodologyDataEntries
            .Where(entry => existingEntries.All(existing =>
                !string.Equals(existing.Key, entry.Key, StringComparison.OrdinalIgnoreCase)))
            .ToArray();

        if (missingEntries.Length == 0)
        {
            return;
        }

        await context.MethodologyDataEntries.AddRangeAsync(missingEntries, cancellationToken);
    }
}
