using Microsoft.EntityFrameworkCore;

namespace OctWebsite.Infrastructure.Data;

public sealed class ApplicationDbInitializer(ApplicationDbContext context)
{
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        await context.Database.MigrateAsync(cancellationToken);

        await SeedCollectionAsync(context.TeamMembers, SeedData.TeamMembers, cancellationToken);
        await SeedCollectionAsync(context.CompanyAboutEntries, SeedData.About, cancellationToken);
        await SeedCollectionAsync(context.ServiceItems, SeedData.Services, cancellationToken);
        await SeedCollectionAsync(context.ProductItems, SeedData.Products, cancellationToken);
        await SeedCollectionAsync(context.AcademyTracks, SeedData.AcademyTracks, cancellationToken);
        await SeedCollectionAsync(context.BlogPosts, SeedData.BlogPosts, cancellationToken);

        if (!await context.SiteSettings.AnyAsync(cancellationToken))
        {
            await context.SiteSettings.AddAsync(SeedData.SiteSettings, cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);
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
