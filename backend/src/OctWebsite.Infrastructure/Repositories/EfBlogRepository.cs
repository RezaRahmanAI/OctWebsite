using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfBlogRepository(ApplicationDbContext dbContext) : IBlogRepository
{
    public async Task<IReadOnlyList<BlogPost>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.BlogPosts.AsNoTracking().ToListAsync(cancellationToken);

    public Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        return dbContext.BlogPosts.AsNoTracking()
            .FirstOrDefaultAsync(post => post.Slug.ToLower() == normalizedSlug, cancellationToken);
    }
}
