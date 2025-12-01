using Microsoft.EntityFrameworkCore;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class EfBlogRepository(ApplicationDbContext dbContext) : IBlogRepository
{
    public async Task<IReadOnlyList<BlogPost>> GetAllAsync(CancellationToken cancellationToken = default)
        => await dbContext.BlogPosts.AsNoTracking().OrderByDescending(post => post.CreatedDate).ToListAsync(cancellationToken);

    public Task<BlogPost?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => dbContext.BlogPosts.AsNoTracking().FirstOrDefaultAsync(post => post.Id == id, cancellationToken);

    public Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalized = slug.Trim().ToLowerInvariant();
        return dbContext.BlogPosts.AsNoTracking().FirstOrDefaultAsync(post => post.Slug.ToLower() == normalized, cancellationToken);
    }

    public async Task<BlogPost> CreateAsync(BlogPost post, CancellationToken cancellationToken = default)
    {
        await dbContext.BlogPosts.AddAsync(post, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return post;
    }

    public async Task<BlogPost?> UpdateAsync(BlogPost post, CancellationToken cancellationToken = default)
    {
        var exists = await dbContext.BlogPosts.AnyAsync(entry => entry.Id == post.Id, cancellationToken);
        if (!exists)
        {
            return null;
        }

        dbContext.BlogPosts.Update(post);
        await dbContext.SaveChangesAsync(cancellationToken);
        return post;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.BlogPosts.FirstOrDefaultAsync(post => post.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        dbContext.BlogPosts.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
