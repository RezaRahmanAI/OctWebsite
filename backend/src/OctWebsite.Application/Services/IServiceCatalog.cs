using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IServiceCatalog
{
    Task<IReadOnlyList<ServiceItemDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
