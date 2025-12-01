using System;
using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class AcademyPageService(ICompanyAboutRepository repository, IAcademyTrackService trackService)
    : IAcademyPageService
{
    private const string StorageKey = "academy-page";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<AcademyPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken)
            ?? throw new InvalidOperationException("Academy page content has not been initialized.");

        return await DeserializeAsync(stored.Content, stored.Id, cancellationToken);
    }

    public async Task<AcademyPageDto> UpsertAsync(SaveAcademyPageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var serialized = Serialize(request);
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (existing is null)
        {
            var created = new CompanyAbout(Guid.NewGuid(), StorageKey, serialized);
            await repository.CreateAsync(created, cancellationToken);
            return await DeserializeAsync(created.Content, created.Id, cancellationToken);
        }

        var updated = existing with { Content = serialized };
        await repository.UpdateAsync(updated, cancellationToken);
        return await DeserializeAsync(updated.Content, updated.Id, cancellationToken);
    }

    private static void Validate(SaveAcademyPageRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderEyebrow);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderSubtitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Intro);
    }

    private static string Serialize(SaveAcademyPageRequest request)
        => JsonSerializer.Serialize(request, JsonOptions);

    private async Task<AcademyPageDto> DeserializeAsync(
        string json,
        Guid? id,
        CancellationToken cancellationToken)
    {
        var stored = JsonSerializer.Deserialize<SaveAcademyPageRequest>(json, JsonOptions)
            ?? throw new InvalidOperationException("Unable to deserialize academy page content.");

        var tracks = await trackService.GetAllAsync(cancellationToken);

        return new AcademyPageDto(
            id ?? Guid.NewGuid(),
            stored.HeaderEyebrow,
            stored.HeaderTitle,
            stored.HeaderSubtitle,
            stored.Intro,
            CreateMedia(stored.HeroVideoFileName),
            stored.KidsFeatures,
            stored.FreelancingCourses,
            tracks);
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
