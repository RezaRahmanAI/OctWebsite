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
        var stored = await repository.GetByKeyAsync(StorageKey, cancellationToken);
        if (stored is null)
        {
            return await SeedDefaultAsync(cancellationToken);
        }

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

    private async Task<AcademyPageDto> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaultRequest = new SaveAcademyPageRequest(
            "Zero Programming Academy",
            "Ignite imagination with code, creativity, and community.",
            "Our academy fuses vibrant visuals, interactive labs, and compassionate mentorship to empower children, teens, and young professionals to thrive.",
            "Our academy fuses vibrant visuals, interactive labs, and compassionate mentorship to empower children, teens, and young professionals to thrive.",
            null,
            new[]
            {
                new AcademyFeatureDto("STEM.org Accredited", "Dolor sit am Provide Ipsum learning tailored for young innovators.", "🎓"),
                new AcademyFeatureDto("Project Based Learning", "Build games, animations, and inventions that spark curiosity.", "🧠"),
                new AcademyFeatureDto("Skilled Instructors", "Mentors who translate complex topics into playful experiences.", "👩‍🏫"),
                new AcademyFeatureDto("Comprehensive Curriculum", "Progressive modules covering coding, robotics, and creativity.", "📘"),
                new AcademyFeatureDto("Small Batch Size", "Maximum 10 students to ensure every child receives attention.", "🤝")
            },
            new[]
            {
                new FreelancingCourseDto("Web Development", "Modern stacks, responsive design, and client collaboration skills.", "💻"),
                new FreelancingCourseDto("Graphics & Branding", "Logo design, brand systems, and storytelling with visuals.", "🎨"),
                new FreelancingCourseDto("Digital Marketing", "Learn funnels, SEO, and automation for online success.", "📈")
            });

        return await UpsertAsync(defaultRequest, cancellationToken);
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
