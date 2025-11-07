using System;
using System.Collections.Generic;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

internal sealed class ServiceCatalog(
    IServiceRepository serviceRepository,
    IProductRepository productRepository,
    IAcademyRepository academyRepository) : IServiceCatalog
{
    public async Task<IReadOnlyList<ServiceItemDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var services = await serviceRepository.GetAllAsync(cancellationToken);
        return services.Select(service => service.ToDto()).ToArray();
    }

    public async Task<ServiceItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            throw new ArgumentException("Slug is required", nameof(slug));
        }

        var service = await serviceRepository.GetBySlugAsync(slug, cancellationToken);
        return service?.ToDto();
    }

    public async Task<ServiceCatalogDto> GetUnifiedCatalogAsync(CancellationToken cancellationToken = default)
    {
        var serviceTask = serviceRepository.GetAllAsync(cancellationToken);
        var productTask = productRepository.GetAllAsync(cancellationToken);
        var academyTask = academyRepository.GetAllAsync(cancellationToken);

        await Task.WhenAll(serviceTask, productTask, academyTask);

        var softwareSolutions = new List<ServiceOfferingDto>();
        softwareSolutions.AddRange(serviceTask.Result.Select(service => service.ToServiceOfferingDto()));
        softwareSolutions.AddRange(productTask.Result.Select(product => product.ToServiceOfferingDto()));

        var trainingPrograms = academyTask.Result
            .Select(track => track.ToDto())
            .ToArray();

        return new ServiceCatalogDto(softwareSolutions.ToArray(), trainingPrograms);
    }
}
