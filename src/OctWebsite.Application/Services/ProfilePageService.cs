using System;
using System.Collections.Generic;
using System.Linq;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class ProfilePageService(IProfilePageRepository repository) : IProfilePageService
{
    public async Task<ProfilePageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var stored = await repository.GetAsync(cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

        return MapToDto(stored);
    }

    public async Task<ProfilePageDto> UpsertAsync(
        SaveProfilePageRequest request,
        CancellationToken cancellationToken = default)
    {
        Validate(request);

        var existing = await repository.GetAsync(cancellationToken);
        var entity = MapToEntity(existing, request);
        var saved = await repository.UpsertAsync(entity, cancellationToken);
        return MapToDto(saved);
    }

    private async Task<ProfilePageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = new SaveProfilePageRequest(
            "Profile",
            "Company profile",
            "A single hub for our credentials, focus areas, and team DNA.",
            "A modern profile built for partners who want a crisp snapshot of ObjectCanvas.",
            "/images/hero/profile-cover.webp",
            null,
            "Download profile (PDF)",
            null,
            "https://objectcanvas.com/company-profile.pdf",
            "Who we are",
            "ObjectCanvas is a multi-disciplinary product studio and academy helping teams build, launch, and level up across product, platform, and data initiatives.",
            new[]
            {
                new SaveProfileStatRequest("Founded", "2018", "Years building products and talent in Bangladesh."),
                new SaveProfileStatRequest("Studios", "2", "Hybrid teams across Dhaka and Rajshahi."),
                new SaveProfileStatRequest("Specialists", "20+", "Engineers, designers, and data practitioners."),
                new SaveProfileStatRequest("Engagement speed", "< 2 weeks", "Average time from scoping to kickoff."),
            },
            new[]
            {
                new SaveProfilePillarRequest("Strategic discovery", "We co-design outcomes, roadmaps, and resourcing with stakeholders before writing code.", "Discovery"),
                new SaveProfilePillarRequest("Delivery discipline", "Battle-tested engineering practices with observability, CI/CD, and peer reviews by default.", "Delivery"),
                new SaveProfilePillarRequest("Capability building", "We leave behind playbooks, pairing sessions, and clear documentation so teams level up.", "Enablement"),
            },
            "Built for modern teams",
            "Download a profile that blends credentials, case studies, and the operating model we use to de-risk projects.",
            "Always-on partnership");

        return await UpsertAsync(defaults, cancellationToken);
    }

    private static ProfilePage MapToEntity(ProfilePage? existing, SaveProfilePageRequest request)
    {
        var entity = existing ?? new ProfilePage { Id = Guid.NewGuid() };

        entity.HeaderEyebrow = request.HeaderEyebrow.Trim();
        entity.HeaderTitle = request.HeaderTitle.Trim();
        entity.HeaderSubtitle = request.HeaderSubtitle.Trim();
        entity.HeroTagline = request.HeroTagline.Trim();
        entity.HeroImageFileName = NormalizeMediaPath(request.HeroImageFileName);
        entity.HeroVideoFileName = NormalizeMediaPath(request.HeroVideoFileName);
        entity.DownloadLabel = request.DownloadLabel.Trim();
        entity.DownloadFileName = NormalizeMediaPath(request.DownloadFileName);
        entity.DownloadUrl = string.IsNullOrWhiteSpace(request.DownloadUrl)
            ? null
            : request.DownloadUrl.Trim();
        entity.OverviewTitle = request.OverviewTitle.Trim();
        entity.OverviewDescription = request.OverviewDescription.Trim();
        entity.Stats = request.Stats.Select(MapToEntity).ToList();
        entity.Pillars = request.Pillars.Select(MapToEntity).ToList();
        entity.SpotlightTitle = request.SpotlightTitle.Trim();
        entity.SpotlightDescription = request.SpotlightDescription.Trim();
        entity.SpotlightBadge = request.SpotlightBadge.Trim();

        return entity;
    }

    private static ProfileStat MapToEntity(SaveProfileStatRequest request) => new()
    {
        Label = request.Label.Trim(),
        Value = request.Value.Trim(),
        Description = request.Description.Trim()
    };

    private static ProfilePillar MapToEntity(SaveProfilePillarRequest request) => new()
    {
        Title = request.Title.Trim(),
        Description = request.Description.Trim(),
        Accent = request.Accent.Trim()
    };

    private static ProfilePageDto MapToDto(ProfilePage page) => new(
        page.Id,
        page.HeaderEyebrow,
        page.HeaderTitle,
        page.HeaderSubtitle,
        page.HeroTagline,
        CreateMedia(page.HeroVideoFileName),
        CreateMedia(page.HeroImageFileName),
        page.DownloadLabel,
        CreateDownload(page),
        page.OverviewTitle,
        page.OverviewDescription,
        page.Stats.Select(stat => new ProfileStatDto(stat.Label, stat.Value, stat.Description)).ToArray(),
        page.Pillars.Select(pillar => new ProfilePillarDto(pillar.Title, pillar.Description, pillar.Accent)).ToArray(),
        page.SpotlightTitle,
        page.SpotlightDescription,
        page.SpotlightBadge);

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }

    private static MediaResourceDto? CreateDownload(ProfilePage page)
    {
        if (string.IsNullOrWhiteSpace(page.DownloadFileName) && string.IsNullOrWhiteSpace(page.DownloadUrl))
        {
            return null;
        }

        return new MediaResourceDto(page.DownloadFileName, page.DownloadUrl);
    }

    private static string? NormalizeMediaPath(string? path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            return null;
        }

        return path.Trim();
    }

    private static void Validate(SaveProfilePageRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderEyebrow);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderSubtitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeroTagline);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.DownloadLabel);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.OverviewTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.OverviewDescription);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.SpotlightTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.SpotlightDescription);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.SpotlightBadge);

        if (request.Stats.Count == 0)
        {
            throw new ArgumentException("At least one profile stat is required.");
        }

        if (request.Pillars.Count == 0)
        {
            throw new ArgumentException("At least one profile pillar is required.");
        }

        foreach (var stat in request.Stats)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(stat.Label);
            ArgumentException.ThrowIfNullOrWhiteSpace(stat.Value);
            ArgumentException.ThrowIfNullOrWhiteSpace(stat.Description);
        }

        foreach (var pillar in request.Pillars)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(pillar.Title);
            ArgumentException.ThrowIfNullOrWhiteSpace(pillar.Description);
            ArgumentException.ThrowIfNullOrWhiteSpace(pillar.Accent);
        }
    }
}
