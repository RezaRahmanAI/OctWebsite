using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IBlogRepository
{
    Task<IReadOnlyList<BlogPost>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<BlogPost?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<BlogPost> CreateAsync(BlogPost post, CancellationToken cancellationToken = default);

    Task<BlogPost?> UpdateAsync(BlogPost post, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
