using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IHomeTestimonialRepository
{
    Task<IReadOnlyList<HomeTestimonial>> GetByHomePageIdAsync(Guid homePageId, CancellationToken cancellationToken = default);
    Task ReplaceAsync(Guid homePageId, IReadOnlyList<HomeTestimonial> testimonials, CancellationToken cancellationToken = default);
}
