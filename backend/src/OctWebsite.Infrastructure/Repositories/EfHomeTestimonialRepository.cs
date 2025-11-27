using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfHomeTestimonialRepository(ApplicationDbContext dbContext) : IHomeTestimonialRepository
{
    public async Task<IReadOnlyList<HomeTestimonial>> GetByHomePageIdAsync(Guid homePageId, CancellationToken cancellationToken = default)
        => await dbContext.HomeTestimonials.AsNoTracking()
            .Where(t => t.HomePageId == homePageId)
            .ToListAsync(cancellationToken);

    public async Task ReplaceAsync(Guid homePageId, IReadOnlyList<HomeTestimonial> testimonials, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.HomeTestimonials.Where(t => t.HomePageId == homePageId).ToListAsync(cancellationToken);
        if (existing.Count > 0)
        {
            dbContext.HomeTestimonials.RemoveRange(existing);
        }

        await dbContext.HomeTestimonials.AddRangeAsync(testimonials, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
