using OctWebsite.Application.Abstractions;
using OctWebsite.Application.Defaults;
using OctWebsite.Application.DTOs;
using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Services;

internal sealed class HomeTestimonialService(IHomeTestimonialRepository repository) : IHomeTestimonialService
{
    public async Task<IReadOnlyList<HomeTestimonialDto>> GetAsync(CancellationToken cancellationToken = default)
    {
        var testimonials = await repository.GetAllAsync(cancellationToken);
        if (testimonials.Count == 0)
        {
            var seeded = await SeedDefaultAsync(cancellationToken);
            return seeded;
        }

        return testimonials.Select(ToDto).ToArray();
    }

    public async Task<HomeTestimonialDto> CreateAsync(HomeTestimonialRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var entity = new HomeTestimonial(
            Guid.NewGuid(),
            request.Quote,
            request.Name,
            request.Title,
            request.Location,
            request.Rating,
            request.Type,
            request.ImageFileName);

        var stored = await repository.CreateAsync(entity, cancellationToken);
        return ToDto(stored);
    }

    public async Task<HomeTestimonialDto> UpdateAsync(Guid id, HomeTestimonialRequest request, CancellationToken cancellationToken = default)
    {
        Validate(request);
        var existing = await repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            throw new InvalidOperationException($"Testimonial {id} was not found");
        }

        var updated = existing with
        {
            Quote = request.Quote,
            Name = request.Name,
            Title = request.Title,
            Location = request.Location,
            Rating = request.Rating,
            Type = request.Type,
            ImageFileName = request.ImageFileName
        };

        var stored = (await repository.UpdateAsync(updated, cancellationToken))!;
        return ToDto(stored);
    }

    public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
        => repository.DeleteAsync(id, cancellationToken);

    private async Task<IReadOnlyList<HomeTestimonialDto>> SeedDefaultAsync(CancellationToken cancellationToken)
    {
        var defaults = HomePageDefaults.DefaultTestimonials
            .Select(testimonial => new HomeTestimonial(
                Guid.NewGuid(),
                testimonial.Quote,
                testimonial.Name,
                testimonial.Title,
                testimonial.Location,
                testimonial.Rating,
                testimonial.Type,
                testimonial.ImageFileName))
            .ToArray();

        var results = new List<HomeTestimonialDto>();
        foreach (var testimonial in defaults)
        {
            var stored = await repository.CreateAsync(testimonial, cancellationToken);
            results.Add(ToDto(stored));
        }

        return results;
    }

    private static void Validate(HomeTestimonialRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (request.Rating is < 1 or > 5)
        {
            throw new ArgumentException("Testimonial rating must be between 1 and 5", nameof(request));
        }
    }

    private static HomeTestimonialDto ToDto(HomeTestimonial testimonial)
        => new(testimonial.Id, testimonial.Quote, testimonial.Name, testimonial.Title, testimonial.Location, testimonial.Rating, testimonial.Type, CreateMedia(testimonial.ImageFileName));

    private static MediaResourceDto? CreateMedia(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
        {
            return null;
        }

        return new MediaResourceDto(fileName, null);
    }
}
