using OctWebsite.Application.DTOs;

namespace OctWebsite.Application.Services;

public interface IAcademyTrackService
{
    Task<IReadOnlyList<AcademyTrackDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<AcademyTrackDto?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<AcademyTrackDto> CreateAsync(SaveAcademyTrackRequest request, CancellationToken cancellationToken = default);

    Task<AcademyTrackDto> UpdateAsync(Guid id, SaveAcademyTrackRequest request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
