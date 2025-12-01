using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IProductPageRepository
{
    Task<ProductPage?> GetAsync(CancellationToken cancellationToken = default);

    Task<ProductPage> UpsertAsync(ProductPage page, CancellationToken cancellationToken = default);
}
