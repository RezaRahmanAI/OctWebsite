using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IServiceCatalog
{
    Task<IReadOnlyList<ServiceDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ServiceDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ServiceDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<ServiceDto> CreateAsync(SaveServiceRequest request, CancellationToken cancellationToken = default);

    Task<ServiceDto?> UpdateAsync(Guid id, SaveServiceRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
