using System;
using System.Threading;
using System.Threading.Tasks;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class CareerPageService(ICareerPageRepository repository) : ICareerPageService
{
    public async Task<CareerPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var page = await repository.GetAsync(cancellationToken);
        if (page is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return MapToDto(page);
    }

    public async Task<CareerPageDto> UpsertAsync(
        SaveCareerPageRequest request,
        CancellationToken cancellationToken = default)
    {
        Validate(request);

        var existing = await repository.GetAsync(cancellationToken);
        var entity = MapToEntity(existing, request);
        var saved = await repository.UpsertAsync(entity, cancellationToken);
        return MapToDto(saved);
    }

    private async Task<CareerPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = new SaveCareerPageRequest(
            "Careers",
            "Build products and skills with us",
            "Join a team shipping ambitious products for clients while investing in your growth.",
            "video/careers.mp4",
            "Hybrid teams across Dhaka, Rajshahi, and remote",
            "View open roles",
            "/careers#open-roles",
            "We review all applications within 3 business days.");

        var saved = await repository.UpsertAsync(MapToEntity(null, defaults), cancellationToken);
        return MapToDto(saved);
    }

    private static CareerPage MapToEntity(CareerPage? existing, SaveCareerPageRequest request)
    {
        var entity = existing ?? new CareerPage { Id = Guid.NewGuid() };

        entity.HeaderEyebrow = request.HeaderEyebrow.Trim();
        entity.HeaderTitle = request.HeaderTitle.Trim();
        entity.HeaderSubtitle = request.HeaderSubtitle.Trim();
        entity.HeroVideoFileName = request.HeroVideoFileName?.Trim();
        entity.HeroMetaLine = request.HeroMetaLine.Trim();
        entity.PrimaryCtaLabel = request.PrimaryCtaLabel.Trim();
        entity.PrimaryCtaLink = request.PrimaryCtaLink.Trim();
        entity.ResponseTime = request.ResponseTime.Trim();

        return entity;
    }

    private static CareerPageDto MapToDto(CareerPage page) => new(
        page.Id,
        page.HeaderEyebrow,
        page.HeaderTitle,
        page.HeaderSubtitle,
        CreateMedia(page.HeroVideoFileName),
        page.HeroMetaLine,
        page.PrimaryCtaLabel,
        page.PrimaryCtaLink,
        page.ResponseTime);

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }

    private static void Validate(SaveCareerPageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.HeaderTitle))
        {
            throw new ArgumentException("Header title is required", nameof(request.HeaderTitle));
        }

        if (string.IsNullOrWhiteSpace(request.PrimaryCtaLabel))
        {
            throw new ArgumentException("Primary CTA label is required", nameof(request.PrimaryCtaLabel));
        }

        if (string.IsNullOrWhiteSpace(request.PrimaryCtaLink))
        {
            throw new ArgumentException("Primary CTA link is required", nameof(request.PrimaryCtaLink));
        }
    }
}
