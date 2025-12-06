using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ProductShowcaseService(IProductShowcaseRepository repository) : IProductShowcaseService
{
    public async Task<IReadOnlyList<ProductShowcaseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await repository.GetAllAsync(cancellationToken);
        return items.Select(item => item.ToDto()).ToArray();
    }

    public async Task<ProductShowcaseDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetByIdAsync(id, cancellationToken);
        return item?.ToDto();
    }

    public async Task<ProductShowcaseDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var item = await repository.GetBySlugAsync(slug, cancellationToken);
        return item?.ToDto();
    }

    public async Task<ProductShowcaseDto> CreateAsync(SaveProductShowcaseRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var entity = Map(Guid.NewGuid(), request);
        var created = await repository.CreateAsync(entity, cancellationToken);
        return created.ToDto();
    }

    public async Task<ProductShowcaseDto?> UpdateAsync(Guid id, SaveProductShowcaseRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var entity = Map(id, request);
        var updated = await repository.UpdateAsync(entity, cancellationToken);
        return updated?.ToDto();
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private static ProductShowcaseItem Map(Guid id, SaveProductShowcaseRequest request)
    {
        return new ProductShowcaseItem(
            id,
            request.Name,
            request.Slug,
            request.Description,
            request.ImageUrl,
            request.BackgroundColor,
            request.ProjectScreenshotUrl,
            request.Highlights);
    }

    private static void Validate(SaveProductShowcaseRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Name is required", nameof(request.Name));
        }

        if (string.IsNullOrWhiteSpace(request.Slug))
        {
            throw new ArgumentException("Slug is required", nameof(request.Slug));
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            throw new ArgumentException("Description is required", nameof(request.Description));
        }
    }
}
