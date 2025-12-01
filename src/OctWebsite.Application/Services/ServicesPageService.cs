using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ServicesPageService(IServicesPageRepository repository) : IServicesPageService
{
    public async Task<ServicesPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var existing = await repository.GetAsync(cancellationToken);
        return existing is null ? await SeedDefaultAsync(cancellationToken) : MapToDto(existing);
    }

    public async Task<ServicesPageDto> UpsertAsync(SaveServicesPageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var existing = await repository.GetAsync(cancellationToken);
        var entity = MapToEntity(existing, request);
        var saved = await repository.UpsertAsync(entity, cancellationToken);
        return MapToDto(saved);
    }

    private async Task<ServicesPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = new SaveServicesPageRequest(
            "Services",
            "Services shaped to match your brand energy",
            "Engineering, cloud, security, content, and outsourcing squads that mirror the tone of your product and customers.",
            null);

        var saved = await repository.UpsertAsync(MapToEntity(null, defaults), cancellationToken);
        return MapToDto(saved);
    }

    private static ServicesPage MapToEntity(ServicesPage? existing, SaveServicesPageRequest request)
    {
        var entity = existing ?? new ServicesPage { Id = Guid.NewGuid() };
        entity.HeaderEyebrow = request.HeaderEyebrow.Trim();
        entity.HeaderTitle = request.HeaderTitle.Trim();
        entity.HeaderSubtitle = request.HeaderSubtitle.Trim();
        entity.HeroVideoFileName = request.HeroVideoFileName;
        return entity;
    }

    private static ServicesPageDto MapToDto(ServicesPage page) => new(
        page.Id,
        page.HeaderEyebrow,
        page.HeaderTitle,
        page.HeaderSubtitle,
        string.IsNullOrWhiteSpace(page.HeroVideoFileName)
            ? null
            : new MediaResourceDto(page.HeroVideoFileName, null));

    private static void Validate(SaveServicesPageRequest request)
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
