using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IServiceItemService
{
    Task<IReadOnlyList<ServiceItemDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ServiceItemDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ServiceItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<ServiceItemDto> CreateAsync(SaveServiceItemRequest request, CancellationToken cancellationToken = default);

    Task<ServiceItemDto?> UpdateAsync(Guid id, SaveServiceItemRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
