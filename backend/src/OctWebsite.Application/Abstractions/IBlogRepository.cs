using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IBlogRepository
{
    Task<IReadOnlyList<BlogPost>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
