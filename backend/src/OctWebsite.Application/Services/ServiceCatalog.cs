using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class ServiceCatalog(IServiceRepository repository) : IServiceCatalog
{
    public async Task<IReadOnlyList<ServiceItemDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var services = await repository.GetAllAsync(cancellationToken);
        return services.Select(service => service.ToDto()).ToArray();
    }

    public async Task<ServiceItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ArgumentException("Slug is required", nameof(slug));
        }

        var service = await repository.GetBySlugAsync(slug, cancellationToken);
        return service?.ToDto();
    }
}
