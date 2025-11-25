using System.Linq;
using System.Text.Json;
using OctWebsite.Application.Abstractions;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class AboutPageService(ICompanyAboutRepository repository) : IAboutPageService
{
    private const string StorageKey = "about-page";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<AboutPageDto> GetAsync(CancellationToken cancellationToken = default)
    {
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (existing is null)
        {
            var seeded = await SeedDefaultAsync(cancellationToken);
            return seeded;
        }

        return Deserialize(existing.Content);
    }

    public async Task<AboutPageDto> UpsertAsync(SaveAboutPageRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);

        var storedContent = Serialize(request);
        var existing = await repository.GetByKeyAsync(StorageKey, cancellationToken);

        if (existing is null)
        {
            var created = new CompanyAbout(Guid.NewGuid(), StorageKey, storedContent);
            await repository.CreateAsync(created, cancellationToken);
            return Deserialize(created.Content);
        }

        var updated = existing with { Content = storedContent };
        await repository.UpdateAsync(updated, cancellationToken);
        return Deserialize(updated.Content);
    }

    private async Task<AboutPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaultRequest = new SaveAboutPageRequest(
            "About Us",
            "ObjectCanvas Technology",
            "Engineering teams, educators, and strategists building products and people together.",
            "about/hero.mp4",
            "ObjectCanvas engineers, product strategists, data practitioners, and  educators work as one integrated team.",
            "Build products and people together",
            "We help ambitious teams design, build, and scale digital products while growing the next generation of engineers and creators across Bangladesh and beyond.",
            "A global product studio rooted in Bangladesh",
            "Our vision is to be a long-term technology and learning partner for global companies, proving that world-class products and talent can be built from Dhaka, Rajshahi and remote teams across the country.",
            "about/mission-vision.jpg",
            new[]
            {
                new SaveAboutValueRequest("Craft over shortcuts", "We care deeply about code quality, design systems, and operational excellence instead of one-off hacks.", "about/values-1.mp4"),
                new SaveAboutValueRequest("Teach while we build", "Every project is a chance to upskill clients, students, and our own team through pairing, documentation, and open playbooks.", "about/values-2.mp4"),
                new SaveAboutValueRequest("Long-term partnerships", "We prefer fewer, deeper relationships where we can own outcomes, not just deliver tickets.", "about/values-3.mp4")
            },
            "From small experiments to a multi-discipline studio",
            "ObjectCanvas began as a focused engineering partner helping teams ship quickly. Over time, we layered in strategy, design, data, and an academy to support learners alongside our clients.",
            "about/story.jpg");

        return await UpsertAsync(defaultRequest, cancellationToken);
    }

    private static void Validate(SaveAboutPageRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderEyebrow);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.HeaderSubtitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.Intro);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.MissionTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.MissionDescription);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.VisionTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.VisionDescription);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.StoryTitle);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.StoryDescription);
    }

    private static string Serialize(SaveAboutPageRequest request)
    {
        return JsonSerializer.Serialize(request, JsonOptions);
    }

    private static AboutPageDto Deserialize(string json)
    {
        var stored = JsonSerializer.Deserialize<SaveAboutPageRequest>(json, JsonOptions)
            ?? throw new InvalidOperationException("Unable to deserialize about page content.");

        return new AboutPageDto(
            Guid.NewGuid(),
            stored.HeaderEyebrow,
            stored.HeaderTitle,
            stored.HeaderSubtitle,
            CreateMedia(stored.HeroVideoFileName),
            stored.Intro,
            stored.MissionTitle,
            stored.MissionDescription,
            stored.VisionTitle,
            stored.VisionDescription,
            CreateMedia(stored.MissionImageFileName),
            stored.Values.Select(value => new AboutValueDto(
                value.Title,
                value.Description,
                CreateMedia(value.VideoFileName))).ToArray(),
            stored.StoryTitle,
            stored.StoryDescription,
            CreateMedia(stored.StoryImageFileName));
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
