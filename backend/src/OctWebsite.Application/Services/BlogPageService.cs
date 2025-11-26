using System;
using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class BlogPageService(ICompanyAboutRepository repository) : IBlogPageService
{
    private const string StorageKey = "blog-page";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<BlogPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (existing is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return Deserialize(existing.Content, existing.Id);
    }

    public async Task<BlogPageDto> UpsertAsync(SaveBlogPageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var serialized = Serialize(request);
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (existing is null)
        {
            var created = new CompanyAbout(Guid.NewGuid(), StorageKey, serialized);
            await repository.CreateAsync(created, cancellationToken);
            return Deserialize(created.Content, created.Id);
        }

        var updated = existing with { Content = serialized };
        await repository.UpdateAsync(updated, cancellationToken);
        return Deserialize(updated.Content, updated.Id);
    }

    private async Task<BlogPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var request = new SaveBlogPageRequest(
            "Insights & Updates",
            "Stories from the studio",
            "Explore lessons from our product experiments, engineering playbooks, and academy cohorts. Filter by topic or jump straight into the latest releases.",
            null);

        return await UpsertAsync(request, cancellationToken);
    }

    private static void Validate(SaveBlogPageRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderEyebrow);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderSubtitle);
    }

    private static string Serialize(SaveBlogPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private static BlogPageDto Deserialize(string json, Guid? id = null)
    {
        var stored = JsonSerializer.Deserialize<SaveBlogPageRequest>(json, JsonOptions)
            ?? throw new InvalidOperationException("Unable to deserialize blog page content.");

        return new BlogPageDto(
            id ?? Guid.NewGuid(),
            stored.HeaderEyebrow,
            stored.HeaderTitle,
            stored.HeaderSubtitle,
            CreateMedia(stored.HeroVideoFileName));
    }

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }
}
