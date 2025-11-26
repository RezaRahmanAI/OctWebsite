using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IBlogPageService
{
    Task<BlogPageDto> GetAsync(CancellationToken cancellationToken = default);

    Task<BlogPageDto> UpsertAsync(SaveBlogPageRequest request, CancellationToken cancellationToken = default);
}
