using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IHomeTestimonialService
{
    Task<IReadOnlyList<HomeTestimonialDto>> GetAsync(CancellationToken cancellationToken = default);
    Task<HomeTestimonialDto> CreateAsync(HomeTestimonialRequest request, CancellationToken cancellationToken = default);
    Task<HomeTestimonialDto> UpdateAsync(Guid id, HomeTestimonialRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
