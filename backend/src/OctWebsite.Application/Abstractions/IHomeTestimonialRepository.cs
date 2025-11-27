using OctWebsite.Domain.Entities;

namespace OctWebsite.Application.Abstractions;

public interface IHomeTestimonialRepository
{
    Task<IReadOnlyList<HomeTestimonial>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<HomeTestimonial?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<HomeTestimonial> CreateAsync(HomeTestimonial testimonial, CancellationToken cancellationToken = default);
    Task<HomeTestimonial?> UpdateAsync(HomeTestimonial testimonial, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
