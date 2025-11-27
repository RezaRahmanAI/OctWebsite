using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfHomeHeroRepository(ApplicationDbContext dbContext) : IHomeHeroRepository
{
    public async Task<HomeHeroSection?> GetAsync(CancellationToken cancellationToken = default)
        => await dbContext.HomeHeroSections.AsNoTracking().FirstOrDefaultAsync(cancellationToken);

    public async Task<HomeHeroSection> CreateAsync(HomeHeroSection hero, CancellationToken cancellationToken = default)
    {
        await dbContext.HomeHeroSections.AddAsync(hero, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return hero;
    }

    public async Task<HomeHeroSection?> UpdateAsync(HomeHeroSection hero, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.HomeHeroSections.AnyAsync(h => h.Id == hero.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.HomeHeroSections.Update(hero);
        await dbContext.SaveChangesAsync(cancellationToken);
        return hero;
    }
}
