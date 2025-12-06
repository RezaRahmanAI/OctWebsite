using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IProductShowcaseService
{
    Task<IReadOnlyList<ProductShowcaseDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductShowcaseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductShowcaseDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<ProductShowcaseDto> CreateAsync(SaveProductShowcaseRequest request, CancellationToken cancellationToken = default);
    Task<ProductShowcaseDto?> UpdateAsync(Guid id, SaveProductShowcaseRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
