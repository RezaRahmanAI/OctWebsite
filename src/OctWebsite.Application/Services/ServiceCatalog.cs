using System.Text.RegularExpressions;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ServiceCatalog(IServiceRepository repository) : IServiceCatalog
{
    public async Task<IReadOnlyList<ServiceDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var services = await repository.GetAllAsync(cancellationToken);
        return services.Select(service => service.ToDto()).ToArray();
    }

    public async Task<ServiceDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var service = await repository.GetByIdAsync(id, cancellationToken);
        return service?.ToDto();
    }

    public async Task<ServiceDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var normalized = NormalizeSlug(slug);
        var service = await repository.GetBySlugAsync(normalized, cancellationToken);
        return service?.ToDto();
    }

    public async Task<ServiceDto> CreateAsync(SaveServiceRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var service = Map(Guid.NewGuid(), request);
        var created = await repository.CreateAsync(service, cancellationToken);
        return created.ToDto();
    }

    public async Task<ServiceDto?> UpdateAsync(Guid id, SaveServiceRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = Map(id, request);
        var saved = await repository.UpdateAsync(updated, cancellationToken);
        return saved?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static ServiceItem Map(Guid id, SaveServiceRequest request)
    {
        return new ServiceItem(
            id,
            request.Title.Trim(),
            request.Subtitle?.Trim(),
            NormalizeSlug(request.Slug),
            request.Summary.Trim(),
            request.Description?.Trim(),
            request.Icon?.Trim(),
            request.BackgroundImageFileName?.Trim(),
            request.HeaderVideoFileName?.Trim(),
            request.AdditionalImageFileNames.Where(file => !string.IsNullOrWhiteSpace(file)).ToArray(),
            request.Features.Where(feature => !string.IsNullOrWhiteSpace(feature)).Select(feature => feature.Trim()).ToArray(),
            request.Active,
            request.Featured);
    }

    private static void Validate(SaveServiceRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
    }

    private static string NormalizeSlug(string slug)
    {
        var normalized = slug.Trim().ToLowerInvariant();
        normalized = Regex.Replace(normalized, "[^a-z0-9-]", "-");
        normalized = Regex.Replace(normalized, "-+", "-");
        return normalized.Trim('-');
    }
}
