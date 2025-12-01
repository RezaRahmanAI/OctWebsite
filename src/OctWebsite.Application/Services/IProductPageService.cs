using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IProductPageService
{
    Task<ProductPageDto> GetAsync(CancellationToken cancellationToken = default);

    Task<ProductPageDto> UpsertAsync(SaveProductPageRequest request, CancellationToken cancellationToken = default);
}
