using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IMethodologyPageService
{
    Task<MethodologyPageDto> GetAsync(CancellationToken cancellationToken = default);

    Task<MethodologyPageDto> UpsertPageAsync(SaveMethodologyPageRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<MethodologyOfferingDto>> GetOfferingsAsync(CancellationToken cancellationToken = default);

    Task<MethodologyOfferingDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<MethodologyOfferingDto> CreateOfferingAsync(SaveMethodologyOfferingRequest request, CancellationToken cancellationToken = default);

    Task<MethodologyOfferingDto> UpdateOfferingAsync(Guid id, SaveMethodologyOfferingRequest request, CancellationToken cancellationToken = default);

    Task DeleteOfferingAsync(Guid id, CancellationToken cancellationToken = default);
}
