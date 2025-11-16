using System;
using System.Collections.Generic;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

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

    public async Task<ServiceItemDto> CreateAsync(SaveServiceItemRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var service = new ServiceItem(
            Guid.NewGuid(),
            request.Title.Trim(),
            request.Slug.Trim().ToLowerInvariant(),
            request.Summary.Trim(),
            request.Icon.Trim(),
            request.Features?.ToArray() ?? Array.Empty<string>(),
            request.Active);

        var created = await serviceRepository.CreateAsync(service, cancellationToken);
        return created.ToDto();
    }

    public async Task<ServiceItemDto?> UpdateAsync(Guid id, SaveServiceItemRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await serviceRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim().ToLowerInvariant(),
            Summary = request.Summary.Trim(),
            Icon = request.Icon.Trim(),
            Features = request.Features?.ToArray() ?? Array.Empty<string>(),
            Active = request.Active
        };

        var saved = await serviceRepository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => serviceRepository.DeleteAsync(id, cancellationToken);

    private static void Validate(SaveServiceItemRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Icon);
    }
}
