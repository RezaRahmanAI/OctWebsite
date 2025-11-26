using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ServiceItemService(IServiceItemRepository repository) : IServiceItemService
{
    public async Task<IReadOnlyList<ServiceItemDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await repository.GetAllAsync(cancellationToken);
        return items.Select(Map).ToArray();
    }

    public async Task<ServiceItemDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetByIdAsync(id, cancellationToken);
        return item is null ? null : Map(item);
    }

    public async Task<ServiceItemDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetBySlugAsync(slug, cancellationToken);
        return item is null ? null : Map(item);
    }

    public async Task<ServiceItemDto> CreateAsync(SaveServiceItemRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var entity = new ServiceItem(
            Guid.NewGuid(),
            request.Title.Trim(),
            request.Slug.Trim(),
            request.Summary.Trim(),
            request.Icon?.Trim() ?? string.Empty,
            request.Features.ToArray(),
            request.Active);

        await repository.CreateAsync(entity, cancellationToken);
        return Map(entity);
    }

    public async Task<ServiceItemDto?> UpdateAsync(Guid id, SaveServiceItemRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        var updated = existing with
        {
            Title = request.Title.Trim(),
            Slug = request.Slug.Trim(),
            Summary = request.Summary.Trim(),
            Icon = request.Icon?.Trim() ?? string.Empty,
            Features = request.Features.ToArray(),
            Active = request.Active
        };

        await repository.UpdateAsync(updated, cancellationToken);
        return Map(updated);
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return repository.DeleteAsync(id, cancellationToken);
    }

    private static void Validate(SaveServiceItemRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
        if (request.Features is null)
        {
            throw new ArgumentException("Features are required", nameof(request));
        }
    }

    private static ServiceItemDto Map(ServiceItem entity)
    {
        return new ServiceItemDto(
            entity.Id,
            entity.Title,
            entity.Slug,
            entity.Summary,
            string.IsNullOrWhiteSpace(entity.Icon) ? null : entity.Icon,
            entity.Features,
            entity.Active);
    }
}
