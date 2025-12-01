using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IBlogService
{
    Task<IReadOnlyList<BlogPostDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<BlogPostDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<BlogPostDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<BlogPostDto> CreateAsync(SaveBlogPostRequest request, CancellationToken cancellationToken = default);

    Task<BlogPostDto?> UpdateAsync(Guid id, SaveBlogPostRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
