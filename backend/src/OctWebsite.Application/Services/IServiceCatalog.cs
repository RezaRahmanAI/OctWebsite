using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IServiceCatalog
{
    Task<IReadOnlyList<ServiceItemDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<ServiceCatalogDto> GetUnifiedCatalogAsync(CancellationToken cancellationToken = default);
    Task<ServiceItemDto> CreateAsync(SaveServiceItemRequest request, CancellationToken cancellationToken = default);
    Task<ServiceItemDto?> UpdateAsync(Guid id, SaveServiceItemRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

public sealed record SaveServiceItemRequest(
    string Title,
    string Slug,
    string Summary,
    string Icon,
    IReadOnlyList<string> Features,
    bool Active);
