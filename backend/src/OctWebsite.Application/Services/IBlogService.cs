using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IBlogService
{
    Task<IReadOnlyList<BlogPostDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<BlogPostDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
