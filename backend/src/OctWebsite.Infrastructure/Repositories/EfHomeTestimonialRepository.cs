using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfHomeTestimonialRepository(ApplicationDbContext dbContext) : IHomeTestimonialRepository
{
    public async Task<IReadOnlyList<HomeTestimonial>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.HomeTestimonials.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<HomeTestimonial?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await dbContext.HomeTestimonials.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

    public async Task<HomeTestimonial> CreateAsync(HomeTestimonial testimonial, CancellationToken cancellationToken = default)
    {
        await dbContext.HomeTestimonials.AddAsync(testimonial, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return testimonial;
    }

    public async Task<HomeTestimonial?> UpdateAsync(HomeTestimonial testimonial, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.HomeTestimonials.AnyAsync(t => t.Id == testimonial.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.HomeTestimonials.Update(testimonial);
        await dbContext.SaveChangesAsync(cancellationToken);
        return testimonial;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.HomeTestimonials.Where(t => t.Id == id).ToListAsync(cancellationToken);
        if (existing.Count == 0)
        {
            return;
        }

        dbContext.HomeTestimonials.RemoveRange(existing);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
