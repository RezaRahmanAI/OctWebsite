using System;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class AcademyTrackService(IAcademyTrackRepository repository) : IAcademyTrackService
{
    public async Task<IReadOnlyList<AcademyTrackDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var tracks = await repository.GetAllAsync(cancellationToken);
        return tracks.Select(Map).ToArray();
    }

    public async Task<AcademyTrackDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var track = await repository.GetBySlugAsync(slug, cancellationToken);
        return track is null ? null : Map(track);
    }

    public async Task<AcademyTrackDto> CreateAsync(SaveAcademyTrackRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var existing = await repository.GetBySlugAsync(request.Slug, cancellationToken);
        if (existing is not null)
        {
            throw new InvalidOperationException("A track with this slug already exists.");
        }

        var entity = Map(Guid.NewGuid(), request);
        await repository.CreateAsync(entity, cancellationToken);
        return Map(entity);
    }

    public async Task<AcademyTrackDto> UpdateAsync(Guid id, SaveAcademyTrackRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var existing = await repository.GetByIdAsync(id, cancellationToken)
            ?? throw new InvalidOperationException("Track not found.");

        var slugOwner = await repository.GetBySlugAsync(request.Slug, cancellationToken);
        if (slugOwner is not null && slugOwner.Id != id)
        {
            throw new InvalidOperationException("Another track with this slug already exists.");
        }

        var updated = Map(id, request);
        await repository.UpdateAsync(updated, cancellationToken);
        return Map(updated);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await repository.DeleteAsync(id, cancellationToken);
    }

    private static void Validate(SaveAcademyTrackRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Title);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.AgeRange);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Duration);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Audience);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Format);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Summary);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.CallToActionLabel);
    }

    private static AcademyTrack Map(Guid id, SaveAcademyTrackRequest request)
    {
        return new AcademyTrack
        {
            Id = id,
            Title = request.Title,
            Slug = request.Slug,
            AgeRange = request.AgeRange,
            Duration = request.Duration,
            PriceLabel = request.PriceLabel,
            Audience = request.Audience,
            Format = request.Format,
            Summary = request.Summary,
            HeroVideoFileName = request.HeroVideoFileName,
            HeroPosterFileName = request.HeroPosterFileName,
            Highlights = request.Highlights.ToList(),
            LearningOutcomes = request.LearningOutcomes.ToList(),
            Levels = request.Levels.Select((level, index) => new AcademyTrackLevel
            {
                Id = Guid.NewGuid(),
                TrackId = id,
                Title = level.Title,
                Duration = level.Duration,
                Description = level.Description,
                Tools = level.Tools.ToList(),
                Outcomes = level.Outcomes.ToList(),
                Project = level.Project,
                Image = level.Image,
                Order = index
            }).ToList(),
            AdmissionSteps = request.AdmissionSteps.Select((step, index) => new AdmissionStep
            {
                Id = Guid.NewGuid(),
                TrackId = id,
                Title = step.Title,
                Description = step.Description,
                Order = index
            }).ToList(),
            CallToActionLabel = request.CallToActionLabel,
            Active = request.Active
        };
    }

    private static AcademyTrackDto Map(AcademyTrack track)
    {
        var orderedLevels = track.Levels.OrderBy(level => level.Order).ToArray();
        var orderedSteps = track.AdmissionSteps.OrderBy(step => step.Order).ToArray();

        return new AcademyTrackDto(
            track.Id,
            track.Title,
            track.Slug,
            track.AgeRange,
            track.Duration,
            track.PriceLabel,
            track.Audience,
            track.Format,
            track.Summary,
            CreateMedia(track.HeroVideoFileName),
            CreateMedia(track.HeroPosterFileName),
            track.Highlights,
            track.LearningOutcomes,
            orderedLevels.Select(level => new AcademyTrackLevelDto(
                level.Title,
                level.Duration,
                level.Description,
                level.Tools,
                level.Outcomes,
                level.Project,
                level.Image)).ToArray(),
            orderedSteps.Select(step => new AdmissionStepDto(step.Title, step.Description)).ToArray(),
            track.CallToActionLabel,
            track.Active);
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
