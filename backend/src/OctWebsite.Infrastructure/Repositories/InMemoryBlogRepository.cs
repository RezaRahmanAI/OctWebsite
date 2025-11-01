using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Domain.Entities;
using OctWebsite.Infrastructure.Data;

namespace OctWebsite.Infrastructure.Repositories;

internal sealed class InMemoryBlogRepository : IBlogRepository
{
    public Task<IReadOnlyList<BlogPost>> GetAllAsync(CancellationToken cancellationToken = default)
        => Task.FromResult<IReadOnlyList<BlogPost>>(SeedData.BlogPosts);

    public Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalizedSlug = slug.Trim().ToLowerInvariant();
        var post = SeedData.BlogPosts.FirstOrDefault(post => post.Slug.Equals(normalizedSlug, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(post);
    }
}
