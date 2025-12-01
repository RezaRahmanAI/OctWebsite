using System;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ProductPageService(IProductPageRepository repository) : IProductPageService
{
    public async Task<ProductPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var existing = await repository.GetAsync(cancellationToken);
        return existing is null ? await SeedDefaultAsync(cancellationToken) : MapToDto(existing);
    }

    public async Task<ProductPageDto> UpsertAsync(SaveProductPageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var existing = await repository.GetAsync(cancellationToken);
        var entity = MapToEntity(existing, request);
        var saved = await repository.UpsertAsync(entity, cancellationToken);
        return MapToDto(saved);
    }

    private async Task<ProductPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = new SaveProductPageRequest(
            "Products",
            "Product playbooks to ship, learn, and iterate",
            "Modular squads that co-design strategy, experience, and delivery so your roadmap stays aligned to outcomes.",
            null);

        var saved = await repository.UpsertAsync(MapToEntity(null, defaults), cancellationToken);
        return MapToDto(saved);
    }

    private static ProductPage MapToEntity(ProductPage? existing, SaveProductPageRequest request)
    {
        var entity = existing ?? new ProductPage { Id = Guid.NewGuid() };
        entity.HeaderEyebrow = request.HeaderEyebrow.Trim();
        entity.HeaderTitle = request.HeaderTitle.Trim();
        entity.HeaderSubtitle = request.HeaderSubtitle.Trim();
        entity.HeroVideoFileName = request.HeroVideoFileName;
        return entity;
    }

    private static ProductPageDto MapToDto(ProductPage page) => new(
        page.Id,
        page.HeaderEyebrow,
        page.HeaderTitle,
        page.HeaderSubtitle,
        string.IsNullOrWhiteSpace(page.HeroVideoFileName)
            ? null
            : new MediaResourceDto(page.HeroVideoFileName, null));

    private static void Validate(SaveProductPageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.HeaderEyebrow))
        {
            throw new ArgumentException("Header eyebrow is required", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.HeaderTitle))
        {
            throw new ArgumentException("Header title is required", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.HeaderSubtitle))
        {
            throw new ArgumentException("Header subtitle is required", nameof(request));
        }
    }
}
